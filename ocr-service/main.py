import io
import os
import re
from datetime import datetime

import cv2
import fitz
import numpy as np
from fastapi import FastAPI, File, Header, HTTPException, UploadFile
from paddleocr import PaddleOCR

app = FastAPI(title="Wedding ticket OCR")
ocr = PaddleOCR(use_angle_cls=True, lang="en", show_log=False)
MAX_BYTES = 4 * 1024 * 1024


def text_from_image(image: np.ndarray) -> list[str]:
    result = ocr.ocr(image, cls=True)
    return [line[1][0] for page in result or [] for line in page or []]


def pages_from_ticket(raw: bytes, content_type: str) -> list[np.ndarray]:
    if content_type == "application/pdf":
        document = fitz.open(stream=raw, filetype="pdf")
        pages = []
        for page in list(document)[:3]:
            pixmap = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
            image = np.frombuffer(pixmap.samples, dtype=np.uint8).reshape(pixmap.height, pixmap.width, 3)
            pages.append(cv2.cvtColor(image, cv2.COLOR_RGB2BGR))
        return pages
    image = cv2.imdecode(np.frombuffer(raw, dtype=np.uint8), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError("The uploaded image could not be read.")
    return [image]


def pick_arrival_date(text: str) -> str | None:
    patterns = [
        (r"\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b", "%Y-%m-%d"),
        (r"\b(\d{1,2})[-/.](\d{1,2})[-/.](20\d{2}|\d{2})\b", None),
        (r"\b(\d{1,2})\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s*,?\s*(20\d{2})\b", "%d %b %Y"),
    ]
    for pattern, fmt in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if not match:
            continue
        try:
            if fmt:
                return datetime.strptime(match.group(0).replace("/", "-").replace(".", "-"), fmt).date().isoformat()
            day, month, year = match.groups()
            return datetime(int("20" + year if len(year) == 2 else year), int(month), int(day)).date().isoformat()
        except ValueError:
            continue
    return None


def pick_arrival_time(text: str) -> str | None:
    arrival_context = re.search(r"(?:arrival|arrives?|landing|arrival time).{0,70}", text, re.IGNORECASE)
    source = arrival_context.group(0) if arrival_context else text
    match = re.search(r"\b(0?[1-9]|1[0-2]|[01]\d|2[0-3])[:.]([0-5]\d)\s*(AM|PM)?\b", source, re.IGNORECASE)
    if not match:
        return None
    hour, minute, meridiem = match.groups()
    hour = int(hour)
    if meridiem:
        if meridiem.upper() == "PM" and hour != 12:
            hour += 12
        if meridiem.upper() == "AM" and hour == 12:
            hour = 0
    return f"{hour:02d}:{minute}"


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/extract")
async def extract(ticket: UploadFile = File(...), x_ocr_token: str | None = Header(default=None)):
    configured_token = os.getenv("OCR_SERVICE_TOKEN")
    if configured_token and x_ocr_token != configured_token:
        raise HTTPException(status_code=401, detail="Unauthorized")
    allowed = {"application/pdf", "image/jpeg", "image/png", "image/webp"}
    if ticket.content_type not in allowed:
        raise HTTPException(status_code=415, detail="Unsupported ticket type")
    raw = await ticket.read()
    if not raw or len(raw) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="Ticket must be 4 MB or smaller")
    try:
        lines = [line for page in pages_from_ticket(raw, ticket.content_type) for line in text_from_image(page)]
    except Exception as error:
        raise HTTPException(status_code=422, detail="Ticket could not be read") from error
    text = "\n".join(lines)
    return {"text": text, "arrivalDate": pick_arrival_date(text), "arrivalTime": pick_arrival_time(text)}
