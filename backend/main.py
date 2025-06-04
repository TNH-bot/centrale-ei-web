from fastapi import FastAPI
from recommendation.router import router as reco_router

app = FastAPI()
app.include_router(reco_router)

@app.get("/")
def root():
    return {"message": "Hello Hiba"}
