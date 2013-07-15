
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

var toReduceW = {}, toReduceM = {};

var emit = function(k,v,toReduce){
  toReduce[k] || (toReduce[k] = []);
  toReduce[k].push(v);
  return toReduce;
};


db.view('mail/all', function(err, res) {
  res.forEach(function(row){
    var doc = row;
    if(doc.name && doc.formatedDate){
      toReduceM = emit(doc.name+"-"+doc.formatedDate.year+"-"+doc.formatedDate.month,1,toReduceM);
      toReduceW = emit(doc.name+"-"+doc.formatedDate.hour+"-"+doc.formatedDate.dow,1,toReduceW);       
      console.log(doc.name+"-"+doc.formatedDate.year+"-"+doc.formatedDate.month)
    }
  });


  var csvM = [["id","valeur"]];
  var csvW = [["id","valeur"]];

  var r = function(keys, values) {
    var s = 0;
    values.map(function(v){
      s+=v;
    });
    return s;
  };

  for(var k in toReduceM){
    csvM.push([k, r(k, toReduceM[k])]);
  }

  for(var k in toReduceW){
    csvW.push([k, r(k, toReduceW[k])]);
  }

  var csvMonth = csvM.map(function(line){
      return line.join(",");
  }).join("\n");

  var csvWeek = csvW.map(function(line){
      return line.join(",");
  }).join("\n");

  fs.writeFile('chronoMonths.csv', csvMonth, function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });


  fs.writeFile('chronoWeek.csv', csvWeek, function (err) {
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

