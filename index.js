const {gameOptionsBtn, playAgainBtn} = require('./options.js') // импорт инлайн конструкций кнопок
const TelegramApi = require('node-telegram-bot-api') // npm api для работы с ботом телеграм
const token = '5927390543:AAGZ-JgSAxZOnZ4e_pPNhmvp01Qy-XPisao' // токен бота телеграм
const bot = new TelegramApi (token, {polling: true}); // создание бота от класса TelegramApi

const Db = require('./dataBase/db.js') // получение класса с базами данных из файла-модуля

const simpleParser = require('mailparser').simpleParser; // позволяет без ебли получать все данные письма

// const { returnTrueValue } = require('./utils/utils.js')

function sendRecord (from, title, date, text) {
  Db.module.chatsStore.find({}, { multi: true }, function (err, docs) { // найти и извлечь запись
    docs.forEach(item=>{
      return bot.sendMessage(item.chatId,`${from}\n<em>${date}</em>\n<b>${title}</b>\n\n${text}`,{parse_mode : "HTML"});
    })
  })
}



var Imap = require('imap');
const { inspect } = require("util");
const { log } = require('console');

var imap = new Imap({ // параметры подключения к mail.ru
  user: 'alliancecrbot@mail.ru', // put your mail email
  password: 'vCJZNtLze7ukpwnFPRDt', // put your mail password or your mail app password
  host: 'imap.mail.ru', // put your mail host
  port: 993, // your mail host port
  tls: true 
})




// db.find({year: 1246}, function (err, docs) { // найти и извлечь запись
// 	console.log(docs); 
// });
// db.update({year: 1246}, {name: "Doug the Head", year: 1940}, {}); // обновить запись




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
        // const msgText = msg.text
        // const msgDate = msg.date
        const msgSender = msg.from.username
        const text = msg.text
        const chatId = msg.chat.id

        // занесение ID чатов в бд, для рассылки
Db.module.chatsStore.find({chatId: chatId}, function (err, docs) { 
	if (!docs.length) {
    Db.module.chatsStore.insert({chatId : chatId, sender: msgSender});
    bot.sendMessage(chatId, 'Теперь вы будете получать уведомления от бота')
  } else {  }
});



        if (text === '/start') {
            await bot.sendSticker(chatId, './images/warden.png')
            return bot.sendMessage(chatId, 'Chat has been started')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Бот отправляет все данные письма, когда оно приходит на почту`)
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

// start()





















const openInbox = (cb) => {
  imap.openBox("INBOX", true, cb);

  imap.on("mail", (msg)=>{     // СЛУШАТЕЛЬ СОБЫТИЯ ПРИХОДЯЩЕГО СООБЩЕНИЯ
    // console.log(msg);
    imap.openBox("INBOX", true, cb); // перезапуск фетчинга писем // 
  })
};







imap.once("ready", () => {

  openInbox(function (err, box) {
    if (err) throw err;
    const f = imap.seq.fetch('1:' + box.messages.total, { // кол-во принимаемых сообщений - принимать все сообщения
      bodies: '',
      // ['HEADER.FIELDS (FROM TO SUBJECT DATE)','TEXT']
      struct: true,
    });

    f.on("message", (msg, seqno) => {
      const prefix = "(#" + seqno + ") ";
      msg.on("body", (stream, info) => {




simpleParser(stream, (err, mail) => { // Парсинг всех данных

        let msgRecord = {}
          msgRecord = { // Создание записи письма
            from: mail.from.text.replace(/[\<\>\[\]\']*/g,''),
            date: inspect(Imap.parseHeader(buffer).date).replace(/[\<\>\[\]\']*/g,''),
            subject: mail.subject.replace(/[\<\>\[\]\']*/g,''),
            content: mail.text.replace(/[\<\>\[\]\']*/g,'')
          }

        console.log(msgRecord);

        Db.module.recordsStore.find({date: msgRecord.date}, function (err, docs) { 
          if (!docs.length) {
            // sendRecord(msgRecord.from, msgRecord.subject, msgRecord.date,msgRecord.content)
            // Db.module.recordsStore.insert(msgRecord); // добавить письмо
          }
        });


// Db.module.recordsStore.remove({}, { multi: true }); // Очистить все записи

});



        let buffer = "";


        stream.on("data", (chunk) => {
          buffer += chunk.toString('utf8');
          // console.log(buffer)  //view the body
        });


        stream.once("end", () => {

          // console.log( // ВСЕ ПАРАМЕТРЫ
          //   prefix + "Parsed header: %s",
          //   inspect(Imap.parseHeader(buffer))
          // );

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
      // console.log("Fetch error: " + err);
    });
   // ! // f.once("end", () => {  // отключение от почты, при разблокировке слушатель не будет работать
   // ! //   console.log("Done fetching all messages!");
   // ! //   imap.end();
   // ! // });
  });
});

imap.once("error", (err) => {
  console.log(err);
});
imap.once("end", () => {
  console.log("Connection ended");
});

imap.connect();













