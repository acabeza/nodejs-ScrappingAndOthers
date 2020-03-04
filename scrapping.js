let axios = require('axios');
let cheerio = require('cheerio');
let fs = require('fs'); 
axios.post('http://10.45.17.147:9000/issues?createdAfter=2019-07-01&resolved=false&severities=BLOCKER%2CCRITICAL%2CMAJOR')
    .then((response) => {
        if(response.status === 200) {
            const html = response.data;
            console.log(response.data);
            const $ = cheerio.load(html); 
            let devtoList = [];
            $('body').each(function(i, elem) {
                devtoList[i] = {
                    name: $(this).children().text()
                }      
            });
            // const devtoListTrimmed = devtoList.filter(n => n != undefined )
            // fs.writeFile('datosSonar.json', 
            //               JSON.stringify(devtoListTrimmed, null, 4), 
            //               (err)=> console.log('File successfully written!'))
    }
}, (error) => console.log(err) );