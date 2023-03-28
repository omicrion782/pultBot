// деструктуризация
module.exports = {
    


gameOptionsBtn: {
    reply_markup: ({
        inline_keyboard: [
            // Текст кнопки      что вернётся на сервер после нажатия
            [{text: '1', callback_data:'1'}, {text: '2', callback_data:'2'}, {text: '3', callback_data:'3'}],
            [{text: '4', callback_data:'4'}, {text: '5', callback_data:'5'}, {text: '6', callback_data:'6'}],
            [{text: '7', callback_data:'7'},{text: '8', callback_data:'8'},{text: '9', callback_data:'9'}],
            [{text: '0', callback_data:'0'}]
        ]
    })
},

playAgainBtn: {
    reply_markup: ({
        inline_keyboard: [
            [{text: 'Попробовать ещё раз', callback_data:'/game'}]
        ]
    })
}




}



// const ImapClient = require('emailjs-imap-client').default;


// (async () => {
//     // Initialize imap client
//     const client = new ImapClient('imap.mail.ru', 993, {
//         logLevel: 1000,
//         auth: {
//             user: '',
//             pass: ''
//         }
//     });

//     // Handling imap mail error
//     client.onerror = (err) => {
//         throw new Error(`Error IMAP handling: ${err}`);
//     };

//     // Create mail connection
//     await client.connect();

//     // Getting messages on mail
//     const listMessages = await client.listMessages('INBOX', '1:*', ['uid', 'flags', 'envelope', 'body[]']);

//     for (const message of listMessages) {
//         const messageDate = new Date(message.envelope.date);
//         const messageSubject = message.envelope.subject;
//         const messageBody = message['body[]'];

//         console.log(messageSubject);
//     }

//     // Close mail connection
//     await client.close();
// })();
