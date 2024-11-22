import streamlit as st
import pandas as pd
import plotly.express as px
import geopandas as gpd
from streamlit_extras.add_vertical_space import add_vertical_space
from streamlit.components.v1 import html
# Configuración de la página
st.set_page_config(layout="wide")
# Estilo para la imagen
import streamlit as st

# Agregar estilos CSS para el encabezado y la imagen
import streamlit as st
from PIL import Image


import streamlit as st
import base64
from PIL import Image
from io import BytesIO

# Cambiar el fondo de la aplicación
st.markdown(
    """
    <style>
    /* Cambiar el fondo principal de la app */
    .stApp {
        background-color: #E0E0E0;
    }
    </style>
    """,
    unsafe_allow_html=True
)
# Cargar la imagen del logo
logo = Image.open('DRUG.png')  # Cambia la ruta a donde esté tu logo

# Función para convertir la imagen a base64
def logo_to_base64(img):
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return img_str

# Convertir la imagen a base64
logo_base64 = logo_to_base64(logo)

# CSS para la barra de navegación
st.markdown(
    """
    <style>
        .streamlit-expanderHeader {
        display: none;
    }
    .css-1a8r6vl {
        visibility: hidden;
    }

    .navbar {
        background-color: #003d3d;
        color: white;
        padding: 5px 0;
        text-align: center;
        font-size: 30px;
        font-family: Arial, sans-serif;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1000;  /* Asegura que se quede encima de otros elementos */
    }
    .navbar-logo {
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
    }
    .navbar-text {
        display: inline-block;
        color: white;
        font-weight: bold;
        letter-spacing: 2px;
        vertical-align: middle;
    }
    .navbar-logo-text {
        color: #00bfbf;
        font-weight: 600;
    }
    </style>
    """,
    unsafe_allow_html=True
)
# Contenido de la barra con la imagen como logo
st.markdown(
    f"""
    <style>
        .navbar {{
            margin-top: 60px;  /* Ajusta el margen superior aquí */
        }}
        .navbar-logo img {{
            width: 250px;
            height: 100px;
        }}
    </style>

    <div class="navbar">
        <span class="navbar-logo"><img src="data:image/png;base64,{logo_base64}" width="250" height="100"></span>
    </div>
    """,
    unsafe_allow_html=True
)


st.divider()

# Cargar y procesar el dataset
@st.cache_data
def load_data(nrows):
    data = pd.read_csv('data.csv', nrows=nrows)
    return data

# Lista de departamentos de Colombia
departamentos_colombia = [
    'RISARALDA', 'BOGOTA D.C.', 'QUINDIO', 'CAUCA', 'ATLANTICO',
    'NORTE DE SANTANDER', 'ANTIOQUIA', 'META', 'SANTANDER', 'AMAZONAS',
    'BOLIVAR', 'VALLE DEL CAUCA', 'SAN ANDRES ISLAS', 'CORDOBA',
    'NARIÑO', 'CALDAS', 'MAGDALENA', 'GUAVIARE', 'CUNDINAMARCA',
    'TOLIMA', 'LA GUAJIRA', 'CAQUETA', 'CASANARE', 'CESAR', 'HUILA',
    'BOYACA', 'CHOCO', 'PUTUMAYO', 'SUCRE', 'ARAUCA', 'VAUPES',
    'GUAINIA', 'VICHADA'
]

# Cargar los datos
data = load_data(1122157)
data['DEPARTAMENTO'] = data['DEPARTAMENTO'].str.upper()
data = data[data['DEPARTAMENTO'].isin(departamentos_colombia)]

#top10 data

#data_sin_heroina
data_sin_heroina = data[data['DROGA'] != 'HEROÍNA']
data_sin_heroina['FECHA HECHO'] = pd.to_datetime(data_sin_heroina['FECHA HECHO'], format='%d/%m/%Y')
data_sin_heroina['MES'] = data_sin_heroina['FECHA HECHO'].dt.to_period("M")


