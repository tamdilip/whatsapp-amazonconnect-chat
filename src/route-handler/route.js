const Database = require("../dynamo-db-service/dynamo-db");
const ConnectService = require("../amazon-connect-service/connect");
const Websocket = require("../websocket-client-service/websocket-client");

let sendWhatsappMessageToConnect = async req => {
  try {
    const { body: incomingData } = req;
    const { Item: existingCustomer } = await Database.getRecordByNumber(incomingData.From);
    const existingSocket = Websocket.activeClients.find(s => s.customerNumber === incomingData.From);

    if (!existingSocket || !existingCustomer || new Date(existingCustomer.connectionExpiry) < new Date()) {
      const connectionInfo = await ConnectService.initialiseChat(incomingData);
      const savedCustomer = await Database.addCustomerRecord(connectionInfo);
      const socketData = {
        websocketUrl: connectionInfo.participantConnectionResponse.Websocket.Url,
        customerNumber: incomingData.From
      };
      savedCustomer && Websocket.establishConnection(socketData);
    } else {
      if (incomingData.Body === "call me")
        ConnectService.startOutboundCall(existingCustomer.customerNumber);
      const sentMessage = await ConnectService.sendMessageToChat({ existingCustomer, incomingData });
      sentMessage && Database.updateRecordByCustomerNumer(existingCustomer.customerNumber);
    }
  } catch (err) {
    console.log("Error::sendWhatsappMessageToConnect", err);
  }
};

module.exports = { sendWhatsappMessageToConnect };
