# whatsapp-amazonconnect-chat

[![Abrir en CodeSandbox](https://img.shields.io/badge/CodeSandbox-Ready--to--Code-green?style=flat-square&logo=codesandbox)](https://codesandbox.io/s/github/tamdilip/whatsapp-amazonconnect-chat)

Servidor Node JS para transferir mensajes en tiempo real entre WhatsApp y Amazon Connect Chat utilizando el entorno de pruebas de la API empresarial de WhatsApp de Twilio a través de los clientes Websocket del lado del servidor.

Esta prueba de concepto es una integración entre WhatsApp y Amazon Connect Chat en tiempo real para aprovechar el soporte al cliente por parte de agentes en vivo sin BOT Madness 🤪.

### Arquitectura

![Imagen de arquitectura](https://raw.githubusercontent.com/tamdilip/whatsapp-amazonconnect-chat/master/docs/WhatsApp-AmazonConnect.jpg)

### Uso de las API del SDK

![Imagen de sdk-api-flow](https://raw.githubusercontent.com/tamdilip/whatsapp-amazonconnect-chat/master/docs/SDK-API-FLOW.png)

## Pruebas locales

==================

### Requisitos previos

- Cree y configure una [Instancia de Amazon Connect](https://console.aws.amazon.com/connect/onboarding).
- Cree y configure su [Twilio WhatsApp API Sandbox](https://www.twilio.com/console/sms/whatsapp/sandbox).
- Cree y configure una [Dynamo DB Table](https://console.aws.amazon.com/dynamodb/home?region=us-east-1#create-table:).
- Actualice las variables de entorno requeridas en `config/env.js`

Para continuar, podemos profundizar en el archivo de configuración env.js en la carpeta /config del repositorio, lo que nos da una lista de parámetros a completar por completo, para que todo funcione correctamente.

Estos parámetros deben establecerse como variables de entorno, sin embargo, también es posible modificar el archivo env.js para reemplazar los distintos process.env. PARAMETERNAME directamente con su valor respectivo (entre comillas ")

```javascript
module.exports = {
  TABLE_NAME: process.env.TABLE_NAME,
  TWILIO_WHATSAPP_NUM: process.env.TWILIO_WHATSAPP_NUM,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_WHATSAPP_NUM: process.env.TWILIO_WHATSAPP_NUM,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_ACCOUNT_SID: process.env.TWILIO_WHATSAPP_NUM,
  TWILIO_ACCOUNT_SID: process.env.SECRET_ACCESS_KEY,
  CONNECT_INSTANCE_ID: process.env.CONNECT_INSTANCE_ID,
  CONNECT_CONTACT_FLOW_ID: process.env.CONNECT_CONTACT_FLOW_ID,
  CONNECT_SOURCE_NUMBER: process.env.CONNECT_SOURCE_NUMBER,
  CONNECT_DESTINATION_NUMBER: process.env.CONNECT_DESTINATION_NUMBER,
};
```

- `TABLE_NAME` sugiere que necesitamos una tabla en dynamoDB cuyo nombre se indicará en este campo. En particular, la tabla requiere tener "`customerNumber`" como clave principal.
- `TWILIO_WHATSAPP_NUM`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` son respectivamente el número de teléfono, la cuenta SID y el token de autenticación que nos proporcionó Twilio:

  - El primero requiere un prefijo y es el indicado en [esta página](https://www.twilio.com/console/sms/whatsapp/sandbox) de tu cuenta Twilio, precedido por la cadena `'whatsapp:'`, produciendo así algo como esto: `"whatsapp: +000000000000"`. El número debe respetar el formato [E.164](https://www.twilio.com/docs/glossary/what-e164).
  - El Token SID y AUTH son los indicados en [esta página](https://www.twilio.com/console/project/settings) de Twilio (las Credenciales de TEST solo le permiten recibir pero no enviar mensajes, se necesitan Credenciales LIVE para probar ambas direcciones).

- `ACCESS_KEY`, `SECRET_ACCESS_KEY` son las credenciales AWS de un “usuario de acceso programático”, que se pueden generar en AWS IAM, al que se le deben asignar las políticas que le permiten acceder a Amazon Connect y DynamoDB.
- El `CONNECT_INSTANCE_ID` se indica en la parte final de la cadena ARN, la que sigue a "`instance/`", que es visible al hacer clic en el alias de la instancia de conexión en [esta página](https://console.aws.amazon.com/connect/home)
- El `CONNECT_CONTACT_FLOW_ID` también se indica al final de su cadena ARN.

  Para verlo, debe acceder a su instancia de Amazon Connect con el nombre de usuario y la contraseña establecidos en la primera configuración y luego presionar el icono con las 3 flechas en el menú de la izquierda, luego "Contact Flows", elegir el flujo correspondiente y hacer clic en su nombre para llegar a la página correspondiente. De esta forma, el ARN y consecuentemente el ID del flujo de contacto serán visibles en la url de la página que se abre.

- El `CONNECT_SOURCE_NUMBER` es siempre el número proporcionado por Twilio, pero a diferencia del `TWILIO_WHATSAPP_NUM`, no debe ir precedido de ningun string, mientras que `CONNECT_DESTINATION_NUMBER` representa la cadena alternativa que se mostrará si no es posible rastrear el número de teléfono del destinatario.

- Las direcciones de los endpoints de la aplicación deben indicarse en la página de la zona de pruebas de Whatsapp de su cuenta de Twilio ([aquí](https://www.twilio.com/console/sms/whatsapp/sandbox)). 

### Configuración del servidor de node

```sh
$ git clone https://github.com/tamdilip/whatsapp-amazonconnect-chat.git
$ cd whatsapp-amazonconnect-chat
$ npm i
```

### Tunneling

```sh
$ npm install ngrok -g
$ ngrok http 3000
```

### Posterior a la instalación

- Configure la URL del servidor ngrok url / Node Server en Twilio WhatsApp Sandbox - [Webhook](https://www.twilio.com/console/sms/whatsapp/sandbox)

  > `WHEN A MESSAGE COMES IN` - https://xxxxxxxx.ngrok.io/

  > `STATUS CALLBACK URL` - https://xxxxxxxx.ngrok.io/status-callback

- Todo listo ahora, mantenga su interfaz de chat de Amazon Connect como disponible e intente enviar un mensaje de texto desde su whatsapp a Twilio-WhatsApp-Business-Number y continúe la conversación bidireccionalmente 😁😎
- Además, si el cliente envía un mensaje de texto como "call me" (actualiza el comando de texto/chat como quieras), reenvía el mensaje al chat del agente y también coloca automáticamente una llamada de voz saliente de forma bidireccional.

### Notas

- Se buscó un servicio de AWS adecuado que proporcione un tipo de enfoque sin servidor para mantener las conexiones de cliente websocket activas en el lado del servidor sin ningún esfuerzo adicional para la escalabilidad, el equilibrio de carga y el mantenimiento.
- Lambda no se ajusta a esto ya que tiene una limitación de tiempo de espera de ejecución, tampoco quiere activar una instancia EC2 / EKS / Fargate que requiere un poco de esfuerzo en el mantenimiento y la escalabilidad solo para alojar un servidor nodejs activo.
- Mensajes probados simultáneamente desde múltiples números de whatsapp, todos han sido colocados apropiadamente a la cantidad de agentes disponibles.
- En caso de abandono y reconexión del agente, el soporte se colocó correctamente con la conversación del historial de chat y también al mismo agente en cola en función de su disponibilidad como primera preferencia.
- La realización de una llamada de voz en "call me" no se probó en tiempo real, sobre cómo se comporta cuando un agente está activo con soporte por chat y se espera que el mismo agente reciba la llamada del cliente al que está brindando soporte. Según la política de conexión de Amazon, un agente puede estar disponible para chat o voz a la vez.

#### Marcadores

- [Amazon Connect Chat CCP](https://dilip-chat-dev.awsapps.com/connect/login)
- [Credenciales de seguridad de AWS](https://console.aws.amazon.com/iam/home?#/security_credentials)
- [Tabla de AWS Dynamo DB](https://console.aws.amazon.com/dynamodb/home?region=us-east-1#tables:selected=whatsappconnect;tab=items)
- [Twilio WhatsApp Business API Sandbox](https://www.twilio.com/console/sms/whatsapp/sandbox)
- [AWS Connect - JavaScript SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Connect.html)
- [Participante de AWS Connect: SDK de JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConnectParticipant.html)

**Happy Coding :) !!!**
