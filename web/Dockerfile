# Stage 1: Cài đặt dependencies với pnpm
FROM node:20-alpine AS deps
WORKDIR /app
# Cài đặt pnpm
RUN npm install -g pnpm
# Copy file manifest và lockfile
COPY package.json pnpm-lock.yaml* ./
# Chạy pnpm install
RUN pnpm install

# Stage 2: Môi trường development
FROM node:20-alpine
WORKDIR /app
# Cài đặt pnpm
RUN npm install -g pnpm
# Copy dependencies đã cài ở stage 1
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Expose port của Vite dev server
EXPOSE 5173

# Chạy dev server bằng pnpm và cho phép truy cập từ bên ngoài container
CMD ["pnpm", "run", "dev", "--", "--host"]
