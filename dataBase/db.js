const Datastore = require('nedb'); // подключение npm локальных БД

class Db {
    // создание локальной БД с автозагрузкой
    static recordsStore = new Datastore({ filename: './dataBase/records', autoload: true });

    static chatsStore = new Datastore({ filename: './dataBase/chats', autoload: true });
}

exports.module = Db