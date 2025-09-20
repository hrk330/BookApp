import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  // ✅ First check if session exists
  if (!session || !(session.user as { id: string })?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const book = await prisma.book.findUnique({
    where: { id: params.id },
  });

  if (!book) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // ✅ Compare logged-in user ID to book's owner
  if (book.userId !== (session.user as { id: string }).id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.book.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
