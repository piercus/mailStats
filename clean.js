// Nombre de mail, 
// nombre de mots, 
// nombre de lettre, 
// Nombre de nouveaux mails
// Nombre de réponses à mes nouveaux mails
// Nombre de réponses directs à mes mails
// par adresse par mois
var cradle = require('cradle');

var db = new(cradle.Connection)().database('bredas');

var members = require('./config.js').members ;

db.view('mail/all', function(err, res) {
  console.log(err);
  res.forEach(function(row){
    if(!(row.from && row.from.length)){
      return
    }
    var f = row.from[0].address.toLowerCase(), member = null;
    for (var i in members) if (members.hasOwnProperty(i)){
      if(members[i].indexOf(f) !== -1){
        member = i;
      }
    }
    if(member) {
      console.log(member);
      db.merge(row._id,{name : member, mail : true, fromBreda : true}, function(err, res){
        console.log(err)
      });
    }
    
  });
});


// Nombre de mail, nombre de mots, nombre de lettre, par adresse par heure de la semaine



// Fréquence des mots dans les emails par personne



// nombre de réponses su

