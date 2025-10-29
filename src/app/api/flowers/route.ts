import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { flowers } from '@/db/schema';
import { desc } from 'drizzle-orm';

// GET all flowers
export async function GET() {
    try {
        const allFlowers = await db
            .select()
            .from(flowers)
            .orderBy(desc(flowers.createdAt));

        return NextResponse.json({ flowers: allFlowers });
    } catch (error) {
        console.error('Error fetching flowers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch flowers' },
            { status: 500 }
        );
    }
}

// POST new flower
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { gridData, name, link, x, y } = body;

        if (!gridData || !Array.isArray(gridData)) {
            return NextResponse.json(
                { error: 'Invalid grid data' },
                { status: 400 }
            );
        }

        if (typeof x !== 'number' || typeof y !== 'number') {
            return NextResponse.json(
                { error: 'Invalid position coordinates' },
                { status: 400 }
            );
        }

        const [newFlower] = await db
            .insert(flowers)
            .values({
                gridData,
                name: name || null,
                link: link || null,
                x,
                y,
            })
            .returning();

        return NextResponse.json({ flower: newFlower }, { status: 201 });
    } catch (error) {
        console.error('Error creating flower:', error);
        return NextResponse.json(
            { error: 'Failed to create flower' },
            { status: 500 }
        );
    }
}
