import json
import requests
from time import sleep
import os

IMAGES_JSON = "e:/C code/bachelor/Backend/data/SeedData/images.json"
TEMP_JSON = "e:/C code/bachelor/Backend/data/SeedData/images_temp.json"
PLACEHOLDER_URL = "https://img.freepik.com/premium-vector/travel-copenhagen-icon_408115-1792.jpg?w=1600"
SAVE_EVERY = 10  # Save progress after this many entries

def is_image_ok(url):
    try:
        response = requests.get(url, stream=True, timeout=8)
        print(f" → Status code: {response.status_code}", end="")
        return response.status_code == 200
    except Exception as e:
        print(f" → Error: {e}", end="")
        return False

def save_progress(images):
    with open(TEMP_JSON, "w", encoding="utf-8") as f:
        json.dump(images, f, indent=2, ensure_ascii=False)
    print(" [Progress saved]")

def main():
    # Load the JSON file
    if os.path.exists(TEMP_JSON):
        print("Resuming from temp file...")
        with open(TEMP_JSON, "r", encoding="utf-8") as f:
            images = json.load(f)
    else:
        with open(IMAGES_JSON, "r", encoding="utf-8") as f:
            images = json.load(f)

    changed = 0
    total = len(images)
    start_idx = 0

    try:
        for idx, entry in enumerate(images):
            url = entry.get("image_url")
            try:
                ok = is_image_ok(url)
                if not ok:
                    print(f"[{idx+1}/{total}] Checking: {url[:60]}...", end="")
                    print(" BROKEN → replaced")
                    entry["image_url"] = PLACEHOLDER_URL
                    changed += 1
            except Exception as inner_e:
                print(f" Exception: {inner_e} (replaced)")
                entry["image_url"] = PLACEHOLDER_URL
                changed += 1

            # Save progress every N entries
            if (idx + 1) % SAVE_EVERY == 0:
                save_progress(images)

            sleep(0.4)  # Adjust if you need to be slower/faster
    except KeyboardInterrupt:
        print("\nInterrupted! Saving progress...")
        save_progress(images)
        print("Progress saved. You can resume by running the script again.")
        return

    print(f"\nUpdated {changed} broken image links.")
    save_progress(images)
    print(f"All done. Final output in {TEMP_JSON}. You can rename it to images.json if you wish.")

if __name__ == "__main__":
    main()
