from fastapi import FastAPI, Response, status, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from collections import deque
import threading

app = FastAPI()

# 1) Wire up CORS first
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# 2) Explicit OPTIONS handler for /submit
@app.options("/submit")
async def _preflight_submit(request: Request) -> Response:
    """
    CORS preflight response for the /submit endpoint.
    """
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# 3) In‑memory store setup
MAX_RECORDS = 100
lock = threading.Lock()
records = deque()
_product_sum = 0
_service_sum = 0

class Submission(BaseModel):
    name: str
    email: EmailStr
    productRating: int
    serviceRating: int
    recommendLikelihood: str

# 4) POST /submit (no content)
@app.post("/submit", status_code=status.HTTP_204_NO_CONTENT)
def submit(payload: Submission):
    global _product_sum, _service_sum
    with lock:
        if len(records) >= MAX_RECORDS:
            old = records.popleft()
            _product_sum -= old.productRating
            _service_sum  -= old.serviceRating

        records.append(payload)
        _product_sum += payload.productRating
        _service_sum  += payload.serviceRating

    return Response(status_code=status.HTTP_204_NO_CONTENT)

# 5) GET /stats
@app.get("/stats")
def stats():
    with lock:
        count = len(records)
        avg_product = (_product_sum / count) if count else 0.0
        avg_service = (_service_sum / count) if count else 0.0

    return {
        "recordsCount": count,
        "averageProductRating": round(avg_product, 2),
        "averageServiceRating": round(avg_service, 2),
    }
