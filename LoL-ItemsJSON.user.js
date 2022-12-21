// ==UserScript==
// @name         League Items JSON Exporter
// @description  Export your mobafire builds to League of Legends Item Sets
// @version      1.0
// @author       EagleExe
// @contributer  Passbaan
// @match        https://mobafire.com/league-of-legends/build/*
// @match        https://www.mobafire.com/league-of-legends/build/*
// @match        https://probuilds.net/guide/show/*
// @match        https://www.probuilds.net/guide/show/*
// ==/UserScript==
const Request = function () {
	const self = this;
	self.get = (url) => new Promise((resolve, reject) => {
		try {
			const xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					resolve(this.responseText);
				}
			}
			xmlhttp.open("GET", url, true);
			xmlhttp.send();
		} catch (error) {
			reject(error)
		}
	});
	return self;
}
// Reduce Items to a single object
const reduceItems = (items) => Object.entries(items)
	.reduce((acc, [itemCode, value]) => ({
		...acc,
		[value.name.toLowerCase()]: parseInt(itemCode, 10)
	}), {});
// 
const reduceChampions = (champions) => Object.entries(champions).reduce((acc, [champ, value]) => ({
	...acc,
	[champ.toLowerCase()]: parseInt(value.key, 10)
}), {})
// 
const reduceNonSameChamps = (champions) => Object.entries(champions)
	.filter(([champ, value]) => champ !== value.name)
	.reduce((acc, [champ, value]) => ({
		...acc,
		[value.name.replaceAll(' ', '').replace('\'', '').toLowerCase()]: champ.toLowerCase()
	}), {})
