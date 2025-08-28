import torch
print('CUDA available:', torch.cuda.is_available())
print('CUDA version:', torch.version.cuda if torch.cuda.is_available() else 'N/A')
exit()
