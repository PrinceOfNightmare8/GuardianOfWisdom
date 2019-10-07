const Discord = require("discord.js");
const fetch = require('node-fetch');
const fs = require('fs')
const client = new Discord.Client();
const prefix = "<@628302057572663296>";
const baseUrl = "https://mazebert.com/rest/player/profile?id=";
const roles = {
   1 : {name : "Apprentice",
        min : 1,
        max : 20},
   2 : {name : "Scholar",
        min : 21,
        max : 40},
   3 : {name : "Master",
        min : 41,
        max : 60},
   4 : {name : "Master Defender",
        min : 61,
        max : 80},
   5 : {name : "Master Commander",
        min : 81,
        max : 99},
   6 : {name : "King's Hand",
        min : 100,
        max : 105},
   7 : {name : "King",
        min : 106,
        max : 110},
   8 : {name : "Emperor",
        min : 111,
        max : 115},
   9 : {name : "Master of the Universe",
        min : 116,
        max : 129},
  10 : {name : "Chuck Norris",
        min : 130,
        max : 999999}
}

const helpMsg = "To use me, type \"@Guardian of Wisdom [action] [input]\"\n" +
  "In the steps below, \"@Guardian of Wisdom\" will be \"@me\"\n\n" +
  "1 - \"@me verification\"\n" +
  "2 - \"@me start Mazebert ID\"\n" +
  "3 - Play a suicide game (build zero towers) and wait until you lose.\n" +
  "4 - \"@me check\"\n" +
  "5 - Done!\n\n" +
  "If you get an error, type \"@me restart\" to restart the verification.";

const undefinedErrorMsg = "To start the verification you have to use" +
  " the \"@me start [Mazebert ID]\" command. " +
  "Your Mazebert ID is in the Mazebert.com URL for your profile; " +
  "it is the numerical code in the URL.";
const noIDerrorMsg = "Hey! Don't waste my time!!! " +
  "You must tell me your Mazebert id when you start the verification.\n" +
  "Command format: \"@me start Mazebert ID\"";

const waitMsg = "Bot is currently in use. " +
  "If they take too long, use the \"@me restart\" command.";

const noGameMsg = "Hey! Are you kidding me? " +
  "You haven't finished the suicide game. Don't waste my time!";

const successMsg = "Good. Now I bless you with my wisdom...";

const notReadyMsg = "Before you start your verification, " +
  "you must tell me you're ready with the \"@me verification\" command." +
  " If you're lost outside my infinite wisdom, use the \"@me help\" command.";

const readyMsg = "No one has started the verification. " +
  "If you want to be verified, use the \"@me verification\" command.";

const processingMsg = "I'm waiting your play! " +
  "If is really you, you will blessed by my wisdom.";

/* // See the lookUpRole function below.
const apprenticeRole = message.guild.roles.find(role => role.name === "Apprentice");
const scholarRole = message.guild.roles.find(role => role.name === "Scholar");
const masterRole = message.guild.roles.find(role => role.name === "Master");
const masterDefenderRole = message.guild.roles.find(role => role.name === "Master Defender");
const masterCommanderRole = message.guild.roles.find(role => role.name === "Master Commander");
const kingsHandCommanderRole = message.guild.roles.find(role => role.name === "King's Hand");
const kingRole = message.guild.roles.find(role => role.name === "King");
const emperorRole = message.guild.roles.find(role => role.name === "Emperor");
const masterOfTheUniverseRole = message.guild.roles.find(role => role.name === "Master of the Universe");
const chuckNorrisRole = message.guild.roles.find(role => role.name === "Chuck Norris");
const aTrueHeroRole = message.guild.roles.find(role => role.name === "A True Hero");
const collectorRole = message.guild.roles.find(role => role.name === "Collector");
const alchemistRole = message.guild.roles.find(role => role.name === "Alchemist");
const craftsmanshipRole = message.guild.roles.find(role => role.name === "Craftsmanship");
const completionistRole = message.guild.roles.find(role => role.name === "Completionist");
*/

var userToVerify, userIdToVerify, userUrl, getFirstCurrentXp,
  getAfterCurrentXp, mazebertData, mazebertLevel, mazebertName, mazebertLink,
  mazebertRank, mazebertGoldHeroes, mazebertGoldItems,mazebertGoldPotions,
  mazebertGoldTowers, mazebertGoldCards, newAKA, autoUpdateFile, messageWords;