#Data con heroina
data_con_heroina = data[data['DROGA'] == 'HEROÍNA']
data_con_heroina['FECHA HECHO'] = pd.to_datetime(data_con_heroina['FECHA HECHO'], format='%d/%m/%Y')
data_con_heroina['MES'] = data_con_heroina['FECHA HECHO'].dt.to_period("M")


#Data timeline para el histograma
df_timeline_heroina = data_con_heroina.groupby(['MES', 'DROGA']).agg({'CANTIDAD': 'sum'}).reset_index()
df_timeline_heroina['MES'] = df_timeline_heroina['MES'].dt.to_timestamp()

df_timeline = data_sin_heroina.groupby(['MES', 'DROGA']).agg({'CANTIDAD': 'sum'}).reset_index()
df_timeline['MES'] = df_timeline['MES'].dt.to_timestamp()

# Datos para el mapa
df_pivot = data.pivot_table(index="DEPARTAMENTO", columns="DROGA", values="CANTIDAD", aggfunc="sum").reset_index()
df_pivot = df_pivot.fillna(0)
df_pivot.columns = ["DEPARTAMENTO", "COCAINA", "HEROINA", "MARIHUANA"]


#-----------------------Selectbox-----------------------#
# Opciones para el selectbox
opciones_drogas = ["COCAINA", "MARIHUANA", "HEROINA"]

# Aplicar estilos al selectbox
selectbox_styles = """
    <style>
        /* Estilo general del contenedor del selectbox */
        div[data-baseweb="select"] {
            max-width: 300px;      /* Ajustar el ancho del selectbox */
            margin-left: 0;        /* Alinear a la izquierda */
            transition: transform 0.3s; /* Efecto de suavizado */
            cursor: pointer;
               
        }
        /* Efecto hover para el selectbox */
        div[data-baseweb="select"]:hover {
            transform: scale(1.05); /* Agrandar ligeramente al pasar el cursor */
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Sombra al pasar el cursor */
        }
    </style>
"""
st.markdown(selectbox_styles, unsafe_allow_html=True)

# Mostrar el selectbox
droga_seleccionada = st.selectbox(
    "Selecciona el tipo de droga:",
    opciones_drogas
)
top_cocaina = df_pivot[["DEPARTAMENTO", "COCAINA"]].sort_values(by="COCAINA", ascending=False).head(10)
top_heroina = df_pivot[["DEPARTAMENTO", "HEROINA"]].sort_values(by="HEROINA", ascending=False).head(10)
top_marihuana = df_pivot[["DEPARTAMENTO", "MARIHUANA"]].sort_values(by="MARIHUANA", ascending=False).head(10)
#quitar decimales de COCAINA
top_cocaina['COCAINA'] = top_cocaina['COCAINA'].astype(int)
top_heroina['HEROINA'] = top_heroina['HEROINA'].astype(int)
top_marihuana['MARIHUANA'] = top_marihuana['MARIHUANA'].astype(int)

#-----------------------Selectbox-----------------------#
df_filtrado = df_pivot[['DEPARTAMENTO', droga_seleccionada]].rename(columns={droga_seleccionada: "CANTIDAD"})

departamentos_data = gpd.read_file('./geoData/colombia.geojson')

# Paleta de colores personalizada
custom_colors = ["#002B2B", "#004F4F", "#007373", "#00A5A5", "#33CCCC"]

#-----------------------CHARTS-----------------------#
# Donut chart
total_por_droga = data.groupby('DROGA')['CANTIDAD'].sum().reset_index()

fig_pie = px.pie(
    total_por_droga,
    values='CANTIDAD',
    names='DROGA',
    color_discrete_sequence=custom_colors,
    hole=0.4,
)
fig_pie.update_layout(
                    height=350,
                    margin_l=20,
                    legend_orientation="h",
                    paper_bgcolor="#E0E0E0",  # Fondo de toda la figura
                    plot_bgcolor="#E0E0E0"    # Fondo del área de la gráfic
                    
                    )



