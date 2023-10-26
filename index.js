const TelegramBot = require('node-telegram-bot-api');

const API_KEY_BOT = '6916354601:AAEOFFmm_G-_Trx6sHGTkUs-aCDh94u2ErU';

const bot = new TelegramBot(API_KEY_BOT, {

    polling: true

});

const commands = [
    {
        command: 'start',
        description: 'Запуск бота'
    },
    {
        command: 'ccal',
        description: 'Посчитать калории'
    },
    {
        command: 'help',
        description: 'Раздел помощи'
    }
]

const answers = {};

bot.setMyCommands(commands);

bot.on('text', async msg => {
    try {
        if (msg.text === '/start') {
            answers[msg.chat.id] = {};
            await bot.sendMessage(msg.chat.id, 'Привет! Я помогу тебе рассчитать параметры еды. Выбери, что хочешь посчитать', {
                parse_mode: "HTML",
                reply_markup: {
                    keyboard: [
                        ['Посчитать калории'],
                        ['Помощь', 'Закрыть меню']
                    ],
                    resize_keyboard: true,
                }
            });
        } else if (msg.text === '/ccal' || msg.text === 'Посчитать калории') {
            answers[msg.chat.id].ccal = {
                ccal: false,
            }
            await bot.sendMessage(msg.chat.id, 'Чтобы посчитать калории, введи калорийность на 100г',
            {
                reply_markup: {
                    remove_keyboard: true
                }
            });
        } else if (msg.text === '/help' || msg.text === 'Помощь') {
            await bot.sendMessage(msg.chat.id, 'Пока мой функционал не очень велик..Но я могу помочь тебе рассчитать калорийность продукта, зная его вес и калорийность на 100г');
        } else {
            const editMsg = msg.text.replace(/,/gi, '.');
            const quan = parseFloat(editMsg);
            if (answers[msg.chat.id].ccal.ccal === false) {
                answers[msg.chat.id].ccal.ccal = quan;
                await bot.sendMessage(msg.chat.id, 'Хорошо, а теперь введи вес продукта');
            } else {
                await bot.sendMessage(msg.chat.id, `Калорийность продукта составляет ${Math.round(quan*answers[msg.chat.id].ccal.ccal/100)}`);
                delete answers[msg.chat.id].ccal;
            }
        }
    } catch(e) {
        console.log(e);
    }
});