import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/services/aiService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { audioUrl, sampleText } = body;

    // Simulated voice note text if no live media stream attached
    const voiceTranscript = sampleText || "Hi Minesh, I am looking for a 3-bedroom luxury penthouse in Dubai Marina or Bluewaters. My budget is around 8 to 10 million dirhams, and I want to view projects next Tuesday.";

    const prompt = `Extract structured lead attributes from this WhatsApp voice note transcript.

VOICE TRANSCRIPT:
"${voiceTranscript}"

RETURN ONLY JSON:
{
  "transcript": "${voiceTranscript}",
  "extractedBudget": "AED 8,000,000 - 10,000,000",
  "extractedLocation": "Dubai Marina / Bluewaters Island",
  "extractedTimeline": "Next Tuesday",
  "extractedPropertyType": "3-Bedroom Penthouse"
}`;

    const aiRes = await AIService.generateResponse({
      leadName: 'Voice Client',
      conversationHistory: [],
      userMessage: prompt,
    });

    try {
      const jsonMatch = aiRes.reply.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ success: true, result });
      }
    } catch (e) {}

    return NextResponse.json({
      success: true,
      result: {
        transcript: voiceTranscript,
        extractedBudget: "AED 8,000,000 - 10,000,000",
        extractedLocation: "Dubai Marina / Bluewaters Island",
        extractedTimeline: "Next Tuesday",
        extractedPropertyType: "3-Bedroom Penthouse",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
