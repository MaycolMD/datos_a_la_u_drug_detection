import pickle
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import numpy as np
import joblib
from datetime import datetime
from pydantic import BaseModel


app = FastAPI()

# Permite solicitudes CORS desde todos los dominios
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open('dicts\dict_depto.pkl', 'rb') as f:
    dict_depto = pickle.load(f)

with open('dicts\dict_suma_cantidad_depto_mes.pkl', 'rb') as f:
    dict_suma = pickle.load(f)

with open('training\linear_regression_model.joblib', 'rb') as f:
    model = joblib.load(f)

class Data(BaseModel):
    depto: str
    droga: str 
    cantidad: float

@app.post("/data_prediction")
def data_prediction(input_array: Data):
    #input_array = [depto, droga, cantidad]

    today = datetime.now()
    month = today.month

    cod_depto = dict_depto.get(input_array.depto, 0)

    if (input_array.droga =="COCINA"):
        cod_droga=1
    elif(input_array.droga =="MARIHUANA"):
        cod_droga=2
    else:
        cod_droga=3

    mes_1=month+1
    mes_2=month+2

    if (month==11):
        mes_2=1
    elif (month==12):
        mes_1=1
        mes_2=2

    suma_mes_actual = dict_suma.get((cod_depto, month), 0)
    suma_mes_n_1 = dict_suma.get((cod_depto, mes_1), 0)
    suma_mes_n_2 = dict_suma.get((cod_depto, mes_2), 0)

    prediccion = np.abs(model.predict([
        [cod_depto, input_array.cantidad, cod_droga, month, suma_mes_actual],
        [cod_depto, input_array.cantidad, cod_droga, mes_1, suma_mes_n_1],
        [cod_depto, input_array.cantidad, cod_droga, mes_2, suma_mes_n_2]
    ]))

    return {"prediction": prediccion.tolist()}

#print(data_prediction(['QUINDIO','COCAINA',0.70]))