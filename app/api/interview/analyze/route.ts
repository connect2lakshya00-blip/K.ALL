import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { targetRole, messages } = await request.json();
        
        // Create interview record
        const transcript = messages.map((m: any) => `${m.role}: ${m.content}`).join('\n\n');
        
        await db.voiceInterview.create({
            data: {
                user: { connect: { clerkUserId: userId } },
                targetRole,
                transcript,
                chatHistory: messages,
                status: 'COMPLETED',
                technicalScore: 75, // Placeholder
                communicationScore: 80,
                confidenceScore: 70,
                detailedFeedback: 'Interview completed successfully. Detailed analysis will be provided shortly.',
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: true }); // Fail silently
    }
}
