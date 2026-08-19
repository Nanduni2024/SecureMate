const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ msg: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are SecureMate AI, an expert cybersecurity assistant. Answer concisely and concisely help the user: ${message}`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return res.json({ response: text });
    } catch (err) {
      console.error('Gemini API Error:', err);
    }
  }

  // Smart fallback assistant response
  const lowerMsg = message.toLowerCase();
  let fallbackResponse = "I'm SecureMate AI, your digital security assistant. How can I help protect your device and data today?";
  if (lowerMsg.includes('password')) {
    fallbackResponse = "Make sure your passwords are at least 12 characters long, containing uppercase letters, numbers, and symbols. Avoid reusing passwords across different sites!";
  } else if (lowerMsg.includes('scan') || lowerMsg.includes('url') || lowerMsg.includes('phishing')) {
    fallbackResponse = "You can enter any suspicious URL into the top search bar or Dashboard scan box to analyze it for threats.";
  } else if (lowerMsg.includes('vault')) {
    fallbackResponse = "Your Security Vault uses client and server-side encryption to safely store sensitive credentials and notes.";
  }

  res.json({ response: fallbackResponse });
});

module.exports = router;
