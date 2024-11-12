'use client'
import Image from "next/image";
import styles from '../app/styles/Home.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faCamera, faInfoCircle, faImage} from '@fortawesome/free-solid-svg-icons';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isVideoPaused, setIsVideoPaused] = useState(false);

  useEffect(() => {
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
    setIsVideoPaused(false);
    setImageSrc(null);
  };

  return (
    <div className={styles.container}>
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
                <button className={styles.button} onClick={handleContinue}>
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
        <div className={styles.circle}>
          <FontAwesomeIcon icon={faChartBar} style={{ color: '#002424', width: '30px', height: '30px' }} />
        </div>
        <div className={styles.circle}>
          <FontAwesomeIcon icon={faCamera} style={{ color: '#002424', width: '30px', height: '30px' }} />
        </div>
        <div className={styles.circle}>
          <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#002424', width: '30px', height: '30px' }} />
        </div>
      </footer>
    </div>
  );
}
