from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import flights
from middlewares.case_converter import CaseConverterMiddleware

app = FastAPI()

app.add_middleware(CaseConverterMiddleware)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(flights.router, prefix="/flights", tags=["Chuyến bay"])
