// импорт инлайн конструкций кнопок
const {gameOptionsBtn, playAgainBtn} = require('./options.js')
const TelegramApi = require('node-telegram-bot-api')
const token = '5927390543:AAGZ-JgSAxZOnZ4e_pPNhmvp01Qy-XPisao'


// создание бота от класса TelegramApi
const bot = new TelegramApi (token, {polling: true});


// аналог базы данных 
const chats = {
}


    async function startGame (chatId) {
        const randomNumber = Math.floor(Math.random()*10).toString();
        chats[chatId] = randomNumber;
        await bot.sendMessage(chatId, `Отгадай число от 0 до 9.`, gameOptionsBtn)
    }


function start () {

    // опционально установка упрощённого списка команд для пользователя
    bot.setMyCommands([
        {command: '/start', description: 'Начать работу.'},
        {command: '/info', description: 'Получить номер чата.'},
        {command: '/game', description: 'Сыграем.'}
    ])

    // слушатель событий на обработку сообщений
    bot.on('message', async msg  =>  {

        // const msgID = msg.message_id
    // const msgSender = msg.from.username
    // const msgText = msg.text
    // const msgDate = msg.date

    // console.log('//////////////////////');
    // console.log(msgID);
    // console.log(msgSender);
    // console.log(msgText);
    // console.log(msgDate);

        const text = msg.text
        const chatId = msg.chat.id

        if (text === '/start') {
            await bot.sendSticker(chatId, './images/warden.png')
            return bot.sendMessage(chatId, 'Здарова Варден, надеюсь на плодотворное сотрудничество.')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Мы находимся в чате ${chatId}`)
        }

        if (text === '/game') {
            startGame(chatId)
        }

        // if (text[0] === '/') {
        //     return bot.sendMessage(chatId, `Такой команды нет`)
        // }
        // return bot.sendMessage(chatId, `${chats.chatId}`)
    })


    // при нажатии пользователем кнопки, возвращается cb, который не является 'message', поэтому отлавливается другим обработчиком
    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if (data === '/game') {
            startGame(chatId)
        }
        else if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Верно, число было ${chats[chatId]}`, playAgainBtn)
        } 
        else { return bot.sendMessage(chatId, `Неверно, число было ${chats[chatId]}`, playAgainBtn) }
        })
}


start()