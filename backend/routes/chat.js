const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/', async (req, res) => {
  const { message, history = [] } = req.body;
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ msg: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
        systemInstruction: 'You are SecureMate AI, a cybersecurity assistant. Give accurate, practical, defensive advice. Refuse requests for malware, credential theft, evasion, or unauthorized access. Keep answers concise and explain uncertainty.'
      });
      const safeHistory = Array.isArray(history)
        ? history
          .filter(item => item && (item.role === 'user' || item.role === 'model') && Array.isArray(item.parts))
          .map(item => ({
            role: item.role,
            parts: item.parts
              .filter(part => part && typeof part.text === 'string')
              .map(part => ({ text: part.text.slice(0, 4000) }))
          }))
          .filter(item => item.parts.length > 0)
          .slice(-20)
        : [];
      while (safeHistory[0]?.role === 'model') safeHistory.shift();

      const chat = model.startChat({ history: safeHistory });
      const result = await chat.sendMessage(message.trim().slice(0, 4000));
      const text = result.response.text().trim();
      if (text) return res.json({ response: text, source: 'gemini' });
    } catch (err) {
      console.error('Gemini API Error:', err);
    }
  }

  // Smart fallback assistant response
  const lowerMsg = message.toLowerCase();
  let fallbackResponse = "I’m SecureMate AI. Ask me about phishing, passwords, malware, privacy, or your SecureMate scan results.";
  if (lowerMsg.includes('password')) {
    fallbackResponse = "Make sure your passwords are at least 12 characters long, containing uppercase letters, numbers, and symbols. Avoid reusing passwords across different sites!";
  } else if (lowerMsg.includes('malicious') || lowerMsg.includes('what is phishing') || lowerMsg.includes('what is a phishing')) {
    fallbackResponse = "A malicious website is designed to steal information, install malware, or trick you into unsafe actions. Warning signs include a misspelled domain, urgent requests for passwords or codes, unexpected downloads, suspicious pop-ups, and links that do not match the claimed organization. Do not enter credentials; verify the domain independently and scan the link first.";
  } else if (lowerMsg.includes('scan') || lowerMsg.includes('url') || lowerMsg.includes('phishing') || lowerMsg.includes('link')) {
    fallbackResponse = "You can enter any suspicious URL into the top search bar or Dashboard scan box to analyze it for threats.";
  } else if (lowerMsg.includes('vault')) {
    fallbackResponse = "Your Security Vault uses client and server-side encryption to safely store sensitive credentials and notes.";
  } else if (lowerMsg.includes('2fa') || lowerMsg.includes('mfa') || lowerMsg.includes('two-factor')) {
    fallbackResponse = "Enable MFA with an authenticator app or security key wherever possible. Store recovery codes offline and never share a verification code with anyone.";
  } else if (lowerMsg.includes('malware') || lowerMsg.includes('virus')) {
    fallbackResponse = "Disconnect a suspected infected device from the network, avoid opening more files, run a trusted security scan, and change important passwords from a separate clean device.";
  } else if (lowerMsg.includes('privacy') || lowerMsg.includes('tracking')) {
    fallbackResponse = "Use unique passwords with MFA, keep software updated, review app permissions, and avoid entering sensitive information on links received unexpectedly.";
  }

  res.json({ response: fallbackResponse, source: 'fallback' });
});

module.exports = router;
