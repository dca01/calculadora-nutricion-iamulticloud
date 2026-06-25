import json
import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
load_dotenv()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("Falta configurar la variable de entorno GEMINI_API_KEY")

client = genai.Client(api_key=GEMINI_API_KEY)

SYSTEM_INSTRUCTION = ""

def analyze_food_image_with_vertex(image_bytes: bytes, mime_type: str = "image/jpeg") -> dict:
    ""
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[
                SYSTEM_INSTRUCTION,
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2,
            )
        )
        return json.loads(response.text.strip())
    except json.JSONDecodeError:
        return {"error": "El modelo no devolvió un JSON válido."}
    except Exception as e:
        return {"error": str(e)}

async def analyze_food_image_with_vertex_async(image_bytes: bytes, mime_type: str = "image/jpeg") -> dict:
    ""
    try:
        response = await client.aio.models.generate_content(
            model='gemini-2.5-flash',
            contents=[
                SYSTEM_INSTRUCTION,
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2,
            )
        )
        return json.loads(response.text.strip())
    except json.JSONDecodeError:
        return {"error": "El modelo no devolvió un JSON válido."}
    except Exception as e:
        return {"error": str(e)}