# Mapa de calor
fig = px.choropleth(
    df_filtrado,
    geojson=departamentos_data,
    locations="DEPARTAMENTO",
    featureidkey="properties.NOMBRE_DPT",
    color="CANTIDAD",
    color_continuous_scale=custom_colors,
    hover_name="DEPARTAMENTO",
    height=400,
)
fig.update_geos(fitbounds="locations", 
                
                visible=True,
                bgcolor='rgba(0,0,0,0)',
                coastlinecolor="white",
                framecolor='white',
                showcountries=True,
                )

fig.update_layout(
    margin={"r": 0, "t": 0, "l": 0, "b": 0},
    paper_bgcolor="#E0E0E0",  # Fondo de toda la figura
    plot_bgcolor="#E0E0E0"    # Fondo del área de la gráfic
)


col = st.columns((1.8, 4.2, 2.5), gap='medium')

with col[0]:
    st.markdown("##### Distribución de incautación de drogas en Colombia (kg)")
    st.plotly_chart(fig_pie, use_container_width=True)
with col[1]:
    st.markdown(
    f"""
    <div style="text-align: center;">
        <h5>Incautación de <span style="color: blue; font-weight: bold;">{droga_seleccionada}</span> en Colombia por departamento</h5>
    </div>
    """, 
    unsafe_allow_html=True
)

    st.plotly_chart(fig, use_container_width=True)
    if droga_seleccionada == 'HEROINA':
        
        fig_timeline = px.line(
            df_timeline_heroina,
            x='MES',
            y='CANTIDAD',
            color='DROGA',
            labels={'MES': 'Fecha', 'CANTIDAD': 'Cantidad (kg)'},
            color_discrete_sequence=["#000000"])
        fig_timeline.update_traces(line=dict(width=2))  # Ajusta el grosor de las líneas
        fig_timeline.update_layout(
            paper_bgcolor="#E0E0E0",  # Fondo de toda la figura
            plot_bgcolor="#E0E0E0",  # Fondo del área de la gráfic
            margin={"r": 0, "t": 70, "l": 0, "b": 0},
            height=400)
        st.plotly_chart(fig_timeline, use_container_width=True)
        st.markdown("##### Incautación de :blue[**HEROINA**] en Colombia en el tiempo")
    else:
       
        fig_timeline = px.line(
            df_timeline,
            x='MES',
            y='CANTIDAD',
            color='DROGA',
            labels={'MES': 'Fecha', 'CANTIDAD': 'Cantidad (kg)'},
            color_discrete_sequence=custom_colors
              # Aplicar la paleta de colores personalizada
        )
        fig_timeline.update_traces(line=dict(width=2))  # Ajusta el grosor de las líneas
        fig_timeline.update_layout(
            paper_bgcolor="#E0E0E0",  # Fondo de toda la figura
            plot_bgcolor="#E0E0E0",    # Fondo del área de la gráfic
            margin={"r": 0, "t": 70, "l": 0, "b": 0},
            height=400,
        )  
        
        st.plotly_chart(fig_timeline, use_container_width=True)
        st.markdown("##### Incautación de :blue[**COCAINA**] Y :blue[**MARIHUANA**] en Colombia ")
    # Pie de página
