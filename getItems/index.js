var request = require('request')
const fs = require('fs')

const writeFile = async (file, data) => {
    return new Promise(resolve => {
        fs.writeFile(file, data, function (err) {
            if (err) {
                return console.log(err);
            } else {
                resolve(true);
            }
        });
    })
}

const util = require('util')
let VERSION = '10.25.1';

const post = (url) => new Promise((resolve, reject) => {
    request(url, function (err, data) {
        if (err) {
            reject(err)
        } else {
            resolve(data)
        }
    });
});

// Step 1 => Get all the versions from https://ddragon.leagueoflegends.com/api/versions.json
(async function () {
    const data = {
        compiledEnglishItems: null
    };
    let upperScript = '';
    const { body: versions } = await post('https://ddragon.leagueoflegends.com/api/versions.json');
    VERSION = JSON.parse(versions)[0];
    console.log("Latest Version => ", VERSION);
    // Step 2: Get English Items from https://ddragon.leagueoflegends.com/cdn/x/data/en_US/item.json
    const { body: englishItems } = await post(`https://ddragon.leagueoflegends.com/cdn/${VERSION}/data/en_US/item.json`);
    const englishJson = JSON.parse(englishItems).data;
    let totalItems = {};
    Object.entries(englishJson).forEach(([itemCode, value]) => (totalItems[value.name] = parseInt(itemCode, 10)));
    // Step 3 : Get Spanish Items https://ddragon.leagueoflegends.com/cdn/x/data/es_ES/item.json 
    const { body: spanishItems } = await post(`https://ddragon.leagueoflegends.com/cdn/${VERSION}/data/es_ES/item.json`);
    const spanishJson = JSON.parse(spanishItems).data;
    Object.entries(spanishJson).forEach(([itemCode, value]) => (totalItems[value.name] = parseInt(itemCode, 10)));
    // WRITE ALL THE ITEMS TO FILE
    upperScript += `\ndocument.ItemCodes = ${JSON.stringify(totalItems)};`;
    // Get champions from https://ddragon.leagueoflegends.com/cdn/${VERSION}/data/en_US/champion.json
    const { body: engChamps } = await post(`https://ddragon.leagueoflegends.com/cdn/${VERSION}/data/en_US/champion.json`);
    const engChampJSON = JSON.parse(engChamps).data;
    const champs = {};
    const champDisplayNames = {};
    Object.entries(engChampJSON).forEach(([champ, value]) => (champs[champ] = parseInt(value.key, 10)));
    // await writeFile(`data/champs-${VERSION}.json`, JSON.stringify(champs))
    upperScript += `\ndocument.ChampionCodes = ${JSON.stringify(champs)};`;
    Object.entries(engChampJSON).forEach(([champ, value]) => { if (champ !== value.name) champDisplayNames[champ] = value.name });
    upperScript += `\ndocument.NeedToAddSpaces = ${JSON.stringify(champDisplayNames)};\n`;

    await writeFile(`data/vars-${VERSION}.js`, upperScript);
    console.log('success');
})();
