# whatsapp-amazonconnect-chat
[![Generic badge](https://img.shields.io/badge/Build-Passing-blue.svg)]() [![Generic badge](https://img.shields.io/badge/Issues-0%20Open-green.svg)]()

Node JS server for transferring real-time messages between WhatsApp and Amazon Connect Chat using Twilio's WhatsApp Business API Sandbox via Server-Side Websocket Clients.

This proof-of-concept is an integration between WhatsApp and Amazon Connect Chat in realtime to leverage customer support by live agents without any BOT Madness 🤪 .

### Architecture
![Image of architecture](https://raw.githubusercontent.com/tamdilip/whatsapp-amazonconnect-chat/master/docs/WhatsApp-AmazonConnect.jpg)

### Usage of SDK API's 
![Image of sdk-api-flow](https://raw.githubusercontent.com/tamdilip/whatsapp-amazonconnect-chat/master/docs/SDK-API-FLOW.png)


## Local Testing
==================

#### Prerequisites
* Create and configure an [Amazon Connect Instance](https://console.aws.amazon.com/connect/onboarding).
* Create and configure an [Twilio WhatsApp API Sandbox](https://www.twilio.com/console/sms/whatsapp/sandbox).
* Create and configure an [Dynamo DB Table](https://console.aws.amazon.com/dynamodb/home?region=us-east-1#create-table:).
* Update the required environmet variables in `config/env.js`

#### Node Server setup

```sh
        $ git clone https://github.com/tamdilip/whatsapp-amazonconnect-chat.git
        $ cd whatsapp-amazonconnect-chat
        $ npm i
```

#### Tunneling 
```sh
        $ npm install ngrok -g
        $ ngrok http 3000
```

#### Post Installation
* Configure the ngrok url/Node server host URL in Twilio WhatsApp Sandbox - [Webhook](https://www.twilio.com/console/sms/whatsapp/sandbox)

    > `WHEN A MESSAGE COMES IN` - https://xxxxxxxx.ngrok.io/
    
    > `STATUS CALLBACK URL` - https://xxxxxxxx.ngrok.io/status-callback



* All set now, keep your Amazon Connect Chat Interface as Available and try sending a text from your whatsapp to Twilio-WhatsApp-Business-Number and continue the conversation bi-directionally 😁😎
* Additionally if the customer texts as `call me` (update the text/chat-command as you like), it forwards the message to agent chat and also automatically places an outgoing voice call bidirectionally. 

#### Notes
* Looked for a suitable AWS service which provides serverless kind of approach to maintain an active websocket client connections on the serverside without any overhead efforts for scalability, load balancing, maintenance.
* Lambda doesn't fit for this as it has execution time-out limitation, also don't want to spin up an EC2 instance/EKS/Fargate which requires a bit effort on maintaining and scalability just to host an active nodejs server.
* Tested messaging simultaneously from multiple whatsapp numbers, all has been properply placed to the number of available agents.
* In case of agent drop-out and reconnection, the support was placed correctly with the chat history conversation and also to the same agent on queue based on his availability as first preference.
* Placing Voice call on `call me` was not tested in realtime, on how it behaves when an agent is active with chat support and the same agent is expected to get the call from the customer he's supporting. As per Amazon connects policy, an agent can either be available for chat or voice at a time.

#### Bookmarks
* [Amazon Connect Chat CCP](https://dilip-chat-dev.awsapps.com/connect/login)
* [AWS security credentials](https://console.aws.amazon.com/iam/home?#/security_credentials)
* [AWS Dynamo DB Table](https://console.aws.amazon.com/dynamodb/home?region=us-east-1#tables:selected=whatsappconnect;tab=items)
* [Twilio WhatsApp Business API Sandbox](https://www.twilio.com/console/sms/whatsapp/sandbox)
* [AWS Connect - JavaScript SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Connect.html)
* [AWS Connect Participant- JavaScript SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConnectParticipant.html)




**Happy coding :) !!**
