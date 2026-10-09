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
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: message }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.status(200).json({ reply: `Error dari Google: ${data.error.message}` });
        }

        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
            const reply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply });
        } else {
            return res.status(200).json({ reply: 'Struktur respons tidak dikenali.' });
        }

    } catch (error) {
        return res.status(500).json({ reply: 'Gagal terhubung ke server API.' });
    }
}
