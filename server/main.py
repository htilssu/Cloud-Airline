from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import flights, auth, ticket_options, airports
from middlewares.case_converter import CaseConverterMiddleware

app = FastAPI()


# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(CaseConverterMiddleware)


@app.get("/health")
async def health_check():
    """Health check endpoint để kiểm tra server có đang hoạt động không"""
    return {"status": "healthy", "message": "Server đang hoạt động bình thường"}


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "QLDAPM API Server", "status": "running"}


app.include_router(auth.router)
app.include_router(airports.router, prefix="/airports", tags=["Sân bay"])
app.include_router(flights.router, prefix="/flights", tags=["Chuyến bay"])
app.include_router(ticket_options.router, prefix="/ticket-options", tags=["Vé máy bay"])
