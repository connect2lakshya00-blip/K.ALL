import { NextResponse } from 'next/server';
import { genAI, GEMINI_MODELS } from '@/lib/gemini';

export async function POST(request: Request) {
    try {
        const { targetRole, messages } = await request.json();
        
        const systemPrompt = `You are a professional AI interviewer conducting a technical interview for a ${targetRole} position.

INSTRUCTIONS:
1. Ask ONE question at a time based on the conversation flow
2. Ask technical questions relevant to ${targetRole}
3. Ask behavioral questions using STAR method
4. Provide brief acknowledgments before moving to next question
5. After 5-6 questions, politely conclude the interview
6. Be professional, encouraging, and constructive

Current conversation context: The candidate is being interviewed for ${targetRole}.`;

        const conversationHistory = messages.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // Try Gemini models
        for (const modelName of GEMINI_MODELS) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                
                const chat = model.startChat({
                    history: [
                        { role: 'user', parts: [{ text: systemPrompt }] },
                        { role: 'model', parts: [{ text: 'Understood. I will conduct a professional interview.' }] },
                        ...conversationHistory.slice(0, -1)
                    ],
                });

                const result = await chat.sendMessage(messages[messages.length - 1].content);
                const response = result.response.text();

                return NextResponse.json({ message: response });
            } catch (error) {
                console.error(`Model ${modelName} failed:`, error);
                continue;
            }
        }

        // Fallback response
        return NextResponse.json({ 
            message: "Thank you for sharing that. Can you tell me about a challenging project you've worked on and how you approached it?" 
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ 
            message: "Could you elaborate on that?" 
        }, { status: 200 });
    }
}
