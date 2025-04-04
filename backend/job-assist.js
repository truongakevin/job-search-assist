require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');

const app = express();
app.use(cors());
app.use(express.json());

// Set up multer for file uploads with file type validation
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'text/plain', 
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Invalid file type. Only PDF, TXT, and DOCX are allowed.'), false); // Reject the file
    }
  }
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
console.log(process.env.GEMINI_API_KEY);

// Handle the POST request for file and job description
app.post('/job-assist/generate-cl', upload.single('resume'), async (req, res) => {
  const { jobDescription, coverTemplate } = req.body; // Receive the custom prompt
  const resumeFile = req.file;

  if (!jobDescription || !resumeFile) {
    return res.status(400).send({ error: 'Resume and job description are required' });
  }

  // Read the content of the resume file
  let resumeText = '';
  if (resumeFile.mimetype === 'application/pdf') {
    resumeText = await pdfParse(resumeFile.buffer).then(function (data) {
      return data.text;
    });
  } else if (resumeFile.mimetype === 'text/plain') {
    resumeText = resumeFile.buffer.toString('utf-8');
  } else if (resumeFile.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const docxData = await mammoth.extractRawText({ buffer: resumeFile.buffer });
    resumeText = docxData.value;
  }

  // If there's a custom prompt, use it, otherwise use the default prompt format
  const promptToUse = `
    Given the following job description:
    ${jobDescription}

    Write a cover letter based on the following resume:
    ${resumeText}

    ${coverTemplate}
  `;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: promptToUse,
    });
    res.send({
      generatedCoverLetter: response.text,
    });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).send({ error: 'Failed to generate content' });
  }
});

app.listen(5687, () => {
  console.log('Server running on http://localhost:5687');
}).on('error', (err) => {
  console.error('Error starting the server:', err);
});