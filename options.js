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