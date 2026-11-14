# Updating the archive

## Add a season
Add a new object to `data/seasons.json`. Give it a unique ID such as `season-04`, increment the number, and fill in title, status, summary, objectives, review, league finish, trophies, best signing, and young player.

## Add a player
Add an object to `data/players.json`. Supported fields:
- `name`
- `position` (e.g. GK, CB, CM, ST)
- `position_group` (GK, DEF, MID, FWD)
- `nationality`
- `status`
- `ovr`
- `seasons` (array of season numbers)
- `photo` (relative path)
- `notes`

## Add a transfer
Add an object to `data/transfers.json` with `season`, `player`, `type` (`IN` or `OUT`), `position`, `fee`, and `notes`.

## Add a record
Add an object to `data/records.json` with `label`, `holder`, `value`, and `note`.

## Add a gallery item
Put the image in `assets/images/gallery/`, then add `title`, `season`, `category`, and relative `image` path to `data/gallery.json`.

## Data quality
Do not invent missing fees, ratings, statistics, or results. Use `TBD` until the information is confirmed.
