import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { prisma } from "@/lib/portal/prisma";
import { createSupabaseServer } from "@/lib/supabase/server";

const COOKIE = "so-smooth-portal";

const profileInclude = {
  players: { orderBy: { name: "asc" as const } },
  lessonSpec: true,
};

export type SessionUser = NonNullable<Awaited<ReturnType<typeof getSession>>>;

export async function getSession() {
  const supabase = await createSupabaseServer();
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    return linkAuthUser(data.user);
  }

  const id = (await cookies()).get(COOKIE)?.value;
  if (!id) return null;
  return prisma.profile.findUnique({
    where: { id },
    include: profileInclude,
  });
}

export async function linkAuthUser(user: User) {
  const email = (user.email || "").toLowerCase();
  if (!email) return null;

  const existing = await prisma.profile.findFirst({
    where: { OR: [{ authId: user.id }, { email }] },
    include: profileInclude,
  });

  if (existing) {
    if (existing.authId !== user.id) {
      return prisma.profile.update({
        where: { id: existing.id },
        data: { authId: user.id },
        include: profileInclude,
      });
    }
    return existing;
  }

  return prisma.profile.create({
    data: {
      email,
      name: String(user.user_metadata?.name || email.split("@")[0]),
      password: "",
      authId: user.id,
      role: "parent",
    },
    include: profileInclude,
  });
}

export async function setSession(userId: string) {
  (await cookies()).set(COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const supabase = await createSupabaseServer();
  if (supabase) await supabase.auth.signOut();
  (await cookies()).delete(COOKIE);
}

export async function requireUser() {
  const user = await getSession();
  if (!user) redirect("/portal");
  return user;
}

export async function requireCoach() {
  const user = await requireUser();
  if (user.role !== "coach") redirect("/portal/parent");
  return user;
}

export async function requireParent() {
  const user = await requireUser();
  if (user.role !== "parent") redirect("/portal/coach");
  return user;
}

export function portalHome(role: string) {
  return role === "coach" ? "/portal/coach" : "/portal/parent";
}
