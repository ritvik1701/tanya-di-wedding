import { notFound } from "next/navigation";
import InvitePage from "@/components/InvitePage";
import { eventsForInvite, getInvite, inviteIds } from "@/config/invites";

// Only ids listed in the invite config exist. Anything else 404s rather
// than quietly falling back to showing every event.
export const dynamicParams = false;

export function generateStaticParams() {
  return inviteIds.map((id) => ({ id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invite = getInvite(id);
  if (!invite) notFound();

  return <InvitePage events={eventsForInvite(invite)} />;
}
