const { Polly } = require("@aws-sdk/client-polly");
require("dotenv").config();

const polly = new Polly({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const params = {
  OutputFormat: "mp3",
  Text: "Hello, world!",
  VoiceId: "Joanna",
};

polly.synthesizeSpeech(params)
  .then(data => {
    console.log("Success:", data);
  })
  .catch(err => {
    console.error("Error synthesizing speech:", err.message);
    console.error(err.stack);
  });
