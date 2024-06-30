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

import axios from 'axios';

export default async function handler(req, res) {
    const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN } = process.env;

    if (!WEBHOOK_VERIFY_TOKEN || !GRAPH_API_TOKEN) {
        console.error('Missing environment variables');
        res.status(500).send('Internal Server Error');
        return;
    }

    if (req.method === 'GET') {
        const { mode, token, challenge } = req.query;

        if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
            res.status(200).send(challenge);
            console.log('Webhook verified successfully!');
        } else {
            res.status(403).send('Forbidden');
        }
    } else if (req.method === 'POST') {
        try {
            const { body } = req;
            console.log('Incoming webhook message:', JSON.stringify(body, null, 2));

            const message = body.entry?.[0]?.changes[0]?.value?.messages?.[0];

            if (message?.type === 'text') {
                const businessPhoneNumberId = body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

                await axios.post(
                    `https://graph.facebook.com/v18.0/${businessPhoneNumberId}/messages`,
                    {
                        messaging_product: 'whatsapp',
                        to: message.from,
                        text: { body: 'Hello, Welcome to our portal' },
                        context: {
                            message_id: message.id,
                        },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${GRAPH_API_TOKEN}`,
                        },
                    }
                );

                await axios.post(
                    `https://graph.facebook.com/v18.0/${businessPhoneNumberId}/messages`,
                    {
                        messaging_product: 'whatsapp',
                        status: 'read',
                        message_id: message.id,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${GRAPH_API_TOKEN}`,
                        },
                    }
                );
            }

            res.status(200).send('Webhook received');
            return;
        } catch (error) {
            console.error('Error handling webhook request:', error.message);
            res.status(500).send('Error handling webhook request: ' + error.message);
            return;
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).send(`Method ${req.method} Not Allowed`);
    }
}