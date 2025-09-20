import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user as { id?: string })?.id) {
    return NextResponse.json([], { status: 200 });
  }
  const books = await prisma.book.findMany({
    where: { userId: (session.user as { id: string }).id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(books);
}

const createBookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  genre: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // ✅ Fix for "session is possibly null" + "id doesn't exist"
  if (!session || !(session.user as { id: string })?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = createBookSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { title, author, genre } = parsed.data;

  const created = await prisma.book.create({
    data: {
      title,
      author,
      genre,
      // ✅ Assert again here for TypeScript
      userId: (session.user as { id: string }).id,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
