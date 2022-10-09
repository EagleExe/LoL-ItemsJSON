// ==UserScript==
// @name        LoL-ItemsJSON
// @version     11.15.1
// @author      EagleExe
// @include     https://mobafire.com/league-of-legends/build/*
// @include     https://www.mobafire.com/league-of-legends/build/*
// @include     https://probuilds.net/guide/show/*
// @include     https://www.probuilds.net/guide/show/*
// ==/UserScript==

//Fixed 29th Sep 2022 by aougri

String.prototype.has = function (findWhat) {
  return this.indexOf(findWhat) != -1;
};
String.prototype.trim = function () {
  return this.replace(/^\s+|\s+$/g, "");
};
String.prototype.replaceQuotes = function () {
  return this.replace(/"/g, '\\"');
};
String.prototype.removeTags = function () {
  return this.replace(/<[\D\d]*>/g, "");
};
String.prototype.removeSpaces = function () {
  return this.replace(/\s/g, "");
};
String.prototype.removeApostrophe = function () {
  return this.replace(/'/g, "");
};
String.prototype.removeParenthesis = function () {
  return this.replace(/\([^)]*\)/gi, "");
};
document.ItemCodes = {
  Boots: 1001,
  "Faerie Charm": 1004,
  "Rejuvenation Bead": 1006,
  "Giant's Belt": 1011,
  "Cloak of Agility": 1018,
  "Blasting Wand": 1026,
  "Sapphire Crystal": 1027,
  "Ruby Crystal": 1028,
  "Cloth Armor": 1029,
  "Chain Vest": 1031,
  "Null-Magic Mantle": 1033,
  Emberknife: 1035,
  "Long Sword": 1036,
  Pickaxe: 1037,
  "B. F. Sword": 1038,
  Hailblade: 1039,
  "Obsidian Edge": 1040,
  Dagger: 1042,
  "Recurve Bow": 1043,
  "Amplifying Tome": 1052,
  "Vampiric Scepter": 1053,
  "Doran's Shield": 1054,
  "Doran's Blade": 1055,
  "Doran's Ring": 1056,
  "Negatron Cloak": 1057,
  "Needlessly Large Rod": 1058,
  "Dark Seal": 1082,
  Cull: 1083,
  "Penetrating Bullets": 1500,
  Fortification: 1501,
  "Reinforced Armor": 1502,
  "Warden's Eye": 1503,
  Vanguard: 1504,
  "Lightning Rod": 1505,
  "Reinforced Armor": 1506,
  Overcharged: 1507,
  "Anti-tower Socks": 1508,
  Gusto: 1509,
  "Phreakish Gusto": 1510,
  "Super Mech Armor": 1511,
  "Super Mech Power Field": 1512,
  "Turret Plating": 1515,
  "Structure Bounty": 1516,
  "Structure Bounty": 1517,
  "Structure Bounty": 1518,
  "Structure Bounty": 1519,
  "Health Potion": 2003,
  "Total Biscuit of Everlasting Will": 2010,
  "Kircheis Shard": 2015,
  "Refillable Potion": 2031,
  "Corrupting Potion": 2033,
  "Guardian's Horn": 2051,
  "Poro-Snax": 2052,
  "Control Ward": 2055,
  "Shurelya's Battlesong": 2065,
  "Elixir of Iron": 2138,
  "Elixir of Sorcery": 2139,
  "Elixir of Wrath": 2140,
  "Minion Dematerializer": 2403,
  "Commencing Stopwatch": 2419,
  Stopwatch: 2420,
  "Broken Stopwatch": 2421,
  "Slightly Magical Footwear": 2422,
  "Perfectly Timed Stopwatch": 2423,
  "Broken Stopwatch": 2424,
  Evenshroud: 3001,
  "Archangel's Staff": 3003,
  Manamune: 3004,
  "Berserker's Greaves": 3006,
  "Boots of Swiftness": 3009,
  "Chemtech Putrifier": 3011,
  "Sorcerer's Shoes": 3020,
  "Glacial Buckler": 3024,
  "Guardian Angel": 3026,
  "Infinity Edge": 3031,
  "Mortal Reminder": 3033,
  "Last Whisper": 3035,
  "Lord Dominik's Regards": 3036,
  "Seraph's Embrace": 3040,
  "Mejai's Soulstealer": 3041,
  Muramana: 3042,
  Phage: 3044,
  "Phantom Dancer": 3046,
  "Plated Steelcaps": 3047,
  "Zeke's Convergence": 3050,
  "Hearthbound Axe": 3051,
  "Sterak's Gage": 3053,
  Sheen: 3057,
  "Spirit Visage": 3065,
  "Winged Moonplate": 3066,
  Kindlegem: 3067,
  "Sunfire Aegis": 3068,
  "Tear of the Goddess": 3070,
  "Black Cleaver": 3071,
  Bloodthirster: 3072,
  "Ravenous Hydra": 3074,
  Thornmail: 3075,
  "Bramble Vest": 3076,
  Tiamat: 3077,
  "Trinity Force": 3078,
  "Warden's Mail": 3082,
  "Warmog's Armor": 3083,
  "Runaan's Hurricane": 3085,
  Zeal: 3086,
  "Rabadon's Deathcap": 3089,
  "Wit's End": 3091,
  "Rapid Firecannon": 3094,
  Stormrazor: 3095,
  "Lich Bane": 3100,
  "Banshee's Veil": 3102,
  "Aegis of the Legion": 3105,
  Redemption: 3107,
  "Fiendish Codex": 3108,
  "Knight's Vow": 3109,
  "Frozen Heart": 3110,
  "Mercury's Treads": 3111,
  "Guardian's Orb": 3112,
  "Aether Wisp": 3113,
  "Forbidden Idol": 3114,
  "Nashor's Tooth": 3115,
  "Rylai's Crystal Scepter": 3116,
  "Mobility Boots": 3117,
  "Winter's Approach": 3119,
  Fimbulwinter: 3121,
  "Executioner's Calling": 3123,
  "Guinsoo's Rageblade": 3124,
  "Caulfield's Warhammer": 3133,
  "Serrated Dirk": 3134,
  "Void Staff": 3135,
  "Mercurial Scimitar": 3139,
  "Quicksilver Sash": 3140,
  "Youmuu's Ghostblade": 3142,
  "Randuin's Omen": 3143,
  "Hextech Alternator": 3145,
  "Hextech Rocketbelt": 3152,
  "Blade of The Ruined King": 3153,
  Hexdrinker: 3155,
  "Maw of Malmortius": 3156,
  "Zhonya's Hourglass": 3157,
  "Ionian Boots of Lucidity": 3158,
  Morellonomicon: 3165,
  "Guardian's Blade": 3177,
  "Umbral Glaive": 3179,
  Hullbreaker: 3181,
  "Guardian's Hammer": 3184,
  "Locket of the Iron Solari": 3190,
  "Seeker's Armguard": 3191,
  "Gargoyle Stoneplate": 3193,
  "Spectre's Cowl": 3211,
  "Mikael's Blessing": 3222,
  "Scarecrow Effigy": 3330,
  "Stealth Ward": 3340,
  "Farsight Alteration": 3363,
  "Oracle Lens": 3364,
  "Your Cut": 3400,
  "Ardent Censer": 3504,
  "Essence Reaver": 3508,
  "Eye of the Herald": 3513,
  "Kalista's Black Spear": 3599,
  "Kalista's Black Spear": 3600,
  "Dead Man's Plate": 3742,
  "Titanic Hydra": 3748,
  "Crystalline Bracer": 3801,
  "Lost Chapter": 3802,
  "Edge of Night": 3814,
  "Spellthief's Edge": 3850,
  Frostfang: 3851,
  "Shard of True Ice": 3853,
  "Steel Shoulderguards": 3854,
  "Runesteel Spaulders": 3855,
  "Pauldrons of Whiterock": 3857,
  "Relic Shield": 3858,
  "Targon's Buckler": 3859,
  "Bulwark of the Mountain": 3860,
  "Spectral Sickle": 3862,
  "Harrowing Crescent": 3863,
  "Black Mist Scythe": 3864,
  "<rarityLegendary>Fire at Will</rarityLegendary><br><subtitleLeft><silver>500 Silver Serpents</silver></subtitleLeft>": 3901,
  "<rarityLegendary>Death's Daughter</rarityLegendary><br><subtitleLeft><silver>500 Silver Serpents</silver></subtitleLeft>": 3902,
  "<rarityLegendary>Raise Morale</rarityLegendary><br><subtitleLeft><silver>500 Silver Serpents</silver></subtitleLeft>": 3903,
  "Oblivion Orb": 3916,
  "Imperial Mandate": 4005,
  "Force of Nature": 4401,
  "The Golden Spatula": 4403,
  "Horizon Focus": 4628,
  "Cosmic Drive": 4629,
  "Blighting Jewel": 4630,
  "Verdant Barrier": 4632,
  Riftmaker: 4633,
  "Leeching Leer": 4635,
  "Night Harvester": 4636,
  "Demonic Embrace": 4637,
  "Watchful Wardstone": 4638,
  "Stirring Wardstone": 4641,
  "Bandleglass Mirror": 4642,
  "Vigilant Wardstone": 4643,
  "Crown of the Shattered Queen": 4644,
  Shadowflame: 4645,
  "Ironspike Whip": 6029,
  "Silvermere Dawn": 6035,
  "Death's Dance": 6333,
  "Chempunk Chainsword": 6609,
  "Staff of Flowing Water": 6616,
  "Moonstone Renewer": 6617,
  Goredrinker: 6630,
  Stridebreaker: 6631,
  "Divine Sunderer": 6632,
  "Liandry's Anguish": 6653,
  "Luden's Tempest": 6655,
  Everfrost: 6656,
  "Bami's Cinder": 6660,
  "Frostfire Gauntlet": 6662,
  "Turbo Chemtank": 6664,
  Noonquiver: 6670,
  Galeforce: 6671,
  "Kraken Slayer": 6672,
  "Immortal Shieldbow": 6673,
  "Navori Quickblades": 6675,
  "The Collector": 6676,
  Rageknife: 6677,
  "Duskblade of Draktharr": 6691,
  Eclipse: 6692,
  "Prowler's Claw": 6693,
  "Serylda's Grudge": 6694,
  "Serpent's Fang": 6695,
  "Axiom Arc": 6696,
  "Sandshrike's Claw": 7000,
  Syzygy: 7001,
  "Draktharr's Shadowcarver": 7002,
  "Turbocharged Hexperiment": 7003,
  "Forgefire Crest": 7004,
  "Rimeforged Grasp": 7005,
  Typhoon: 7006,
  "Wyrmfallen Sacrifice": 7007,
  Bloodward: 7008,
  "Icathia's Curse": 7009,
  Vespertide: 7010,
  "Upgraded Aeropack": 7011,
  "Liandry's Lament": 7012,
  "Eye of Luden": 7013,
  "Eternal Winter": 7014,
  "Ceaseless Hunger": 7015,
  Dreamshatter: 7016,
  Deicide: 7017,
  "Infinity Force": 7018,
  "Reliquary of the Golden Dawn": 7019,
  "Shurelya's Requiem": 7020,
  Starcaster: 7021,
  "Seat of Command": 7022,
  Equinox: 7023,
  Caesura: 7024,
  "Gangplank Placeholder": 7050,
  "Anathema's Chains": 8001,
  "Abyssal Mask": 8020,
};
document.ChampionCodes = {
  Aatrox: 266,
  Ahri: 103,
  Akali: 84,
  Akshan: 166,
  Alistar: 12,
  Amumu: 32,
  Anivia: 34,
  Annie: 1,
  Aphelios: 523,
  Ashe: 22,
  "Aurelion Sol": 136,
  Azir: 268,
  Bard: 432,
  "Bel'Veth": 200,
  Blitzcrank: 53,
  Brand: 63,
  Braum: 201,
  Caitlyn: 51,
  Camille: 164,
  Cassiopeia: 69,
  "Cho'Gath": 31,
  Corki: 42,
  Darius: 122,
  Diana: 131,
  Draven: 119,
  "Dr. Mundo": 36,
  Ekko: 245,
  Elise: 60,
  Evelynn: 28,
  Ezreal: 81,
  Fiddlesticks: 9,
  Fiora: 114,
  Fizz: 105,
  Galio: 3,
  Gangplank: 41,
  Garen: 86,
  Gnar: 150,
  Gragas: 79,
  Graves: 104,
  Gwen: 887,
  Hecarim: 120,
  Heimerdinger: 74,
  Illaoi: 420,
  Irelia: 39,
  Ivern: 427,
  Janna: 40,
  "Jarvan IV": 59,
  Jax: 24,
  Jayce: 126,
  Jhin: 202,
  Jinx: 222,
  "Kai'Sa": 145,
  Kalista: 429,
  Karma: 43,
  Karthus: 30,
  Kassadin: 38,
  Katarina: 55,
  Kayle: 10,
  Kayn: 141,
  Kennen: 85,
  "Kha'Zix": 121,
  Kindred: 203,
  Kled: 240,
  "Kog'Maw": 96,
  LeBlanc: 7,
  "Lee Sin": 64,
  Leona: 89,
  Lillia: 876,
  Lissandra: 127,
  Lucian: 236,
  Lulu: 117,
  Lux: 99,
  Malphite: 54,
  Malzahar: 90,
  Maokai: 57,
  "Master Yi": 11,
  "Miss Fortune": 21,
  Wukong: 62,
  Mordekaiser: 82,
  Morgana: 25,
  Nami: 267,
  Nasus: 75,
  Nautilus: 111,
  Neeko: 518,
  Nidalee: 76,
  Nilah: 895,
  Nocturne: 56,
  "Nunu & Willump": 20,
  Olaf: 2,
  Orianna: 61,
  Ornn: 516,
  Pantheon: 80,
  Poppy: 78,
  Pyke: 555,
  Qiyana: 246,
  Quinn: 133,
  Rakan: 497,
  Rammus: 33,
  "Rek'Sai": 421,
  Rell: 526,
  "Renata Glasc": 888,
  Renekton: 58,
  Rengar: 107,
  Riven: 92,
  Rumble: 68,
  Ryze: 13,
  Samira: 360,
  Sejuani: 113,
  Senna: 235,
  Seraphine: 147,
  Sett: 875,
  Shaco: 35,
  Shen: 98,
  Shyvana: 102,
  Singed: 27,
  Sion: 14,
  Sivir: 15,
  Skarner: 72,
  Sona: 37,
  Soraka: 16,
  Swain: 50,
  Sylas: 517,
  Syndra: 134,
  "Tahm Kench": 223,
  Taliyah: 163,
  Talon: 91,
  Taric: 44,
  Teemo: 17,
  Thresh: 412,
  Tristana: 18,
  Trundle: 48,
  Tryndamere: 23,
  "Twisted Fate": 4,
  Twitch: 29,
  Udyr: 77,
  Urgot: 6,
  Varus: 110,
  Vayne: 67,
  Veigar: 45,
  "Vel'Koz": 161,
  Vex: 711,
  Vi: 254,
  Viego: 234,
  Viktor: 112,
  Vladimir: 8,
  Volibear: 106,
  Warwick: 19,
  Xayah: 498,
  Xerath: 101,
  "Xin Zhao": 5,
  Yasuo: 157,
  Yone: 777,
  Yorick: 83,
  Yuumi: 350,
  Zac: 154,
  Zed: 238,
  Zeri: 221,
  Ziggs: 115,
  Zilean: 26,
  Zoe: 142,
  Zyra: 143,
};
document.NeedToAddSpaces = {
  AurelionSol: "Aurelion Sol",
  DrMundo: "Dr. Mundo",
  JarvanIV: "Jarvan IV",
  KogMaw: "Kog'Maw",
  LeeSin: "Lee Sin",
  MasterYi: "Master Yi",
  MissFortune: "Miss Fortune",
  MonkeyKing: "Monkey King",
  RekSai: "Rek'Sai",
  TahmKench: "Tahm Kench",
  XinZhao: "Xin Zhao",
};

// If the item name has " (Trinket)" or anything in parenthesis, make a duplicate entry that has the parenthesis removed
for (let k in document.ItemCodes)
  if (k.has("("))
    document.ItemCodes[k.removeParenthesis()] = document.ItemCodes[k];

document.GatherTheData = () => {
  let URL = (document.location.href.ChampionCodes = {
    Aatrox: 266,
    Ahri: 103,
    Akali: 84,
    Akshan: 166,
    Alistar: 12,
    Amumu: 32,
    Anivia: 34,
    Annie: 1,
    Aphelios: 523,
    Ashe: 22,
    "Aurelion Sol": 136,
    Azir: 268,
    Bard: 432,
    "Bel'Veth": 200,
    Blitzcrank: 53,
    Brand: 63,
    Braum: 201,
    Caitlyn: 51,
    Camille: 164,
    Cassiopeia: 69,
    "Cho'Gath": 31,
    Corki: 42,
    Darius: 122,
    Diana: 131,
    Draven: 119,
    "Dr. Mundo": 36,
    Ekko: 245,
    Elise: 60,
    Evelynn: 28,
    Ezreal: 81,
    Fiddlesticks: 9,
    Fiora: 114,
    Fizz: 105,
    Galio: 3,
    Gangplank: 41,
    Garen: 86,
    Gnar: 150,
    Gragas: 79,
    Graves: 104,
    Gwen: 887,
    Hecarim: 120,
    Heimerdinger: 74,
    Illaoi: 420,
    Irelia: 39,
    Ivern: 427,
    Janna: 40,
    "Jarvan IV": 59,
    Jax: 24,
    Jayce: 126,
    Jhin: 202,
    Jinx: 222,
    "Kai'Sa": 145,
    Kalista: 429,
    Karma: 43,
    Karthus: 30,
    Kassadin: 38,
    Katarina: 55,
    Kayle: 10,
    Kayn: 141,
    Kennen: 85,
    "Kha'Zix": 121,
    Kindred: 203,
    Kled: 240,
    "Kog'Maw": 96,
    LeBlanc: 7,
    "Lee Sin": 64,
    Leona: 89,
    Lillia: 876,
    Lissandra: 127,
    Lucian: 236,
    Lulu: 117,
    Lux: 99,
    Malphite: 54,
    Malzahar: 90,
    Maokai: 57,
    "Master Yi": 11,
    "Miss Fortune": 21,
    Wukong: 62,
    Mordekaiser: 82,
    Morgana: 25,
    Nami: 267,
    Nasus: 75,
    Nautilus: 111,
    Neeko: 518,
    Nidalee: 76,
    Nilah: 895,
    Nocturne: 56,
    "Nunu & Willump": 20,
    Olaf: 2,
    Orianna: 61,
    Ornn: 516,
    Pantheon: 80,
    Poppy: 78,
    Pyke: 555,
    Qiyana: 246,
    Quinn: 133,
    Rakan: 497,
    Rammus: 33,
    "Rek'Sai": 421,
    Rell: 526,
    "Renata Glasc": 888,
    Renekton: 58,
    Rengar: 107,
    Riven: 92,
    Rumble: 68,
    Ryze: 13,
    Samira: 360,
    Sejuani: 113,
    Senna: 235,
    Seraphine: 147,
    Sett: 875,
    Shaco: 35,
    Shen: 98,
    Shyvana: 102,
    Singed: 27,
    Sion: 14,
    Sivir: 15,
    Skarner: 72,
    Sona: 37,
    Soraka: 16,
    Swain: 50,
    Sylas: 517,
    Syndra: 134,
    "Tahm Kench": 223,
    Taliyah: 163,
    Talon: 91,
    Taric: 44,
    Teemo: 17,
    Thresh: 412,
    Tristana: 18,
    Trundle: 48,
    Tryndamere: 23,
    "Twisted Fate": 4,
    Twitch: 29,
    Udyr: 77,
    Urgot: 6,
    Varus: 110,
    Vayne: 67,
    Veigar: 45,
    "Vel'Koz": 161,
    Vex: 711,
    Vi: 254,
    Viego: 234,
    Viktor: 112,
    Vladimir: 8,
    Volibear: 106,
    Warwick: 19,
    Xayah: 498,
    Xerath: 101,
    "Xin Zhao": 5,
    Yasuo: 157,
    Yone: 777,
    Yorick: 83,
    Yuumi: 350,
    Zac: 154,
    Zed: 238,
    Zeri: 221,
    Ziggs: 115,
    Zilean: 26,
    Zoe: 142,
    Zyra: 143,
  });
  let Author, ChampionName, Title, ChampionCode;
  if (window.location.href.indexOf("mobafire.com") != -1) {
    let mobile_sr = document.querySelector("span[class$='mobile-sr']");
    Author =
      mobile_sr.querySelector("a").innerHTML +
      " @ " +
      mobile_sr.querySelector("a").href;
    ChampionName = mobile_sr.innerHTML.split("\n")[1];

    Title = document
      .querySelector("#content > div > div.mf-responsive__wrap.mf-redesign.view-guide > div.mf-responsive__topCol > div > div.view-guide__banner > div.view-guide__banner__slash > h1")
      .children[1].innerHTML.trim();
    ChampionCode =
      document.ChampionCodes[ChampionName.removeSpaces().removeApostrophe()];
  } else if (window.location.href.indexOf("probuilds.net")) {
    let Highlighted = document.querySelector(
      "td[class$='summoner highlighted']"
    );
    Author = Highlighted.children[0].innerHTML;
    ChampionName =
      Highlighted.parentElement.children[0].children[0].children[0].attributes[
        "data-id"
      ].value;
    if (document.NeedToAddSpaces[ChampionName])
      ChampionName = document.NeedToAddSpaces[ChampionName];
    Title = ChampionName + " &lt;" + Author + "&gt;";
    ChampionCode = document.ChampionCodes[ChampionName];
  }

  let Output =
    '{\n\t"title": "' +
    Title.replaceQuotes() +
    '",\n\t"associatedMaps": [],\n\t"associatedChampions": [' +
    ChampionCode +
    '],\n\t"_notes": "' +
    URL +
    '",\n\t"_author": "' +
    Author +
    '",\n\t"blocks": [';
  let GroupName = "",
    ItemCode,
    i,
    j;

  if (window.location.href.indexOf("mobafire.com")) {
    String.prototype.removeUnwantedCharacters = function () {
      return this.replace(/ - [\D]{1,}/gm, "");
    }; // The end of the names of some of Mabafire's items include " - Warrier", " - Runic Echoes", " - Cinderhunk", " - Bloodrazer" and these don't match the names in the https://ddragon.leagueoflegends.com/cdn/10.18.1/data/en_US/item.json
    let Divs = document.querySelectorAll("div.view-guide__items");
    let ItemSpans;
    for (i = 0; i < Divs.length; i++) {
      GroupName = Divs[i].children[0].children[0].innerHTML;
      Output += '\n\t\t{\n\t\t\t"type": "' + GroupName + '",\n\t\t\t"items": [';
      ItemSpans = Divs[i].children[1].children;

      for (j = 0; j < ItemSpans.length; j++) {
        ItemCode =
          document.ItemCodes[
            ItemSpans[j]
              .querySelector("span")
              .innerHTML.removeUnwantedCharacters()
          ];
        Output += '\n\t\t\t\t{ "id": "' + ItemCode + '", "count": 1 }';
        if (j != ItemSpans.length - 1) Output += ",";
      }
      Output += "\n\t\t\t]\n\t\t}";
      if (i < Divs.length - 1) Output += ",";
    }
  } else if (window.location.href.indexOf("probuilds.net")) {
    let LIs = document.querySelector("ul.buy-order").children;
    let time,
      buys = [];

    for (i = 0; i < LIs.length; i++) {
      time = LIs[i].children[1].innerHTML.trim();
      if (time.length > 9) {
        time = LIs[i].children[2].innerHTML.trim();
        GroupName = "Sold @ " + time;
      }
      buys.push({
        ItemCode: LIs[i].children[0].attributes["data-id"].value,
        Time: time,
      });

      if (
        i == LIs.length - 1 ||
        GroupName.has("Sold") ||
        LIs[i + 1].className.has("first")
      ) {
        if (!GroupName)
          for (j = 0; j < buys.length; j++) {
            if (j == 0) GroupName = buys[j].Time;
            else if (j == buys.length - 1) GroupName += " ~ " + buys[j].Time;
          }
        Output +=
          '\n\t\t{\n\t\t\t"type": "' + GroupName + '",\n\t\t\t"items": [';
        for (j = 0; j < buys.length; j++) {
          Output +=
            '\n\t\t\t\t{ "id": "' + buys[j].ItemCode + '", "count": 1 }';
          if (j != buys.length - 1) Output += ",";
        }
        Output += "\n\t\t\t]\n\t\t}";
        if (i < LIs.length - 1) Output += ",";
        GroupName = "";
        buys = [];
      }
    }
  }
  Output += "\n\t]\n}";
  console.log("============ gathered the data ============");
  return Output;
};


let TheTextarea = document.createElement("textarea");
TheTextarea.style =
  "position:fixed; top:82px; right:7px; z-index:999999; border:2px dashed navy; width:280px; height:420px; background:gainsboro; color:black; font-size:7px; font-family:'Open Sans Mobafire','Open Sans',sans-serif,sans-serif; overflow-x:hidden; visibility:hidden";
TheTextarea.id = "TheTextarea";
TheTextarea.value = document.GatherTheData();
TheTextarea.onmouseover = function () {
  document.getElementById("TheTextarea").select();
};
document.body.appendChild(TheTextarea);

let Button = document.createElement("button");
Button.style =
  "position:fixed; top:50px; right:7px; z-index:999999; border:0px; background:darkblue; color:#bbcbe8; padding:5px 9px; font-family:'Helvetica','Open Sans',sans-serif,sans-serif";
Button.innerHTML = "Items JSON";
Button.onmouseover = function () {
  document.getElementById("TheTextarea").value = document.GatherTheData();
  document.getElementById("TheTextarea").style.visibility = "visible";
};
Button.onclick = function () {
  document.getElementById("TheTextarea").style.visibility =
    document.getElementById("TheTextarea").style.visibility == "hidden"
      ? "visible"
      : "hidden";
};
document.body.appendChild(Button);


/* THE FOLLOWING IS A REFERENCE FOR HOW I GATHERED THE ITEM AND CHAMPION DATA
 * THE LATEST VERSION OF THE .json FILE NAMES CAN BE FOUND BY GOING HERE https://ddragon.leagueoflegends.com/api/versions.json
TheTextArea
// https://ddragon.leagueoflegends.com/cdn/11.15.1/data/en_US/item.json
// https://ddragon.leagueoflegends.com/cdn/11.15.1/data/es_ES/item.json
INPUT = JSON.parse(this.JSONView.json.data).data;
OUTPUT = "document.ItemCodes = {";
for(code in INPUT)
	OUTPUT += '"' + INPUT[code].name + '":' + code + ",";
console.log( OUTPUT.slice(0,-1) + "};" );

// https://ddragon.leagueoflegends.com/cdn/11.15.1/data/en_US/champion.json
// https://ddragon.leagueoflegends.com/cdn/11.15.1/data/es_ES/champion.json
INPUT = JSON.parse(this.JSONView.json.data).data;
OUTPUT = "document.ChampionCodes = {";
for(name in INPUT)
	OUTPUT += '"' + name + '":' + INPUT[name].key + ",";
console.log( OUTPUT.slice(0,-1) + "};" );

*/
