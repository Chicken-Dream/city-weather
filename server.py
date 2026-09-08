import http.server
import json
import os
import re
import urllib.request
from urllib.parse import urlparse, parse_qs

PORT = 8793
DEFAULT_STATION = "CYEG"
STATION_RE = re.compile(r"^[A-Za-z0-9]{2,6}$")
BBOX_RE = re.compile(r"^-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?$")


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith("/api/metar"):
            self.handle_metar()
        elif self.path.startswith("/api/stations"):
            self.handle_stations()
        else:
            super().do_GET()

    def handle_metar(self):
        query = parse_qs(urlparse(self.path).query)
        station = query.get("ids", [DEFAULT_STATION])[0]
        if not STATION_RE.match(station):
            station = DEFAULT_STATION
        api_url = f"https://aviationweather.gov/api/data/metar?ids={station}&format=json&hours=24"
        self.proxy_json(api_url)

    def handle_stations(self):
        query = parse_qs(urlparse(self.path).query)
        bbox = query.get("bbox", [""])[0]
        if not BBOX_RE.match(bbox):
            self.send_json(400, {"error": "invalid bbox"})
            return
        api_url = f"https://aviationweather.gov/api/data/metar?bbox={bbox}&format=json"
        self.proxy_json(api_url)

    def proxy_json(self, api_url):
        try:
            req = urllib.request.Request(api_url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=10) as resp:
                body = resp.read()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(body)
        except Exception as exc:
            self.send_json(502, {"error": str(exc)})

    def send_json(self, code, obj):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(obj).encode())

    def log_message(self, format, *args):
        pass


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = http.server.HTTPServer(("127.0.0.1", PORT), Handler)
    print(f"Serving at http://localhost:{PORT}")
    server.serve_forever()
