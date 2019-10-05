const Discord = require("discord.js");
const fetch = require('node-fetch');
const fs = require('fs')
const client = new Discord.Client();
const prefix = "<@628302057572663296>";
const baseUrl = "https://mazebert.com/rest/player/profile?id=";
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
var userToVerify, userIdToVerify, userUrl, getFirstCurrentXp, getAfterCurrentXp, mazebertLevel, mazebertName, mazebertLink, mazebertRank, mazebertGoldHeroes, mazebertGoldItems, mazebertGoldPotions, mazebertGoldTowers, mazebertGoldCards, newAKA, autoUpdateFile;

client.on("ready", () => {
  console.log("Logged in as " +client.user.tag + "!");
});

client.on("message", async message => {
	//automaticUpdate();
	validation = message.content.substring(message.content.indexOf(" "), message.content.length);
	let secondValidation = message.content.substring(message.content.indexOf(" ") + 7, message.content.length);
	if (message.content.substring(0,21) == prefix){
		switch (validation){
			case " help":
				message.channel.send("1 - @mention me (@Guardian of Wisdom) followed by 'verification';\n2 - @mention me again followed by start and your Mazebert ID;\n3 - Play a suicide game (build zero towers) and wait until you lose;\n4 - @mention me followed by 'check';\n5 - Done!\nIf you get some error, just @mention me followed by restart, and restart the verification.");
				break;
			case " verification":
				if (userToVerify == undefined) {
					message.channel.send("<@"+ message.author.id + "> For starting the verification you have to @mention me followed by start and your Mazebert id. You can take it in your profile, is the numerical code in the url.");
					userToVerify = message.author.id;
				}
				else {
					message.reply("Before you, there is another member. Wait him or her verification.");
				};
				break;
			case " check":
				if (userToVerify == message.author.id){
					getAfterCurrentXp = await takeXpVerification(userUrl);
					getAfterCurrentXp = getAfterCurrentXp["profile"]["experience"];
					if (getFirstCurrentXp == getAfterCurrentXp) {
						message.reply("Hey! You're kidding me? You haven't make the suicide run, don't waist my time!!!");
					}
					else if (getFirstCurrentXp + 1 == getAfterCurrentXp || getFirstCurrentXp + 2 == getAfterCurrentXp || getFirstCurrentXp + 3 == getAfterCurrentXp) {
						message.reply("Good. Now i bless you with my wisdom...");
						mazebertLevel = await takeXpVerification(userUrl);
						mazebertLevel = mazebertLevel["profile"]["level"];
						mazebertName = await takeXpVerification(userUrl);
						mazebertName = mazebertName["profile"]["name"];
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
					message.reply("Before you, there is another member. Wait him or her verification.");
				}
				else {
					message.reply("No one have started the verification. If you want to make the verification @mention me followed by verification.");
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
		if (validation == " start " + secondValidation) {
			if (userToVerify == undefined) {
				message.reply("Before you start the verification of your play, you have to tell me to get the verification with @mention me followed by verification. If you're lost in my infinite wisdom, @mention me followed by help.");
			}
			else {
				message.reply("I'm waiting your play! If is really you, you will blessed by my wisdom.");
				userIdToVerify = secondValidation;
				userUrl = baseUrl + userIdToVerify;
				getFirstCurrentXp = await takeXpVerification(userUrl);
				getFirstCurrentXp = getFirstCurrentXp["profile"]["experience"];
			};
		}
		else if (validation == " start" || validation == " start ") {
			if (userToVerify == undefined) {
				message.reply("Before you start the verification of your play, you have to tell me to get the verification with @mention me followed by verification. If you're lost in my infinite wisdom, @mention me followed by help.");
			}
			else {
				message.reply("Hey! Don't waste my time!!! You have to tell me your Mazebert id when you start the verification.");
			};
		};
	};
});
async function takeXpVerification(userUrl){
    return await fetch(userUrl)
    .then(res => res.json())
}
function setLevelRole(message, mazebertName, mazebertLevel){
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
	newAKA = mazebertName + " | Rank ☆" + mazebertRank + " | Level " + mazebertLevel;
	message.member.setNickname(newAKA)
	newAKA = undefined;
};
function setGoldRole(message, mazebertGoldHeroes, mazebertGoldItems, mazebertGoldPotions, mazebertGoldTowers){
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
client.login("NjI4MzAyMDU3NTcyNjYzMjk2.XZWiPQ.gGhlX_8mrHlGKuxaTIPPHIq13Bw");
