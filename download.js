var Imap = require('imap'),
    inspect = require('util').inspect;

var cradle = require('cradle');
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');
var db = new(cradle.Connection)().database('bredas');
var MailParser = require("mailparser").MailParser;

var config = require('/config.js')

var imap = new Imap(config.imap);

function show(obj) {
  return inspect(obj, false, Infinity);
}

function die(err) {
  console.log('Uh oh: ' + err);
  process.exit(1);
}

function openInbox(cb) {
  imap.connect(function(err) {
    if (err) die(err);
    imap.openBox('INBOX', true, cb);
  });
}

//download body of the less fat emails


openInbox(function(err, mailbox) {
  if (err) die(err);
  //imap.search([ 'ALL',['SINCE', 'March 16 2009'], ['BEFORE', 'March 18 2009'] ], function(err, results) {
  imap.search([['UID', '1:*'], ['SMALLER', 91099]], function(err, results) {
  //imap.search([['UID', '168'], ['SMALLER', 91099]], function(err, results) {
    if (err) die(err);
    imap.fetch(results,
      {struct : true, size : true},
      { headers: {parse : false},
        body : true,
        cb: function(fetch) {


          fetch.on('message', function(msg) {
            var dateF = new Date();
            var mailparser = new MailParser();
            msg.on('data', function(chunk) {
              //console.log(chunk.toString())
              mailparser.write(chunk);
              //console.log("write",chunk.toString())
            });

            msg.on('end', function() {
              mailparser.end();
              //console.log("end")
            });            

            mailparser.on('end', function(mail) {
              //console.log("save")
              db.save(msg.uid.toString(), mail, function(err, res){
                  console.log("db parsed and saved "+msg.uid.toString()+" in "+((new Date()) - dateF).toString()+" ms");
              });
            });
          });
        }
      }, function(err) {
        if (err) throw err;
        console.log('Done fetching all messages!');
        imap.logout();
      }
    );
  });
});


//get size of all emails

openInbox(function(err, mailbox) {
  if (err) die(err);
  //imap.search([ 'ALL',['SINCE', 'March 16 2009'], ['BEFORE', 'March 18 2009'] ], function(err, results) {
  imap.search([['UID', '1:*']], function(err, results) {
  //imap.search([['UID', '168'], ['SMALLER', 91099]], function(err, results) {
    if (err) die(err);
    imap.fetch(results,
      {struct : true, size : true},
      { body : false,
        headers : ["from",'to',"date"],
        cb: function(fetch) {
          console.log(fetch);

          fetch.on('message', function(msg) {
            var dateF = new Date();
            var mailparser = new MailParser();

            msg.on('end', function() {
              mailparser.write(msg[']']);
              mailparser.end()
              return; 
            });            

            mailparser.on('end', function(mail) {
              mail.size = msg.size;
              db.merge(msg.uid.toString(), mail, function(err, res){
                  console.log("db parsed and saved headers+size "+msg.uid.toString()+" in "+((new Date()) - dateF).toString()+" ms");
              });
            });
          });
        }
      }, function(err) {
        if (err) throw err;
        console.log('Done fetching all messages!');
        imap.logout();
      }
    );
  });
});