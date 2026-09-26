# Walkthrough - Collectibles Vault Setup & RunPod Configuration

We have successfully updated the Collectibles Vault application codebase to address database connection issues and frontend-to-backend routing problems when running on RunPod.

## Changes Made

### 1. Database Configuration
* **File:** [database.py](file://[local path redacted])
* **Change:** Configured the database connection string to dynamically fall back to a local SQLite database (`sqlite:///./collectibles.db`) if no PostgreSQL environment variable is present (`DATABASE_URL`).
* **Why:** This allows the backend to start up instantly outside of a Docker network (e.g. running directly on the RunPod GPU host with `python3 main.py`).

### 2. Frontend Proxy Configuration
* **File:** [vite.config.js](file://[local path redacted])
* **Change:** Made the proxy target dynamic. It now reads `process.env.VITE_API_TARGET` or defaults to `http://127.0.0.1:8000`.
* **Why:** The previous hardcoded value `http://backend:8000` was only resolvable inside a Docker Compose network. Running the Vite dev server directly on the host now correctly proxies API calls to `127.0.0.1:8000`.

### 3. Setup Verification Script
* **File:** [verify_setup.py](file://[local path redacted])
* **Change:** Added a script to check that python packages (`torch`, `transformers`, `fastapi`), SQLite database connection, and CUDA/GPU are all functional.

---

## How to Run on Your RunPod Instance

### Option A: Running Directly on the Host (Recommended for development/debugging)

1. **Verify the environment:**
   Run the verification script:
   ```bash
   python3 backend/verify_setup.py
   ```
   *Since RunPod PyTorch templates come with PyTorch, CUDA, and transformers pre-installed, this should succeed out of the box.*

2. **Start the Backend:**
   If dependencies are missing globally, install them via requirements:
   ```bash
   pip install -r backend/requirements.txt
   ```
   Then start the FastAPI app:
   ```bash
   python3 backend/main.py
   ```

3. **Start the Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev -- --host 0.0.0.0 --port 3000
   ```

### Option B: Running via Docker Compose (Recommended for production/deployment)

1. Run the start script:
   ```bash
   ./scripts/start.sh
   ```
   *This starts the database, backend, and frontend containers automatically.*
