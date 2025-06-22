import TelegramApi from "node-telegram-bot-api";
import { gameOptions, restartGameOptions } from './options.js';

const token = process.env.BOT_TOKEN;

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
	const randomNumber = Math.floor(Math.random() * 10);
	chats[chatId] = randomNumber;
	await bot.sendMessage(chatId, "Try to guess a number from 0 to 9", gameOptions);
}

const start = () => {
	bot.setMyCommands([
		{ command: '/start', description: 'Initial greeting' },
		{ command: '/info', description: 'Get user info' },
		{ command: '/game', description: 'A number guessing game' }
	])

	bot.on("message", async msg => {
		const text = msg.text;
		const chatId = msg.chat.id;
		if (text === "/start") {
			await bot.sendSticker(chatId, "https://cdn2.combot.org/memecapriofans_by_demybot/webp/5xf09fa5a7.webp");
			return bot.sendMessage(chatId, "Welcome to my telegram bot");
		}
		if (text === "/info") {
			return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from.last_name ? msg.from.last_name : ''}`);
		}
		if (text === "/game") {
			return startGame(chatId);
		}

		return bot.sendMessage(chatId, "I don't understand you. Pls, try again");
	});

	bot.on('callback_query', async msg => {
		const data = msg.data;
		const chatId = msg.message?.chat.id;
		if (data === '/restart') {
			return startGame(chatId);
		}
		if (data === String(chats[chatId])) {
			return bot.sendMessage(chatId, `Congrats, you guessed the number: ${chats[chatId]}`, restartGameOptions);
		} else {
			return bot.sendMessage(chatId, `Nope, you're wrong. \nThe correct num is ${chats[chatId]}`, restartGameOptions);
		}
	});
}

start();