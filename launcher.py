import os
import sys
import time
import socket
import webbrowser
import subprocess
import threading
import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")

def is_port_open(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex(('127.0.0.1', port)) == 0

class SkyShieldLauncher:
    def __init__(self, root):
        self.root = root
        self.root.title("SkyShield AI — Control Center")
        self.root.geometry("640x620")
        self.root.minsize(580, 560)
        self.root.configure(bg="#0B1120")

        self.backend_proc = None
        self.frontend_proc = None
        self.is_running = False

        self.setup_ui()
        self.start_monitoring_thread()

    def setup_ui(self):
        # Header Frame
        header = tk.Frame(self.root, bg="#0F172A", padx=20, pady=16)
        header.pack(fill=tk.X)

        title_lbl = tk.Label(
            header,
            text="🛡️ SkyShield AI (VarshDristhi)",
            font=("Segoe UI", 16, "bold"),
            fg="#38BDF8",
            bg="#0F172A"
        )
        title_lbl.pack(anchor="w")

        subtitle_lbl = tk.Label(
            header,
            text="Severe Weather Nowcasting & Disaster Response Hub",
            font=("Segoe UI", 10),
            fg="#94A3B8",
            bg="#0F172A"
        )
        subtitle_lbl.pack(anchor="w")

        # Status Cards Frame
        status_frame = tk.Frame(self.root, bg="#0B1120", padx=20, pady=12)
        status_frame.pack(fill=tk.X)

        # Backend Status Card
        self.backend_card = tk.LabelFrame(
            status_frame,
            text=" FastAPI Backend (Port 8000) ",
            font=("Segoe UI", 9, "bold"),
            fg="#94A3B8",
            bg="#1E293B",
            padx=12,
            pady=8
        )
        self.backend_card.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(0, 6))

        self.backend_status_lbl = tk.Label(
            self.backend_card,
            text="● Offline",
            font=("Segoe UI", 11, "bold"),
            fg="#EF4444",
            bg="#1E293B"
        )
        self.backend_status_lbl.pack(anchor="w")

        # Frontend Status Card
        self.frontend_card = tk.LabelFrame(
            status_frame,
            text=" React Frontend (Port 5173) ",
            font=("Segoe UI", 9, "bold"),
            fg="#94A3B8",
            bg="#1E293B",
            padx=12,
            pady=8
        )
        self.frontend_card.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=(6, 0))

        self.frontend_status_lbl = tk.Label(
            self.frontend_card,
            text="● Offline",
            font=("Segoe UI", 11, "bold"),
            fg="#EF4444",
            bg="#1E293B"
        )
        self.frontend_status_lbl.pack(anchor="w")

        # Main Action Buttons Frame
        action_frame = tk.Frame(self.root, bg="#0B1120", padx=20, pady=10)
        action_frame.pack(fill=tk.X)

        # Big START Button
        self.start_btn = tk.Button(
            action_frame,
            text="▶  START APPLICATION",
            font=("Segoe UI", 13, "bold"),
            bg="#059669",
            fg="#FFFFFF",
            activebackground="#047857",
            activeforeground="#FFFFFF",
            relief=tk.FLAT,
            cursor="hand2",
            padx=16,
            pady=10,
            command=self.start_all
        )
        self.start_btn.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 6))

        # STOP Button
        self.stop_btn = tk.Button(
            action_frame,
            text="⏹  STOP APPLICATION",
            font=("Segoe UI", 13, "bold"),
            bg="#DC2626",
            fg="#FFFFFF",
            activebackground="#B91C1C",
            activeforeground="#FFFFFF",
            relief=tk.FLAT,
            cursor="hand2",
            padx=16,
            pady=10,
            state=tk.DISABLED,
            command=self.stop_all
        )
        self.stop_btn.pack(side=tk.RIGHT, fill=tk.X, expand=True, padx=(6, 0))

        # Quick Links Frame
        quick_frame = tk.Frame(self.root, bg="#0B1120", padx=20, pady=4)
        quick_frame.pack(fill=tk.X)

        self.open_app_btn = tk.Button(
            quick_frame,
            text="🌐 Open App (Browser)",
            font=("Segoe UI", 9, "bold"),
            bg="#2563EB",
            fg="#FFFFFF",
            relief=tk.FLAT,
            cursor="hand2",
            padx=8,
            pady=5,
            command=lambda: webbrowser.open("http://localhost:5173")
        )
        self.open_app_btn.pack(side=tk.LEFT, expand=True, fill=tk.X, padx=2)

        self.open_docs_btn = tk.Button(
            quick_frame,
            text="⚡ API Docs (FastAPI)",
            font=("Segoe UI", 9, "bold"),
            bg="#334155",
            fg="#E2E8F0",
            relief=tk.FLAT,
            cursor="hand2",
            padx=8,
            pady=5,
            command=lambda: webbrowser.open("http://localhost:8000/docs")
        )
        self.open_docs_btn.pack(side=tk.LEFT, expand=True, fill=tk.X, padx=2)

        # Credentials Box
        creds_frame = tk.Frame(self.root, bg="#1E293B", padx=12, pady=6)
        creds_frame.pack(fill=tk.X, padx=20, pady=8)

        creds_lbl = tk.Label(
            creds_frame,
            text="🔑 Officer: officer / commander2026   |   Citizen: +91 98765 43210 (Aashrith)",
            font=("Consolas", 8),
            fg="#38BDF8",
            bg="#1E293B"
        )
        creds_lbl.pack()

        # Log Output Frame
        log_frame = tk.LabelFrame(
            self.root,
            text=" Live Console Logs ",
            font=("Segoe UI", 9),
            fg="#94A3B8",
            bg="#0B1120",
            padx=10,
            pady=6
        )
        log_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=(0, 14))

        self.log_text = scrolledtext.ScrolledText(
            log_frame,
            wrap=tk.WORD,
            bg="#020617",
            fg="#A5F3FC",
            insertbackground="white",
            font=("Consolas", 9),
            height=10
        )
        self.log_text.pack(fill=tk.BOTH, expand=True)
        self.log("Ready to launch. Click 'START APPLICATION' to begin.")

    def log(self, message):
        timestamp = time.strftime("%H:%M:%S")
        self.log_text.insert(tk.END, f"[{timestamp}] {message}\n")
        self.log_text.see(tk.END)

    def start_all(self):
        self.start_btn.config(state=tk.DISABLED, bg="#4B5563")
        self.stop_btn.config(state=tk.NORMAL, bg="#DC2626")
        self.is_running = True

        threading.Thread(target=self._run_servers, daemon=True).start()

    def _run_servers(self):
        # 1. Start Backend
        self.log("Starting FastAPI Backend on port 8000...")
        backend_cmd = [
            sys.executable, "-m", "uvicorn", "app.main:app",
            "--host", "0.0.0.0", "--port", "8000"
        ]
        try:
            self.backend_proc = subprocess.Popen(
                backend_cmd,
                cwd=BACKEND_DIR,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0
            )
            threading.Thread(target=self._stream_logs, args=(self.backend_proc, "Backend"), daemon=True).start()
        except Exception as e:
            self.log(f"Error launching backend: {e}")

        # 2. Start Frontend
        self.log("Starting React Frontend on port 5173...")
        npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
        try:
            self.frontend_proc = subprocess.Popen(
                [npm_cmd, "run", "dev"],
                cwd=BASE_DIR,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                shell=(os.name == "nt"),
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0
            )
            threading.Thread(target=self._stream_logs, args=(self.frontend_proc, "Frontend"), daemon=True).start()
        except Exception as e:
            self.log(f"Error launching frontend: {e}")

        # 3. Wait for ports and open browser
        self.log("Waiting for servers to initialize...")
        opened_browser = False
        for _ in range(30):
            if not self.is_running:
                break
            b_online = is_port_open(8000)
            f_online = is_port_open(5173)
            if f_online and not opened_browser:
                self.log("Frontend is online! Launching browser...")
                webbrowser.open("http://localhost:5173")
                opened_browser = True
                break
            time.sleep(1)

        if not opened_browser and self.is_running:
            self.log("Services started. If browser didn't open automatically, click 'Open App (Browser)'.")

    def _stream_logs(self, proc, prefix):
        try:
            for line in iter(proc.stdout.readline, ''):
                if line:
                    clean = line.strip()
                    if clean:
                        self.log(f"[{prefix}] {clean}")
        except Exception:
            pass

    def stop_all(self):
        self.log("Stopping all services...")
        self.is_running = False

        def _kill():
            # Terminate backend process
            if self.backend_proc:
                try:
                    self.backend_proc.terminate()
                except Exception:
                    pass
                self.backend_proc = None

            # Terminate frontend process
            if self.frontend_proc:
                try:
                    self.frontend_proc.terminate()
                except Exception:
                    pass
                self.frontend_proc = None

            # Force kill any lingering port holders on Windows
            if os.name == "nt":
                os.system('for /f "tokens=5" %a in (\'netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"\') do taskkill /F /PID %a >nul 2>&1')
                os.system('for /f "tokens=5" %a in (\'netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"\') do taskkill /F /PID %a >nul 2>&1')

            self.log("All services stopped.")
            self.root.after(0, self._on_stopped)

        threading.Thread(target=_kill, daemon=True).start()

    def _on_stopped(self):
        self.start_btn.config(state=tk.NORMAL, bg="#059669")
        self.stop_btn.config(state=tk.DISABLED, bg="#4B5563")

    def start_monitoring_thread(self):
        def monitor():
            while True:
                b_ok = is_port_open(8000)
                f_ok = is_port_open(5173)

                def update_labels():
                    if b_ok:
                        self.backend_status_lbl.config(text="● Online (Port 8000)", fg="#10B981")
                    else:
                        self.backend_status_lbl.config(text="● Offline", fg="#EF4444")

                    if f_ok:
                        self.frontend_status_lbl.config(text="● Online (Port 5173)", fg="#10B981")
                    else:
                        self.frontend_status_lbl.config(text="● Offline", fg="#EF4444")

                try:
                    self.root.after(0, update_labels)
                except Exception:
                    break
                time.sleep(1.5)

        threading.Thread(target=monitor, daemon=True).start()

if __name__ == "__main__":
    root = tk.Tk()
    app = SkyShieldLauncher(root)
    root.protocol("WM_DELETE_WINDOW", lambda: (app.stop_all(), root.destroy()))
    root.mainloop()
