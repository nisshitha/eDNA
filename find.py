import requests
import json
from typing import Union, Dict

# --- Constants ---
GBIF_API_URL = "https://api.gbif.org/v1"
OBIS_API_URL = "https://api.obis.org/v3/occurrence"
GEOCODING_API_URL = "https://nominatim.openstreetmap.org/reverse"

def get_location_from_coords(latitude: float, longitude: float) -> str:
    """Converts coordinates into a human-readable location."""
    print(f"Finding location for coordinates: {latitude}, {longitude}...")
    params = {'format': 'json', 'lat': latitude, 'lon': longitude, 'zoom': 3}
    headers = {'User-Agent': 'SpeciesProfileFinder/1.0'}
    try:
        response = requests.get(GEOCODING_API_URL, params=params, headers=headers)
        response.raise_for_status()
        location_data = response.json()
        address = location_data.get('address', {})
        country = address.get('country')
        ocean = address.get('ocean')
        if country: return country
        if ocean: return ocean
        return location_data.get('display_name', "Detailed location not found")
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to geocoding API: {e}")
        return "Could not fetch location data"

def get_species_profile(species_name: str) -> Union[Dict, None]:
    """Finds a full profile: classification, coordinates, and location."""
    print(f"\n--- Starting search for '{species_name}' ---")
    
    gbif_info = get_gbif_species_info(species_name)
    if not gbif_info:
        return None

    scientific_name = gbif_info['scientific_name']
    coordinates = gbif_info['coordinates']

    # If GBIF had no coordinates → fallback to OBIS
    if coordinates == "No coordinates found":
        print("Falling back to OBIS for coordinates...")
        obis_coords = get_obis_coordinates(scientific_name)
        if obis_coords:
            coordinates = obis_coords

    if isinstance(coordinates, list) and len(coordinates) == 2:
        location_name = get_location_from_coords(coordinates[0], coordinates[1])
    else:
        location_name = "No location available"
    
    return {
        "scientific_name": scientific_name,
        "classification": gbif_info.get('classification', 'N/A'),
        "coordinates": coordinates,
        "location": location_name
    }

def get_gbif_species_info(species_name: str) -> Union[Dict, None]:
    """Handles all logic for getting species data (including classification) from GBIF."""
    taxon_key = None
    gbif_data = {}

    print("Attempting a strict name match on GBIF...")
    try:
        response = requests.get(f"{GBIF_API_URL}/species/match", params={"name": species_name})
        response.raise_for_status()
        match_data = response.json()
        if match_data.get('matchType') != 'NONE' and match_data.get('usageKey'):
            print("Strict match found!")
            gbif_data = match_data
            taxon_key = gbif_data.get('usageKey')
    except requests.exceptions.RequestException as e:
        print(f"Warning: Error during strict match: {e}")

    if not taxon_key:
        print("Falling back to a broader search on GBIF...")
        try:
            response = requests.get(f"{GBIF_API_URL}/species/search", params={"q": species_name, "rank": "SPECIES", "limit": 1})
            response.raise_for_status()
            search_data = response.json()
            if search_data.get('results'):
                gbif_data = search_data['results'][0]
                taxon_key = gbif_data.get('key')
        except requests.exceptions.RequestException as e:
            print(f"Error during GBIF search: {e}")
            return None

    if not taxon_key:
        print("Could not find any species match on GBIF.")
        return None

    scientific_name = gbif_data.get('scientificName', 'N/A')
    classification = f"{gbif_data.get('kingdom', '')} / {gbif_data.get('phylum', '')} / {gbif_data.get('class', '')}"
    print(f"Found on GBIF! Name: {scientific_name}, Key: {taxon_key}")
    
    print(f"Searching for occurrence records for key {taxon_key}...")
    try:
        response = requests.get(
            f"{GBIF_API_URL}/occurrence/search", 
            params={"taxonKey": taxon_key, "hasCoordinate": "true", "limit": 50}
        )
        response.raise_for_status()
        occurrence_data = response.json()
        if occurrence_data.get('results'):
            for result in occurrence_data['results']:
                latitude = result.get('decimalLatitude')
                longitude = result.get('decimalLongitude')
                if latitude is not None and longitude is not None:
                    return {
                        "scientific_name": scientific_name, 
                        "coordinates": [latitude, longitude],
                        "classification": classification
                    }
        print("No occurrence records with coordinates found on GBIF.")
        return {
            "scientific_name": scientific_name,
            "coordinates": "No coordinates found",
            "classification": classification
        }
    except requests.exceptions.RequestException as e:
        print(f"Error fetching occurrence data: {e}")
        return None

def get_obis_coordinates(scientific_name: str) -> Union[list, None]:
    """Fetches occurrence coordinates from OBIS."""
    try:
        response = requests.get(OBIS_API_URL, params={"scientificname": scientific_name, "size": 1})
        response.raise_for_status()
        data = response.json()
        if "results" in data and len(data["results"]) > 0:
            first = data["results"][0]
            lat = first.get("decimalLatitude")
            lon = first.get("decimalLongitude")
            if lat is not None and lon is not None:
                print(f"Found coordinates on OBIS: {lat}, {lon}")
                return [lat, lon]
    except requests.exceptions.RequestException as e:
        print(f"Error fetching OBIS data: {e}")
    return None

# --- Main execution block ---
if __name__ == "__main__":
    print("--- Species Profile Finder ---")
    print("Enter a species name (e.g., Tiger Shark, Carcharodon carcharias)")
    
    try:
        while True:
            species_input = input("\nEnter species name (or type 'exit' to quit): ")
            if species_input.lower() == 'exit': break
            if not species_input: continue
            
            profile_data = get_species_profile(species_input)

            if profile_data:
                print(f"\nSUCCESS! Profile for '{profile_data['scientific_name']}':")
                print(f"  Classification: {profile_data['classification']}")
                print(f"  Coordinates:    {profile_data['coordinates']}")
                print(f"  Found in:       {profile_data['location']}")
            else:
                print(f"\nFAILURE! Could not retrieve a full profile for '{species_input}'.")
    except KeyboardInterrupt:
        print("\nExiting program.")
