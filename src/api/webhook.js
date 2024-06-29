export default function handler(req, res) {
    const VERIFY_TOKEN = 'my_verify_token';

    if (req.method === 'POST') {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        if (mode && token === VERIFY_TOKEN) {
            res.status(200).send(challenge);
        } else {
            res.status(403).send('Forbidden');
        }
    } else if (req.method === 'GET') {
        // Handle the incoming webhook request
        const body = req.body;

        // Perform your processing here
        console.log('Webhook received:', body);

        // Send a response back to WhatsApp API
        res.status(200).send('Webhook received');
    } else {
        res.status(405).send('Method Not Allowed');
    }
}
