from pydantic import BaseModel


class Error(BaseModel):
    detail: str


class HTTPError(BaseModel):
    status_code: int
    detail: Error
