'use client'
import Image from "next/image";
import styles from '../app/styles/Home.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faCamera, faInfoCircle, faImage} from '@fortawesome/free-solid-svg-icons';
import { faTelegram } from '@fortawesome/free-brands-svg-icons'; // Cambiar esta importación

import { useEffect, useRef } from "react";

export default function Home() {

  const videoRef = useRef<HTMLVideoElement | null>(null);

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
        const stream = videoRef.current.srcObject as MediaStream; // Hacemos un casting explícito
        const tracks = stream.getTracks(); // Accedemos a los tracks del stream
        tracks.forEach((track) => track.stop()); // Detenemos todos los tracks (video/audio)
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      {/* Header o barra superior */}
      <header className={styles.header}>
        <Image src="/DRUG.png" alt="Logo" width={250} height={0} /> {/* Tamaño mayor */}
      </header>
      
      <main className={styles.mainContent}>
        {/* Sección izquierda */}
        <section className={styles.leftSection}>
          <div className={styles.sidebarContent}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Bienvenido a Drug Detector</h3>
              <p className={styles.cardText}>
                Nuestra aplicación trabaja automáticamente a través de su <strong>cámara</strong>. 
                Una vez reconozca en su campo de visión algún derivado de la droga como  
                <strong> Marihuana</strong>, <strong>Cocaína</strong> o <strong>Heroína</strong> será notificado.
              </p>
              {/* Botones con íconos */}
              <div className={styles.buttonContainer} style={{ marginLeft: '20px' }}>
                <button className={styles.button}>
                  <FontAwesomeIcon icon={faImage} style={{ width: '30px' }} />
                </button>
                <button className={styles.button} style={{ marginRight: '20px' }}>
                  <FontAwesomeIcon icon={faTelegram} style={{ width: '30px' }} />
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Sección principal */}
        <section className={styles.rightSection}>
        <div className={styles.mainContentArea}>
            {/* Elemento de video para mostrar el stream de la cámara */}
            <video
              ref={videoRef}
              autoPlay
              muted
              className={styles.videoElement}
            ></video>
          </div>
        </section>
      </main>

      {/* Footer con círculos */}
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
