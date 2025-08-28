import requests

url = "http://127.0.0.1:5000/predict"
image_path = "./206.jpg"

with open(image_path, 'rb') as f:
    files = {'file': f}
    response = requests.post(url, files=files)
    print(response.json())
