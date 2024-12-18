import cv2
from inference_sdk import InferenceHTTPClient

# Configurar el cliente para la inferencia
CLIENT = InferenceHTTPClient(
    api_url="https://outline.roboflow.com",
    api_key="Glwg3WRKqF07dJBzArAn"
)

# Inicializar la cámara (0 para la cámara integrada o especificar el número de la cámara)
cap = cv2.VideoCapture(0)

while cap.isOpened():
    # Capturar cada frame de la cámara
    ret, frame = cap.read()
    if not ret:
        print("Error al capturar el frame.")
        break

    # Realiza la inferencia en el frame capturado
    result1 = CLIENT.infer(frame, model_id="drugs_segmentation/1")

    # Filtrar las detecciones con alta confianza
    high_conf_detections_1 = [det for det in result1['predictions'] if ( (det['confidence'] >= 0.5) and (det['class'] not in ('alcohol', 'smoking', 'Shrooms')) ) ]

    # Realiza la inferencia en el frame capturado
    result2 = CLIENT.infer(frame, model_id="drugs-detection/3")

    # Filtrar las detecciones con alta confianza
    high_conf_detections_2 = [det for det in result2['predictions'] if ( (det['confidence'] >= 0.5) and (det['class'] not in ('alcohol', 'smoking', 'Shrooms')) ) ]

    # Combinar ambas listas de detecciones de alta confianza (si ambas existen)
    all_detections = high_conf_detections_1 + high_conf_detections_2 if high_conf_detections_1 and high_conf_detections_2 else high_conf_detections_1 or high_conf_detections_2

    # Verificar si hay detecciones de alta confianza en el frame
    if all_detections:
        for det in all_detections:
            if ((det['class'] not in ('alcohol', 'smoking', 'Shrooms')) and ( det['confidence']>= 0.5 )):
                # Extraer las coordenadas de los límites detectados
                x = int(det['x'] - det['width'] / 2)
                y = int(det['y'] - det['height'] / 2)
                w = int(det['width'])
                h = int(det['height'])

                # Dibujar el rectángulo de la detección en el frame
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)

                label = f"{det['class']} ({det['confidence']*100:.1f}%)"

                xx = int(det['x'])
                yy = int(det['y'])
                width = int(det['width'])
                height = int(det['height'])

                top_left = (xx - width // 2, yy - height // 2)
                bottom_right = (xx + width // 2, yy + height // 2)

                cv2.putText(frame, label, (top_left[0], top_left[1] - 10), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)

        # Mostrar el frame anotado
        cv2.imshow("Detección en tiempo real", frame)

        # Pausar el bucle cuando se detecta algo
        if cv2.waitKey(0) & 0xFF == ord('q'):
            break
    else:
        # Mostrar el frame en tiempo real sin anotación
        cv2.imshow("Detección en tiempo real", frame)

    # Para continuar o detener el loop de procesamiento en cada frame
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Liberar la cámara y cerrar ventanas
cap.release()
cv2.destroyAllWindows()
