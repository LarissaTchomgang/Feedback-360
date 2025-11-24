import json
import os
from typing import List
from models import Feedback

DATA_PATH = "data/feedbacks.json"

# S'assurer que le dossier existe
os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)

def load_feedbacks() -> List[dict]:
    if not os.path.exists(DATA_PATH):
        return []
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def save_feedbacks(data: List[dict]):
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
