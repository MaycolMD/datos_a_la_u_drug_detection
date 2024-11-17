import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import geopandas as gpd
from streamlit_extras.add_vertical_space import add_vertical_space
st.set_page_config(layout="wide")
c1,c2 = st.columns([0.2,1])

with c1:
    st.image('DRUG.png', width=200)
with c2:
    st.markdown(
        """
        <div style="background-color:#002424; padding:10px; border-radius:5px; display:flex; align-items:center; justify-content:center;">
            <h1 style="color:white; display:inline; text-align:center;">Incautación de Drogas en Colombia</h1>
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

# Datos de ejemplo de departamentos en Colombia
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

#Convertir la fecha a datetime
data['FECHA HECHO'] = pd.to_datetime(data['FECHA HECHO'], format='%d/%m/%Y')
data['MES'] = data['FECHA HECHO'].dt.to_period("M")
df_timeline = data.groupby(['MES', 'DROGA']).agg({'CANTIDAD': 'sum'}).reset_index()
df_timeline['MES'] = df_timeline['MES'].dt.to_timestamp()



data['DEPARTAMENTO'] = data['DEPARTAMENTO'].str.upper()
df = data[data['DEPARTAMENTO'].isin(departamentos_colombia)]
df_pivot = df.pivot_table(index="DEPARTAMENTO", columns="DROGA", values="CANTIDAD", aggfunc="sum").reset_index()
df_pivot = df_pivot.fillna(0)
df_pivot.columns = ["DEPARTAMENTO", "COCAINA", "HEROINA", "MARIHUANA"]

droga_seleccionada = st.selectbox(
    "Selecciona el tipo de droga:", 
    ["COCAINA", "MARIHUANA", "HEROINA"])
df_filtrado = df_pivot[['DEPARTAMENTO', droga_seleccionada]].rename(columns={droga_seleccionada: "CANTIDAD"})
departamentos_data = gpd.read_file('./geoData/colombia.geojson')
total_por_droga = df.groupby('DROGA')['CANTIDAD'].sum().reset_index()
add_vertical_space(1)
custom_colors = ["#97BF7A", "#5E8C5D", "#325935", "#214029", "#132623"]
#Donut chart
fig_pie = px.pie(
    total_por_droga,
    values='CANTIDAD',
    names='DROGA',
    color_discrete_sequence=custom_colors,
    hole = 0.4,
    
)
fig_pie.update_layout(       # Fondo del área del gráfico
    height=350
         # Fondo exterior del gráfico
)
#mapa de calor de colombia
fig = px.choropleth(
    df_filtrado,
    geojson=departamentos_data,
    locations="DEPARTAMENTO",
    featureidkey="properties.NOMBRE_DPT",
    color="CANTIDAD",
    color_continuous_scale=custom_colors,
    labels={'CANTIDAD': f'Incautacion de {droga_seleccionada}'},
    height=350
    
    
)
fig.update_geos(fitbounds="locations", visible=False)

fig.update_layout(
    # Fondo del área del gráfico
    paper_bgcolor='rgba(0,0,0,0)',
    plot_bgcolor='rgba(0,0,0,0)',
    margin={"r":0,"t":0,"l":0,"b":0}, 

)
#Histograma
fig_timeline = px.line(
    df_timeline,
    x='MES',
    y='CANTIDAD',
    color='DROGA',
    labels={'MES': 'Fecha', 'CANTIDAD': 'Cantidad (kg)'},
    
)

c1,c2 = st.columns([2,1])
with c1:
    st.markdown("### Incautacion de drogas en Colombia por departamento")
    st.plotly_chart(fig, use_container_width=True)
with c2:
    st.markdown("### Distribucion de incautacion de drogas en Colombia (kg)")
    st.plotly_chart(fig_pie, use_container_width=True)



st.subheader("Incautacion de drogas en Colombia en el tiempo")
st.plotly_chart(fig_timeline, use_container_width=True)

st.markdown(
    """
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    """, 
    unsafe_allow_html=True
)

st.markdown(
    """
    <div style="display: flex; justify-content: center; gap: 30px; background-color: #002424; padding: 20px; border-radius: 10px; width: 80%; margin: auto;">
        <a href="http://localhost:3000" target="_blank" style="text-decoration: none;">
            <div style="background-color: #089693; width: 50px; height: 50px; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                <i class="fa fa-camera" style="color: #002424; font-size: 24px;"></i>
            </div>
        </a>
        <a href="https://youtube.com" target="_blank" style="text-decoration: none;">
            <div style="background-color: #089693; width: 50px; height: 50px; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                <i class="fas fa-info" style="color: #002424; font-size: 24px;"></i>
            </div>
        </a>
    </div>
    """, 
    unsafe_allow_html=True
)
st.markdown(
    """
    <hr style="border-top: 1px solid #344e41;">
    <div style="background-color:#002424;text-align:center; color:gray;">
        <p>Desarrollado por Equipo 33 &copy; 2024</p>
        <p>Datos obtenidos de datos.gov.com </p>
    </div>
    """, 
    unsafe_allow_html=True
)