const {gameOptionsBtn, playAgainBtn} = require('./options.js') // импорт инлайн конструкций кнопок
const TelegramApi = require('node-telegram-bot-api') // npm api для работы с ботом телеграм
const token = '5927390543:AAGZ-JgSAxZOnZ4e_pPNhmvp01Qy-XPisao' // токен бота телеграм
const bot = new TelegramApi (token, {polling: true}); // создание бота от класса TelegramApi


var Datastore = require('nedb'); // подключение npm локальных БД
var db = new Datastore({filename : 'records'}); // создание локальной БД в корне проекта
db.loadDatabase(); // загрузка БД

var chat_db = new Datastore({filename : 'chatidstore'}); // создание локальной БД в корне проекта
chat_db.loadDatabase(); // загрузка БД


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

const {MailParser} = require('mailparser');

// db.insert({name : "Boris the Blade", year: 1246}); // добавить запись
// db.find({year: 1246}, function (err, docs) { // найти и извлечь запись
// 	console.log(docs); 
// });
// db.update({year: 1246}, {name: "Doug the Head", year: 1940}, {}); // обновить запись
// db.remove({}, { multi: true }); // удалить все записи



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
chat_db.find({chatId: chatId}, function (err, docs) { 
	if (!docs.length) {
    chat_db.insert({chatId : chatId, sender: msgSender})
  } else {  }
});



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

// start()

















let chatIdArray = []
chat_db.find({}, { multi: true }, function (err, docs) { // найти и извлечь запись
	chatIdArray = docs;
});



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
    var f = imap.seq.fetch(box.messages.total + ':*', { bodies: ['HEADER.FIELDS     (FROM)','TEXT'] });

    f.on('message', function(msg, seqno) {
        console.log('Message #%d', seqno);
        var prefix = '(#' + seqno + ') ';
        msg.on('body', function(stream, info) {

          
            if (info.which === 'TEXT')
            console.log(prefix + 'Body [%s] found, %d total bytes', inspect(info.which), info.size);
            var buffer = '', count = 0;
            stream.on('data', function(chunk) {
                count += chunk.length;
                buffer += chunk.toString('utf8');
                console.log('BUFFER', buffer)  //HEre i am able to view the body
                if (info.which === 'TEXT')
                    console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which),            count, info.size);
            });
            stream.once('end', function() {
                if (info.which !== 'TEXT')
                    console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                else
                     console.log(prefix + 'Body [%s] Finished', inspect(info.which));
            });
        });
        msg.once('attributes', function(attrs) {
            console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
        });
        msg.once('end', function() {
            console.log(prefix + 'Finished');
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












