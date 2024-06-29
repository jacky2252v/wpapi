export default function handler(req, res) {
    if (req.method === 'POST') {
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
