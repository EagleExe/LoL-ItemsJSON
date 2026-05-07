// ==UserScript==
// @name         League Items JSON Exporter
// @description  Export your mobafire builds to League of Legends Item Sets
// @version      1.1
// @author       EagleExe
// @contributer  Passbaan
// @contributer  iustusae
// @match        https://mobafire.com/league-of-legends/build/*
// @match        https://www.mobafire.com/league-of-legends/build/*
// @match        https://probuilds.net/guide/show/*
// @match        https://www.probuilds.net/guide/show/*
// @match        https://www.deeplol.gg/summoner/*/*/mastery*
// @match        https://deeplol.gg/summoner/*/*/mastery*
// @grant        none
// ==/UserScript==

console.log('[LIJE] Script loaded');

// --- Riot API ---

const DDRAGON = 'https://ddragon.leagueoflegends.com';

const fetchJson = (url) => fetch(url).then(r => r.json());

async function getCurrentPatch() {
  return (await fetchJson(`${DDRAGON}/api/versions.json`))[0];
}

async function getItemCodes(version) {
  let langs = await fetchJson(`${DDRAGON}/cdn/languages.json`);
  langs = langs.filter(l => l !== 'id_ID');
  const allItems = await Promise.all(
    langs.map(lang => fetchJson(`${DDRAGON}/cdn/${version}/data/${lang}/item.json`))
  );
  return allItems.reduce((acc, { data }) => {
    for (const [code, val] of Object.entries(data)) {
      acc[val.name.toLowerCase()] = parseInt(code.slice(2), 10);
    }
    return acc;
  }, {});
}

async function getChampionCodes(version) {
  const { data } = await fetchJson(`${DDRAGON}/cdn/${version}/data/en_US/champion.json`);
  const codes = {};
  const aliases = {};
  for (const [key, val] of Object.entries(data)) {
    codes[key.toLowerCase()] = parseInt(val.key, 10);
    if (key !== val.name) {
      aliases[val.name.replaceAll(' ', '').replace("'", '').toLowerCase()] = key.toLowerCase();
    }
  }
  return { codes, aliases };
}

// --- Item ID normalization ---

const ITEM_REPLACEMENTS = {
  '3121': '3119', // Fimblewinter -> Winter's Approach
  '3042': '3004', // Muramana -> Manamune
  '3040': '3003', // Seraph's Embrace -> Archangel's Staff
  '1082': '1101', // Jungle items
  '1107': '1101',
  '1106': '1102',
  '1105': '1103',
};

function normalizeItemId(raw) {
  let id = String(raw);
  if (id.length > 4) id = id.replace(/^\d{2}/, '');
  if (id.length > 4) id = id.replace('23', '');
  return ITEM_REPLACEMENTS[id] || id;
}

// --- ItemSet builder ---

function buildItemSet(data, itemCodes, champCodes, champAliases) {
  const blocks = data.items.map(({ title, content }) => ({
    type: title,
    items: content.map(item => ({
      id: data.preResolved ? item : normalizeItemId(itemCodes[item.trim().toLowerCase()]),
      count: 1,
    })),
  }));

  const champCode = data.champCode
    ? parseInt(data.champCode, 10)
    : champCodes[data.champion] || champCodes[champAliases[data.champion]];

  const title = `${data.title} - ${data.author}`;

  return {
    title,
    toJson: () => JSON.stringify({
      associatedMaps: [],
      title,
      associatedChampions: [champCode],
      blocks,
    }, null, 2),
  };
}

// --- Scrapers ---

function scrapeFromMobaFire() {
  return {
    title: document.querySelector('.view-guide__banner__title span').innerText.trim(),
    author: (() => {
      const a = document.querySelector('.view-guide__banner__author a');
      return `${a.innerHTML} @ ${a.href}`;
    })(),
    champion: document.querySelector('.champ-tabs__more').innerText
      .toLowerCase().replace('more ', '').replace(' guides', '').replaceAll(' ', '').replace("'", ''),
    items: [...document.querySelectorAll('.view-guide__build__items .view-guide__items')].map(el => ({
      title: el.querySelector('.view-guide__items__bar span').innerText,
      content: [...el.querySelectorAll('.view-guide__items__content span a')].map(a => a.innerText.toLowerCase()),
    })),
  };
}

