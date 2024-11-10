# Drug Detection System

### Proyecto para el concurso **Datos a la U**

Este sistema tiene como objetivo reconocer y detectar diferentes tipos de drogas en Colombia a través de la cámara, apoyado por modelos de inteligencia artificial supervisada y no supervisada. También incluye gráficos informativos sobre las incautaciones en el país, permitiendo un análisis visual de los datos históricos.

### Tecnología
- **Front end**: React, CSS, HTML
- **Back end**: Node.js, Python
- **Inteligencia Artificial**: Modelos supervisados y no supervisados
- **Computer Vision**: Google Vision o Microsoft Vision API (futuro)

### Integración y Funcionalidades
- **Sistema de Detección en Tiempo Real**: La pantalla principal actúa como una cámara que detecta drogas utilizando tecnologías de visión por computadora.
- **Conexión a Telegram**: Notifica automáticamente a la Policía Nacional con la ubicación en caso de detección.
- **Modelos Predictivos y Gráficos**: Modelos de propensión y gráficos para análisis de datos de incautaciones, con opciones para filtrar por tipo de droga y regiones en Colombia.

### Integrantes del Proyecto
- **Maycol**: Desarrollo del Front end y Back end
- **Natalia**: Desarrollo de modelo de propensión para predecir cantidad de droga incautada
- **Camilo**: Visualizaciones de datos (mapas de calor, gráficos trimestrales, distribución por tipo de droga)
- **Computer Vision**: Desarrollo colaborativo entre el equipo

---

### Datasets

#### Supervisado
- [Incautaciones de Marihuana](https://www.datos.gov.co/Seguridad-y-Defensa/INCAUTACIONES-DE-MARIHUANA/g228-vp9d/data_preview)
- [Incautaciones de Heroína](https://www.datos.gov.co/Seguridad-y-Defensa/INCAUTACI-N-DE-HERO-NA/iat2-gskt/data_preview)
- [Incautaciones de Cocaína](https://www.datos.gov.co/Seguridad-y-Defensa/INCAUTACIONES-DE-COCA-NA/26zg-9p9r/about_data)

#### No Supervisado (Computer Vision)
- [Drugs Segmentation](https://universe.roboflow.com/drugs-ahung/drugs_segmentation/dataset/1)
- [Drug Segmented Dataset](https://universe.roboflow.com/cbait/drug-segemented/dataset/1)

---

### Visualizaciones
- **Mapa de Calor de Colombia**: Distribución de la cantidad de droga incautada por departamento, con opción de seleccionar tipo de droga.
- **Gráfico Trimestral de Incautaciones**: Gráfico de barras que agrupa los datos trimestralmente, mostrando la cantidad total de droga incautada en Colombia.
- **Gráfico Circular**: Distribución de incautaciones entre los tipos de droga (marihuana, cocaína, heroína).

---
