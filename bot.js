// Var for run main function of the bot

const Discord = require("discord.js");
const fetch = require('node-fetch');
const fs = require('fs')
const client = new Discord.Client();
const botPrefix = "<@628302057572663296>";
const baseUrl = "https://mazebert.com/rest/player/profile?id=";

// Future var

var autoUpdateFile;

// Var for take the bot command

var isBotPrefix, botCommand, mazebertId;

// Var of the message of the bot

var botMessage, search;

// Var for user Mazebert verification

var pendingVerificationUsers = {};
var pendingSearch, inPending, confirming, oldXp, newXp;

// Var for golden cards

var userUrl, mazebertLevel, mazebertName, mazebertLink, mazebertRank, mazebertGoldHeroes, mazebertGoldItems, mazebertGoldPotions, mazebertGoldTowers, mazebertGoldCards, hero, item, potion, tower, current, total;

// When the bot go online

client.on("ready", () => {
  console.log("Logged in as " +client.user.tag + "!");
});

// When in the server is sent a message

client.on("message", async message => {
	search = new RegExp(message.author.id);
	//automaticUpdate();
	takeBotCommand(message);
	if (isBotPrefix == botPrefix){
		switch (botCommand){
			case " help":
				botTalkMessage(botCommand, message);
				botMessage;
				break;
			case " verification":
				isPending(message)
				if (inPending == false) {
					addPendingVerification(message);
					botTalkMessage(botCommand, message);
				};
				botMessage;
				break;
			case " check":
				for (var i = 0; i < pendingVerificationUsers["users"].length; i++) {
					if (search.test(pendingVerificationUsers["users"][i]["userId"]) == true){
						checking(message);
						//updateVerificatedUser(message, mazebertLevel, mazebertName, userUrl);
					};
				};
				botMessage;
				break;
			case " command":
				botTalkMessage(botCommand, message);
				botMessage;
				break;
			case " update":
				botTalkMessage(botCommand, message);
				botMessage;
				break;
		};
		if (botCommand == " start " + mazebertId) {
			for (var i = 0; i < pendingVerificationUsers["users"].length; i++) {
				if (search.test(pendingVerificationUsers["users"][i]["userId"]) == false) {
					botTalkMessage("not verify", message);
					botMessage;
				}
				else {
					botTalkMessage("started", message);
					botMessage;
					addPendingStarted(message)
				};
			};
		};
		if (botCommand == " cards " + mazebertId) {
			takeGoldenProgress(message);
			botMessage;
		};
	};
});
function takeBotCommand(message) {
	botCommand = message.content.substring(message.content.indexOf(" "), message.content.length);
	mazebertId = message.content.substring(message.content.indexOf(" ") + 7, message.content.length);
	isBotPrefix = message.content.substring(0,21);
};
function botTalkMessage(botCommand, message) {
	switch (botCommand) {
		case " help":
			botMessage = message.channel.send("1 - @mention me (@Guardian of Wisdom) followed by 'verification';\n2 - @mention me again followed by start and your Mazebert ID;\n3 - Play a suicide game (build zero towers) and wait until you lose;\n4 - @mention me followed by 'check';\n5 - Done!\nIf you want see my extra ability, just @mention me followed by command!");
			break;
		case " verification":
		    botMessage = message.channel.send("<@" + message.author.id + "> For starting the verification you have to @mention me followed by start and your Mazebert id. You can take it in your profile, is the numerical code in the url.");
			break;
		case "waiting start":
			botMessage = message.channel.send("<@" + message.author.id + "> Hey! You already told me you want to be verified. If you insist then start the verification!");
			break;
		case "waiting check":
			botMessage = message.channel.send("<@" + message.author.id + "> I'm waiting for the suicide run, don't waste my time.");
			break;
		case "not verify":
			botMessage = message.channel.send("Before you start the verification of your play, you have to tell me to get the verification with @mention me followed by verification. If you're lost in my infinite wisdom, @mention me followed by help.");
			break;
		case "started":
			botMessage = message.channel.send("I'm waiting your play! If is really you, you will blessed by my wisdom.");
			break;
		case "checked same experience":
			botMessage = message.channel.send("Hey! You're kidding me? You haven't make the suicide run, don't waist my time!!!");
			break;
		case "checked true":
			botMessage = message.channel.send("Good. Now i bless you with my wisdom...");
			break;
		case "golden progress":
			botMessage = message.channel.send("<@" + message.author.id + "> Here's your current progress with the Golden Cards:\nTotal cards: " + mazebertGoldCards + ";\nHeroes: " + mazebertGoldHeroes + ";\nItems: " + mazebertGoldItems + ";\nPotions: " + mazebertGoldPotions + ";\nTowers: " + mazebertGoldTowers + ".");
			break;
		case " command":
			botMessage = message.channel.send("Here a list of extra command:\ncards followed by your mazebert id: if you tell me this, i'll show your current golden cards progress.\nupdate: with this you can see my master how improve my knowledge.");
			break;
		case " update":
			botMessage = message.channel.send("Let's see how my knowledge continues to increase...\n1.2.1: Added two new commands (update, card followeb by mazeber id).\n1.1.2: improve the code and making it more easy to read, multiple user verification.\n1.1.1: some minor bug fix.");
			break;
	};
};
function addPendingVerification(message) {
	if (pendingVerificationUsers["users"] == undefined) {
		pendingVerificationUsers["users"] = [];
	};
	pendingVerificationUsers["users"].push({"userId":message.author.id,"started":"false"});
};
function isPending(message) {
	if (pendingVerificationUsers["users"] != undefined) {
		for (var i = 0; i < pendingVerificationUsers["users"].length; i++) {
			if (search.test(pendingVerificationUsers["users"][i]["userId"]) == true) {
				inPending = true;
				if (pendingVerificationUsers["users"][i]["started"] == "true") {
					inPending = true;
					botTalkMessage("waiting check", message);
				}
				else {
					inPending = true;
					botTalkMessage("waiting start", message);
				};
			}
			else {
				inPending = false;
			};
		};
	}
	else {
		inPending = false;
	};
};
async function addPendingStarted(message) {
	if (pendingVerificationUsers["users"] != undefined) {
		for (var i = 0; i < pendingVerificationUsers["users"].length; i++) {
			if (search.test(pendingVerificationUsers["users"][i]["userId"]) == true) {
				pendingVerificationUsers["users"][i]["url"] = baseUrl + mazebertId;
				pendingVerificationUsers["users"][i]["data"] = await takeXpVerification(pendingVerificationUsers["users"][i]["url"]);
				pendingVerificationUsers["users"][i]["oldXp"] = pendingVerificationUsers["users"][i]["data"]["profile"]["experience"];
			};
		};
	};
};
async function checking(message) {
	if (pendingVerificationUsers["users"] != undefined) {
		for (var i = 0; i < pendingVerificationUsers["users"].length; i++) {
			if (search.test(pendingVerificationUsers["users"][i]["userId"]) == true) {
				confirming = await takeXpVerification(pendingVerificationUsers["users"][i]["url"]);
				oldXp = pendingVerificationUsers["users"][i]["oldXp"];
				newXp = confirming["profile"]["experience"];
				if (newXp == oldXp) {
					botTalkMessage("checked same experience", message);
				}
				else if (newXp == oldXp + 1 || newXp == oldXp + 2 || newXp == oldXp + 3) {
					botTalkMessage("checked true", message);
					addPendingChecked(message);
				};
			};
		};
	};
};
async function addPendingChecked(message) {
	if (pendingVerificationUsers["users"] != undefined) {
		for (var i = 0; i < pendingVerificationUsers["users"].length; i++) {
			if (search.test(pendingVerificationUsers["users"][i]["userId"]) == true) {
				userUrl = pendingVerificationUsers["users"][i]["url"];
				mazebertLevel = await takeXpVerification(userUrl);
				mazebertLevel = mazebertLevel["profile"]["level"];
				mazebertRank = await takeXpVerification(userUrl);
				mazebertRank = mazebertRank["profile"]["rank"];
				mazebertGoldHeroes = await takeXpVerification(userUrl);
				mazebertGoldHeroes = mazebertGoldHeroes["profile"]["foilHeroProgress"];
				mazebertGoldItems = await takeXpVerification(userUrl);
				mazebertGoldItems = mazebertGoldItems["profile"]["foilItemProgress"];
				mazebertGoldPotions = await takeXpVerification(userUrl);
				mazebertGoldPotions = mazebertGoldPotions["profile"]["foilPotionProgress"];
				mazebertGoldTowers = await takeXpVerification(userUrl);
				mazebertGoldTowers = mazebertGoldTowers["profile"]["foilTowerProgress"];
				setLevelRole(message, mazebertLevel);
				setGoldRole(message, mazebertGoldHeroes, mazebertGoldItems, mazebertGoldPotions, mazebertGoldTowers);
				pendingVerificationUsers["users"].splice(i, 1);
			};
		};
	};
};
async function takeGoldenProgress(message) {
	userUrl = baseUrl + mazebertId;
	mazebertGoldHeroes = await takeXpVerification(userUrl);
	mazebertGoldHeroes = mazebertGoldHeroes["profile"]["foilHeroProgress"];
	mazebertGoldItems = await takeXpVerification(userUrl);
	mazebertGoldItems = mazebertGoldItems["profile"]["foilItemProgress"];
	mazebertGoldPotions = await takeXpVerification(userUrl);
	mazebertGoldPotions = mazebertGoldPotions["profile"]["foilPotionProgress"];
	mazebertGoldTowers = await takeXpVerification(userUrl);
	mazebertGoldTowers = mazebertGoldTowers["profile"]["foilTowerProgress"];
	hero = mazebertGoldHeroes.split("/");
	hero[0] = Number(hero[0]);
	hero[1] = Number(hero[1]);
	item = mazebertGoldItems.split("/");
	item[0] = Number(item[0]);
	item[1] = Number(item[1]);
	potion = mazebertGoldPotions.split("/");
	potion[0] = Number(potion[0]);
	potion[1] = Number(potion[1]);
	tower = mazebertGoldTowers.split("/");
	tower[0] = Number(tower[0]);
	tower[1] = Number(tower[1]);
	current = hero[0] + item[0] + potion[0] + tower[0];
	total = hero[1] + item[1] + potion[1] + tower[1];
	mazebertGoldCards = current + "/" + total;
	botTalkMessage("golden progress", message);
};
async function takeXpVerification(userUrl){
    return await fetch(userUrl)
    .then(res => res.json())
}
function setLevelRole(message, mazebertLevel){
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
	if (mazebertLevel <= 20) {
		message.member.addRole(apprenticeRole);
	}
	else if (mazebertLevel <= 40 && mazebertLevel > 20) {
		message.member.addRole(scholarRole);
	}
	else if (mazebertLevel <= 60 && mazebertLevel > 40) {
		message.member.addRole(masterRole);
	}
	else if (mazebertLevel <= 80 && mazebertLevel > 60) {
		message.member.addRole(masterDefenderRole);
	}
	else if (mazebertLevel <= 99 && mazebertLevel > 80) {
		message.member.addRole(masterCommanderRole);
	}
	else if (mazebertLevel <= 105 && mazebertLevel > 99) {
		message.member.addRole(kingsHandCommanderRole);
	}
	else if (mazebertLevel <= 110 && mazebertLevel > 105) {
		message.member.addRole(kingRole);
	}
	else if (mazebertLevel <= 115 && mazebertLevel > 110) {
		message.member.addRole(emperorRole);
	}
	else if (mazebertLevel <= 129 && mazebertLevel > 115) {
		message.member.addRole(masterOfTheUniverseRole);
	}
	else if (mazebertLevel > 129) {
		message.member.addRole(chuckNorrisRole);
	};
};
function setGoldRole(message, mazebertGoldHeroes, mazebertGoldItems, mazebertGoldPotions, mazebertGoldTowers){
	const aTrueHeroRole = message.guild.roles.find(role => role.name === "A True Hero");
	const collectorRole = message.guild.roles.find(role => role.name === "Collector");
	const alchemistRole = message.guild.roles.find(role => role.name === "Alchemist");
	const craftsmanshipRole = message.guild.roles.find(role => role.name === "Craftsmanship");
	const completionistRole = message.guild.roles.find(role => role.name === "Completionist");
	if (mazebertGoldHeroes == "12/12") {
		message.member.addRole(aTrueHeroRole);
	};
	if (mazebertGoldItems == "66/66") {
		message.member.addRole(collectorRole);
	};
	if (mazebertGoldPotions == "28/28") {
		message.member.addRole(alchemistRole);
	};
	if (mazebertGoldTowers == "41/41") {
		message.member.addRole(craftsmanshipRole);
	};
	if (mazebertGoldCards == "147/147") {
		message.member.addRole(completionistRole);
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
