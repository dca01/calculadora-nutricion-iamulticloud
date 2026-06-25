from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from agent import analyze_food_image_with_vertex_async

app = FastAPI(title="NutriVision AI API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze-food")
async def analyze_food(image: UploadFile = File(...)):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="El archivo subido no es una imagen válida.")

    try:
        image_bytes = await image.read()
        result = analyze_food_image_with_vertex(image_bytes, mime_type=image.content_type)

        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import os
if os.path.exists("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")
