from torchvision import transforms
import torch.nn as nn
from torchvision import models
from transformers import ViTForImageClassification
from torch_geometric.nn import GCNConv
import torch

# Image preprocessing
def transform_image(image):
    return transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                           std=[0.229, 0.224, 0.225])
    ])(image).unsqueeze(0)

# General detection model (formerly CustomModel)
class GeneralModel(nn.Module):
    def __init__(self, num_classes):
        super().__init__()
        self.base = models.efficientnet_b3(pretrained=False)
        self.base.classifier = nn.Identity()
        self.head = nn.Sequential(
            nn.Linear(1536, 512),
            nn.BatchNorm1d(512, momentum=0.99, eps=0.001),
            nn.ReLU(),
            nn.Dropout(0.35),
            nn.Linear(512, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(0.25),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        return self.head(self.base(x))

# HR detection model
class ViT_GNN_MHA(nn.Module):
    def __init__(self, num_classes):
        super().__init__()
        base_model = ViTForImageClassification.from_pretrained(
            "google/vit-base-patch16-224",
            num_labels=num_classes,
            ignore_mismatched_sizes=True
        )
        self.vit = base_model.vit
        self.num_patches = 196
        self.patch_dim = 768
        
        self.gcn1 = GCNConv(self.patch_dim, 512)
        self.gcn2 = GCNConv(512, 512)
        self.gcn3 = GCNConv(512, 512)
        
        self.mha = nn.MultiheadAttention(embed_dim=512, num_heads=8, batch_first=True)
        
        self.fc = nn.Sequential(
            nn.LayerNorm(512),
            nn.Linear(512, 256),
            nn.GELU(),
            nn.Dropout(0.55),
            nn.Linear(256, num_classes)
        )
        self.base_edge_index = self.create_spatial_edges()
        
    def create_spatial_edges(self):
        edges = []
        for i in range(14):
            for j in range(14):
                idx = i * 14 + j
                if j < 13: edges.append([idx, idx+1])
                if i < 13: edges.append([idx, idx+14])
        return torch.tensor(edges, dtype=torch.long).t().contiguous()
    
    def forward(self, x):
        features = self.vit(x).last_hidden_state[:, 1:]
        batch_size = x.size(0)
        features = features.view(-1, self.patch_dim)
        
        edge_indices = []
        for b in range(batch_size):
            offset = b * self.num_patches
            edge_indices.append(self.base_edge_index + offset)
        edge_index = torch.cat(edge_indices, dim=1).to(x.device)
        
        gcn1_out = torch.relu(self.gcn1(features, edge_index))
        gcn2_out = torch.relu(self.gcn2(gcn1_out, edge_index)) + gcn1_out
        gcn3_out = torch.relu(self.gcn3(gcn2_out, edge_index)) + gcn2_out
        
        gnn_features = gcn3_out.view(batch_size, self.num_patches, -1)
        attn_output, _ = self.mha(gnn_features, gnn_features, gnn_features)
        pooled = attn_output.mean(dim=1)
        
        return self.fc(pooled)