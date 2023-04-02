imap.once('ready', function() {
  openInbox(function(err, box) {
      if (err) throw err;
      var f = imap.seq.fetch(box.messages.total + ':*', { bodies: ['HEADER.FIELDS (FROM)','TEXT'] });
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

            console.log("BUFFER", buffer)


            if (info.which === 'TEXT')
              console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which), count, info.size);
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
      f.once('error', function(err) {
        console.log('Fetch error: ' + err);
      });
      f.once('end', function() {
        console.log('Done fetching all messages!');
        imap.end();
      });
    });
});


imap.once("ready", () => {

  openInbox(function (err, box) {
    if (err) throw err;
    const f = imap.seq.fetch("1:10", { // кол-во принимаемых сообщений
      bodies: "HEADER.FIELDS (FROM TO SUBJECT DATE)",
      struct: true,
    });


    f.on("message", (msg, seqno) => {
      
      // console.log("Message #%d", seqno);
      const prefix = "(#" + seqno + ") ";
      msg.on("body", (stream, info) => {
        let buffer = "";
        stream.on("data", (chunk) => {

          

          buffer += chunk.toString("utf8");
          
        });





        stream.once("end", () => {


          let msgRecord = {
            from: inspect(Imap.parseHeader(buffer).from),
            date: inspect(Imap.parseHeader(buffer).date),
            subject: inspect(Imap.parseHeader(buffer).subject),
          }
          console.log(msgRecord);

          db.find({date: msgRecord.date}, function (err, docs) { // найти и извлечь запись
          	if (!docs.length) {
              db.insert(msgRecord);
            } else {
              // console.log('Такая запись уже имеется');
            }
          });

          // db.remove({}, { multi: true }); // Очистить записи

          // console.log( // ВСЕ ПАРАМЕТРЫ
          //   prefix + "Parsed header: %s",
          //   inspect(Imap.parseHeader(buffer))
          // );
          // console.log(inspect(info));

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