function scrapeFromProBuilds() {
  return {
    title: 'Probuild build',
    author: document.querySelector('td.summoner.highlighted a').innerText,
    champCode: document.querySelector('td.summoner.highlighted')
      .parentElement.querySelector('.champion-icon .champ-img').dataset.id,
    items: [
      {
        title: document.querySelector('.guide-items div.left:first-of-type h3').innerText,
        content: [...document.querySelectorAll('.guide-items div.left:first-of-type ul li')]
          .map(li => li.querySelector('p').innerText.toLowerCase()).filter(Boolean),
      },
      ...[...document.querySelectorAll('.guide-items div.buy-order ul.buy-order li')]
        .reduce((acc, li, i) => {
          const span = li.querySelector('span');
          const name = li.querySelector('img').getAttribute('alt').toLowerCase();
          if (i === 0 || li.classList.contains('first')) {
            return [...acc, { title: span.innerText, content: [name] }];
          }
          acc[acc.length - 1].content.push(name);
          return acc;
        }, []),
    ],
  };
}

function scrapeFromDeepLoL() {
  const champImg = document.querySelector('img.imgChamp');
  const champion = champImg ? champImg.alt.toLowerCase() : '';

  const summonerName = document.querySelector('.name')?.innerText.trim() || 'Unknown';

  // Extract item IDs directly from image URLs (e.g. /img/item/3032__56.webp -> "3032")
  function extractItemId(img) {
    const match = img.src.match(/\/item\/(\d+)__/);
    return match ? match[1] : null;
  }

  // Helper: find a table by its header text
  function findTable(headerText) {
    const tables = document.querySelectorAll('table');
    for (const table of tables) {
      const th = table.querySelector('th');
      if (th && th.innerText.includes(headerText)) return table;
    }
    return null;
  }

  // Extract item IDs from a single row
  function idsFromRow(row) {
    return [...row.querySelectorAll('img.imgItem')]
      .map(extractItemId)
      .filter(id => id && id !== '0');
  }

  // Get first row's items from a table
  function firstRowItems(headerText) {
    const table = findTable(headerText);
    const row = table?.querySelector('tbody tr');
    const ids = row ? idsFromRow(row) : [];
    log(`  "${headerText}" item IDs:`, ids);
    return ids;
  }

  // Get all rows from Item Builds table, each as a separate block
  function allBuildRows() {
    const table = findTable('Item Builds');
    if (!table) return [];
    const rows = [...table.querySelectorAll('tbody tr')];
    return rows.map((row, i) => {
      const ids = idsFromRow(row);
      const tds = row.querySelectorAll('td');
      const games = tds[2]?.innerText.trim() || '?';
      const wr = tds[3]?.querySelector('span[value]')?.getAttribute('value') || tds[3]?.innerText.trim() || '?';
      const title = `Build ${i + 1} - ${games} games - ${wr}% WR`;
      log(`  "${title}" item IDs:`, ids);
      return { title, content: ids };
    }).filter(block => block.content.length > 0);
  }

  // Return with preResolved flag so buildItemSet skips name lookup
  return {
    title: 'OTP Build',
    author: `${summonerName} @ deeplol.gg`,
    champion,
    preResolved: true,
    items: [
      { title: 'Starting Items', content: firstRowItems('Starting Items') },
      { title: 'Boots', content: firstRowItems('Boots') },
      ...allBuildRows(),
    ].filter(block => block.content.length > 0),
  };
}

function scrape() {
  const loc = document.location.href;
  if (loc.includes('mobafire.com')) return scrapeFromMobaFire();
  if (loc.includes('probuilds.net')) return scrapeFromProBuilds();
  if (loc.includes('deeplol.gg')) return scrapeFromDeepLoL();
  return null;
}

// --- UI ---

function insertExportButton(onClick) {
  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px', width: '100%',
  });

  const button = document.createElement('button');
  button.innerText = 'Export Build to clipboard';
  Object.assign(button.style, {
    padding: '12px', border: 'none', width: '400px',
    color: 'white', background: '#7b2d8e', cursor: 'pointer',
    fontSize: '16px', fontWeight: 'bold', borderRadius: '15px',
  });
  wrapper.appendChild(button);

  const loc = document.location.href;
  if (loc.includes('mobafire.com')) {
    const rightCol = document.querySelector('.mf-responsive__rightCol');
    rightCol.insertBefore(wrapper, rightCol.firstChild);
  }
  if (loc.includes('probuilds.net')) {
    const parent = document.querySelector('.guide-items').parentElement;
    parent.insertBefore(wrapper, parent.querySelector('.guide-items'));
  }
  if (loc.includes('deeplol.gg')) {
    const mainTab = document.querySelector('.main_tab');
    if (mainTab) mainTab.parentElement.insertBefore(wrapper, mainTab);
  }

  button.addEventListener('click', onClick);
}

