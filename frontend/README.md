# 🌐 Frontend (React)

The frontend of TMS is built with React, styled with Tailwind CSS, and communicates with the Django REST API. It runs independently on localhost:3000 during development and is configured to support CORS for seamless integration.

## 🧰 Tech Stack
- React 19
- Tailwind CSS
- Vite (for fast builds)
- Axios (for API requests)
- React Router

## 🚀 Running the Frontend Locally

### Navigate to the frontend directory:
```bash
cd frontend
```

### Install dependencies:
```bash
npm install
```

### Start the development server:
```bash
npm start
```
The app will be available at `http://localhost:3000` and automatically reload on changes.

### 🔗 API Integration
Make sure your backend (`localhost:8000`) is running. The frontend will connect to it via Axios using environment variables defined in .env.

You can configure the API base URL by editing the `.env` file in the frontend folder. An example of an `.env` file is `.env.example`
