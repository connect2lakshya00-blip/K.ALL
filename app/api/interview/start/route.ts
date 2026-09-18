import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { targetRole } = await request.json();
        
        const greeting = `Welcome! I'm your AI interviewer for the ${targetRole} position. This interview will assess your technical skills, problem-solving abilities, and cultural fit.

Let's begin. Please introduce yourself and tell me about your relevant experience for this role.`;

        return NextResponse.json({ message: greeting });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Welcome to the interview! Please introduce yourself." }, { status: 200 });
    }
}
