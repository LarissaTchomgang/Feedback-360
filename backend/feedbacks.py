from fastapi import APIRouter, HTTPException
from models import Feedback
from storage import load_feedbacks, save_feedbacks
from datetime import datetime
import uuid

router = APIRouter(prefix="/feedbacks", tags=["feedbacks"])

@router.get("/")
def get_all_feedbacks():
    """Retourne tous les feedbacks"""
    return load_feedbacks()

@router.post("/")
def add_feedback(fb: Feedback):
    data = load_feedbacks()

    if fb.email and any(item["email"] == fb.email for item in data):
        raise HTTPException(status_code=400, detail="Cet email a déjà soumis un feedback.")

    fb.id = str(uuid.uuid4())
    fb.createdAt = datetime.now()

    # ✅ On convertit le datetime en texte ISO (lisible et compatible JSON)
    new_feedback = fb.dict()
    new_feedback["createdAt"] = fb.createdAt.isoformat()

    data.append(new_feedback)
    save_feedbacks(data)

    return new_feedback


@router.delete("/{feedback_id}")
def delete_feedback(feedback_id: str):
    data = load_feedbacks()
    new_data = [f for f in data if f["id"] != feedback_id]
    if len(new_data) == len(data):
        raise HTTPException(status_code=404, detail="Feedback non trouvé.")
    save_feedbacks(new_data)
    return {"message": "Feedback supprimé."}
