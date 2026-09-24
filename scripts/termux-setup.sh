#!/usr/bin/env bash
# Termux llama.cpp setup for Unihertz Tank 3 Pro (Dimensity 8200, 16GB RAM)
# Run INSIDE Termux:  bash termux-setup.sh
set -euo pipefail
export PREFIX="$PREFIX"

MODEL_URL="https://huggingface.co/bartowski/Qwen_Qwen3-4B-GGUF/resolve/main/Qwen_Qwen3-4B-Q4_K_M.gguf"
MODEL_FILE="Qwen_Qwen3-4B-Q4_K_M.gguf"
PORT="${LLAMAPORT:-8080}"

echo ">> 0/5 repoint apt to a fast mirror (Cloudflare CDN) + repair half-finished upgrade"
mkdir -p "$PREFIX/etc/apt/sources.list.d"
printf 'deb https://packages-cf.termux.dev/apt/termux-main stable main\n' > "$PREFIX/etc/apt/sources.list"
dpkg --configure -a
apt-get -f install -y || true

echo ">> 1/5 refreshing packages (no full upgrade — not needed)"
pkg update -y

echo ">> 2/5 installing build deps (clang = the Termux C/C++ compiler)"
pkg install -y git cmake ninja clang

echo ">> 3/5 building llama-server (CPU only — ~10-20 min)"
if [ ! -d "$HOME/llama.cpp" ]; then
  git clone https://github.com/ggml-org/llama.cpp "$HOME/llama.cpp"
fi
cd "$HOME/llama.cpp"
git pull --ff-only || true
cmake -B build -DGGML_NATIVE=OFF -DGGML_OPENMP=OFF -DCMAKE_BUILD_TYPE=Release
cmake --build build -j6 --target llama-server

echo ">> downloading model (2.5GB over WiFi — can take a while)"
if [ ! -f "$HOME/$MODEL_FILE" ]; then
  curl -L --retry 3 --retry-delay 5 -o "$HOME/$MODEL_FILE" "$MODEL_URL"
fi

echo ">> 4/5 starting llama-server on 0.0.0.0:$PORT"
echo "   keep this session open; stop later with Ctrl-C"
echo "   smoke test from laptop: node /tmp/opencode/smoke.mjs http://10.84.161.108:$PORT"
exec "$HOME/llama.cpp/build/bin/llama-server" \
  -m "$HOME/$MODEL_FILE" \
  --host 0.0.0.0 \
  --port "$PORT" \
  -c 16384 \
  -t 6 \
  --alias qwen3-4b