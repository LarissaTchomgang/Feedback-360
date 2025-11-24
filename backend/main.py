from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from feedbacks import router as feedback_router

app = FastAPI(title="Feedback API")

# Autoriser le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # mets ici l’URL Vercel plus tard
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(feedback_router)

@app.get("/")
def home():
    return {"message": "API Feedback en ligne 🚀"}
