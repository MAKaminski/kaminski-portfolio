from fastapi import FastAPI
from typing import List

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Kaminski Portfolio API is live."}

# Add endpoints for projects, users, chatbot as needed
