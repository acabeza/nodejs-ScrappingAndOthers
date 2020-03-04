const nodemailer = require("nodemailer");

async function main(){
     let transport = nodemailer.createTransport({
          host: "smtp-mail.outlook.com",
          port: 587,
          secure: false,
          auth:{
               user: "acabezam@everis.com",
               pass: "Ac13012020"
          }
     })

     let info = await transport.sendMail({
          from: 'acabezam@everis.com', // sender address
          to: "acabezam@everis.com", // list of receivers
          subject: "Hello", // Subject line
          text: "Hello world?", // plain text body
          html: "<b>Hello world?</b>" // html body
        });

console.log("Message sent: %s", info.messageId);
// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

// Preview only available when sending through an Ethereal account
console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);