// It seems like this function can replace the dozen lines of const values.
function lookUpRole(roleName) {
  return message.guild.roles.find(role => role.name === roleName);
}

client.on("ready", () => {
  console.log("Logged in as " + client.user.tag + "!");
});

client.on("message", async message => {
	//automaticUpdate();
  messageWords = message.content.split(" ");
  // The " " before the first word is for compatibility with the old system.
	validation = " " + messageWords[1]; // 2nd word.
  // Only try to access array position [2] if it exists.
	let secondValidation = (messageWords.length > 2) ? messageWords[2] : "";
  // I think the below if could be replaced by if (messageWords[0] == prefix){
	if (message.content.substring(0,prefix.length) == prefix){
		switch (validation){
			case " help":
				message.channel.send(helpMsg);
				break;
			case " verification":
				if (userToVerify == undefined) {
					message.reply(undefinedErrorMsg);
					userToVerify = message.author.id;
				}
				else {
					message.reply(waitMsg);
				};
				break;
			case " check":
				if (userToVerify == message.author.id){
					mazebertData = await takeXpVerification(userUrl);
					getAfterCurrentXp = mazebertData["profile"]["experience"];
					if (getFirstCurrentXp == getAfterCurrentXp) {
						message.reply(noGameMsg);
					}
					//else if (getFirstCurrentXp + 1 == getAfterCurrentXp || getFirstCurrentXp + 2 == getAfterCurrentXp || getFirstCurrentXp + 3 == getAfterCurrentXp) {
          else if (getFirstCurrentXp + 5 >= getAfterCurrentXp) {
						message.reply(successMsg);
            mazebertData = await takeXpVerification(userUrl);
						//mazebertLevel = await takeXpVerification(userUrl);
						mazebertLevel = mazebertData["profile"]["level"];
						//mazebertName = await takeXpVerification(userUrl);
						mazebertName = mazebertData["profile"]["name"];
						///mazebertRank = await takeXpVerification(userUrl);
						mazebertRank = mazebertData["profile"]["rank"];
						//mazebertGoldHeroes = await takeXpVerification(userUrl);
						mazebertGoldHeroes = mazebertData["profile"]["foilHeroProgress"];
						//mazebertGoldItems = await takeXpVerification(userUrl);
						mazebertGoldItems = mazebertData["profile"]["foilItemProgress"];
						//mazebertGoldPotions = await takeXpVerification(userUrl);
						mazebertGoldPotions = mazebertData["profile"]["foilPotionProgress"];
						//mazebertGoldTowers = await takeXpVerification(userUrl);
						mazebertGoldTowers = mazebertData["profile"]["foilTowerProgress"];
						setLevelRole(message, mazebertName, mazebertLevel);
						setGoldRole(message, mazebertGoldHeroes, mazebertGoldItems, mazebertGoldPotions, mazebertGoldTowers);
						//updateVerificatedUser(message, mazebertLevel, mazebertName, userUrl);
						userToVerify = undefined;
						userUrl = undefined;
						userIdToVerify = undefined;
						mazebertLevel = undefined;
						mazebertName = undefined;
						mazebertRank = undefined;
						mazebertGoldHeroes = undefined;
						mazebertGoldItems = undefined;
						mazebertGoldPotions = undefined;
						mazebertGoldTowers = undefined;
					}
				}
				else if (userToVerify != undefined){
					message.reply(waitMsg);
				}
				else {
					message.reply(readyMsg);
				};
				break;
			case " restart":
				userToVerify = undefined;
				userIdToVerify = undefined;
				userUrl = undefined;
				getFirstCurrentXp = undefined;
				getAfterCurrentXp = undefined;
				mazebertLevel = undefined;
				mazebertName = undefined;
				mazebertLink = undefined;
				mazebertRank = undefined;
				mazebertGoldHeroes = undefined;
				mazebertGoldItems = undefined;
				mazebertGoldPotions = undefined;
				mazebertGoldTowers = undefined;
				break;
		};
		//if (validation == " start " + secondValidation) {
    if (validation == " start") { // Now it is split by word.
			if (userToVerify == undefined) {
				message.reply(notReadyMsg);
			}
			else {
				message.reply(processingMsg);
				userIdToVerify = secondValidation;
				userUrl = baseUrl + userIdToVerify;
				getFirstCurrentXp = await takeXpVerification(userUrl);
				getFirstCurrentXp = getFirstCurrentXp["profile"]["experience"];
			};
		}
		else if (validation == " start" || validation == " start ") {
			if (userToVerify == undefined) {
				message.reply(notReadyMsg);
			}
			else {
				message.reply(noIDerrorMsg);
			};
		};
	};
});
async function takeXpVerification(userUrl){
    return await fetch(userUrl)
    .then(res => res.json())
}

