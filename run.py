#!/usr/bin/env python3
"""
Launcher alias for Murim Realm Map Studio.
Usage: python run.py
"""
import os
import sys

if __name__ == "__main__":
    start_script = os.path.join(os.path.dirname(os.path.abspath(__file__)), "start.py")
    with open(start_script, "r", encoding="utf-8") as f:
        code = compile(f.read(), start_script, 'exec')
        exec(code, {'__name__': '__main__', '__file__': start_script})
