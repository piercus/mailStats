// Nombre de mail, 
// nombre de mots, 
// nombre de lettre, 
// Nombre de nouveaux mails
// Nombre de réponses à mes nouveaux mails
// Nombre de réponses directs à mes mails
// par adresse par mois
var cradle = require('cradle');

var db = new(cradle.Connection)().database('bredas');

var natural = require('natural'),
  tokenizer = new natural.WordTokenizer({
      pattern : /[^a-zA-Z0-9éèàê@:\/\.\#\-\?=]+/
  });

db.view('mail/all', function(err, res) {
  res.forEach(function(row){
    var stats = {};
    if(row.name && row.fragment){
      var tokens = tokenizer.tokenize(row.fragment), nC = 0;
      for(var i = 0; i < tokens.length; i++){
        nC += tokens[i].length;
      }

      var date = new Date(row.headers.date);

      var stats = {
        nWords : tokens.length,
        nChar : nC
      };

      var formatedDate = {        
        year : date.getFullYear(),
        dow : date.getDay(),
        month : date.getMonth(),
        hour : date.getHours()
      };

      db.merge(row._id, {
        stats : stats, 
        tokens : tokens, 
        smileys : row.fragment.match(/\s((?::|;|=)(?:-)?(?:\)|D|P))/g),
        formatedDate : formatedDate
      }, function(err){
        if(err) console.log(err);
        console.log("saved", stats,row._id)
      });
    }
    
  });
});