import json
import requests

# Load your API key
API_KEY = 'AIzaSyBlu6ITiY2Z7o3diQp8h3wdctGdB39kRK4'  # <-- replace with your actual API key

# Load your JSON file
with open('copenhagen_places2.json', 'r', encoding='utf-8') as f:
    places = json.load(f)

# Function to fetch place details
def fetch_place_details(place_id):
    url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&key={API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json().get("result", {})
    else:
        print(f"Failed to fetch details for place_id: {place_id}")
        return {}

# Collect detailed info
detailed_places = []

for place in places:
    place_id = place.get("place_id")
    if place_id:
        details = fetch_place_details(place_id)
        detailed_places.append(details)

# Save to a new file
with open('detailed_places1.json', 'w', encoding='utf-8') as f:
    json.dump(detailed_places, f, ensure_ascii=False, indent=2)

print("All place details fetched and saved to 'detailed_places.json'")
