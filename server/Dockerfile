# Sử dụng base image Python 3.12 slim
FROM python:3.12-slim

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy file requirements và cài đặt dependencies
RUN pip install debugpy
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy entrypoint scripts
COPY .docker/entrypoint.sh /usr/local/bin/
COPY .docker/entrypoint-dev.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint-dev.sh

# Copy toàn bộ source code của server vào container
COPY . .

# Expose port 8000 mà uvicorn sẽ chạy
EXPOSE 8000

# Lệnh để chạy app, cho phép truy cập từ bên ngoài container
# --host 0.0.0.0 là bắt buộc để có thể truy cập từ máy host
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
