import os
import time
import shutil
from pathlib import Path
from datetime import datetime

# NOTE: Requires watchdog library
# pip install watchdog
try:
    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler
except ImportError:
    print("WARNING: 'watchdog' package not found. Install via 'pip install watchdog'")
    Observer, FileSystemEventHandler = None, None

class BrainWatcherHandler(FileSystemEventHandler):
    def __init__(self, target_queue_dir: str):
        self.target_queue_dir = Path(target_queue_dir)
        self.target_queue_dir.mkdir(parents=True, exist_ok=True)

    def on_created(self, event):
        """Triggered when a new file is dropped into a monitored directory."""
        if not event.is_directory and event.src_path.endswith('.md'):
            print(f"[{datetime.now().strftime('%H:%M:%S')}] NEW BRAIN DUMP DETECTED: {event.src_path}")
            self.route_to_odysseus(event.src_path)

    def on_modified(self, event):
        """Triggered when an existing file is updated."""
        # For simplicity, we only route on creation in this mock, 
        # but in production, we might track significant updates.
        pass

    def route_to_odysseus(self, source_path: str):
        """
        Simulates routing the new file to the Odysseus GUI via a file-drop integration.
        It copies the file to an 'Inbox/Queue' folder that the Odysseus GUI reads from.
        """
        source_file = Path(source_path)
        
        # In a real scenario, this is where we would call the LocalIdeationEngine
        # to generate the synthesized outputs (Script, Substack, Hook) BEFORE
        # dropping it into the Odysseus queue.
        
        # For this file-based integration, we drop the raw file into the queue
        # for Odysseus to pick up and process.
        destination_path = self.target_queue_dir / source_file.name
        
        try:
            # Adding a slight delay to ensure file writing is complete before copying
            time.sleep(1)
            shutil.copy2(source_file, destination_path)
            print(f"--> Successfully routed {source_file.name} to Odysseus Queue: {self.target_queue_dir}\n")
        except Exception as e:
            print(f"Error routing file: {e}")

def start_watcher(brain_dirs: list, queue_dir: str):
    if not Observer:
        return
        
    event_handler = BrainWatcherHandler(target_queue_dir=queue_dir)
    observer = Observer()
    
    for directory in brain_dirs:
        path = Path(directory)
        path.mkdir(parents=True, exist_ok=True)
        observer.schedule(event_handler, str(path), recursive=False)
        print(f"Watching Central Brain directory: {path}")
        
    observer.start()
    print(f"\nCentral Brain Watcher active. Waiting for new inputs...")
    print(f"Routing outputs to: {queue_dir}\n")
    print("Press Ctrl+C to stop.")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print("\nWatcher stopped.")
    observer.join()

if __name__ == "__main__":
    # Define the core directories that make up the Central Brain
    BASE_DIR = Path(".")
    
    BRAIN_DIRECTORIES = [
        BASE_DIR / "A_Plain_of_Jars",
        BASE_DIR / "Reluctant_Capitalist",
        BASE_DIR / "MLM_Truth",
        BASE_DIR / "Chat_History"
    ]
    
    # Define the folder that the Odysseus GUI monitors for its "Inbox"
    ODYSSEUS_QUEUE_DIR = BASE_DIR / "Odysseus_Inbox"
    
    start_watcher(BRAIN_DIRECTORIES, str(ODYSSEUS_QUEUE_DIR))
