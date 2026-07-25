import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';

export async function POST(req: Request) {
  const { content } = await req.json();

  const prompt = `Generate 3 short anonymous feedback message suggestions for someone to send to a user.
  ${content ? `The sender wants to say something like this (use it as the core idea, but rephrase it): "${content}"` : 'No specific idea was given — generate general, kind, constructive feedback starters.'}

  Write like a real person typing anonymous feedback, NOT like an AI or corporate email.

  Style rules:
  - Casual, conversational tone — like a text message, not a performance review
  - Use simple everyday words, contractions (don't, you're, it's), and natural phrasing
  - Avoid overly polished, symmetric, or "perfect" sentence structures
  - Skip corporate/therapy-speak like "I wanted to reach out," "I appreciate you," "constructive feedback," "moving forward," "just my two cents," etc.
  - Vary sentence length and structure between the 3 suggestions — don't make them all the same shape
  - It's okay to be a little blunt, informal, or imperfect — real feedback isn't always smooth
  - No exclamation-point enthusiasm or fake positivity padding
  - Don't start every message the same way (e.g. don't start all 3 with "Hey" or "I think")

  Content rules:
  - Each message 1-3 sentences
  - No hate speech, harassment, or personal attacks
  - Should be honest and specific, even if a bit critical — but never cruel
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
			suggestions
		},
		{ status: 200 }
	);
	  
  } catch (err) {
    console.error(err);
    return Response.json(
		{
			success: false,
			message:"Failed to generate suggestions"
		},
		{ status: 500 }
	);
  }
}
