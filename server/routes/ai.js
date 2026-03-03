const express = require('express');
const { protect } = require('../middleware/auth');
const axios = require('axios');
const router = express.Router();

router.post('/ask', protect, async (req, res) => {
    try {
        const { question, context } = req.body;

        const systemPrompt = `You are Maitri, a privacy-first, AI-assisted women's health assistant. 
Your singular purpose is to help teenage girls and working women understand their cycle based on physiological explanations.
Hard limits: Do not diagnose conditions, interpret complex test results, or comment on medication.
Tone: Warm, conversational, plain English.
Context: ${context || 'None'}`;

        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'meta-llama/llama-3.3-70b-instruct:free',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: question }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const reply = response.data.choices[0].message.content;
        res.json({ reply });

    } catch (error) {
        console.error('Ask AI error:', error?.response?.data || error.message);
        res.status(500).json({ message: 'Error communicating with Maitri AI' });
    }
});

module.exports = router;
