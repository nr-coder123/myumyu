#!/usr/bin/env python3
"""
Murim Realm Map Studio - Local Application Launcher
Cross-platform launcher for Windows, macOS, and Linux.
Usage: python start.py  or  python run.py
"""

import os
import sys
import subprocess
import shutil
import time
import webbrowser
import threading

def check_node_installed():
    """Verify Node.js and npm are available on the system PATH."""
    node_path = shutil.which("node")
    npm_path = shutil.which("npm")
    
    if not node_path or not npm_path:
        print("\n[ERROR] Node.js and npm are required to run this application.")
        print("Please download and install Node.js (v18 or higher) from: https://nodejs.org/")
        sys.exit(1)
    
    print(f"[INFO] Node.js detected: {node_path}")
    print(f"[INFO] npm detected: {npm_path}")

def install_dependencies_if_needed(project_dir):
    """Run npm install if node_modules directory is missing."""
    node_modules_dir = os.path.join(project_dir, "node_modules")
    
    if not os.path.exists(node_modules_dir):
        print("\n[INFO] First-time setup: Installing project dependencies via npm install...")
        cmd = ["npm", "install"]
        if sys.platform == "win32":
            cmd = ["npm.cmd", "install"]
            
        result = subprocess.run(cmd, cwd=project_dir)
        if result.returncode != 0:
            print("\n[ERROR] npm install failed. Please check your network connection and try again.")
            sys.exit(1)
        print("[INFO] Dependencies installed successfully!")
    else:
        print("[INFO] Project dependencies verified (node_modules exists).")

def start_dev_server(project_dir):
    """Launch Vite development server and open application in default browser."""
    url = "http://localhost:3000"
    
    print("\n=======================================================")
    print("      Murim Realm Map Studio Local Launcher")
    print("=======================================================")
    print(f"[INFO] Starting application server at {url} ...")
    print("[INFO] Press Ctrl+C at any time to stop the server.\n")
    
    def open_browser():
        time.sleep(2.5)
        print(f"\n[INFO] Opening web browser at {url} ...")
        try:
            webbrowser.open(url)
        except Exception:
            pass

    threading.Thread(target=open_browser, daemon=True).start()
    
    cmd = ["npm", "run", "dev"]
    if sys.platform == "win32":
        cmd = ["npm.cmd", "run", "dev"]
        
    try:
        subprocess.run(cmd, cwd=project_dir)
    except KeyboardInterrupt:
        print("\n[INFO] Application server stopped. Goodbye!")

if __name__ == "__main__":
    project_dir = os.path.dirname(os.path.abspath(__file__))
    check_node_installed()
    install_dependencies_if_needed(project_dir)
    start_dev_server(project_dir)
