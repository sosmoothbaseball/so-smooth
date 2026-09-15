import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { prisma } from "@/lib/portal/prisma";
import { isParentRole, isStaffRole } from "@/lib/portal/roles";
import { createSupabaseServer } from "@/lib/supabase/server";

const COOKIE = "so-smooth-portal";

const profileInclude = {
  players: { orderBy: { name: "asc" as const } },
  lessonSpec: true,
};

export type SessionUser = NonNullable<Awaited<ReturnType<typeof getSession>>>;

export async function getSession() {
  const supabase = await createSupabaseServer();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  return linkAuthUser(data.user);
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
      phone: String(user.user_metadata?.phone || ""),
      authId: user.id,
      role: "parent",
    },
    include: profileInclude,
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
  if (!isStaffRole(user.role)) redirect("/portal/parent");
  return user;
}

export async function requireParent() {
  const user = await requireUser();
  if (!isParentRole(user.role)) redirect("/portal/coach");
  return user;
}

export function portalHome(role: string) {
  return isStaffRole(role) ? "/portal/coach" : "/portal/parent";
}

export async function ensureParentProfile(input: {
  authId: string;
  name: string;
  email: string;
  phone: string;
  player?: { name: string; ageGroup: string };
}) {
  try {
    return await prisma.profile.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        authId: input.authId,
        role: "parent",
        ...(input.player ? { players: { create: input.player } } : {}),
      },
    });
  } catch {
    const existing = await prisma.profile.findFirst({
      where: { OR: [{ authId: input.authId }, { email: input.email }] },
    });
    if (!existing) throw new Error("Could not save the profile.");

    const updated = await prisma.profile.update({
      where: { id: existing.id },
      data: {
        authId: input.authId,
        phone: existing.phone || input.phone,
      },
    });

    if (input.player) {
      const already = await prisma.player.findFirst({
        where: { parentId: existing.id, name: input.player.name },
      });
      if (!already) {
        await prisma.player.create({
          data: {
            parentId: existing.id,
            name: input.player.name,
            ageGroup: input.player.ageGroup,
          },
        });
      }
    }

    return updated;
  }
}
