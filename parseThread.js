
// Nombre de mail, 
// nombre de mots, 
// nombre de lettre, 
// Nombre de nouveaux mails
// Nombre de réponses à mes nouveaux mails
// Nombre de réponses directs à mes mails
// par adresse par mois
var cradle = require('cradle');

var parser = require('./lib/emailreplyparser').EmailReplyParser;



var db = new(cradle.Connection)().database('bredas');
//console.log(parser.read.toString());
var all = 1;
db.view('mail/all', function(err, res) {

  for(var i = 0; i < res.length; i++){
     if(res[i].value.text && res[i].value.fromBreda){
        var r = parser.read(res[i].value.text);
        db.merge(res[i].value._id,{fragment : r.fragments[0].content }, function(err, res){
          console.log(err)
        });
     } else if(res[i].value.fromBreda){
        console.log(res[i], "no text in it, too much size ?");
     }
  }
  
  // debug
  // var i = 564;
  // console.log(res[i].value.text, res[i].value._id);
  // var r = parser.read(res[i].value.text);
  // console.log("fragment "+i+" : \n"+ r.fragments[0].content);
 });
