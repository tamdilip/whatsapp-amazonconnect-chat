const W3CWebSocket = require("websocket").w3cwebsocket;
const DatabaseService = require("../dynamo-db-service/dynamo-db");
const ConnectService = require("../amazon-connect-service/connect");
const TwilioService = require("../twilio-client-service/twilio-client");

//Persists Amazon Connect Chat Websocket client connections
let activeClients = [];

let establishConnection = masterConnectData => {
  let client = new W3CWebSocket(masterConnectData.websocketUrl);

  client.onerror = function () {
    console.log("Websocket::Connection Error");
  };

  client.onopen = function () {
    console.log("WebSocket::Client Connected");
    client.send(
      JSON.stringify({
        topic: "aws/subscribe",
        content: { topics: ["aws/chat"] }
      })
    );
  };

  client.onclose = function () {
    console.log("Websocket::Client connection closed");
  };

  client.onmessage = async function (e) {
    const data = e && e.data && JSON.parse(e.data),
      { content } = data;

    if (typeof content === "string") {
      const socketMessage = JSON.parse(content);
      console.log("CONNECT::", socketMessage.ParticipantRole, "::", socketMessage.ContentType)
      if (socketMessage.ContentType === "application/vnd.amazonaws.connect.event.participant.joined" && socketMessage.ParticipantRole === "AGENT") {
        const customerRecord = await DatabaseService.getRecordByContactId(socketMessage.InitialContactId);
        if (customerRecord && customerRecord.initialMessage !== "-SENT-")
          ConnectService.sendMessageToChat({ existingCustomer: customerRecord, incomingData: { Body: customerRecord.initialMessage } });
      }
      if (socketMessage.ContentType === "text/plain" && socketMessage.ParticipantRole === "AGENT") {
        const customerRecord = await DatabaseService.getRecordByContactId(socketMessage.InitialContactId);
        if (customerRecord)
          TwilioService.sendMessage(socketMessage.Content, customerRecord.customerNumber);
      }
    }
  };

  masterConnectData.client = client;
  const socketExist = activeClients.find(s => s.customerNumber === masterConnectData.customerNumber);
  !socketExist && activeClients.push(masterConnectData);
};

module.exports = { activeClients, establishConnection };
