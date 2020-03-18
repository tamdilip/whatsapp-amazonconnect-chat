const ENV = require("../config/env");
const { AWS } = require("../config/config");

const connect = new AWS.Connect();
const connectparticipant = new AWS.ConnectParticipant();

let initialiseChat = incomingData => {
  return new Promise((resolve, reject) => {
    const startChatParams = {
      InstanceId: ENV.CONNECT_INSTANCE_ID,
      ContactFlowId: ENV.CONNECT_CONTACT_FLOW_ID,
      ParticipantDetails: {
        DisplayName: incomingData.From
      },
      Attributes: {
        Channel: "CHAT"
      }
    };
    connect.startChatContact(startChatParams, function (err, startChatResponse) {
      if (err) {
        console.log("Error::startChatContact", err);
        reject(err);
      } else {
        console.log("Success::startChatContact");
        const participantConnectionParams = {
          ParticipantToken: startChatResponse.ParticipantToken,
          Type: ["WEBSOCKET", "CONNECTION_CREDENTIALS"]
        };
        connectparticipant.createParticipantConnection(participantConnectionParams, function (err, participantConnectionResponse) {
          if (err) {
            console.log("Error::createParticipantConnection", err);
            reject(err);
          } else {
            console.log("Success::createParticipantConnection");
            resolve({ incomingData, startChatResponse, participantConnectionResponse });
          }
        }
        );
      }
    });
  });
};

let sendMessageToChat = ({ existingCustomer, incomingData }) => {
  return new Promise((resolve, reject) => {
    var sendMessageParams = {
      ConnectionToken: existingCustomer.connectionToken,
      Content: incomingData.Body,
      ContentType: "text/plain"
    };
    connectparticipant.sendMessage(sendMessageParams, function (err, data) {
      if (err) {
        console.log("Error::sendMessageToChat", err);
        reject(err);
      } else {
        console.log("Success::sendMessageToChat");
        resolve(data);
      }
    });
  });
};

let startOutboundCall = customerNumber => {
  const destNumber = customerNumber.replace("whatsapp:", "");
  const outboundParams = {
    InstanceId: ENV.CONNECT_INSTANCE_ID,
    ContactFlowId: ENV.CONNECT_CONTACT_FLOW_ID,
    SourcePhoneNumber: ENV.CONNECT_SOURCE_NUMBER,
    DestinationPhoneNumber: destNumber || ENV.CONNECT_DESTINATION_NUMBER,
    Attributes: {
      name: customerNumber
    }
  };
  connect.startOutboundVoiceContact(outboundParams, function (err, data) {
    if (err) console.log("Error::startOutboundVoiceContact", err);
    else console.log("Success::startOutboundVoiceContact", data.ContactId);
  });
};

module.exports = { initialiseChat, sendMessageToChat, startOutboundCall };
