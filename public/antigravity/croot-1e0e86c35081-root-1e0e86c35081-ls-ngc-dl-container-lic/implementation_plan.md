# Host Odysseus AI and Deploy Collectibles Vault on RunPod

This plan outlines the steps to spin up an NVIDIA GPU instance on RunPod, deploy Odysseus AI natively, and host the Collectibles Vault app on the same instance, making both accessible via HTTP proxies.

## Proposed Changes

We will create a python provisioning script to deploy a GPU pod on RunPod using the user's API Key. The pod will expose ports:
- `7000` (Odysseus AI)
- `3000` (Collectibles Vault Frontend)
- `8000` (Collectibles Vault Backend)
- `22` (SSH)

Once the pod is provisioned:
1. We will use SSH/SCP/rsync to copy:
   - `[local path redacted]/` to `/workspace/odysseus/` on the pod
   - `[local path redacted]/` to `/workspace/collectibles-vault/` on the pod
2. We will SSH into the pod to:
   - Set up and run Odysseus AI natively on port `7000`.
   - Set up and run the Collectibles Vault backend on port `8000` and frontend on port `3000`.
   - Configure the frontend proxy so API calls resolve correctly.

### Scripts

#### [NEW] [deploy_runpod.py](file://[local path redacted])
A Python script to call the RunPod GraphQL API, launch an NVIDIA L4 GPU instance, configure the ports, and retrieve the public IP/port configuration for SSH/HTTP access.

#### [NEW] [setup_pod.sh](file://[local path redacted])
A script to run on the pod that automates the installation of Node.js, Python packages, builds the frontend/backend, and starts the services.

## Verification Plan

### Manual Verification
- Access Odysseus AI via `http://<RUNPOD_IP>:<PROXY_PORT_7000>`
- Access Collectibles Vault Frontend via `http://<RUNPOD_IP>:<PROXY_PORT_3000>`
- Verify that image uploads trigger LLaVA inference and auto-identify collectibles on the GPU.
