#!/usr/bin/env python3
"""
PS2 Vault - ETL Catalog Enrichment Script
Author: PS2 Vault System Architecture
Description:
    Queries TheGamesDB API and niemasd/GameDB-PS2 repository to fetch complete,
    enriched metadata for PS2 games and updates the catalog dataset.

Usage:
    Single Game:
        python scripts/enrich_catalog.py --title "Resident Evil 4"
        python scripts/enrich_catalog.py --serial "SLUS-21134"

    Batch Processing:
        python scripts/enrich_catalog.py --list "God of War, Devil May Cry, Silent Hill 2"
        python scripts/enrich_catalog.py --file scripts/my_games.txt

    Interactive Mode:
        python scripts/enrich_catalog.py
"""

import sys
import os
import json
import argparse
import requests
import re
from typing import Dict, List, Optional, Any

# Configuration
THEGAMESDB_API_KEY = "264cb03427179b76c8f91e0aa8fb2b37f2b41e6c2cbcca2f60b96d7365c24f80"
THEGAMESDB_BASE_URL = "https://api.thegamesdb.net/v1"
PS2_PLATFORM_ID = 11

# File Paths
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MOCK_GAMES_PATH = os.path.join(ROOT_DIR, "src", "data", "mockGames.ts")
GAMES_JSON_PATH = os.path.join(ROOT_DIR, "src", "data", "games.json")

# Official Genres in PS2 Vault Schema
VALID_GENRES = [
    "Acción", "Beat 'em up", "Aventura", "Shooter", "Deportes", 
    "Carreras", "Lucha", "Arcade", "Disney", "Películas", 
    "Infantiles", "Terror", "Aviones", "Estrategia"
]

GENRE_MAP = {
    "action": "Acción",
    "shooter": "Shooter",
    "sports": "Deportes",
    "racing": "Carreras",
    "driving": "Carreras",
    "fighting": "Lucha",
    "arcade": "Arcade",
    "horror": "Terror",
    "survival horror": "Terror",
    "strategy": "Estrategia",
    "adventure": "Aventura",
    "flight": "Aviones",
    "disney": "Disney",
    "children": "Infantiles",
    "movie": "Películas"
}

def map_genre(genre_str: str) -> str:
    if not genre_str:
        return "Acción"
    for valid in VALID_GENRES:
        if valid.lower() in genre_str.lower():
            return valid
    for key, target in GENRE_MAP.items():
        if key in genre_str.lower():
            return target
    return "Acción"

def fetch_niemasd_by_serial(serial: str) -> Optional[Dict[str, str]]:
    """Fetch baseline metadata from niemasd/GameDB-PS2 GitHub repo by serial."""
    serial_clean = serial.strip().upper()
    base_raw = f"https://raw.githubusercontent.com/niemasd/GameDB-PS2/main/games/{serial_clean}"
    
    try:
        title_res = requests.get(f"{base_raw}/title.txt", timeout=5)
        if title_res.status_code != 200:
            return None
        
        title = title_res.text.strip()
        region = requests.get(f"{base_raw}/region.txt", timeout=5).text.strip() or "NTSC-U"
        genre = requests.get(f"{base_raw}/genre.txt", timeout=5).text.strip() or "Acción"
        developer = requests.get(f"{base_raw}/developer.txt", timeout=5).text.strip() or ""
        publisher = requests.get(f"{base_raw}/publisher.txt", timeout=5).text.strip() or ""
        language = requests.get(f"{base_raw}/language.txt", timeout=5).text.strip() or "Inglés / Español"
        
        return {
            "id": serial_clean,
            "titulo": title,
            "region": "PAL" if "PAL" in region else ("NTSC-J" if "JAPAN" in region or "NTSC-J" in region else "NTSC-U"),
            "genero": map_genre(genre),
            "idioma": language,
            "developer": developer,
            "publisher": publisher
        }
    except Exception as e:
        print(f"[!] Error querying niemasd repo for {serial_clean}: {e}")
        return None

