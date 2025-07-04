# Hướng dẫn Cài đặt và Phát triển Dự án QLDAPM

Chào mừng đến với dự án! Tài liệu này hướng dẫn cách cài đặt môi trường và bắt đầu phát triển cho cả frontend và backend.

## Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt các công cụ sau:

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/products/docker-desktop/) và Docker Compose
- [Node.js](https://nodejs.org/) (v20+) và [pnpm](https://pnpm.io/installation) (`npm install -g pnpm`)
- [Python](https://www.python.org/downloads/) (v3.12+)
- **IDE:** [VS Code](https://code.visualstudio.com/) hoặc [Cursor](https://cursor.sh/)
- **VS Code Extensions:**
  - [Python (ms-python.python)](https://marketplace.visualstudio.com/items?itemName=ms-python.python)
  - [Dev Containers (ms-vscode-remote.remote-containers)](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) (Rất khuyến khích)

---

## Cài đặt ban đầu

Clone repository về máy của bạn:

```bash
git clone <your-repository-url>
cd QLDAPM
```

Mọi cấu hình cần thiết cho môi trường Docker đều đã được định nghĩa trong file `docker-compose.yml`.

---

## Luồng làm việc cho Lập trình viên Frontend

Môi trường phát triển cho frontend đã được container hóa hoàn toàn.

1.  **Khởi động môi trường:**
    Mở terminal tại thư mục gốc của dự án và chạy lệnh:

    ```bash
    docker-compose up --build
    ```

    Lệnh này sẽ khởi động frontend, backend và database. Frontend sẽ chạy tại `http://localhost:3000`.

2.  **Bắt đầu code:**
    Mở thư mục `web` trong VS Code. Mọi thay đổi bạn lưu sẽ được tự động cập nhật trên trình duyệt.

---

## Luồng làm việc cho Lập trình viên Backend

**Lựa chọn 1: Phát triển với Docker (Khuyến khích)** là tối ưu nhất.

### Lựa chọn 1: Phát triển với Docker (Khuyến khích)

1.  **Khởi động môi trường Docker:**
    Chạy lệnh sau ở thư mục gốc:

    ```bash
    docker-compose up --build
    ```

    Server backend sẽ khởi động và chờ debugger từ VS Code kết nối.

2.  **Kết nối (Attach) Debugger từ VS Code:**

    - Mở tab "Run and Debug" (`Ctrl+Shift+D`).
    - Chọn cấu hình **"Python: Attach to Docker"** và nhấn **F5**.

3.  **Bắt đầu code và debug:**
    - Bạn có thể đặt breakpoints trong code Python.
    - Code trong thư mục `server` được mount vào container, mọi thay đổi sẽ được tự động reload.

### Lựa chọn 2: Phát triển trên máy Local

1.  **Cài đặt và chạy PostgreSQL:**
    Bạn cần cài đặt PostgreSQL trên máy của mình và đảm bảo nó đang chạy với các thông tin đăng nhập sau (hoặc tự cấu hình lại code):

    - **Database:** `mydatabase`
    - **User:** `myuser`
    - **Password:** `mypassword`

2.  **Thiết lập môi trường ảo và cài đặt dependencies:**

    - Vào thư mục `server`, tạo và kích hoạt môi trường ảo (`venv`).
    - Chạy `pip install -r requirements.txt`.

3.  **Chạy và Debug với VS Code:**
    - Mở tab "Run and Debug", chọn cấu hình **"Python: FastAPI"** và nhấn **F5**.
    - **Quan trọng:** Để server local kết nối được DB local, bạn cần set biến môi trường `DATABASE_URL` trước khi chạy. Ví dụ trên Powershell:
      ```powershell
      $env:DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydatabase"
      ```

---

## Cấu trúc Dự án

```
/
├── server/
├── web/
├── .vscode/
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Ports và URLs quan trọng

| Service  | URL trên máy Host       | URL bên trong Docker (từ container khác) |
| :------- | :---------------------- | :--------------------------------------- |
| Frontend | `http://localhost:3000` | `http://web:3000`                        |
| Backend  | `http://localhost:8000` | `http://server:8000`                     |
| Database | `localhost:5432`        | `db:5432`                                |

## Cấu hình API Endpoint cho Frontend

URL của backend API được tự động cung cấp cho môi trường frontend thông qua biến môi trường `VITE_API_URL` được định nghĩa trong `docker-compose.yml`.

**Bạn không cần phải cấu hình gì thêm khi chạy dự án với Docker.**

Để sử dụng trong code React, bạn chỉ cần đọc biến môi trường của Vite như sau:

**Ví dụ trong `web/src/App.jsx`:**
`const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';`
