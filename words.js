
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

var fs = require("fs");

var toReduce = {};

var emit = function(k,v){
  toReduce[k] || (toReduce[k] = []);
  toReduce[k].push(v);
}

var rmWords =  [ 
  'com','pour', '2012', '2013', '2011', '2010',
  'vous', 'est', 'des', 'que', 'pas', 'nous', 'les', 
  'tous', 'vos', 'quand', 'tes', 'bon', 'bien', 'oui',
  'êtes', '...', 'été', 'était', 'peu', 'plus', 'ses', 'sera', 'peux', 'peut', 'assez', 'aller', 'pense',
  'avec', 'sur', 'une', 'qui', 'par', 'tes', 'puis', 'bonne', 'donc', 'voir', 'soit',
  'tout', 'mais', 'soir', 'dans', 'mon', 'serait', 'serai', 'sont',
  'cette', 'mes', 'faire', 'fait', 'moi', 'suis', 'chez', 'comme', 'autres', 'avoir', 'encore',
  'depuis', 'votre', 'aussi', 'sais', 'ceux', 'être', 'celui',
  'envoyé', 'iphone', 'blackberry', 'terminal', 'bouygues', 'telecom', 'entre', '----'
 
  // 'philippe', 'rivi', 'piercus',
  // 'sebastien', 'wathle', '0100', 
  // 'caro0808', 'donc', 'mai', 'biz', 'thu', 'peut', 'sinon', 'vos', 'objet', 'bredas'
  // 'lucasbonan2', 'pierre', 'colle', 'bien', 'plus', 'centraliens', 'mailto', 'bredasandsistas', 'lucas', 'bonan', 
  // 'envoy', 'iphone', 'crit', 'rafin', 'elodie', 'nassoy', 'raphaelle', 'seb', 
  //   '0200', 'julien', 'jean',  'caro', 'bon',
  // 'yahoo', 'wrote', 'lafon', 'laetitia', 'jpez78', 'tre',

];



db.view('mail/all', function(err, res) {
  res.forEach(function(row){
    var doc = row;
    if(doc.name){
       var f = {};
       
       if(doc.tokens){
         
         for(var i = 0; i < doc.tokens.length; i++){
           if(doc.tokens[i].length > 2) {
             var t = doc.tokens[i].toLowerCase();
             f[t] || (f[t] = 0);
             f[t] ++;
           }
         }        
         f.nChar = doc.stats.nChar;
         f.nWords = doc.stats.nWords;
         f.nNew = !(doc.inReplyTo || doc.references);

       }

       f.nMail = 1;
       f.nSmileys = doc.smileys ? doc.smileys.length : 0;
       f.size = doc.size;
       
       emit(doc.name,f);
    }
    
  });

  var res = {}, arr = {}, csv = [];
  var n = 0;

  var toCsv = function(o){
    var a = [o["id"],o["nMail"],o["nChar"],o["nWords"],o["nNew"],o["size"],o["nSmileys"]];
    for(var i = 0; i < 11; i++){
      a.push(o["w"+i]);
      a.push(o["f"+i]);
    }
    csv.push(a);  
  };


  var headers = {"id": "id", "nSmileys" : "nSmileys", "size":"size", "nMail" : "nMail", "nChar" : "nChar", "nWords" : "nWords", "nNew" : "nNew"};
  for(var i = 0; i < 11; i++){
    headers["w"+i] = "w"+i;
    headers["f"+i] = "f"+i;
  }

  toCsv(headers);

  for(var k in toReduce){
    //console.log(k);
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
    
    var excluded = ["nMail", "nChar", "nWords", "nNew", "size", "nSmileys"];
    
    arr[k] = [];
    for(var j in res[k]) if(excluded.indexOf(j) == -1){
      if(rmWords.indexOf(j) === -1){
        arr[k].push([j,res[k][j]])
      }
    }

    arr[k] = arr[k].sort(function(a,b){
      return b[1] - a[1];
    });
    

    arr[k] = arr[k].slice(0,10);

    for(var i = 0; i < arr[k].length; i++){
      res[k]["w"+i] = arr[k][i][0];
      res[k]["f"+i] = arr[k][i][1];
    }

    res[k]["id"] = k;

    toCsv(res[k]);

  }

  var csvTxt = csv.map(function(line){
      return line.join(",");
  }).join("\n");

  fs.writeFile('stats.csv', csvTxt, function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });
});




// Nombre de mail, nombre de mots, nombre de lettre, par adresse par heure de la semaine



// Fréquence des mots dans les emails par personne



// nombre de réponses su



// Nombre de mail, nombre de mots, nombre de lettre, par adresse par heure de la semaine



// Fréquence des mots dans les emails par personne



// nombre de réponses su

