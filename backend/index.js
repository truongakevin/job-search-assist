const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/generate', async (req, res) => {
  const { resume, jobDescription } = req.body;

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent([
    `Job description:\n${jobDescription}`,
    `Resume:\n${resume}`,
    `Now write a personalized cover letter and a tailored version of the resume.`,
  ]);
  const text = await result.response.text();
  res.send({ result: text });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));