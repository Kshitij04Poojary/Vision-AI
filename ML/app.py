from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from PIL import Image
import io
import sys
from utils import transform_image, GeneralModel, ViT_GNN_MHA
import warnings
warnings.filterwarnings("ignore", category=UserWarning)

app = Flask(__name__)
CORS(app)

# Critical class name mapping for model compatibility
sys.modules['__main__'].CustomModel = GeneralModel
sys.modules['__main__'].ViT_GNN_MHA = ViT_GNN_MHA

# Initialize models
general_model = None
hr_model = None

def load_models():
    global general_model, hr_model
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    # Load General Model with class mapping
    general_model = GeneralModel(num_classes=8).to(device)
    general_model.load_state_dict(torch.load('models/General_detection_state_dict.pth', map_location=device))
    
    # Load ViT_GNN_MHA model directly as you instructed, no changes here
    hr_model = torch.load('models/ViT_GCN_MHA_93.89.pth', map_location=device, weights_only=False)
    
    # Set evaluation mode
    general_model.eval()
    hr_model.eval()

# Load models during startup
load_models()

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    try:
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        # Process image
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        tensor = transform_image(image).to(device)

        # General detection
        with torch.no_grad():
            general_output = general_model(tensor)
            general_pred = torch.argmax(general_output, dim=1).item()

        # HR detection if needed
        hr_pred = None
        if general_pred == 5:  # HR class index
            with torch.no_grad():
                hr_output = hr_model(tensor)
                hr_pred = torch.argmax(hr_output, dim=1).item()

        return jsonify({
            'general_result': int(general_pred),
            'hr_detected': general_pred == 5,
            'hr_result': int(hr_pred) if hr_pred is not None else None,
            'message': 'Success'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e), 'message': 'Prediction failed'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
