from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import flights, auth
from middlewares.case_converter import CaseConverterMiddleware

app = FastAPI()


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
app.add_middleware(CaseConverterMiddleware)


app.include_router(auth.router)
app.include_router(flights.router, prefix="/flights", tags=["Chuyến bay"])