function isCompleteFraction(fracText) {
  let numbers = fracText.split("/");
  return numbers[0] == numbers[1]; // Is numerator == denomenator?
}
function setLevelRole(message, mazebertName, mazebertLevel){
  let i = 1;
  while(mazebertLevel > roles[i]["max"]){
    i++; // Should stop on the correct role.
  }
  message.member.addRole(lookUpRole(roles[i]["name"]));
	//newAKA = mazebertName + " | Rank ☆" + mazebertRank + " | Level " + mazebertLevel;
  // let's not use Rank - the ☆ were for completing weekly challenges.
  // They only lasted for 2 weeks, so it wasn't very "weekly"
  newAKA = mazebertName + " | Level " + mazebertLevel;
	message.member.setNickname(newAKA)
	newAKA = undefined;
};
function setGoldRole(message, mazebertGoldHeroes, mazebertGoldItems, mazebertGoldPotions, mazebertGoldTowers){
  // If we use == "48/48" or something like that,
  // then it will break when another card is added.
  // This way it always checks to see if all the cards are there.
  if (isCompleteFraction(mazebertGoldHeroes)) {
		//message.member.addRole(aTrueHeroRole);
    message.member.addRole(lookUpRole("A True Hero"));
	};
	if (isCompleteFraction(mazebertGoldItems)) {
		//message.member.addRole(collectorRole);
    message.member.addRole(lookUpRole("Collector");
	};
	if (isCompleteFraction(mazebertGoldPotions)) {
		//message.member.addRole(alchemistRole);
    message.member.addRole(lookUpRole("Alchemist");
	};
	if (isCompleteFraction(mazebertGoldTowers)) {
		//message.member.addRole(craftsmanshipRole);
    message.member.addRole(lookUpRole("Craftsmanship");
	};
	if (isCompleteFraction(mazebertGoldCards)) {
		//message.member.addRole(completionistRole);
    message.member.addRole(lookUpRole("Completionist");
	};
};
/*function updateVerificatedUser(message, mazebertLevel, mazebertName, mazebertLink) {
	fs.readFile('verificatedUser.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("Error reading file from disk:", err)
        return
    }
    try {
        var userVerify = JSON.parse(jsonString)
        console.log("Current user:", customer.address)
	} catch(err) {
			console.log('Error parsing JSON string:', err)
		}
	});
	var newUser = {
		"discordId": message.author.id,
		"mazebertName": mazebertName,
		"mazebertLevel": mazebertLevel
		"mazebertLink": mazebertLink;
	}
	userVerify.push(newUser);
	var jsonString = JSON.stringify(newUser)
	fs.writeFile('verificatedUser.json', jsonString, err => {
		if (err) {
			console.log('Error writing file', err)
		} else {
			console.log('Successfully wrote file')
		}
	});
};
function readAutomaticUpdate(userVerify) {
	fs.readFile('verificatedUser.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("Error reading file from disk:", err)
        return
    }
    try {
        userVerify = JSON.parse(jsonString)
        console.log("Current user:", customer.address)
	} catch(err) {
			console.log('Error parsing JSON string:', err)
		}
	});
	return userVerify;
};
function automaticUpdate() {
	var userVerify;
	var currentLevel;
	var oldLevel;
	readAutomaticUpdate(userVerify);
	for (i in userVerify) {
		currentLevel = takeXpVerification(userVerify);
		currentLevel = currentLevel["profile"]["level"];
		oldLevel = userVerify[]
	};
};*/
client.login("NjI4MzAyMDU3NTcyNjYzMjk2.XZWiPQ.gGhlX_8mrHlGKuxaTIPPHIq13Bw");
