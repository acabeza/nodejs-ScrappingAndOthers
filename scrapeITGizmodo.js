var scrapeIT = require("scrape-it");

scrapeIT("https://es.gizmodo.com/", {
     titles: {
          listItem: ".dfwuc8-0",
          data: {
               span: {
                    selector: "span"
               }
          }
     },
     titles2: {
          listItem: ".dfwuc8-0",
          data: {
               href: {
                    attr: "href"
               }
          }
     }
     
}).then(({data}) => console.log(data)).catch(console.error)