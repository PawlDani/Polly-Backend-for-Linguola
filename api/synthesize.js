const { Polly } = require("@aws-sdk/client-polly");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const serverless = require("serverless-http");
require("dotenv").config();

const app = express();

// Create an Amazon Polly service client object.
const polly = new Polly({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

app.use(cors());
app.use(bodyParser.json());

app.post("/synthesize", async (req, res) => {
  const { text, voiceId = "Joanna" } = req.body;

  const params = {
    OutputFormat: "mp3",
    Text: text,
    VoiceId: voiceId,
  };

  try {
    const data = await polly.synthesizeSpeech(params);

    let audioBuffer = [];

    data.AudioStream.on("data", (chunk) => {
      audioBuffer.push(chunk);
    });

    data.AudioStream.on("end", () => {
      const audio = Buffer.concat(audioBuffer);
      console.log("Audio data length:", audio.length); // Log audio data length
      res.set({
        "Content-Type": "audio/mpeg",
        "Content-Length": audio.length,
      });
      res.send(audio);
    });
  } catch (err) {
    console.error("Error synthesizing speech:", err.message); // Log only the error message
    console.error(err.stack); // Log the stack trace for debugging
    res.status(500).json({ message: "Error synthesizing speech" }); // Send simplified error response
  }
});

module.exports = app;
module.exports.handler = serverless(app);
