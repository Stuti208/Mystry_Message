import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';

export async function POST(req: Request) {
  const { content } = await req.json();

  const prompt = `Generate 3 short anonymous message suggestions someone could send to another person.

  ${content 
    ? `They're trying to say something like this — keep the same idea, just reword it naturally: "${content}"` 
    : 'They haven\'t decided what to say yet. Generate 3 standalone anonymous messages with zero prior context — mix of genuine questions (curious, not creepy) and honest feedback/opinions about the person. Examples of the type: a question about a choice they made, an honest opinion about how they come across, feedback on something specific they do. Each should stand completely alone, like the only message someone receives.'}

  Write like a normal person quickly typing a message — not like an AI trying to sound smart or polished.

  Style rules:
  - Short, casual, natural phrasing — like something typed in 5 seconds, not drafted
  - Use simple words and contractions (don't, you're, it's, gonna)
  - No poetic language, no metaphors, no fancy or "elevated" vocabulary
  - No corporate or therapy-speak: avoid "I appreciate," "just wanted to say," "constructive feedback," "reach out," "moving forward"
  - No exclamation-heavy enthusiasm — keep it flat and normal, like texting
  - Don't reference "you said," "earlier," "our conversation," or anything implying prior context
  - Vary the 3 suggestions — mix questions and statements, different lengths, different openers
  - It's fine if it sounds a little blunt, imperfect, or unpolished — real messages aren't always smooth

  Content rules:
  - Each message 1 short sentence, occasionally 2
  - No hate speech, harassment, or personal attacks
  - When asking a question, make it genuinely answerable and relevant (about their habits, choices, personality) — not vague or generic
  - When giving feedback, be specific and honest, even if mildly critical — never cruel
  - Must stand completely alone with no assumed context
  - Return ONLY a JSON object like {"suggestions": ["...", "...", "..."]}, nothing else, no markdown formatting`;
    
  try {
    const { text } = await generateText({
      model: groq('llama-3.1-8b-instant'),
      prompt,
      temperature: 0.8,
      maxOutputTokens: 400,
    });

    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const suggestions = Array.isArray(parsed) ? parsed : parsed.suggestions;

    return Response.json(
      {
        success: true,
        suggestions,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return Response.json(
      {
        success: false,
        message: 'Failed to generate suggestions',
      },
      { status: 500 }
    );
  }
}
