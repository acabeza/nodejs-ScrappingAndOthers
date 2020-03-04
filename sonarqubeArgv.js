//Frameworks
const axios = require("axios")
const template = require("template-js")
const fs = require('fs');
const nodemailer = require("nodemailer");
//Variables
var date = new Date();
var dateInfo = process.argv.slice(2);
var dateInfoRef = "";
var blocker = [],critical = [],major = [], ruleData, ruleName = [], FECHA = []
var urlSonarIssues = ""
var urlSonarRules = ""

lastDates(FECHA)
axios.get(urlSonarIssues+"createdAfter="+dateInfo[0]+"&resolved=false&severities=MAJOR")
     .then(function(data){
     major.push(data.data.total)
}).then(function(){
axios.get(urlSonarIssues+"createdAfter="+dateInfo[0]+"&resolved=false&severities=CRITICAL")
     .then(function(data){
     critical.push(data.data.total)
}).then(function(){
axios.get(urlSonarIssues+"createdAfter="+dateInfo[0]+"&resolved=false&severities=BLOCKER")
     .then(function(data){
     blocker.push(data.data.total)
}).then(function(){
          majorF(major, urlSonarIssues)
          .then(function(){
                    criticalF(critical, urlSonarIssues)
                    .then(function(){
                              blockerF(blocker, urlSonarIssues)
                              .then(function(){
                                   createFile(urlSonarIssues, urlSonarRules, dateInfo);
                         })
                    })
               })
          })   
     })     
}).catch(console.error);

//Me recoge los resultados de comparación de fecha de MAJOR
async function majorF(major, urlSonarIssues) {

     for (let i = 0; i <=3 ; i++) {
          let response  = await axios.get(urlSonarIssues+"createdAfter="+dateInfo[0]+"&createdBefore="+FECHA[i]+"&resolved=false&severities=MAJOR")
               major.push(response.data.total)
     }
     console.log(major)
     return major
}
//Me recoge los resultados de comparación de fecha de CRITICAL
async function criticalF(critical, urlSonarIssues) {

     for (let i = 0; i <=3 ; i++) {
          let response  = await axios.get(urlSonarIssues+"createdAfter="+dateInfo[0]+"&createdBefore="+FECHA[i]+"&resolved=false&severities=CRITICAL")
               critical.push(response.data.total)
     }
     console.log(critical)
     return critical
}
//Me recoge los resultados de comparación de fecha de BLOCKER
async function blockerF(blocker, urlSonarIssues) {

     for (let i = 0; i <=3 ; i++) {
          let response  = await axios.get(urlSonarIssues+"createdAfter="+dateInfo[0]+"&createdBefore="+FECHA[i]+"&resolved=false&severities=BLOCKER")
               blocker.push(response.data.total)
     }
     console.log(blocker)
     return blocker
}
//Me crea un fichero mediante un template
async function createFile(urlSonarIssues, urlSonarRules, dateInfo){
     let response = await axios.get(urlSonarIssues+"createdAfter="+dateInfo[0]+"&resolved=false&severities=BLOCKER%2CCRITICAL%2CMAJOR&facets=rules&facetMode=count")
               ruleData = response.data.facets[0].values
               for (let i = 0; i<ruleData.length; i++){
                    let responseN = await  axios.get(urlSonarRules+"key="+ruleData[i].val);
                    ruleName.push(responseN.data.rule.name)
                    if(ruleName.length === ruleData.length){
                         var tempSonarChart = new template("templateChart.html", {
                                   BLOCKER: blocker,
                                   CRITICAL:  critical,
                                   MAJOR: major,
                                   RULEDATA: ruleData,
                                   RULENAME: ruleName,
                                   FECHA: FECHA
                         })
                         let file = date.getFullYear()+""+(date.getMonth()+1)+""+date.getDate()+""+date.getHours()+""+date.getMinutes()+""+date.getSeconds()+".html"
                         fs.writeFile(file, tempSonarChart.toString(), "utf8",(err) => {
                         if (err) throw err;
                              console.log('Fichero creado!!!');
                         });
                         sendEmail(file).catch(console.error)
                    }
               }
}
//Envia mediante correo los datos obtenidos del sonarqube y adjunta el fichero correspiente a esos datos
async function sendEmail(file){

     var tempSonar = new template("template.html", {
               BLOCKER: blocker,
               CRITICAL:  critical,
               MAJOR: major,
               RULEDATA: ruleData,
               RULENAME: ruleName,
               FECHA: FECHA
     })

     let transport = nodemailer.createTransport({
          host: "smtp-mail.outlook.com",
          port: 587,
          secure: false,
          auth:{
               user: "@.com",
               pass: ""
          }
     })

     let info = await transport.sendMail({
          from: '@.com', 
          to: "@.com", 
          subject: "Data Sonarqube", 
          attachments: [{
               filename: file,
               path: "./"+file
          }],
           
          html: tempSonar.toString()
        });

console.log("Mensaje enviado: %s", info.messageId);
}
//Me organiza las fechas en un array
async function lastDates(FECHA){
     for(i = 28; i >= 0; i-=7){
         let fecha  = new Date(date.getFullYear(),date.getMonth(),date.getDate()-i, date.getHours())
         FECHA.push(fecha.getFullYear()+"-"+(month(fecha.getMonth()+1))+"-"+(days(fecha.getDate())))
          if(FECHA.length==5){
                FECHA.forEach(element => {
                console.log(element)
                })
           }
      }
}
//Añade un 0 a la izquierda de un valor menor a 10
function days(day){
     if(day < 10){
          return '0'+day
     }else{
          return day
     }
}
//Añade un 0 a la izquierda de un valor menor a 10
function month(month){
     if(month < 10){
          return '0'+month
     }else{
          return month
     }
}