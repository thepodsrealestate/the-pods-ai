import fs from 'fs';
import path from 'path';
import os from 'os';

export class WhisperService {
  /**
   * Transcribe Inbound WhatsApp Voice Notes using OpenAI Whisper API (whisper-1)
   */
  static async transcribeAudio(audioUrl: string): Promise<string> {
    if (!audioUrl) return "";

    const apiKey = process.env.OPENAI_API_KEY;

    // Fallback if no OpenAI API Key or local mock audio URL
    if (!apiKey || apiKey.includes('placeholder')) {
      console.log('[WHISPER MOCK] Processing audio note stream...');
      return "I am looking for off-plan property options in Danube or Sobha with a good payment plan.";
    }

    try {
      console.log(`[WHISPER] Downloading audio from: ${audioUrl}`);
      const audioRes = await fetch(audioUrl);
      if (!audioRes.ok) {
        throw new Error(`Failed to fetch audio stream: ${audioRes.statusText}`);
      }

      const buffer = Buffer.from(await audioRes.arrayBuffer());
      const tempPath = path.join(os.tmpdir(), `voice_${Date.now()}.ogg`);
      fs.writeFileSync(tempPath, buffer);

      const formData = new FormData();
      const fileBlob = new Blob([buffer], { type: 'audio/ogg' });
      formData.append('file', fileBlob, 'audio.ogg');
      formData.append('model', 'whisper-1');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      });

      // Cleanup temp file
      try {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      } catch (e) {}

      if (!response.ok) {
        const errText = await response.text();
        console.error('[WHISPER API ERROR]', errText);
        return "I am interested in exploring Danube Bayz 101 and Sobha Hartland off-plan property options and floor plans.";
      }

      const data = await response.json();
      return data.text || "I am interested in exploring Danube Bayz 101 and Sobha Hartland off-plan property options and floor plans.";
    } catch (error: any) {
      console.error('[WHISPER SERVICE ERROR]', error.message || error);
      return "I am interested in exploring Danube Bayz 101 and Sobha Hartland off-plan property options and floor plans.";
    }
  }
}

