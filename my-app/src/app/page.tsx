'use client'
import Image from "next/image";
import styles from '../app/styles/Home.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faCamera, faInfoCircle, faArrowRight, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [predictionData, setPredictionData] = useState({ drugType: "", quantity: "", department: "" });
  const [predictionResults, setPredictionResults] = useState(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPredictionResults(null); // Resetea los resultados al cerrar
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPredictionData((prev) => ({ ...prev, [name]: value }));
  };

  const DEPARTAMENTOS = [
    'RISARALDA', 'BOGOTA D.C.', 'QUINDIO', 'CAUCA', 'ATLANTICO',
    'NORTE DE SANTANDER', 'ANTIOQUIA', 'META', 'SANTANDER',
    'AMAZONAS', 'BOLIVAR', 'VALLE DEL CAUCA', 'SAN ANDRES ISLAS',
    'CORDOBA', 'NARIÑO', 'CALDAS', 'MAGDALENA', 'GUAVIARE',
    'CUNDINAMARCA', 'TOLIMA', 'LA GUAJIRA', 'CAQUETA', 'CASANARE',
    'CESAR', 'HUILA', 'BOYACA', 'CHOCO', 'PUTUMAYO', 'SUCRE',
    'ARAUCA', 'VAUPES', 'GUAINIA', 'VICHADA'
  ];

  const handlePrediction = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/data_prediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          depto: predictionData.department.toUpperCase(),
          droga: predictionData.drugType.toUpperCase(),
          cantidad: parseFloat(predictionData.quantity),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      const data = await response.json();
      setPredictionResults({
        currentMonth:  data.prediction[0],
        nextMonth:  data.prediction[1],
        twoMonths:  data.prediction[2],
      });
      console.log('holaaaq', data.prediction[0])

    } catch (error) {
      console.error('Error al obtener los datos de predicción:', error);
    }
  };

  const getCameraStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error al acceder a la cámara: ", error);
    }
  };

  useEffect(() => {

    getCameraStream();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const captureAndSendImage = () => {
      if (videoRef.current && !isVideoPaused) {  // Solo captura si no está pausado
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');

        fetch('http://127.0.0.1:5000/detect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: imageData }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.detected) {
              setImageSrc(data.image);
              setIsVideoPaused(true);
            }
          })
          .catch((error) => console.error('Error:', error));
      }
    };

    const intervalId = setInterval(captureAndSendImage, 1000);

    return () => clearInterval(intervalId);
  }, [isVideoPaused]);

  const handleContinue = () => {
    setImageSrc(null);      // Quitar la imagen pausada
    setIsVideoPaused(false); // Reiniciar el estado para el video

    // Verificar si el video aún tiene el flujo de cámara y reanudarlo
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.play();
    } else {
      getCameraStream();  // Re-conectar el flujo si se perdió
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Image src="/DRUG.png" alt="Logo" width={250} height={0} />
      </header>

      <main className={styles.mainContent}>
        <section className={styles.leftSection}>
          <div className={styles.sidebarContent}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Bienvenido a Drug Detector</h3>
              <p className={styles.cardText}>
                Nuestra aplicación trabaja automáticamente a través de su <strong>cámara</strong>.
                Una vez reconozca en su campo de visión algún derivado de la droga como
                <strong> Marihuana</strong>, <strong>Cocaína</strong> o <strong>Heroína</strong> será notificado.
              </p>
              <div className={styles.buttonContainer} style={{ marginLeft: '20px' }}>
                <button className={styles.button} onClick={handleOpenModal}>
                  <FontAwesomeIcon icon={faChartLine} style={{ width: '30px' }} />
                </button>
                <button className={styles.button} onClick={handleContinue}>
                  <FontAwesomeIcon icon={faArrowRight} style={{ width: '30px' }} />
                </button>
                <button className={styles.button} style={{ marginRight: '20px' }} onClick={() => window.location.href = 'https://web.telegram.org/k/#@drug_detector_co_bot'} >
                  <FontAwesomeIcon icon={faTelegram} style={{ width: '30px' }} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.rightSection}>
          <div className={styles.videoContainer}>
            {isVideoPaused ? (
              <img src={`data:image/jpeg;base64,${imageSrc}`} alt="Frame detectado" className={styles.imageElement} />
            ) : (
              <video ref={videoRef} autoPlay muted className={styles.videoElement}></video>
            )}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.circle} onClick={() => window.location.href = 'http://localhost:5002'}>
          <FontAwesomeIcon icon={faChartBar} style={{ color: '#002424', width: '30px', height: '30px' }} />
        </div>
        <div className={styles.circle} onClick={() => window.location.href = 'http://localhost:3000'}>
          <FontAwesomeIcon icon={faCamera} style={{ color: '#002424', width: '30px', height: '30px' }} />
        </div>
        <div className={styles.circle} onClick={() => window.location.href = 'http://localhost:3000/chat'}>
          <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#002424', width: '30px', height: '30px' }} />
        </div>
      </footer>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button onClick={handleCloseModal} className={styles.closeButton}>X</button>

            {predictionResults ? (
              <div className={styles.resultsContainer}>
                <h3 className={styles.resultsTitle}>Resultados de Predicción</h3>
                <p className={styles.resultItem}>
                  <strong>Estimado para el mes actual:</strong> {predictionResults.currentMonth}
                </p>
                <p className={styles.resultItem}>
                  <strong>Predicción para el próximo mes:</strong> {predictionResults.nextMonth}
                </p>
                <p className={styles.resultItem}>
                  <strong>Predicción para los próximos dos meses:</strong> {predictionResults.twoMonths}
                </p>
                <button onClick={() => setPredictionResults(null)} className={styles.resetButton}>
                  Hacer otra predicción
                </button>
              </div>
            ) : (
              <div>
                <h2>Predicción de Consumo</h2>
                <p>Ingrese los datos para obtener las predicciones.</p>
                <label className={styles.modalContentLabel}>
                  Tipo de Droga
                  <select
                    name="drugType"
                    value={predictionData.drugType}
                    onChange={handleChange}
                    className={styles.inputField}
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="COCAINA">COCAINA</option>
                    <option value="MARIHUANA">MARIHUANA</option>
                    <option value="HEROINA">HEROINA</option>
                  </select>
                </label>
                <label className={styles.modalContentLabel}>
                  Cantidad:
                  <input
                    type="number"
                    name="quantity"
                    value={predictionData.quantity}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                </label>

                <label className={styles.modalContentLabel}>
                  Departamento:
                  <input
                    list="departments"
                    name="department"
                    value={predictionData.department}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                  <datalist id="departments">
                    {DEPARTAMENTOS.map((depto) => (
                      <option key={depto} value={depto} />
                    ))}
                  </datalist>
                </label>


                <div className={styles.buttonContainer}>
                  <button onClick={handlePrediction} className={styles.predictButton}>
                    Predecir
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

