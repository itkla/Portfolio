import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { flowers } from '@/db/schema';
import { eq } from 'drizzle-orm';

// DELETE a specific flower
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const flowerId = parseInt(id);

        if (isNaN(flowerId)) {
            return NextResponse.json(
                { error: 'Invalid flower ID' },
                { status: 400 }
            );
        }

        await db.delete(flowers).where(eq(flowers.id, flowerId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting flower:', error);
        return NextResponse.json(
            { error: 'Failed to delete flower' },
            { status: 500 }
        );
    }
}
