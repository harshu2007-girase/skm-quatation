import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { DEMO_USERS } from "@/lib/data";

const DEMO_PASSWORD = "SHREEKALI@100CR";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const user = DEMO_USERS.find((candidate) => candidate.username === String(username).toLowerCase().trim());
  const expected = Buffer.from(DEMO_PASSWORD);
  const received = Buffer.from(String(password));
  const validPassword = expected.length === received.length && timingSafeEqual(expected, received);

  if (!user || !validPassword) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const expires = Date.now() + 8 * 60 * 60 * 1000;
  const payload = `${user.id}.${expires}`;
  const signature = createHmac("sha256", process.env.DEMO_AUTH_SECRET || "skm-local-demo-only").update(payload).digest("hex");
  const response = NextResponse.json({ user, expires });
  response.cookies.set("skm_demo_session", `${payload}.${signature}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 8 * 60 * 60,
    path: "/"
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("skm_demo_session", "", { httpOnly: true, expires: new Date(0), path: "/" });
  return response;
}