with col[2]:
    st.markdown(f"##### Top 10 departamentos con mayor incautación de :blue[**{droga_seleccionada}**] ")
    if droga_seleccionada == 'COCAINA':
        st.dataframe(top_cocaina,
                 column_order=("DEPARTAMENTO","COCAINA"),
                 hide_index=True,
                 width=None,
                 column_config={
                    "DEPARTAMENTO": st.column_config.TextColumn(
                        "DEPARTAMENTO",
                    ),
                    "COCAINA": st.column_config.ProgressColumn(
                        "COCAINA",
                        format="%f",
                        min_value=0,
                        max_value=max(top_cocaina.COCAINA),
                     )}
                 )
    elif droga_seleccionada == 'HEROINA':
        st.dataframe(top_heroina,
                 column_order=("DEPARTAMENTO","HEROINA"),
                 hide_index=True,
                 width=None,
                 column_config={
                    "DEPARTAMENTO": st.column_config.TextColumn(
                        "DEPARTAMENTO",
                    ),
                    "HEROINA": st.column_config.ProgressColumn(
                        "HEROINA",
                        format="%f",
                        min_value=0,
                        max_value=max(top_heroina.HEROINA),
                     )}
                 )
    else:
        st.dataframe(top_marihuana,
                 column_order=("DEPARTAMENTO","MARIHUANA"),
                 hide_index=True,
                 width=None,
                 column_config={
                    "DEPARTAMENTO": st.column_config.TextColumn(
                        "DEPARTAMENTO",
                    ),
                    "MARIHUANA": st.column_config.ProgressColumn(
                        "MARIHUANA",
                        format="%f",
                        min_value=0,
                        max_value=max(top_marihuana.MARIHUANA),
                     )}
                 )
    st.divider()
    with st.expander('Acerca de', expanded=True):
        st.write('''
            - :blue[**Datos**]: [datos.gov.co](<https://datos.gov.co/>).
            - :blue[**Tipo de datos**]: Para la tabla del top 10, los valores estan expresados en kilogramos.
            - :blue[**Interactividad**]: Todos los graficos son interactivos, puedes hacer zoom, descargar la grafica, etc.
            ''')

st.divider()
# Agregar Font Awesome desde un CDN
st.markdown(
    """
    <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    </head>
    """, 
    unsafe_allow_html=True
)
st.markdown(
    """
    <style>
        /* Estilos para los iconos de acción */
        .icon-button {
            width: 70px;  /* Tamaño de ancho ajustado */
            height: 70px; /* Tamaño de alto ajustado */
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #089693;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .icon-button:hover {
            transform: scale(1.2);
            background-color: rgb(3, 216, 212);
            box-shadow: 0px 4px 10px #1be9e5;
        }

        /* Fijar la barra en la parte inferior */
        .static-footer {
            background-color: #002424;
             justify-content: space-around;
            padding: 10px;
            border-radius: 10px;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.4);
        }
        .static-footer .icon-button {
            margin: 0 10px;
        }
    </style>

    <div class="static-footer">
        <div style="display: flex; justify-content: space-around; gap: 20px;">
            <a href="http://localhost:5002" target="_blank" style="text-decoration: none;">
                <div class="icon-button">
                    <i class="fa-solid fa-chart-bar" style="color: #002424; font-size: 30px;"></i> <!-- Tamaño del ícono ajustado -->
                </div>
            </a>
            <a href="http://localhost:3000" target="_blank" style="text-decoration: none;">
                <div class="icon-button">
                    <i class="fa fa-camera" style="color: #002424; font-size: 30px;"></i> <!-- Tamaño del ícono ajustado -->
                </div>
            </a>
            <a href="https://youtube.com" target="_blank" style="text-decoration: none;">
                <div class="icon-button">
                    <i class="fa-solid fa-circle-info" style="color: #002424; font-size: 30px;"></i> <!-- Tamaño del ícono ajustado -->
                </div>
            </a>
        </div>
    </div>
    """, 
    unsafe_allow_html=True
)

st.markdown(
    """
    <style>
        .footer {
            background-color: #002424;
            color: white;
            padding: 10px;
            border-radius: 10px;
            text-align: center;
            font-size: 14px;
            margin-top: 30px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.4);
        }
    </style>
    <div class="footer">
        <p>Desarrollado por Equipo 33 &copy; 2024</p>
        <p>Datos obtenidos de <a href="https://datos.gov.co/" style="color: #A4DE02;">datos.gov.co</a></p>
    </div>
    """, 
    unsafe_allow_html=True
)
