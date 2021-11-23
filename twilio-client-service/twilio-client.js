const ENV = require("../utils/env");
const { TwilioClient } = require("../utils/config");

let sendMessage = (content, customerNumber) => {
  TwilioClient.messages
    .create({
      from: ENV.TWILIO_WHATSAPP_NUM,
      body: content,
      to: customerNumber
    })
    .then(message => console.log("Success::sendMessage", message.sid));
};

module.exports = { sendMessage };
