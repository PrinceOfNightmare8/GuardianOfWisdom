const Discord = require("discord.js");
const fetch = require('node-fetch');
const client = new Discord.Client();
const prefix = "<@628302057572663296>";
const baseUrl = "https://mazebert.com/rest/player/profile?id=";
var userToVerify, userIdToVerify, userUrl, getFirstCurrentXp, getAfterCurrentXp, mazebertLevel, mazebertName, newAKA;

client.on("ready", () => {
  console.log("Logged in as " +client.user.tag + "!");
});

client.on("message", async message => {
	let validation = message.content.substring(message.content.indexOf(" "), message.content.length);
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
						setRole(message, mazebertName, mazebertLevel);
						userToVerify = undefined;
						userUrl = undefined;
						userIdToVerify = undefined;
						mazebertLevel = undefined;
						mazebertName = undefined;
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
				break;
			case " role common make" || " role uncommon make" || " role rare make" || " role epic make":
				roleMaker(message);
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
				message.reply("Hey! you're wasting my time!!! You have to tell me your Mazebert id when you start the verification.");
			};
		};
	};
});
async function takeXpVerification(userUrl){
    return await fetch(userUrl)
    .then(res => res.json())
}

client.login("NjI4MzAyMDU3NTcyNjYzMjk2.XZNaxA.oMmPHGjDNiLO6NtFqdmeE_B2i5A");

function roleMaker(message) {
	var commonRole = message.guild.roles.find(role => role.name === "Common");
	var uncommonRole = message.guild.roles.find(role => role.name === "Uncommon");
	var rareRole = message.guild.roles.find(role => role.name === "Rare");
	var legendaryRole = message.guild.roles.find(role => role.name === "Legendary");
	var epicRole = message.guild.roles.find(role => role.name === "Epic");
	if (commonRole == null) {
		message.guild.createRole({
			name: "Common",
			color: [255, 255, 255],
		});
	}
	else if (uncommonRole == null) {
		message.guild.createRole({
			name: "Uncommon",
			color: [27, 39, 250],
		});
	}
	else if (rareRole == null) {
		message.guild.createRole({
			name: "Rare",
			color: [255, 247, 87],
		});
	}
	else if (legendaryRole == null) {
		message.guild.createRole({
			name: "Legendary",
			color: [255, 98, 31],
		});
	}
	else if (epicRole == null) {
		message.guild.createRole({
			name: "Epic",
			color: [152, 48, 255],
		});
	};
};
function setRole(message, mazebertName, mazebertLevel){
	var commonRole = message.guild.roles.find(role => role.name === "Common");
	var uncommonRole = message.guild.roles.find(role => role.name === "Uncommon");
	var rareRole = message.guild.roles.find(role => role.name === "Rare");
	var legendaryRole = message.guild.roles.find(role => role.name === "Legendary");
	var epicRole = message.guild.roles.find(role => role.name === "Epic");
	if (mazebertLevel <= 50) {
		message.member.addRole(commonRole);
	}
	else if (mazebertLevel <= 70 && mazebertLevel > 50) {
		message.member.addRole(uncommonRole);
	}
	else if (mazebertLevel <= 100 && mazebertLevel > 70) {
		message.member.addRole(rareRole);
	}
	else if (mazebertLevel <= 120 && mazebertLevel > 100) {
		message.member.addRole(legendaryRole);
	}
	else if (mazebertLevel > 120) {
		message.member.addRole(epicRole);
	};
	newAKA = mazebertName + " Level " + mazebertLevel;
	message.member.setNickname(newAKA)
};