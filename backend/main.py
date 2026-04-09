from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Food Waste Analyzer API")

# ✅ CORS FIX (IMPORTANT for frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Model
class FoodWasteRequest(BaseModel):
    items: List[str]
    wasted_items: List[str]


# Updated Response Model
class FoodWasteResponse(BaseModel):
    waste_percent: float
    category: str
    analysis: str
    suggestions: str
    score: str


@app.get("/")
def read_root():
    return {"message": "Food Waste Analyzer API is running"}


@app.post("/analyze", response_model=FoodWasteResponse)
def analyze_waste(data: FoodWasteRequest):
    total_items = len(data.items)
    wasted_items_count = len(data.wasted_items)

    # Avoid division by zero
    if total_items == 0:
        waste_percent = 0
    else:
        waste_percent = (wasted_items_count / total_items) * 100

    # Categorization
    if waste_percent < 20:
        category = "Low Waste"
    elif waste_percent <= 50:
        category = "Moderate Waste"
    else:
        category = "High Waste"

    # ✅ Added fields (frontend expects these)
    analysis = "Food waste detected. Some items are not being consumed efficiently."
    suggestions = "Plan meals, store food properly, and buy only required quantities."
    score = f"{max(1, 10 - int(waste_percent // 10))}/10"

    return {
        "waste_percent": round(waste_percent, 2),
        "category": category,
        "analysis": analysis,
        "suggestions": suggestions,
        "score": score
    }