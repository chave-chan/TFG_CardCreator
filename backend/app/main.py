from fastapi import FastAPI

# Crear una instancia de la aplicación FastAPI
app = FastAPI()

# Definir una ruta de ejemplo
@app.get("/")
async def root():
    return {"message": "Hello, World!"}

# Definir otra ruta de ejemplo con parámetros
@app.post("/cards/")
async def create_cards(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
