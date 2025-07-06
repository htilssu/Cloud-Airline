import json
import re
from starlette.types import ASGIApp, Receive, Scope, Send


def to_snake_case(s: str) -> str:
    return re.sub(r"(?<!^)(?=[A-Z])", "_", s).lower()


def to_camel_case(s: str) -> str:
    parts = s.split("_")
    return parts[0] + "".join(word.capitalize() for word in parts[1:])


def convert_dict_keys(data, converter_func):
    if isinstance(data, dict):
        return {
            converter_func(k): convert_dict_keys(v, converter_func)
            for k, v in data.items()
        }
    elif isinstance(data, list):
        return [convert_dict_keys(i, converter_func) for i in data]
    return data


class CaseConverterMiddleware:
    def __init__(self, app: ASGIApp):
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        original_body = b""
        more_body = True

        # Đọc toàn bộ request body
        while more_body:
            message = await receive()
            body = message.get("body", b"")
            more_body = message.get("more_body", False)
            original_body += body

        # Convert body nếu là JSON
        headers = dict(scope.get("headers", []))
        content_type = headers.get(b"content-type", b"").decode()
        if "application/json" in content_type:
            try:
                parsed = json.loads(original_body)
                converted = convert_dict_keys(parsed, to_snake_case)
                new_body = json.dumps(converted).encode("utf-8")
            except Exception:
                new_body = original_body
        else:
            new_body = original_body

        # Tạo receive mới
        async def receive_wrapper():
            return {"type": "http.request", "body": new_body, "more_body": False}

        # Biến lưu tạm response để xử lý sửa body
        captured_body = b""
        response_start = {}

        async def send_wrapper(message):
            nonlocal captured_body, response_start

            if message["type"] == "http.response.start":
                # Lưu lại để chỉnh sau
                response_start = message.copy()

            elif message["type"] == "http.response.body":
                captured_body += message.get("body", b"")

                if not message.get("more_body", False):
                    # Chuyển body -> camelCase nếu là JSON
                    headers_dict = dict(response_start.get("headers", []))
                    content_type = headers_dict.get(b"content-type", b"").decode()

                    if "application/json" in content_type:
                        try:
                            parsed = json.loads(captured_body)
                            converted = convert_dict_keys(parsed, to_camel_case)
                            final_body = json.dumps(converted).encode("utf-8")
                        except Exception:
                            final_body = captured_body
                    else:
                        final_body = captured_body

                    # Gửi lại response mới mà không set content-length
                    headers = [
                        (k, v)
                        for k, v in response_start["headers"]
                        if k.lower() != b"content-length"
                    ]

                    await send(
                        {
                            "type": "http.response.start",
                            "status": response_start["status"],
                            "headers": headers,
                        }
                    )
                    await send(
                        {
                            "type": "http.response.body",
                            "body": final_body,
                            "more_body": False,
                        }
                    )

        await self.app(scope, receive_wrapper, send_wrapper)
