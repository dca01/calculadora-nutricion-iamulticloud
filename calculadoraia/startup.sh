#!/bin/bash
echo "Instalando dependencias manualmente..."
pip install -r requirements.txt
echo "Iniciando servidor Gunicorn..."
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
