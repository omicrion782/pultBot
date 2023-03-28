const {gameOptionsBtn, playAgainBtn} = require('./options.js') // импорт инлайн конструкций кнопок
const TelegramApi = require('node-telegram-bot-api') // npm api для работы с ботом телеграм
const token = '5927390543:AAGZ-JgSAxZOnZ4e_pPNhmvp01Qy-XPisao' // токен бота телеграм



var Imap = require('imap');
const { inspect } = require("util");

var imap = new Imap({
  user: 'alliancecrbot@mail.ru', // put your mail email
  password: 'vCJZNtLze7ukpwnFPRDt', // put your mail password or your mail app password
  host: 'imap.mail.ru', // put your mail host
  port: 993, // your mail host port
  tls: true 
})





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





















const openInbox = (cb) => {
  imap.openBox("INBOX", true, cb);

  imap.on("mail", (msg)=>{     // СЛУШАТЕЛЬ СОБЫТИЯ ПРИХОДЯЩЕГО СООБЩЕНИЯ
    console.log(msg);
    // imap.openBox("INBOX", true, cb); // перезапуск фетчинга писем // npm i nedb
  })
};


imap.once("ready", () => {

  openInbox(function (err, box) {
    if (err) throw err;
    const f = imap.seq.fetch("1:10", {                   // кол-во принимаемых сообщений
      bodies: "HEADER.FIELDS (FROM TO SUBJECT DATE)",
      struct: true,
    });


    f.on("message", (msg, seqno) => {
      
      console.log("Message #%d", seqno);
      const prefix = "(#" + seqno + ") ";
      msg.on("body", (stream, info) => {
        let buffer = "";
        stream.on("data", (chunk) => {
          buffer += chunk.toString("utf8");
        });
        stream.once("end", () => {
          console.log(
            prefix + "Parsed header: %s",
            inspect(Imap.parseHeader(buffer))
          );
        });
      });
      msg.once("attributes", (attrs) => {
        // console.log(prefix + "Attributes: %s", inspect(attrs, false, 8));
      });
      msg.once("end", () => {
        // console.log(prefix + "Finished");
      });
    });
    f.once("error", (err) => {
    //   console.log("Fetch error: " + err);
    });
   // ! // f.once("end", () => {  // отключение от почты, при разблокировке слушатель не будет работать
   // ! //   console.log("Done fetching all messages!");
   // ! //   imap.end();
   // ! // });
  });
});

imap.once("error", (err) => {
//   console.log(err);
});

imap.once("end", () => {
//   console.log("Connection ended");
});

imap.connect();













