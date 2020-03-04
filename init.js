const exec = require('child_process').exec;
i = 1
while(i == 1){
let date  = new Date()
let time = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
//console.log(time)
     if(time == "13:23:0"){
               i = 0
               exec('node sonarqube.js')
             while(i == 0){
               let date  = new Date()
               let time = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
               //console.log(time+"----->")
                    if(time == "13:24:0"){
                         i = 1
                    }
               }
     }  
}