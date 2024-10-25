from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs
import json
import requests

API_KEY = '291b62df53cdb1b0a31e2eafbe3b2305'
APP_ID = '071bb78f'
BASE_URL = 'https://api.aylien.com/news/stories'

states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
]

def fetch_disaster_news(state):
    headers = {
        'X-AYLIEN-NewsAPI-Application-ID': APP_ID,
        'X-AYLIEN-NewsAPI-Application-Key': API_KEY,
    }
    
    params = {
        'language': 'en',
        'text': f'disaster OR flood OR earthquake OR cyclone AND "{state}"',
        'locations.country': 'India',
        'sort_by': 'published_at',
        'published_at.start': 'NOW-30DAYS',
        'categories.confident': 'true'
    }
    
    response = requests.get(BASE_URL, headers=headers, params=params)
    
    if response.status_code == 200:
        data = response.json()
        return data['stories']
    else:
        return []

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        all_news = []
        for state in states:
            news = fetch_disaster_news(state)
            all_news.extend(news)

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(all_news).encode())
        return

def do_GET(self):
    self.send_response(200)
    self.send_header('Content-type', 'application/json')
    self.send_header('Access-Control-Allow-Origin', '*')  # Be more specific in production
    self.end_headers()
    # ... rest of the function