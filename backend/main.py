from flask import Flask, request, jsonify
from inference_sdk import InferenceHTTPClient
from flask_cors import CORS  # Importa CORS
import cv2
import numpy as np
import base64

app = Flask(__name__)
CORS(app)

# Inicializa el cliente de inferencia
CLIENT = InferenceHTTPClient(
    api_url="https://outline.roboflow.com",
    api_key="Glwg3WRKqF07dJBzArAn"
)

def detect_drugs(image_data):
    # Decodifica la imagen desde base64
    nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Realiza la inferencia en el frame capturado
    result = CLIENT.infer(frame, model_id="drugs_segmentation/1")
    high_conf_detections = [det for det in result['predictions'] if det['confidence'] >= 0.6]

    if high_conf_detections:
        for det in high_conf_detections:
            x = int(det['x'] - det['width'] / 2)
            y = int(det['y'] - det['height'] / 2)
            w = int(det['width'])
            h = int(det['height'])

            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)
            label = f"{det['class']} ({det['confidence']*100:.1f}%)"
            cv2.putText(frame, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)

        # Codifica la imagen de vuelta a base64 para enviarla al frontend
        _, buffer = cv2.imencode('.jpg', frame)
        image_base64 = base64.b64encode(buffer).decode('utf-8')
        return {'detected': True, 'image': image_base64}
    return {'detected': False}

@app.route('/detect', methods=['POST'])
def detect():
    data = request.get_json()
    image_data = data['image'].split(",")[1]  # Quita el prefijo data:image/jpeg;base64,
    result = detect_drugs(image_data)
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
