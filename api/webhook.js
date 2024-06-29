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

import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT } = process.env;

app.post('/webhook', async (req, res) => {
    try {
        console.log('Incoming webhook message:', JSON.stringify(req.body, null, 2));
        const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

        if (message?.type === 'text') {
            const businessPhoneNumberId = req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

            await sendWhatsAppMessage(businessPhoneNumberId, message.from, 'Hello, Welcome to our portal');
            await markMessageAsRead(businessPhoneNumberId, message.id);
        }
    } catch (error) {
        console.error('Error handling webhook request:', error);
        res.status(500).send('Error handling webhook request');
    } finally {
        res.sendStatus(200);
    }
});

app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'ubscribe' && token === WEBHOOK_VERIFY_TOKEN) {
        res.status(200).send(challenge);
        console.log('Webhook verified successfully!');
    } else {
        res.sendStatus(403);
    }
});

app.get('/', (req, res) => {
    res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});

// Helper functions
async function sendWhatsAppMessage(businessPhoneNumberId, to, text) {
    try {
        await axios({
            method: 'POST',
            url: `https://graph.facebook.com/v18.0/${businessPhoneNumberId}/messages`,
            headers: {
                Authorization: `Bearer ${GRAPH_API_TOKEN}`,
            },
            data: {
                messaging_product: 'whatsapp',
                to,
                text: { body: text },
                context: {
                    message_id: message.id, // shows the message as a reply to the original user message
                },
            },
        });
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
    }
}

async function markMessageAsRead(businessPhoneNumberId, messageId) {
    try {
        await axios({
            method: 'POST',
            url: `https://graph.facebook.com/v18.0/${businessPhoneNumberId}/messages`,
            headers: {
                Authorization: `Bearer ${GRAPH_API_TOKEN}`,
            },
            data: {
                messaging_product: 'whatsapp',
                status: 'ead',
                message_id: messageId,
            },
        });
    } catch (error) {
        console.error('Error marking message as read:', error);
    }
}