// --- Toast notification ---

function showToast(message, duration = 1000) {
  const dialog = document.createElement('dialog');
  dialog.innerText = message;
  Object.assign(dialog.style, {
    border: 'none', borderRadius: '8px', padding: '24px',
    background: '#7b2d8e', color: 'white', fontSize: '16px', fontWeight: 'bold',
    minWidth: '800px', minHeight: '200px',
    position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
    top: 'auto', margin: '0',
    zIndex: '99999',
    display: 'grid', placeItems: 'center',
  });
  document.body.appendChild(dialog);
  dialog.show();
  setTimeout(() => { dialog.close(); dialog.remove(); }, duration);
}

// --- LocalStorage cache ---

const STORAGE_PREFIX = 'LIJE_';

function loadCached(key) {
  const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
  if (raw === null) return null;
  try { return JSON.parse(raw); } catch { return raw; }
}

function saveCache(key, value) {
  localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
}

// --- Debug logging ---

const log = (...args) => console.log('%c[LIJE]', 'background:#7b2d8e;color:#fff;padding:2px 4px;border-radius:3px', ...args);

// --- SPA helper ---

function waitForElement(selector, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) { observer.disconnect(); resolve(el); }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => { observer.disconnect(); reject(new Error(`Timeout waiting for ${selector}`)); }, timeout);
  });
}

// --- Main ---

(async function () {
  log('Script started on', document.location.href);

  let version = loadCached('version');
  let itemCodes = loadCached('itemCodes');
  let champCodes = loadCached('championCodes');
  let champAliases = loadCached('needToAddSpaces');

  const needsRefresh = !version || !itemCodes || !champCodes || !champAliases;
  log('Cache status:', needsRefresh ? 'MISS - fetching from Riot API' : 'HIT - using cached data');

  if (needsRefresh) {
    try {
      log('Fetching current patch...');
      version = await getCurrentPatch();
      log('Patch:', version);

      log('Fetching item codes (all languages)...');
      itemCodes = await getItemCodes(version);
      log('Items loaded:', Object.keys(itemCodes).length, 'items');

      log('Fetching champion codes...');
      const champs = await getChampionCodes(version);
      champCodes = champs.codes;
      champAliases = champs.aliases;
      log('Champions loaded:', Object.keys(champCodes).length, 'champions,', Object.keys(champAliases).length, 'aliases');

      saveCache('version', version);
      saveCache('itemCodes', itemCodes);
      saveCache('championCodes', champCodes);
      saveCache('needToAddSpaces', champAliases);
      log('Data cached to localStorage');
    } catch (err) {
      console.error('LIJE: Failed to initialize', err);
      alert('LIJE: Error loading data. Please reload the page.');
      return;
    }
  }

  // Wait for SPA content on deeplol
  if (document.location.href.includes('deeplol.gg')) {
    log('Waiting for deeplol content to load...');
    await waitForElement('img.imgChamp');
    // Also wait for item build tables to render
    await waitForElement('th');
    // Small extra delay for React to finish rendering table rows
    await new Promise(r => setTimeout(r, 2000));
    log('Deeplol content ready');
  }

  const isDeepLoL = document.location.href.includes('deeplol.gg');

  if (!isDeepLoL) {
    // Mobafire/ProBuilds: scrape once at load
    log('Scraping page...');
    const data = scrape();
    if (!data) { log('No scraper matched this page'); return; }
    log('Scraped:', data.title, '| Champion:', data.champion || data.champCode, '| Items blocks:', data.items.length);
    const itemSet = buildItemSet(data, itemCodes, champCodes, champAliases);
    log('Item set built:', itemSet.title);
    insertExportButton(async () => {
      await navigator.clipboard.writeText(itemSet.toJson());
      log('Copied to clipboard');
      showToast(`Item Set: ${itemSet.title} copied!`);
    });
  } else {
    // DeepLoL: re-scrape on each click (content can change)
    insertExportButton(async () => {
      log('Scraping deeplol page...');
      const data = scrapeFromDeepLoL();
      log('Scraped:', data.title, '| Champion:', data.champion, '| Items blocks:', data.items.length);
      const itemSet = buildItemSet(data, itemCodes, champCodes, champAliases);
      log('Item set built:', itemSet.title);
      await navigator.clipboard.writeText(itemSet.toJson());
      log('Copied to clipboard');
      showToast(`Item Set: ${itemSet.title} copied!`);
    });
  }

  log('Ready');
})();
