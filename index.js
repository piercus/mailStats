
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
  tokenizer = new natural.WordTokenizer();
var toReduce = {};

var emit = function(k,v){
  toReduce[k] || (toReduce[k] = []);
  toReduce[k].push(v);
}

var rmWords =  [ 
  'com','pour','gmail', '2012', '2013', '2011', '2010',
  'vous', 'est', 'hotmail', 'des', 'que', 'pas', 
  'from', 'subject', 'date', 'nous', 'les', 'tous', 
  'avec', 'sur', 'une', 'qui', 'mailto', 'bredasandsistas', 
  'vendredi', 'envoy', 'iphone', 'crit', 'lucas', 'bonan', 
  'lucasbonan2', 'pierre', 'colle', 'bien', 'plus', 'centraliens',
  'tout', 'mais', 'www', 'map', 'talk', 'talkmap', 'apr', 
  'soir', 'dans', 'mon', 'http', 'serait', 'serai', 'net', 'nov',
  'cette', 'mes', 'rafin', 'elodie', 'nassoy', 'raphaelle', 'seb', 
  'vicaire', 'faire', 'fait', 'moi', 'suis', 'chevriau', 
  'chez', 'neuviale',
  '0200', 'julien', 'jean', 'par', 'caro', 'bon',
  'yahoo', 'wrote', 'lafon', 'laetitia', 'jpez78', 'tre', 
  'philippe', 'rivi', 'piercus',
  'sebastien', 'wathle', '0100', 
  'caro0808', 'donc', 'mai', 'biz', 'thu', 'peut', 'sinon', 'vos', 'objet', 'bredas'
];



db.view('mail/all', function(err, res) {
  res.forEach(function(row){
    var doc = row;
    if(doc.name){
       var f = {};
       for(var i = 0; i < doc.tokens.length; i++){
         if(doc.tokens[i].length > 2) {
           var t = doc.tokens[i].toLowerCase();
           f[t] || (f[t] = 0);
           f[t] ++;
         }
       }
       emit(doc.name,f);
    }
    
  });

  var res = {}, arr = {};

  for(var k in toReduce){
    console.log(k);
    var r = function(keys, values) {
      var o = {};
      for(var i = 0; i < values.length; i++){
        for(var j in values[i]){
          o[j] || (o[j] = 0);
          o[j] += values[i][j];
        }
      }
      return o;
    };
    res[k] = r(k, toReduce[k]);
    arr[k] = [];
    for(var j in res[k]){
      if(rmWords.indexOf(j) === -1){
        arr[k].push([j,res[k][j]])
      }
    }
    arr[k] = arr[k].sort(function(a,b){
      return b[1] - a[1];
    }).slice();
    arr[k] = arr[k].slice(0,10);
  }
  console.log(arr);
});




// Nombre de mail, nombre de mots, nombre de lettre, par adresse par heure de la semaine



// Fréquence des mots dans les emails par personne



// nombre de réponses su



// Nombre de mail, nombre de mots, nombre de lettre, par adresse par heure de la semaine



// Fréquence des mots dans les emails par personne



// nombre de réponses su

