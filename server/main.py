from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import flights, auth, ticket_options, airports, bookings
from middlewares.case_converter import CaseConverterMiddleware
from background_tasks import start_background_tasks

app = FastAPI()


# Start background tasks
@app.on_event("startup")
async def startup_event():
    start_background_tasks()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://laughing-space-pancake-v5jqvrwp65phppxj-3000.app.github.dev",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
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
app.include_router(bookings.router, prefix="/bookings", tags=["Đặt vé"])
