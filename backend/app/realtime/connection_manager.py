import json
from typing import Dict, List, Set, Any
from fastapi import WebSocket

class ConnectionManager:
    """
    Real-Time WebSocket Connection Bus for SkyShield AI.
    Handles dual channel topologies:
    1. /ws/officer (Command Center live alerts, SOS dispatch, telemetry)
    2. /ws/citizen/{citizen_id} (Targeted citizen hyper-local alerts and warnings)
    """
    def __init__(self):
        self.officer_connections: Set[WebSocket] = set()
        self.citizen_connections: Dict[str, Set[WebSocket]] = {}

    async def connect_officer(self, websocket: WebSocket):
        await websocket.accept()
        self.officer_connections.add(websocket)

    def disconnect_officer(self, websocket: WebSocket):
        self.officer_connections.discard(websocket)

    async def connect_citizen(self, citizen_id: str, websocket: WebSocket):
        await websocket.accept()
        if citizen_id not in self.citizen_connections:
            self.citizen_connections[citizen_id] = set()
        self.citizen_connections[citizen_id].add(websocket)

    def disconnect_citizen(self, citizen_id: str, websocket: WebSocket):
        if citizen_id in self.citizen_connections:
            self.citizen_connections[citizen_id].discard(websocket)
            if not self.citizen_connections[citizen_id]:
                del self.citizen_connections[citizen_id]

    async def broadcast_to_officers(self, event_type: str, data: Any):
        payload = json.dumps({"event": event_type, "data": data})
        dead_connections = []
        for ws in self.officer_connections:
            try:
                await ws.send_text(payload)
            except Exception:
                dead_connections.append(ws)
        for ws in dead_connections:
            self.officer_connections.discard(ws)

    async def broadcast_to_citizen(self, citizen_id: str, event_type: str, data: Any):
        if citizen_id not in self.citizen_connections:
            return
        payload = json.dumps({"event": event_type, "data": data})
        dead_connections = []
        for ws in self.citizen_connections[citizen_id]:
            try:
                await ws.send_text(payload)
            except Exception:
                dead_connections.append(ws)
        for ws in dead_connections:
            self.citizen_connections[citizen_id].discard(ws)

    async def broadcast_all(self, event_type: str, data: Any):
        await self.broadcast_to_officers(event_type, data)
        payload = json.dumps({"event": event_type, "data": data})
        for c_id, sockets in list(self.citizen_connections.items()):
            for ws in list(sockets):
                try:
                    await ws.send_text(payload)
                except Exception:
                    pass

connection_manager = ConnectionManager()
