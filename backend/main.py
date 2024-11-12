from flask import Flask, request, jsonify
from inference_sdk import InferenceHTTPClient
from flask_cors import CORS  # Importa CORS
import cv2
import numpy as np
import base64
import requests
import io
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Inicializa el cliente de inferencia
CLIENT = InferenceHTTPClient(
    api_url="https://outline.roboflow.com",
    api_key="Glwg3WRKqF07dJBzArAn"
)


TELEGRAM_BOT_TOKEN = '7826884820:AAH1eOui_gbDF5s3ZsT7nfZEI6QgfTONPEE'
TELEGRAM_CHAT_ID = '1577016023'

def send_telegram_message(image_base64=None, drug_type=None, confidence=None):

    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    message = f"¡Alerta! Se ha detectado una posible sustancia.\n"
    message += f"Hora: {current_time}\n"
    message += f"Tipo de Droga: {drug_type}\n" if drug_type else "Tipo de Droga: No disponible\n"
    message += f"Confianza: {confidence * 100:.2f}%\n" if confidence else "Confianza: No disponible\n"
    
    # Enviar el mensaje de alerta
    requests.post(
        f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage',
        data={'chat_id': TELEGRAM_CHAT_ID, 'text': message}
    )

    # Enviar la imagen si se proporciona en base64
    if image_base64:
        # Decodificar la imagen base64 a bytes
        image_data = base64.b64decode(image_base64)
        # Crear un objeto de archivo en memoria (sin necesidad de guardar en disco)
        image_file = io.BytesIO(image_data)
        
        # Enviar la imagen como archivo
        requests.post(
            f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendPhoto',
            data={'chat_id': TELEGRAM_CHAT_ID},
            files={'photo': image_file}
        )


def detect_drugs(image_data):
    # Decodifica la imagen desde base64
    nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Realiza la inferencia en el frame capturado
    result = CLIENT.infer(frame, model_id="drugs_segmentation/1")
    high_conf_detections = [det for det in result['predictions'] if det['confidence'] >= 0.5]

    if high_conf_detections:
        for det in high_conf_detections:
            x = int(det['x'] - det['width'] / 2)
            y = int(det['y'] - det['height'] / 2)
            w = int(det['width'])
            h = int(det['height'])

            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)
            label = f"{det['class']} ({det['confidence']*100:.1f}%)"
            cv2.putText(frame, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)

            clase = det['class']
            confianza = det['confidence']

        # Codifica la imagen de vuelta a base64 para enviarla al frontend
        _, buffer = cv2.imencode('.jpg', frame)
        image_base64 = base64.b64encode(buffer).decode('utf-8')

        send_telegram_message(image_base64=image_base64, drug_type=clase, confidence=(confianza))
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
