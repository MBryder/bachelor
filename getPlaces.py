import requests
import time
import json

API_KEY = 'AIzaSyDeeW_3KPK-RujZQoIIKzlP9eg6QIcsIH8'  # Replace with your actual API key
LOCATION = '55.6761,12.5683'  # Copenhagen's latitude and longitude
RADIUS = 15000  # Search radius in meters
TYPES = ['restaurant',
    "amusement_park",
    "aquarium",
    "art_gallery",
    "bowling_alley",
    "casino",
    "movie_theater",
    "museum",
    "stadium",
    "tourist_attraction",
    "zoo",
    "park",
    "beach",]
MAX_PAGES = 100  # Maximum number of pages to retrieve
OUTPUT_FILE = 'copenhagen_places2.json'

def fetch_places(location, radius, place_type, api_key):
    url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
    params = {
        'location': location,
        'radius': radius,
        'type': place_type,
        'key': api_key
    }
    results = []
    page_count = 0

    while page_count < MAX_PAGES:
        response = requests.get(url, params=params)
        if response.status_code != 200:
            print(f"Error: {response.status_code}")
            break
        data = response.json()
        results.extend(data.get('results', []))
        page_count += 1
        next_page_token = data.get('next_page_token')
        if not next_page_token:
            break
        # There is a short delay between when a next_page_token is issued, and when it will become valid.
        time.sleep(2)
        params = {
            'pagetoken': next_page_token,
            'key': api_key
        }

    return results

all_places = []

for place_type in TYPES:
    places = fetch_places(LOCATION, RADIUS, place_type, API_KEY)
    all_places.extend(places)

with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    json.dump(all_places, f, ensure_ascii=False, indent=2)

print(f"Saved {len(all_places)} places to {OUTPUT_FILE}")
