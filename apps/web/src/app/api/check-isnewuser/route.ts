import { authOptions } from "@/app/libs/auth";
import { prisma } from "@/app/libs/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ isNewUser: false }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isNewUser: true },
  });

  return NextResponse.json({ isNewUser: user?.isNewUser ?? false });
}
