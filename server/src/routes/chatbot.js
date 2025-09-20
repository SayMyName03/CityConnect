import express from 'express';
import axios from 'axios';
import Locality from '../models/Locality.js';
import Issue from '../models/Issue.js';

const router = express.Router();

const makeSystemPrompt = (localityDoc, recentIssues = []) => {
  const localityInfo = localityDoc
    ? `Locality: ${localityDoc.name}, City: ${localityDoc.city || ''}, State: ${localityDoc.state || ''}, Country: ${localityDoc.country || ''}`
    : 'No specific locality provided.';
  const issuesText = recentIssues.length
    ? recentIssues
        .slice(0, 5)
        .map(
          (i, idx) =>
            `${idx + 1}. [${i.status || 'open'}] ${i.title} – ${i.description || ''} @ ${i.location || 'unknown'} (${new Date(
              i.createdAt
            ).toLocaleDateString()})`
        )
        .join('\n')
    : 'No recent issues found.';

  return `You are CityConnect Assistant. Answer succinctly and helpfully.
${localityInfo}
Recent issues:
${issuesText}
If the question is unrelated, politely say you only help with locality information and reported issues.`;
};

router.post('/', async (req, res) => {
  try {
    const { message, locality } = req.body || {};
    console.log('Chatbot request received:', { message, locality });
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key present:', !!apiKey);
    console.log('API Key starts with:', apiKey ? apiKey.substring(0, 10) + '...' : 'undefined');
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured on server' });
    }

    let localityDoc = null;
    if (locality && typeof locality === 'string') {
      localityDoc = await Locality.findOne({ name: locality }).lean();
      if (!localityDoc) {
        // try by id as fallback
        if (locality.match(/^[0-9a-fA-F]{24}$/)) {
          localityDoc = await Locality.findById(locality).lean();
        }
      }
    }

    let recentIssues = [];
    if (localityDoc) {
      recentIssues = await Issue.find({ locality: localityDoc._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();
    } else {
      recentIssues = await Issue.find().sort({ createdAt: -1 }).limit(3).lean();
    }

    const systemPrompt = makeSystemPrompt(localityDoc, recentIssues);
    console.log('System prompt:', systemPrompt);

    // Gemini Pro generateContent call
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    const payload = {
      contents: [
        {
          parts: [
            { text: `${systemPrompt}\n\nUser question: ${message}` }
          ]
        }
      ]
    };

    console.log('Making Gemini API request to:', url.replace(apiKey, 'API_KEY_HIDDEN'));
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 20000,
    });

    console.log('Gemini API Response Status:', response.status);
    console.log('Gemini API Response:', JSON.stringify(response.data, null, 2));

    const data = response.data;
    let reply = 'Sorry, I could not generate a response.';

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      reply = data.candidates[0].content.parts[0].text;
    } else if (data?.error) {
      console.error('Gemini API Error:', data.error);
      reply = 'Sorry, there was an issue with the AI service.';
    } else {
      console.error('Unexpected Gemini response structure:', data);
    }

    console.log('Final reply:', reply);
    return res.json({ reply });
  } catch (err) {
    console.error('Chatbot error:', err.response?.data || err.message);
    console.error('Full error:', err);
    
    if (err.response?.status === 429) {
      return res.status(200).json({ 
        reply: 'Sorry, I\'m currently experiencing high demand. Please try again in a minute. In the meantime, you can browse the reported issues above!' 
      });
    }
    if (err.response?.status === 400) {
      return res.status(500).json({ error: 'Invalid API request. Please check your Gemini API key.' });
    }
    return res.status(500).json({ error: 'Chatbot service error' });
  }
});

export default router;
