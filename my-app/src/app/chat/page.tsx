'use client'
import Image from "next/image";
import styles from '../../app/styles/Home.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faCamera, faInfoCircle, faArrowRight, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';



export default function Home() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const questions = [
        "¿Qué tan extendido está el consumo de heroína en Colombia?",
        "¿Cuáles son los riesgos a corto y largo plazo del uso de heroína?",
        "¿Qué diferencia hay entre el consumo de heroína y otras drogas opioides?",
        "¿Cómo afecta la heroína al sistema nervioso central?",
        "¿Qué regiones de Colombia registran mayor consumo de heroína?",
        "¿Qué alternativas de tratamiento existen en Colombia para personas adictas a la heroína?",
        "¿Cómo identificar una sobredosis de heroína y qué hacer en esos casos?",
        "¿Qué impacto tiene la heroína en la salud mental de los consumidores?",
        "¿Qué iniciativas existen en Colombia para prevenir el uso de heroína?",
        "¿Qué factores han llevado a Colombia a ser uno de los mayores productores de cocaína en el mundo?",
        "¿Cómo afecta el consumo de cocaína al sistema cardiovascular?",
        "¿Qué relación hay entre la producción de cocaína y las comunidades rurales colombianas?",
        "¿Qué formas de consumo de cocaína son más comunes y cómo varían sus efectos?",
        "¿Cuáles son los impactos sociales y económicos del consumo de cocaína en Colombia?",
        "¿Qué papel juega Colombia en el tráfico internacional de cocaína?",
        "¿Qué alternativas legales y comunitarias se han propuesto para combatir la producción de cocaína?",
        "¿Qué tan adictiva es la cocaína en comparación con otras drogas ilícitas?",
        "¿Qué avances ha logrado Colombia en la erradicación de cultivos de coca?",
        "¿Qué diferencia hay entre el uso medicinal y recreativo de la marihuana en Colombia?",
        "¿Cuáles son los efectos secundarios más comunes del consumo de marihuana?",
        "¿Cómo está regulado el cultivo de marihuana medicinal en Colombia?",
        "¿Qué impacto tiene el consumo de marihuana en el rendimiento académico y laboral?",
        "¿Qué tan accesible es la marihuana para los jóvenes en Colombia?",
        "¿Qué beneficios y riesgos tiene el uso de marihuana medicinal?",
        "¿Cómo ha cambiado la percepción social de la marihuana en los últimos años en Colombia?",
        "¿Qué efectos tiene el consumo crónico de marihuana en la memoria y el aprendizaje?",
        "¿Qué medidas existen en Colombia para regular el consumo de marihuana en espacios públicos?",
        "¿Qué líneas de atención hay en Colombia para la ayuda a drogadictos?"
    ];

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setQuery(input);
        // Aquí generas las sugerencias basadas en la entrada
        if (input.length > 1) {
            const filtered = questions.filter((q) =>
                q.toLowerCase().includes(input.toLowerCase())
            ).slice(0, 3);
            setSuggestions(filtered)
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion); // Establecer la sugerencia seleccionada en el input
        setSuggestions([]); // Limpiar las sugerencias
    };

    const handleSendMessage = async () => {

        const chatInput = document.getElementById("chatInput") as HTMLInputElement;
        const chatMessages = document.getElementById("chatMessages");

        // Primero, tomamos el mensaje del usuario y lo agregamos al chat
        const userMessage = chatInput.value.trim();
        if (!userMessage) return; // Evitar enviar si el mensaje está vacío

        // Agregar el mensaje del usuario al chat
        const userMessageElement = document.createElement("div");
        userMessageElement.className = styles.userMessage;
        userMessageElement.textContent = userMessage;
        chatMessages.appendChild(userMessageElement);

        // Crear un mensaje de "cargando" (usualmente un spinner o texto)
        const loadingMessageElement = document.createElement("div");
        loadingMessageElement.className = styles.botMessage;
        loadingMessageElement.textContent = "Procesando...";
        chatMessages.appendChild(loadingMessageElement);

        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch('http://127.0.0.1:5001/ia_response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: chatInput.value
                }),
            }
            );
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
            const r = await response.json();
            if (chatInput && chatMessages && chatInput.value.trim()) {
                const userMessage = chatInput.value;

                loadingMessageElement.remove();

                // Agregar el mensaje del usuario al chat
                /*const userMessageElement = document.createElement("div");
                userMessageElement.className = styles.userMessage;
                userMessageElement.textContent = userMessage;
                chatMessages.appendChild(userMessageElement);*/

                const botAvatar = document.createElement("img");
                botAvatar.src = "/DRUG.png";
                botAvatar.alt = "Bot Avatar";
                botAvatar.className = styles.avatar;

                // Simular respuesta del chatbot
                const botMessageElement = document.createElement("div");
                botMessageElement.className = styles.botMessage;
                botMessageElement.textContent = r.response;
                chatMessages.appendChild(botAvatar);
                chatMessages.appendChild(botMessageElement);

                // Limpiar el campo de entrada
                chatInput.value = "";

                // Desplazar el chat hacia abajo
                //chatMessages.scrollTop = chatMessages.scrollHeight;
                const lastMessage = chatMessages.lastElementChild; // Último mensaje agregado
                if (lastMessage) {
                    // Hacer que el último mensaje se desplace al inicio del contenedor de chat
                    lastMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

            }
        }
        catch (error) {
            console.error('Error al preguntarle a druggi: ', error);
        }


    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <Image src="/DRUG.png" alt="Logo" width={250} height={0} />
            </header>

            <main className={styles.mainContent}>
                <section className={styles.leftSection}>
                    <div className={styles.sidebarContent}>
                        <div className={styles.cardIA}>
                            <h3 className={styles.cardTitle}>Bienvenido a Drug Detector</h3>
                            <p className={styles.cardText}>
                                ¿Sabías que en Colombia existen varias líneas de atención para personas afectadas por el consumo de sustancias psicoactivas?
                                <br />
                                <strong>Línea 106:</strong> Disponible en Bogotá, orienta y acompaña a personas con problemas relacionados con el consumo de drogas. Parte de un esfuerzo institucional para ofrecer ayuda en salud mental y consumo (Fuente: Secretaría Distrital de Salud de Bogotá).
                                <br />
                                <strong>Red de Salud Pública:</strong> Implementa rutas de atención en varios departamentos y ciudades del país, que incluyen servicios de rehabilitación, apoyo social y reintegración productiva (Fuente: Ministerio de Salud y Protección Social).
                                <br />
                                <strong>Ministerio de Salud y Protección Social:</strong> Ha establecido estrategias para la atención integral del consumo de sustancias psicoactivas a nivel nacional, promoviendo la salud, prevención de riesgos y tratamiento especializado (Fuente: Ministerio de Salud y Protección Social).
                            </p>
                            <div className={styles.buttonContainer} style={{ marginLeft: '20px' }}>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.rightSection}>
                    <div className={styles.chat}>
                        <h3 className={styles.chatTitle}>Druggi</h3>
                        <div className={styles.chatMessages} id="chatMessages">
                            {/* Aquí se mostrarán los mensajes del chat */}
                        </div>
                        <div className={styles.chatInputContainer}>
                            <ul className={styles.suggestions}>
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                            <input
                                type="text"
                                placeholder="Escribe tu duda..."
                                className={styles.chatInput}
                                id="chatInput"
                                value={query}
                                onChange={handleInputChange}
                            />
                            <button
                                className={styles.chatSendButton}
                                onClick={() => handleSendMessage()}
                            >
                                Enviar
                            </button>
                        </div>
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
        </div>
    );
}


