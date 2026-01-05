const WebSocket = require('ws');
const sdk = require('microsoft-cognitiveservices-speech-sdk');
const logger = require('../../utils/logger');

function initVoiceSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    const params = new URLSearchParams(req.url.split('?')[1]);
    const orderId = params.get('orderId');

    logger.info(`🔊 WebSocket connecté (orderId=${orderId})`);

    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY,
      process.env.AZURE_SPEECH_REGION
    );

    speechConfig.speechRecognitionLanguage = 'fr-FR';
    speechConfig.speechSynthesisVoiceName = 'fr-FR-DeniseNeural';

    const pushStream = sdk.AudioInputStream.createPushStream();
    const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognized = (s, e) => {
      if (e.result.text) {
        logger.info(`🗣️ Client: ${e.result.text}`);

        // ⚠️ ICI: logique IA à brancher ensuite
        // Pour l’instant, réponse simple
        const responseText = "D'accord, j'ai bien noté.";

        synthesizeAndSend(ws, speechConfig, responseText);
      }
    };

    recognizer.startContinuousRecognitionAsync();

    ws.on('message', (msg) => {
      const data = JSON.parse(msg);
      if (data.event === 'media') {
        const audio = Buffer.from(data.media.payload, 'base64');
        pushStream.write(audio);
      }
      if (data.event === 'stop') {
        recognizer.stopContinuousRecognitionAsync();
        pushStream.close();
      }
    });

    ws.on('close', () => {
      logger.info(`🔌 WebSocket fermé (orderId=${orderId})`);
    });
  });
}

function synthesizeAndSend(ws, speechConfig, text) {
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

  synthesizer.speakTextAsync(
    text,
    result => {
      const audio = Buffer.from(result.audioData).toString('base64');
      ws.send(JSON.stringify({
        event: 'media',
        media: { payload: audio }
      }));
      synthesizer.close();
    },
    err => {
      logger.error('TTS error:', err);
      synthesizer.close();
    }
  );
}

module.exports = { initVoiceSocket };