/*  RIOT API WRAPPER  */
const RiotAPI = function () {
	const self = this;
	self.request = new Request();
	// Get current game patch
	self.currentPatch = async () => {
		try {
			const version = await self.request.get('https://ddragon.leagueoflegends.com/api/versions.json');
			return JSON.parse(version)[0];
		} catch (error) {
			console.log('🤷‍♂️ file: LoL-ItemsJSON.user.js:33 🤷‍♂️ error', error)
		}
	}
	const _getLangs = async () => {
		// https://ddragon.leagueoflegends.com/cdn/languages.json
		try {
			const langs = await self.request.get('https://ddragon.leagueoflegends.com/cdn/languages.json');
			return JSON.parse(langs);
		}
		catch (error) {
			console.log('🤷‍♂️ file: LoL-ItemsJSON.user.js:33 🤷‍♂️ error', error)
		}
	}
	// Get resources from riot
	self.getResources = async (version, resource) => {
		if (['item', 'champion'].includes(resource) === false) {
			throw new Error('Invalid resource type. Only "items" and "champions" are allowed');
		}
		try {
			if (resource === 'item') {
				let langs = await _getLangs();
				langs = langs.filter(i => i !== 'id_ID')
				const items = await Promise.all(langs.map(async (lang) => await self.request.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/${lang}/${resource}.json`)));
				return items.reduce((acc, item) => ({ ...acc, ...reduceItems(JSON.parse(item).data) }), []);
			}
			const champsJson = await self.request.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/${resource}.json`);
			const single = reduceChampions(JSON.parse(champsJson).data);
			const other = reduceNonSameChamps(JSON.parse(champsJson).data);
			return [single, other];
		} catch (error) {
			console.log('🤷‍♂️ file: LoL-ItemsJSON.user.js:42 🤷‍♂️ error', error)
		}
	}
}
const createLogger = (showLogs = false) => (message, data = null) => {
	return showLogs && console.log(`%cLIJE :: ${message}`, 'background: #222; color: #bada55', data || '')
}
//  Items JSON Class
const ItemSet = function (data, itemCodes, championCodes, needToAddSpaces) {
	const self = this;
	//  
	const getItemBlocks = () => data.items.map((item) => ({
		title: item.title,
		content: item.content.map((item) => item.trim()),
	})).map((item) => ({
		title: item.title,
		content: item.content.map((item) => `${itemCodes[item]}`),
	})).map((item) => ({
		type: item.title,
		items: item.content.map((it) => ({
			id: it,
			count: 1
		})),
	}));
	// Get the champion code
	const getChampCode = () => championCodes[data.champion] || championCodes[needToAddSpaces[data.champion]]
	// Make Blocks
	const itemBlocks = {
		associatedMaps: [],
		title: data.title + ' - ' + data.author,
		associatedChampions: data.champCode ? [parseInt(data.champCode, 10)] : [getChampCode(data.champion)],
		blocks: getItemBlocks(),
	};
	// Make the final set string
	self.toJson = () => JSON.stringify(itemBlocks, null, 2);
	self.title = itemBlocks.title;
	return self;
}
//  Main Class
const LolItemsJson = function ({ logs = true } = {}) {
	const self = this;
	//  Declaring all the vars here
	const riotAPI = new RiotAPI();
	const _prefix = 'LIJE_';
	const log = createLogger(logs);
	// Get the stored version
	const _parseExistingData = (item) => {
		try {
			return JSON.parse(item);
		} catch (error) {
			return item;
		}
	};
	let _installedVersion = localStorage.getItem(`${_prefix}version`) || null;
	_installedVersion = _parseExistingData(_installedVersion);
	let _itemCodes = localStorage.getItem(`${_prefix}itemCodes`) || null;
	_itemCodes = _parseExistingData(_itemCodes);
	let _championCodes = localStorage.getItem(`${_prefix}championCodes`) || null;
	_championCodes = _parseExistingData(_championCodes);
	let _needToAddSpaces = localStorage.getItem(`${_prefix}needToAddSpaces`) || null;
	_needToAddSpaces = _parseExistingData(_needToAddSpaces);
	// Integrity check
	const _integrityCheck = () => {
		if (_itemCodes === null || _championCodes === null || _needToAddSpaces === null) {
			log('👎 Integrity check failed. 👎')
			return false;
		}
		log('👍 Integrity check passed. 👍')
		return true;
	}
	// Check if the script is already installed
	const _alreadyInstalled = () => {
		if (_installedVersion === null) {
			log('👎 Script is not installed. 👎')
			return false;
		}
		log('👍 Script is already installed. 👍')
		return true;
	}
	//  Init function
	const _init = async () => {
		try {
			_installedVersion = await riotAPI.currentPatch();
			log('👍 Fetching the latest version of the items. 👍')
			_itemCodes = await riotAPI.getResources(_installedVersion, 'item');
			localStorage.setItem(`${_prefix}itemCodes`, JSON.stringify(_itemCodes));
			log('👍 Items Loaded... 👍');
			//	
			log('👍 Fetching the latest version of the champions. 👍')
			const response = await riotAPI.getResources(_installedVersion, 'champion');
			_championCodes = response[0]
			_needToAddSpaces = response[1]
			//
			localStorage.setItem(`${_prefix}championCodes`, JSON.stringify(_championCodes));
			localStorage.setItem(`${_prefix}needToAddSpaces`, JSON.stringify(_needToAddSpaces));
			log('👍 Champs Loaded... 👍');
			// 
		} catch (error) {
			log('➡️ 🤷‍♂️ file: LoL-ItemsJSON.user.js:108 🤷‍♂️ error', error)
			alert('THERE WAS AN ERROR WHILE INITIALIZING THE SCRIPT. PLEASE RELOAD THE PAGE AND TRY AGAIN. IF THE ERROR PERSISTS, PLEASE CONTACT THE DEVELOPER.');
		}
	}
	self.register = async () => {
		if (_alreadyInstalled() === true && _integrityCheck() === true) {
			return;
		}
		await _init();
		localStorage.setItem(`${_prefix}version`, _installedVersion);
	}
	// Scraping the items from MobaFire
	const _scrapeFromMobaFire = () => ({
		title: document.querySelector('.view-guide__banner__title span').innerText.trim(),
		author: document.querySelector(".view-guide__banner__author").querySelector("a").innerHTML + " @ " + document.querySelector(".view-guide__banner__author").querySelector("a").href,
		champion: document.querySelector('.champ-tabs__more').innerText.toLowerCase().replace('more ', '').replace(' guides', '').replaceAll(' ', '').replace('\'', ''),
		items: [...document.querySelectorAll('.view-guide__build__items .view-guide__items')].map(item => {
			const titleClass = '.view-guide__items__bar';
			const contentClass = '.view-guide__items__content';
			const title = item.querySelector(`${titleClass} span`);
			const content = item.querySelectorAll(`${contentClass} span a`);
			return {
				title: title.innerText,
				content: [...content].map(item => item.innerText.toLowerCase())
			};
		})
	});
	// Scraping the items from probuilds
	const _scrapeFromProBuilds = () => ({
		title: 'Probuild build',
		author: document.querySelector('td.summoner.highlighted a').innerText,
		champCode: document.querySelector('td.summoner.highlighted').parentElement.querySelector('.champion-icon .champ-img').dataset.id,
		items: [
			{
				title: document.querySelector('.guide-items div.left:first-of-type h3').innerText,
				content: [...document.querySelectorAll('.guide-items div.left:first-of-type ul li')]
					.map(it => it.querySelector('p').innerText).filter(i => i)
			},
			...[...document.querySelectorAll('.guide-items div.buy-order ul.buy-order li')]
				.reduce((acc, it, index) => {
					const span = it.querySelector('span');
					const content = it.querySelector('img').getAttribute('alt').toLowerCase();
					if (index === 0 || it.classList.contains('first')) {
						return [...acc, {
							title: span.innerText,
							content: [content]
						}];
					}
					const { [acc.length - 1]: last } = acc;
					last.content.push(content);
					acc[acc.length - 1] = last;
					return acc;
				}, [])
		]
	});
	/* @todo */
	// Scraping the items from Champion.GG
	const _scrapeFromChampionGG = () => { }
	// Scraping the items from Lolalytics
	const _scrapeFromLolalytics = () => { }
	// Scraping the items from U.GG
	const _scrapeFromUGG = () => { }
	// Scraping the items from LolBuilder
	const _scrapeFromLolBuilder = () => { }
	// Scraping the items from LolKing
	const _scrapeFromLolKing = () => { }
	// Scraping the items from LolCounter
	const _scrapeFromLolCounter = () => { }
	
	// Copy to clipboard
	const _copyToClipboard = async (title, text) => {
		await navigator.clipboard.writeText(text);
		alert(`Item Set:${title} Copied To Clipboard!`);
	}
	// Make the button
	const _makeButton = () => {
		const location = document.location.href;
		const buttonWrapper = document.createElement('div');
		buttonWrapper.style.display = 'flex';
		buttonWrapper.style.justifyContent = 'center';
		buttonWrapper.style.alignItems = 'center';
		buttonWrapper.style.margin = '10px';
		buttonWrapper.width = "100%"
		const button = document.createElement('button');
		button.innerText = '🚀 Export Build to clipboard 🚀';
		button.style.padding = '10px';
		button.style.borderRadius = '5px';
		button.style.border = 'none';
		button.style.color = 'white';
		button.style.background = '#2b8b32';
		button.style.cursor = 'pointer';
		buttonWrapper.appendChild(button);
		if (location.includes('mobafire.com')) {
			const parent = document.querySelector('.view-guide__build__items .collapse-title').parentElement;
			parent.insertBefore(buttonWrapper, parent.querySelector('.view-guide__build__items .collapseBox'));
		}
		if (location.includes('probuilds.net')) {
			const parent = document.querySelector('.guide-items').parentElement;
			parent.insertBefore(buttonWrapper, parent.querySelector('.guide-items'));
		}
		return button
	}
	const _makeListener = (button, title, text) => {
		button.addEventListener('click', () => _copyToClipboard(title, text));
	}
	// Scraping the items from the current page
	const _scrape = () => {
		const location = document.location.href;
		if (location.includes('mobafire.com')) return _scrapeFromMobaFire();
		if (location.includes('probuilds.net')) return _scrapeFromProBuilds();
		/* @todo */
		if (location.includes('champion.gg')) return _scrapeFromChampionGG();
		if (location.includes('lolalytics.com')) return _scrapeFromLolalytics();
		if (location.includes('u.gg')) return _scrapeFromUGG();
		if (location.includes('lolbuilder.net')) return _scrapeFromLolBuilder();
		if (location.includes('lolking.net')) return _scrapeFromLolKing();
		if (location.includes('lolcounter.com')) return _scrapeFromLolCounter();
		return null;
	}
	self.compile = async () => {
		let example = _scrape();
		// mobafire.com
		const itemSet = new ItemSet(example, _itemCodes, _championCodes, _needToAddSpaces);
		const json = itemSet.toJson();
		const btn = await _makeButton();
		_makeListener(btn, itemSet.title, json);
		return itemSet.toJson();
	}
	// Actual Logic	
	return self;
};
// Load the script
(
	async function () {
		const lolItemsJson = new LolItemsJson();
		await lolItemsJson.register();
		await lolItemsJson.compile();
	}
)();
