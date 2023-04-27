// const Db = require('../dataBase/db.js')




function returnTrueValue () {
    for (let i = 0; i < arguments.length; i++) {
        const element = arguments[i];
        if (element) {
            return element
        }
    }
}

// function sendRecord (from, title, date, text) {
//   Db.module.chatsStore.find({}, { multi: true }, function (err, docs) { // найти и извлечь запись
//     docs.forEach(item=>{
//       return bot.sendMessage(item.chatId,`${from}\n<em>${date}</em>\n<b>${title}</b>\n\n${text}`,{parse_mode : "HTML"});
//     })
//   })
// }

exports.returnTrueValue = returnTrueValue
