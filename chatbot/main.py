from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Prompt(BaseModel):
    prompt: str

api_key_name = 'AIzaSyDz_HedmcsJBckOiaBfbzaiTmfPRg_VJ2g' # @param {type: "string"}

@app.post("/ia_response")
def ia_response(input: Prompt):

    system_instructions = "Actúa como un experto en drogas y adicciones en Colombia. Tu conocimiento abarca en profundidad las sustancias como la cocaína, la marihuana y la heroína, incluyendo su producción, tráfico, consumo, y las políticas públicas que las regulan en el contexto colombiano. Ofrece información específica sobre los efectos físicos y psicológicos de estas sustancias, los factores sociales y económicos que impulsan su consumo, y los programas de prevención y tratamiento disponibles en el país. También aborda cómo el entorno legal y cultural de Colombia influye en las dinámicas del uso y la lucha contra las adicciones. Responde de manera clara, objetiva y empática. Ten en cuenta que debes limitar la respuesta a 200 caracteres."# @param {type: "string"}
    model = 'gemini-1.5-flash' # @param {type: "string"} ["gemini-1.0-pro", "gemini-1.5-pro", "gemini-1.5-flash"]
    temperature = 0 # @param {type: "slider", min: 0, max: 2, step: 0.05}
    stop_sequence = 'gracias' # @param {type: "string"}

    if system_instructions == '':
        system_instructions = None

    genai.configure(api_key=api_key_name)
    model = genai.GenerativeModel(model, system_instruction=system_instructions)
    config = genai.GenerationConfig(temperature=temperature, stop_sequences=[stop_sequence])
    response = model.generate_content(contents=[input.prompt], generation_config=config)
    return{"response":response.text}

#print(ia_response("Sabes cómo funciona la marihuana en el cerebro?"))