import json
import re
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response, JSONResponse
from starlette.types import ASGIApp


def to_snake_case(s: str) -> str:
    """Converts a camelCase string to snake_case."""
    return re.sub(r"(?<!^)(?=[A-Z])", "_", s).lower()


def to_camel_case(s: str) -> str:
    """Converts a snake_case string to camelCase."""
    parts = s.split("_")
    return parts[0] + "".join(p.capitalize() for p in parts[1:])


def convert_dict_keys(d, converter_func):
    """Recursively converts dictionary keys using the provided converter function."""
    if isinstance(d, list):
        return [convert_dict_keys(i, converter_func) for i in d]
    if not isinstance(d, dict):
        return d
    return {
        converter_func(k): convert_dict_keys(v, converter_func) for k, v in d.items()
    }


class CaseConverterMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        # Convert request body from camelCase to snake_case
        if "application/json" in request.headers.get("content-type", ""):
            try:
                body = await request.body()
                if body:
                    json_body = json.loads(body)
                    converted_body = convert_dict_keys(json_body, to_snake_case)

                    # Create a new request with the modified body
                    async def receive():
                        return {
                            "type": "http.request",
                            "body": json.dumps(converted_body).encode("utf-8"),
                        }

                    request = Request(request.scope, receive)
            except json.JSONDecodeError:
                # Handle cases where body is not valid JSON
                pass

        response = await call_next(request)

        # Convert response body from snake_case to camelCase
        if "application/json" in response.headers.get("content-type", ""):
            response_body = b""
            async for chunk in response.body_iterator:
                response_body += chunk

            try:
                if response_body:
                    json_body = json.loads(response_body)
                    converted_body = convert_dict_keys(json_body, to_camel_case)
                    return JSONResponse(
                        content=converted_body, status_code=response.status_code
                    )
            except json.JSONDecodeError:
                # If response is not valid JSON, return it as is
                return Response(
                    content=response_body,
                    status_code=response.status_code,
                    headers=dict(response.headers),
                    media_type=response.media_type,
                )

        return response
