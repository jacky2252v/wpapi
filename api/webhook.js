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

// import axios from "axios";

// export default async function handler(req, res) {
//     const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN } = process.env;

//     if (req.method === 'POST') {
//         const mode = req.query["hub.mode"];
//         const token = req.query["hub.verify_token"];
//         const challenge = req.query["hub.challenge"];

//         if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
//             res.status(200).send(challenge);
//             console.log("Webhook verified successfully!");
//         } else {
//             res.status(403).send("Forbidden");
//         }
//     } else if (req.method === 'GET') {
//         try {
//             console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));
//             const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

//             if (message?.type === "text") {
//                 const business_phone_number_id =
//                     req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

//                 await axios({
//                     method: "POST",
//                     url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
//                     headers: {
//                         Authorization: `Bearer ${GRAPH_API_TOKEN}`,
//                     },
//                     data: {
//                         messaging_product: "whatsapp",
//                         to: message.from,
//                         text: { body: "Hello, Welcome to our portal" },
//                         context: {
//                             message_id: message.id,
//                         },
//                     },
//                 });

//                 await axios({
//                     method: "POST",
//                     url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
//                     headers: {
//                         Authorization: `Bearer ${GRAPH_API_TOKEN}`,
//                     },
//                     data: {
//                         messaging_product: "whatsapp",
//                         status: "read",
//                         message_id: message.id,
//                     },
//                 });
//             }
//             res.sendStatus(200);
//         } catch (error) {
//             console.error("Error handling webhook request:", error);
//             res.status(500).send("Error handling webhook request");
//         }
//     } else {
//         res.setHeader('Allow', ['GET', 'POST']);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }


// import axios from 'axios';

// export default async function handler(req, res) {
//     const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN } = process.env;

//     if (!WEBHOOK_VERIFY_TOKEN || !GRAPH_API_TOKEN) {
//         console.error('Missing environment variables');
//         res.status(500).send('Internal Server Error');
//         return;
//     }

//     if (req.method === 'GET') {
//         const { mode, token, challenge } = req.query;

//         if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
//             res.status(200).send(challenge);
//             console.log('Webhook verified successfully!');
//         } else {
//             res.status(403).send('Forbidden');
//         }
//     } else if (req.method === 'POST') {
//         try {
//             const { body } = req;
//             console.log('Incoming webhook message:', JSON.stringify(body, null, 2));

//             const message = body.entry?.[0]?.changes[0]?.value?.messages?.[0];

//             if (message?.type === 'text') {
//                 const businessPhoneNumberId = body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

//                 await axios.post(
//                     `https://graph.facebook.com/v18.0/${businessPhoneNumberId}/messages`,
//                     {
//                         messaging_product: 'whatsapp',
//                         to: message.from,
//                         text: { body: 'Hello, Welcome to our portal' },
//                         context: {
//                             message_id: message.id,
//                         },
//                     },
//                     {
//                         headers: {
//                             Authorization: `Bearer ${GRAPH_API_TOKEN}`,
//                         },
//                     }
//                 );

//                 await axios.post(
//                     `https://graph.facebook.com/v18.0/${businessPhoneNumberId}/messages`,
//                     {
//                         messaging_product: 'whatsapp',
//                         status: 'read',
//                         message_id: message.id,
//                     },
//                     {
//                         headers: {
//                             Authorization: `Bearer ${GRAPH_API_TOKEN}`,
//                         },
//                     }
//                 );
//             }

//             res.status(200).send('Webhook received');
//             return;
//         } catch (error) {
//             console.error('Error handling webhook request:', error.message);
//             res.status(500).send('Error handling webhook request: ' + error.message);
//             return;
//         }
//     } else {
//         res.setHeader('Allow', ['GET', 'POST']);
//         res.status(405).send(`Method ${req.method} Not Allowed`);
//     }
// }

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN } = process.env;
if (!process.env.WEBHOOK_VERIFY_TOKEN || !process.env.GRAPH_API_TOKEN) {
    console.error("Missing environment variables: WEBHOOK_VERIFY_TOKEN and GRAPH_API_TOKEN");
    process.exit(1);
}

app.post("/webhook", async (req, res) => {
    try {
        console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

        const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

        if (message?.type === "text") {
            const businessPhoneNumberId = req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
            if (!businessPhoneNumberId) {
                console.error("Missing business phone number ID in webhook request");
                res.status(400).send("Invalid request");
                return;
            }

            await axios({
                method: "POST",
                url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
                headers: {
                    Authorization: `Bearer ${GRAPH_API_TOKEN}`,
                },
                data: {
                    messaging_product: "whatsapp",
                    to: message.from,
                    text: { body: "Echo: " + message.text.body },
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

        res.sendStatus(200);
    }
    catch (error) {
        console.error("Error handling webhook request:", error);
        res.status(500).send("Error processing request");
    }
});

// accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
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

const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});