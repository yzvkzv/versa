export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ reply: 'API Key belum dikonfigurasi di Vercel.' });
    }

    try {
        const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: message }]
                }]
            })
        });

        const data = await apiResponse.json();

        if (data.error) {
            return res.status(200).json({ reply: `Google API Error: ${data.error.message}` });
        }

        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (reply) {
            return res.status(200).json({ reply });
        } else {
            return res.status(200).json({ reply: 'Format respons tidak dikenali oleh server.' });
        }

    } catch (err) {
        return res.status(200).json({ reply: `Terjadi kendala server: ${err.message}` });
    }
}
