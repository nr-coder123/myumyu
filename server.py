#!/usr/bin/env python3
"""
Murim Realm Map - Python Static Server
=====================================
Simple zero-dependency HTTP server to host the Murim Map application.

Usage:
    python3 server.py
    # or specify a custom port:
    PORT=8080 python3 server.py

Then open http://localhost:3000 (or your chosen port) in any web browser.
"""

import http.server
import socketserver
import os
import sys
import webbrowser

# Port preference: CLI argument > PORT env var > 8000 default
if len(sys.argv) > 1 and sys.argv[1].isdigit():
    PORT = int(sys.argv[1])
else:
    PORT = int(os.environ.get("PORT", 8000))

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, "dist")
INDEX_IN_DIST = os.path.join(DIST_DIR, "index.html")

# If dist/index.html does not exist, attempt to build it using npm/npx
if not (os.path.isdir(DIST_DIR) and os.path.isfile(INDEX_IN_DIST)):
    print("[*] dist/index.html not found. Attempting to build production bundle...")
    try:
        import subprocess
        result = subprocess.run(["npm", "run", "build"], cwd=BASE_DIR, shell=True)
        if result.returncode != 0:
            print("[!] Note: 'npm run build' returned non-zero exit code.")
    except Exception as e:
        print(f"[!] Could not run build automatically: {e}")

SERVE_DIR = DIST_DIR if os.path.isdir(DIST_DIR) and os.path.isfile(INDEX_IN_DIST) else BASE_DIR

class CleanHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Explicitly support older python 3 versions that don't take directory kwarg
        try:
            super().__init__(*args, directory=SERVE_DIR, **kwargs)
        except TypeError:
            os.chdir(SERVE_DIR)
            super().__init__(*args, **kwargs)

    def end_headers(self):
        # Enable CORS and disable caching
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

# Guarantee correct MIME types on Windows (fixes "MIME type text/plain" module execution errors)
CleanHTTPRequestHandler.extensions_map.update({
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
})

def run():
    os.chdir(BASE_DIR)
    url = f"http://localhost:{PORT}"
    print("=" * 65)
    print(f" Murim Realm Map - Python Server running")
    print(f" Directory: {SERVE_DIR}")
    print(f" Address  : {url}")
    print("=" * 65)
    
    # Try to open the browser automatically in background
    try:
        webbrowser.open(url)
    except Exception:
        pass

    # Allow socket address reuse immediately
    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("0.0.0.0", PORT), CleanHTTPRequestHandler) as httpd:
            print("Server is active. Press Ctrl+C to stop.")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        sys.exit(0)

if __name__ == "__main__":
    run()
