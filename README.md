# Athletic Bilbao — Spanish Armada

A responsive, static website archive for a FIFA 13 Manager Career Mode project.

## Features
- Hybrid editorial + football dashboard visual design
- Season archive and individual season reports
- Squad directory with search and filters
- Transfer history with season/type filters
- Statistics and records
- Project history timeline
- Screenshot gallery
- JSON-based manual data management
- GitHub Pages deployment using GitHub Actions

## Run locally
Because the website loads JSON with `fetch()`, run it through a local web server rather than opening `index.html` directly.

Python:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.

## Deploy to GitHub Pages
1. Create a GitHub repository named `athletic-bilbao-spanish-armada`.
2. Upload the contents of this folder to the repository root.
3. Push/commit to the `main` branch.
4. Open repository Settings → Pages.
5. Under Build and deployment, choose **GitHub Actions**.
6. Wait for the workflow named **Deploy Spanish Armada to GitHub Pages** to complete.
7. The site will be available at `https://YOUR-USERNAME.github.io/athletic-bilbao-spanish-armada/`.

## Update data manually
Edit JSON files inside `data/`:
- `seasons.json`
- `players.json`
- `transfers.json`
- `records.json`
- `gallery.json`

Keep JSON syntax valid. Use `null` or `TBD` for unknown values instead of guessing.

## Add images
- Player portraits: `assets/images/players/`
- FIFA screenshots: `assets/images/gallery/`

Use relative paths in JSON, for example:
`"photo": "assets/images/players/player-name.jpg"`

Use images you own or have permission to reuse. Add attribution where required.

## Project note
This is an independent fan-made archive. It is not affiliated with Athletic Club, FIFA, or EA Sports. Player names and club references belong to their respective owners.