def fetch_thegamesdb_details(query: str) -> Optional[Dict[str, Any]]:
    """Query TheGamesDB API by game name for PS2 platform."""
    try:
        search_url = f"{THEGAMESDB_BASE_URL}/Games/ByGameName"
        params = {
            "apikey": THEGAMESDB_API_KEY,
            "name": query,
            "fields": "overview,publishers,genres,developers"
        }
        res = requests.get(search_url, params=params, timeout=10)
        if res.status_code != 200:
            print(f"[!] TheGamesDB API error ({res.status_code}): {res.text}")
            return None
        
        data = res.json()
        games = data.get("data", {}).get("games", [])
        
        # Filter for PS2 games (platform == 11)
        ps2_games = [g for g in games if g.get("platform") == PS2_PLATFORM_ID]
        target_game = ps2_games[0] if ps2_games else (games[0] if games else None)
        
        if not target_game:
            return None
        
        game_id = target_game.get("id")
        title = target_game.get("game_title", query)
        overview = target_game.get("overview", "")
        
        # Fetch front boxart cover image
        image_url = "/ps2-cover-placeholder.png"
        if game_id:
            img_req = requests.get(f"{THEGAMESDB_BASE_URL}/Games/Images", params={"apikey": THEGAMESDB_API_KEY, "games_id": game_id}, timeout=10)
            if img_req.status_code == 200:
                img_data = img_req.json()
                base_img_url = img_data.get("data", {}).get("base_url", {}).get("medium", "https://cdn.thegamesdb.net/images/medium/")
                images_list = img_data.get("data", {}).get("images", {}).get(str(game_id), [])
                
                for img in images_list:
                    if img.get("type") == "boxart" and img.get("side") == "front":
                        image_url = f"{base_img_url}{img.get('filename')}"
                        break
        
        return {
            "game_id": game_id,
            "titulo": title,
            "sinopsis": overview,
            "imagen": image_url
        }
    except Exception as e:
        print(f"[!] Error fetching from TheGamesDB for '{query}': {e}")
        return None

def process_single_game(query: str, is_serial: bool = False) -> Dict[str, Any]:
    """Process a single game request by merging niemasd and TheGamesDB data."""
    print(f"\n[+] Buscando información para: '{query}'...")
    
    niemasd_data = None
    if is_serial or re.match(r'^[A-Z]{4}-\d{5}$', query.upper()):
        niemasd_data = fetch_niemasd_by_serial(query)
    
    search_title = niemasd_data["titulo"] if niemasd_data else query
    tgdb_data = fetch_thegamesdb_details(search_title)
    
    # Merge and build GameItem schema
    game_id = niemasd_data["id"] if niemasd_data else f"PS2-{abs(hash(query)) % 100000:05d}"
    title = niemasd_data["titulo"] if niemasd_data else (tgdb_data["titulo"] if tgdb_data else query)
    genre = niemasd_data["genero"] if niemasd_data else "Acción"
    region = niemasd_data["region"] if niemasd_data else "NTSC-U"
    idioma = niemasd_data["idioma"] if niemasd_data else "Español / Inglés"
    sinopsis = tgdb_data["sinopsis"] if tgdb_data and tgdb_data.get("sinopsis") else f"Juego clásico de PlayStation 2: {title}."
    imagen = tgdb_data["imagen"] if tgdb_data and tgdb_data.get("imagen") else "/ps2-cover-placeholder.png"
    
    item = {
        "id": game_id,
        "titulo": title,
        "genero": genre,
        "tipoCaja": "Caja DVD",
        "estado": "Funciona",
        "faltaCaratula": True if imagen == "/ps2-cover-placeholder.png" else False,
        "imagen": imagen,
        "region": region,
        "idioma": idioma,
        "tamanioMb": 3800,
        "sinopsis": sinopsis,
        "etiquetaDvd": False,
        "copias": 1
    }
    
    print(f"    [OK] Juego procesado: [{item['id']}] {item['titulo']} ({item['genero']}) - {item['region']}")
    return item

