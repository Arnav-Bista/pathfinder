from fastapi import FastAPI, HTTPException, Response, Request, status
from slowapi.errors import RateLimitExceeded
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from dotenv import load_dotenv
import requests
import os

load_dotenv()

GOOGLE_CLOUD_API_KEY = os.getenv("GOOGLE_CLOUD_API_KEY")

if GOOGLE_CLOUD_API_KEY is None:
    print("Could not find GOOGLE_CLOUD_API_KEY from .env")
    exit(1)

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@app.get("/geocode")
async def geocode_address(address: str | None):
    if address is None:
        raise HTTPException(status_code=400, detail="address not specified")

    if len(address) >= 50:
        raise HTTPException(
            status_code=400, detail="address must be less than 50 characters")

    results = requests.get(
        "https://maps.googleapis.com/maps/api/geocode/json", params={"address": address, "key": GOOGLE_CLOUD_API_KEY})

    if not results.ok:
        raise HTTPException(status_code=results.status_code,
                            detail="Geocoding failed")

    results = results.json()

    if len(results["results"]) == 0:
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    results = results["results"][0]

    return {
        "name": results["formatted_address"],
        "location": results["geometry"]["location"],
        "viewport": results["geometry"]["viewport"]
    }
