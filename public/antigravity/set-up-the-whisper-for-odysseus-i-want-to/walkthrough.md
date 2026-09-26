# Walkthrough: Installed Odysseus Dependencies & Main Drive Cleanup

We have successfully resolved all dependency installation issues, verified GGUF and image capabilities, set up Speech-to-Text and Text-to-Speech, and cleaned up temporary caches on the main drive.

## Summary of Accomplishments

1. **Configured Speech-to-Text (STT) & Text-to-Speech (TTS)**:
   - **Local Whisper (STT)**: Enabled local Speech-to-Text using the pre-installed `faster-whisper` backend. It automatically runs on CPU using highly-optimized `int8` quantization, providing fast and private local transcription.
   - **Browser Speech (TTS)**: Configured Text-to-Speech to use the browser client (`browser` provider). This allows Odysseus to read chat responses aloud using your browser's native Web Speech API (completely free and local), bypassing the local Kokoro engine's requirement for a CUDA GPU.
   - Both settings are now active in `[local path redacted]`.

2. **Installed LLM GGUF Serving Backend (`llama-cpp-python`)**:
   - Compiled and installed `llama-cpp-python` in the 500GB virtual environment (`[local path redacted]`).
   - Verified that the library imports successfully.

3. **Patched BasicSR Version Resolution for Python 3.13**:
   - `basicsr` (required by `realesrgan`) uses a dynamic `setup.py` version parsing script (`locals()['__version__']`) that fails under setuptools build environments in Python 3.13.
   - We fetched the `basicsr-1.4.2` source tarball, patched `setup.py` to parse the version directly from the local `VERSION` file, and built/installed the package with `--no-build-isolation` to reuse the existing `numpy` and `torch` dependencies.

4. **Installed Remaining Image & Editor Libraries**:
   - Installed `diffusers[torch]` (diffusion engine), `python-multipart`, `transformers`, `accelerate`, and `pillow` (Segment Anything / SAM mask dependencies).
   - Installed `rembg` (background remover) and `realesrgan` (upscaling tool) along with their related sub-dependencies (`gfpgan`, `facexlib`, etc.).
   - Verified that all Python packages successfully registered inside `[local path redacted]`.

5. **Reclaimed Main Drive Space (4.4 GB Reclaimed)**:
   - **Pip Cache Cleaned (3.2 GB)**: Pip cached the massive downloaded `.whl` files (wheels) for PyTorch and other dependencies in `~/.cache/pip` on the main drive. We ran `pip cache purge` to completely clean this up.
   - **Playwright Cache Moved (1.2 GB)**: Playwright originally downloaded browsers to `~/.cache/ms-playwright` on the main drive. We deleted this directory and pointed Playwright to the 500GB drive instead (`[local path redacted]`).
   
   > [!NOTE]
   > Because the 500GB external drive is formatted with **exFAT**, it does not support Unix symlinks. Playwright requires symlinks for WebKit and Firefox, which causes them to fail installation on exFAT. However, **Chromium** and **FFmpeg** (which Odysseus actually uses for browser automation) do not use symlinks and are fully functional on the 500GB drive.
