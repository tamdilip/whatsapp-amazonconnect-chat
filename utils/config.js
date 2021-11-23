const ENV = require("./env");

const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: ENV.ACCESS_KEY,
  secretAccessKey: ENV.SECRET_ACCESS_KEY,
  region: "us-east-1"
});

const TwilioClient = require("twilio")(
  ENV.TWILIO_ACCOUNT_SID,
  ENV.TWILIO_AUTH_TOKEN
);

module.exports = { AWS, TwilioClient };
