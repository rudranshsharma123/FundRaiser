const accountSid = "YOUR ACCOUNT SID";
const authToken = "YOUR AUTH TOKEN";
const client = require("twilio")(accountSid, authToken);

client.messages
	.create({
		body: "Your appointment is coming up on July 21 at 3PM",
		from: "whatsapp:+14155238886",
		to: "whatsapp:+",
	})
	.then((message) => console.log(message.sid))
	.done();
