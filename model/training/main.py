import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from joblib import dump, load


file_path = os.path.join('..', 'data', 'INCAUTACION_DE_DROGAS_20241110.csv')

df = pd.read_csv(file_path, low_memory=False)

df=df.drop(columns=['COD_MUNI','MUNICIPIO'])

df['AVG_CANTIDAD_DROGA_DEPTO_MES'] = df.groupby(['DROGA','DEPARTAMENTO','MES'])['CANTIDAD'].transform('mean')

X = df.drop(columns=['DEPARTAMENTO', 'UNIDAD','DROGA','AÑO','AVG_CANTIDAD_DROGA_DEPTO_MES','FECHA HECHO'])
y = df['AVG_CANTIDAD_DROGA_DEPTO_MES']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
error = mean_squared_error(y_test, y_pred, squared=False)
score = model.score(X_train,y_train)

print(f"error = {error} & score = {score}")
print(X_train)

dump(model, 'linear_regression_model.joblib')
