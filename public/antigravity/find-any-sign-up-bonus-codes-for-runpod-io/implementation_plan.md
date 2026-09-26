# Implementation Plan - Collectibles Vault RunPod Integration

This plan addresses connection issues, database setup, and AI/API integrations for the Collectibles Vault application running on a RunPod GPU instance.

## User Review Required

> [!IMPORTANT]
> The primary cause of connection issues on RunPod when running outside Docker is that the Vite frontend is configured to proxy requests to `http://backend:8000`. This host is only resolvable within a Docker Compose network. When running directly on the host, this must be updated to `http://127.0.0.1:8000`.
> We will update the configurations to dynamically support both local (direct host) and Docker Compose setups.

## Proposed Changes

---

### Database Configuration

#### [MODIFY] [database.py](file://[local path redacted])
* Modify the default `DATABASE_URL` to fallback to SQLite (`sqlite:///./collectibles.db`) if no PostgreSQL connection environment variable is present.
* Configure `create_engine` with `connect_args={"check_same_thread": False}` when SQLite is active to prevent multi-threading errors.

---

### Frontend Proxy Configuration

#### [MODIFY] [vite.config.js](file://[local path redacted])
* Change proxy target to use `http://127.0.0.1:8000` or allow customization via an environment variable (`VITE_API_TARGET` or default to `http://127.0.0.1:8000` when running locally).
* In Docker Compose, we can pass `VITE_API_TARGET=http://backend:8000` or fallback dynamically.

---

### Verification and Setup Script

#### [MODIFY] [setup_server.sh](file://[local path redacted])
* Ensure Python dependencies (`bitsandbytes`, `accelerate`, `transformers`, `torch`) are installed correctly.
* Verify if the LLaVA model can load on GPU correctly.

## Verification Plan

### Automated Tests
- Run backend verification scripts to test LLaVA loading and inference on GPU.
- Verify connection from frontend to backend.

### Manual Verification
- Launch both backend and frontend.
- Verify database migrations.
- Verify image upload and analysis functionality.
