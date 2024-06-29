// export default function handler(req, res) {
//     const VERIFY_TOKEN = 'my_verify_token';

//     if (req.method === 'POST') {
//         const mode = req.query['hub.mode'];
//         const token = req.query['hub.verify_token'];
//         const challenge = req.query['hub.challenge'];

//         if (mode && token === VERIFY_TOKEN) {
//             res.status(200).send(challenge);
//         } else {
//             res.status(403).send('Forbidden');
//         }
//     } else if (req.method === 'GET') {
//         // Handle the incoming webhook request
//         const body = req.body;

//         // Perform your processing here
//         console.log('Webhook received:', body);

//         // Send a response back to WhatsApp API
//         res.status(200).send('Webhook received');
//     } else {
//         res.status(405).send('Method Not Allowed');
//     }
// }

import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT } = process.env;

app.post("https://wpapi-one.vercel.app/webhook", async (req, res) => {
    try {
        console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));
        const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

        if (message?.type === "text") {
            const business_phone_number_id =
                req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

            await axios({
                method: "POST",
                url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
                headers: {
                    Authorization: `Bearer ${GRAPH_API_TOKEN}`,
                },
                data: {
                    messaging_product: "whatsapp",
                    to: message.from,
                    text: { body: "Hello, Welcome to our portal" },
                    context: {
                        message_id: message.id, // shows the message as a reply to the original user message
                    },
                },
            });

            // mark incoming message as read
            await axios({
                method: "POST",
                url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
                headers: {
                    Authorization: `Bearer ${GRAPH_API_TOKEN}`,
                },
                data: {
                    messaging_product: "whatsapp",
                    status: "read",
                    message_id: message.id,
                },
            });
        }
    } catch (error) {
        console.error("Error handling webhook request:", error);
        res.status(500).send("Error handling webhook request");
    } finally {
        res.sendStatus(200);
    }
});

app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    // check the mode and token sent are correct
    if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
        // respond with 200 OK and challenge token from the request
        res.status(200).send(challenge);
        console.log("Webhook verified successfully!");
    } else {
        // respond with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
    }
});

app.get("/", (req, res) => {
    res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});