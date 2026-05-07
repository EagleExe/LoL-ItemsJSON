# League Items JSON Exporter

A Tampermonkey userscript that exports builds from popular League of Legends guide sites into importable Item Set JSON files.

## Supported Sites

| Site | URL Pattern | Notes |
|------|------------|-------|
| **Mobafire** | `mobafire.com/league-of-legends/build/*` | Scrapes item names from guide pages |
| **ProBuilds** | `probuilds.net/guide/show/*` | Scrapes item names from build pages |
| **DeepLoL** | `deeplol.gg/summoner/*/*/mastery*` | Extracts item IDs directly from OTP build pages. Re-scrapes on each click so you can switch between build tabs |

## How It Works

1. On first load, the script fetches the latest patch data from Riot's Data Dragon API (items + champions across all languages) and caches it in localStorage
2. A purple **Export Build to clipboard** button appears on supported pages
3. Click the button to copy a JSON item set to your clipboard
4. Import the JSON in the League client (Collections > Items > Import)

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser
2. **Chrome users**: Enable Developer Mode at `chrome://extensions` (required for Tampermonkey to inject scripts)
3. Click the Tampermonkey icon > **Create a new script**
4. Delete the default code and paste the contents of `LoL-ItemsJSON.user.js`
5. Press **Ctrl+S** (or **Cmd+S** on Mac) to save
6. Navigate to a supported site and the export button will appear

## Importing in League of Legends

1. Open the League client
2. Go to **Collection** > **Items**
3. Click **Import Item Sets**
4. Paste the JSON from your clipboard
5. Save the item set

## How Data Stays Up-to-Date

The script automatically fetches the latest item and champion data from Riot's Data Dragon API on first use. The data is cached in localStorage and refreshed when the cache is missing. No manual updates needed.

## Credits

- **EagleExe** - Original author
- **Passbaan** - Riot API integration, multi-site support, refactor
- **iustusae** - Contributor