def update_mock_games_file(new_games: List[Dict[str, Any]]):
    """Write updated games catalog directly to mockGames.ts for seamless App update."""
    if not os.path.exists(MOCK_GAMES_PATH):
        print(f"[!] Target file {MOCK_GAMES_PATH} not found.")
        return
    
    # Read existing items
    with open(MOCK_GAMES_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Extract existing array via regex or JSON structure
    existing_items = []
    match = re.search(r'export const INITIAL_GAMES: GameItem\[\] = (\[[\s\S]*?\]);', content)
    if match:
        try:
            # Clean up JS formatting to raw JSON parseable string
            js_json = match.group(1)
            # Remove trailing commas
            js_json_clean = re.sub(r',\s*([\]}])', r'\1', js_json)
            # Quote unquoted keys
            js_json_clean = re.sub(r'(\w+):', r'"\1":', js_json_clean)
            existing_items = json.loads(js_json_clean)
        except Exception as e:
            print(f"[!] Warning parsing mockGames.ts: {e}. Will append using structured TS code.")

    # Deduplicate by ID
    existing_ids = {g["id"] for g in existing_items if "id" in g}
    added_count = 0
    
    final_games = list(existing_items)
    for g in new_games:
        if g["id"] not in existing_ids:
            final_games.append(g)
            existing_ids.add(g["id"])
            added_count += 1
        else:
            # Update existing entry
            for idx, item in enumerate(final_games):
                if item["id"] == g["id"]:
                    final_games[idx] = g
                    break
    
    ts_code = 'import type { GameItem } from "../types/catalog";\n\n'
    ts_code += "export const INITIAL_GAMES: GameItem[] = " + json.dumps(final_games, indent=2, ensure_ascii=False) + ";\n"
    
    with open(MOCK_GAMES_PATH, "w", encoding="utf-8") as f:
        f.write(ts_code)
    
    print(f"\n[SUCCESS] Catalogo actualizado con exito en 'src/data/mockGames.ts'. Total juegos: {len(final_games)} (+{added_count} nuevos).")

def main():
    parser = argparse.ArgumentParser(description="PS2 Vault Catalog Enrichment Script")
    parser.add_argument("--title", type=str, help="Procesar un solo título por nombre")
    parser.add_argument("--serial", type=str, help="Procesar un solo título por Serial PS2 (ej: SLUS-20941)")
    parser.add_argument("--list", type=str, help="Procesar lista separada por comas (ej: 'GTA SA, God of War 2')")
    parser.add_argument("--file", type=str, help="Procesar archivo de texto con un título o serial por línea")

    args = parser.parse_args()
    
    games_to_process = []
    
    if args.title:
        games_to_process.append(process_single_game(args.title, is_serial=False))
    elif args.serial:
        games_to_process.append(process_single_game(args.serial, is_serial=True))
    elif args.list:
        titles = [t.strip() for t in args.list.split(",") if t.strip()]
        for t in titles:
            games_to_process.append(process_single_game(t))
    elif args.file:
        if os.path.exists(args.file):
            with open(args.file, "r", encoding="utf-8") as f:
                lines = [line.strip() for line in f if line.strip() and not line.startswith("#")]
                for line in lines:
                    games_to_process.append(process_single_game(line))
        else:
            print(f"[!] Archivo {args.file} no encontrado.")
            sys.exit(1)
    else:
        # Interactive mode
        print("=== PS2 Vault - Enriquecedor de Catálogo ===")
        print("1. Buscar un solo juego por nombre")
        print("2. Buscar un solo juego por Serial (ej: SLUS-20941)")
        print("3. Ingresar múltiples títulos separados por comas")
        choice = input("Seleccioná una opción (1-3): ").strip()
        
        if choice == "1":
            name = input("Nombre del juego: ").strip()
            if name:
                games_to_process.append(process_single_game(name))
        elif choice == "2":
            serial = input("Serial del juego (ej: SLUS-20941): ").strip()
            if serial:
                games_to_process.append(process_single_game(serial, is_serial=True))
        elif choice == "3":
            raw_list = input("Nombres separados por coma: ").strip()
            titles = [t.strip() for t in raw_list.split(",") if t.strip()]
            for t in titles:
                games_to_process.append(process_single_game(t))
    
    if games_to_process:
        update_mock_games_file(games_to_process)
    else:
        print("[!] No se procesó ningún juego.")

if __name__ == "__main__":
    main()
