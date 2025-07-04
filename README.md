# Hướng dẫn Cài đặt và Phát triển Dự án QLDAPM

Chào mừng đến với dự án! Tài liệu này hướng dẫn cách cài đặt môi trường và bắt đầu phát triển cho cả frontend và backend.

## Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt các công cụ sau:

-   [Git](https://git-scm.com/)
-   [Docker](https://www.docker.com/products/docker-desktop/) và Docker Compose
-   [Node.js](https://nodejs.org/) (v20+) và [pnpm](https://pnpm.io/installation) (`npm install -g pnpm`)
-   [Python](https://www.python.org/downloads/) (v3.12+)
-   **IDE:** [VS Code](https://code.visualstudio.com/) hoặc [Cursor](https://cursor.sh/)
-   **VS Code Extensions:**
    -   [Python (ms-python.python)](https://marketplace.visualstudio.com/items?itemName=ms-python.python)
    -   [Dev Containers (ms-vscode-remote.remote-containers)](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) (Rất khuyến khích)

---

## Cài đặt ban đầu

Clone repository về máy của bạn:

```bash
git clone <your-repository-url>
cd QLDAPM
```

---

## Luồng làm việc cho Lập trình viên Frontend

Môi trường phát tri���n cho frontend đã được container hóa hoàn toàn để đảm bảo tính nhất quán.

1.  **Khởi động môi trường:**
    Mở terminal tại thư mục gốc của dự án và chạy lệnh:

    ```bash
    docker-compose up --build
    ```

    Lệnh này sẽ:
    -   Build image cho cả frontend và backend.
    -   Khởi động cả hai services.
    -   Frontend sẽ chạy tại `http://localhost:5173`.

2.  **Bắt đầu code:**
    Mở thư mục `web` trong VS Code. Mọi thay đổi bạn lưu sẽ được tự động cập nhật trên trình duyệt (Hot Module Replacement).

> **Lưu ý quan trọng:** Khi gọi API từ frontend, bạn phải sử dụng URL của service backend trong mạng Docker là `http://server:8000`, không phải `localhost`. Hãy cấu hình biến môi trường cho việc này. (Xem chi tiết ở mục **Cấu hình API Endpoint**).

---

## Luồng làm việc cho Lập trình viên Backend

Bạn có hai lựa chọn để phát triển backend. **Lựa chọn 1 (dùng Docker) được khuyến khích** vì nó mô phỏng môi trường production một cách chính xác nhất.

### Lựa chọn 1: Phát triển với Docker (Khuyến khích)

Cách này cho phép bạn chỉnh sửa code trên máy local nhưng thực thi và debug code đang chạy bên trong container.

1.  **Khởi động môi trường Docker:**
    Chạy lệnh sau ở thư mục gốc:
    ```bash
    docker-compose up --build
    ```
    Bạn sẽ thấy log của server backend hiển thị dòng `waiting for client to attach...`. Điều này là bình thường, server đang chờ debugger từ VS Code kết nối.

2.  **Kết nối (Attach) Debugger từ VS Code:**
    -   Mở tab "Run and Debug" trong VS Code (phím tắt: `Ctrl+Shift+D`).
    -   Từ menu dropdown, chọn cấu hình **"Python: Attach to Docker"**.
    -   Nhấn **F5** (Start Debugging).

3.  **Bắt đầu code và debug:**
    -   VS Code sẽ kết nối vào container. Giờ bạn có thể đặt breakpoints, theo dõi biến,... trực tiếp trong VS Code.
    -   Code của bạn trong thư mục `server` được mount vào container, vì vậy mọi thay đổi sẽ được `uvicorn` tự động reload.

### Lựa chọn 2: Phát triển trên máy Local

Cách này sử dụng môi trường ảo Python trên máy của bạn.

1.  **Thiết lập môi trường ảo (Virtual Environment):**
    -   Mở terminal trong thư mục `server`.
    -   Tạo môi trường ảo:
        ```bash
        python -m venv venv
        ```
    -   Kích hoạt môi trường ảo:
        -   Trên Windows: `.\venv\Scripts\activate`
        -   Trên macOS/Linux: `source venv/bin/activate`

2.  **Cài đặt Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Chạy và Debug với VS Code:**
    -   Mở tab "Run and Debug" (`Ctrl+Shift+D`).
    -   Từ menu dropdown, chọn cấu hình **"Python: FastAPI"**.
    -   Nhấn **F5** để khởi động server. Server sẽ chạy tại `http://localhost:8000`.

---

## Cấu trúc Dự án

```
/
├── server/         # Source code Backend (FastAPI)
│   ├── main.py
│   └── ...
├── web/            # Source code Frontend (React + Vite)
│   ├── src/
│   └── ...
├── .vscode/
│   └── launch.json # Cấu hình debug cho VS Code
├── docker-compose.yml
└── README.md
```

## Ports và URLs quan trọng

| Service  | URL trên máy Host      | URL bên trong Docker (từ container khác) |
| :------- | :--------------------- | :-------------------------------------- |
| Frontend | `http://localhost:5173`| `http://web:5173`                       |
| Backend  | `http://localhost:8000`| `http://server:8000`                    |

## Cấu hình API Endpoint cho Frontend

URL của backend API được tự động cung cấp cho môi trường frontend thông qua biến môi trường `VITE_API_URL` được định nghĩa trong `docker-compose.yml`.

**Bạn không cần phải cấu hình gì thêm khi chạy dự án với Docker.**

Để sử dụng trong code React, bạn chỉ cần đọc biến môi trường của Vite như sau:

**Ví dụ trong `web/src/App.jsx`:**
```javascript
// URL này sẽ là 'http://server:8000' khi chạy trong Docker,
// hoặc 'http://localhost:8000' khi chạy local (nếu không có VITE_API_URL).
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Ví dụ gọi API
fetch(`${API_BASE_URL}/api/items`)
  .then(res => res.json())
  .then(data => console.log(data));
```

> **Dành cho phát triển local (không dùng Docker):** Nếu bạn chạy cả frontend và backend trên máy local, biến `import.meta.env.VITE_API_URL` sẽ không tồn tại. Code sẽ tự động dùng giá trị dự phòng là `'http://localhost:8000'`, vốn là địa chỉ chính xác cho kịch bản này.

