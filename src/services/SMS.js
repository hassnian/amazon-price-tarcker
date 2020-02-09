
const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();


class SMS {
    constructor(){
        const accountSid = process.env.SID; 
        const authToken = process.env.AUTH_TOKEN; 
        this.client =  new twilio(accountSid, authToken);
    }
    sendSMS(body){
        this.client.messages.create({
            body: body,
            to: process.env.TO_NUMBER,  
            from: process.env.FROM_NUMBER 
        })
        .then((message) => console.log("message sent"));
    }
}

module.exports = SMS