# WHY THIS IS

I'm new to League of Legends, and I have no idea why these sites with guides don't already have this function. My buddy was teaching me how to manually enter item sets from a Mobafire guide, and I was like **WTH why isn't there an export feature?** The game can import JSON files. This short snippet of Javascript shrinks a 10-minute task down to 10 seconds. Maybe if I get requests I'll update the script to work on other sites too.



# WHAT IT DO

When you're on a Mobafire guide page (for example https://www.mobafire.com/league-of-legends/build/vapora-dark-in-depth-adc-tristana-guide-season-10-447328) this Tampermonkey/Greasemonkey script (aka user script) creates a blue floating button that says "Items JSON" in the upper-right that when you mouseover will display a JSON block that contains the codes for the item sets so that you can copy and paste them into the game.

<img src="images\image-20200807232917193.png" alt="image-20200807232917193" style="zoom:50%;" />



# HOW TO DO IT

There are two ways to use it:

- You can paste the code into your browser's console (press either F12 or CTRL+SHIFT+I to open the console) and press enter. The blue button will appear in the upper right of the page.
- Or you can make the script execute automatically every time you navigate to a page that has https://www.mobafire.com/league-of-legends/build/ in the URL. To do this you'll need to be using **Firefox** or Chrome (haven't tested yet), and you'll need a user script <u>extension</u> such as **Tampermonkey** or Greasemonkey (haven't tested yet).

To add the script to Tampermonkey click on the black Tampermonkey icon and then click <u>Create a new script...</u>

<img src="images\image-20200807194711068.png" alt="image-20200807194711068" style="zoom:50%;" />

Then delete the code that shows up by default and replace it with my script.

<img src="images\image-20200808015435179.png" alt="image-20200808015435179" style="zoom: 50%;" />

Then click  <u>File</u> > <u>Save</u> or hit CTRL+S.
Close the Tampermonkey tab and then navigate to the Mobafire page that has the item sets, and you'll see the *Items JSON* button appear automatically.



# HOW TO IMPORT IN LoL

<img src="images\image-20200807230049601.png" alt="image-20200807230049601" style="zoom:50%;" />

<img src="images\image-20200807230117721.png" alt="image-20200807230117721" style="zoom:50%;" />

<img src="images\image-20200807230202282.png" alt="image-20200807230202282" style="zoom:50%;" />

<img src="images\image-20200807230240350.png" alt="image-20200807230240350" style="zoom:50%;" />



# HOW TO UPDATE STUFF

**None of these instructions are necessary for you to do unless my user script stops working**. 

If there are updates to the game that add more items and champions, the user script may need to be updated to include the new corresponding codes. In other words, the following two lines of the code will need to be replaced.

`document.ItemCodes = {"Boots of Speed":1001,"Faerie Charm":1004,"Rejuvenation Bead":1006,"Giant's Belt":1011,"Cloak of Agility":1018,"Blasting Wand":1026,"Sapphire Crystal":1027,"Ruby Crystal":1028,"Cloth Armor":1029,"Chain Vest":1031,"Null-Magic Mantle":1033 …`

and

`document.ChampionCodes = {"Aatrox":266,"Ahri":103,"Akali":84,"Alistar":12,"Amumu":32,"Anivia":34,"Annie":1,"Aphelios":523,"Ashe":22,"AurelionSol":136,"Azir":268,"Bard":432,"Blitzcrank":53,"Brand":63,"Braum":201,"Caitlyn":51,"Camille":164,"Cassiopeia":69,"Chogath":31,"Corki":42,"Darius":122,"Diana":131,"Draven": …`

*Note if Mobafire changes the design of their site then the various <u>querySelector / querySelectorAll / getElementById</u> commands in the user script may need to be modified, but a tutorial for how to do that would be much too long for me to make right now.*

I found the complete list of item codes inside the following file,<br>
https://ddragon.leagueoflegends.com/cdn/12.18.1/data/en_US/item.json<br>
and I found the complete list of champion codes in the following file.<br>
https://ddragon.leagueoflegends.com/cdn/12.18.1/data/en_US/champion.json<br>

*I'm new here so I don't know who ddragon is or if this is the official source for the latest updates for developers. These are just the only sources that I was able to find after a short while of poking around on the interwebs. The current version of LoL is 10.16, but I don't think there were any new items or champions in this update, so these version 12.18.1 files should work.*

These JSON files have a bunch of data that we don't need, so I made scripts to convert the data into a slimmed-down array that's more straightforward to implement.

Point Firefox to the *items.json* file (*there will be a new URL for a newer version of LoL that you will have to find*) and open the console by pressing CTRL+SHIFT+I or F12. Paste the following commands.

<pre>INPUT = JSON.parse(this.JSONView.json.data).data;
String.prototype.removeTrinket=function(){return this.replace(/ \([\D\d]*\)/gi,"")}
OUTPUT = "document.ItemCodes = {";
for(code in INPUT)
    OUTPUT += '"' + INPUT[code].name.removeTrinket() + '":' + code + ",";
console.log( OUTPUT.slice(0,-1) + "};" );</pre>

<img src="images\image-20200808012956246.png" alt="image-20200808012956246" style="zoom: 50%;" />

Press enter and Firefox will spit out the data that we are looking for.

<img src="images\image-20200808013126193.png" alt="image-20200808013126193" style="zoom:50%;" />

This block of black text is the new code that we need to paste into the user script, so all of this text starts with `document.ItemCodes = {`down the `};` at the end--- copy it and paste it into the user script replacing the old data. 

#### Now lets extract the data from champions.json >>>>>>>

Then point Firefox to the new *champion.json* file. Open the console. Paste the following code and press enter.

<pre>INPUT = JSON.parse(this.JSONView.json.data).data;
OUTPUT = "document.ChampionCodes = {";
for(name in INPUT)
    OUTPUT += '"' + name + '":' + INPUT[name].key + ",";
console.log( OUTPUT.slice(0,-1) + "};" );</pre>


Copy the output.

<img src="images\image-20200808013535429.png" style="zoom:50%;" />

Paste it into the user script and save the user script and you're done.

<img src="images\image-20200808014336706.png" alt="image-20200808014336706" style="zoom:50%;" />

SAVE TO CACHER

>_ *aougri*
