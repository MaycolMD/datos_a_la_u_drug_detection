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
        "¿Cómo brindar primeros auxilios a alguien que ha consumido heroína o cocaína?",
        "¿Qué pasos seguir si una persona está bajo los efectos de cocaína y muestra signos de sobredosis?",
        "¿Cuáles son los síntomas de intoxicación por marihuana y cómo asistir a alguien en esta situación?",
        "¿Qué hacer si una persona tiene dificultades para respirar después de consumir cocaína?",
        "¿Cómo reconocer una sobredosis de heroína o cocaína y qué primeros auxilios aplicar?",
        "¿Qué precauciones debo tomar al acercarme a alguien bajo los efectos de drogas?",
        "¿Cuáles son los signos de una crisis respiratoria por heroína o cocaína y cómo intervenir?",
        "¿Qué hacer si alguien convulsiona después de consumir cocaína o heroína?",
        "¿Cómo actuar en caso de detectar síntomas de sobredosis en las cámaras?",
        "¿Qué debo hacer si una persona se encuentra muy alterada tras consumir marihuana?",
        "¿Cuándo es seguro mover a una persona inconsciente por consumo de drogas?",
        "¿Qué técnicas de reanimación pueden aplicarse en casos de sobredosis de heroína o cocaína?",
        "¿Cómo manejar una situación en la que alguien tiene náuseas o vómitos tras consumir drogas?",
        "¿Qué debo hacer si alguien bajo el efecto de drogas se comporta de forma agresiva?",
        "¿Cuáles son los síntomas de intoxicación grave por cocaína o marihuana y cómo brindar ayuda?",
        "¿Qué procedimientos de emergencia seguir si alguien muestra signos de sobredosis?",
        "¿Cómo asegurar la vía aérea de una persona inconsciente por consumo de cocaína o heroína?",
        "¿Cuáles son los pasos para administrar RCP a alguien que no respira tras una sobredosis?",
        "¿Qué hacer si alguien pierde el conocimiento después de consumir una droga como heroína o cocaína?",
        "¿Cómo verificar si alguien necesita atención médica urgente tras el uso de cocaína o marihuana?",
        "¿Qué hacer si alguien parece paranoico o ansioso extremo después de consumir marihuana?",
        "¿Qué hacer si una persona experimenta palpitaciones rápidas después de consumir cocaína?",
        "¿Qué técnicas pueden ayudar a calmar a una persona bajo los efectos de marihuana?",
        "¿Qué hacer si alguien tiene alucinaciones después de consumir una droga desconocida?",
        "¿Qué signos indican que una persona debe ser llevada a urgencias inmediatamente tras el uso de drogas?",
        "¿Qué herramientas de primeros auxilios son útiles en casos de sobredosis de cocaína o heroína?",
        "¿Cómo evitar que alguien bajo efectos de drogas se ahogue con su propia saliva?",
        "¿Qué debo hacer si alguien muestra signos de intoxicación por consumir marihuana en exceso?",
        "¿Qué protocolos de seguridad seguir al atender a alguien bajo influencia de cocaína o heroína?",
        "¿Qué hacer si una persona presenta signos de sobredosis en un área pública?"
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
            const response = await fetch('http://127.0.0.1:5003/ia_response', {
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
                                Descubre cómo en Colombia existen entidades de apoyo para quienes enfrentan problemas relacionados con el consumo de sustancias psicoactivas:
                            </p>

                            <div className={styles.infoCard}>
                                <h4 className={styles.cardSubtitle}>🟨 Ministerio de Salud y Protección Social</h4>
                                <p className={styles.cardText}>🌍 <strong>Estrategia nacional:</strong></p>

                                <p className={styles.cardText}>Entidad reguladora que busca liderar y coordinar las políticas públicas relacionadas con la salud y el bienestar social.</p>
                                <p className={styles.cardText}>Ofrecen información clara y guiada sobre la prevención de sustancias psicoactivas y los programas de prevención de las mismas.</p>
                                <p className={styles.cardText}>🌐 <strong>Fuente: </strong> <a href="https://www.minsalud.gov.co/salud/publica/SMental/Paginas/Sustancias-psicoactivas.aspx" target="_blank" rel="noopener noreferrer" className={styles.link}>Ministerio de Salud y Protección Social</a></p>

                            </div>
                            <div className={styles.infoCard}>
                                <h4 className={styles.cardSubtitle}>📞 Línea 106</h4>
                                <p className={styles.cardText}>🌍 <strong>El poder de ser escuchado</strong></p>

                                <p className={styles.cardText}>Una línea de ayuda, intervención psicosocial y soporte en crisis no presencial. Que a través de canales de contacto identifica, previene y canaliza hacia servicios expertos eventos de riesgo para la salud mental, como el consumo de sustancias psicoactivas.</p>
                                <p className={styles.cardText}> 🌐 <strong>Fuente: </strong> <a href="https://bogota.gov.co/servicios/guia-de-tramites-y-servicios/linea-106" target="_blank" rel="noopener noreferrer" className={styles.link}>Línea 106 - Bogotá</a></p>

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


