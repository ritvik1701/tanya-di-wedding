import InvitePage from "@/components/InvitePage";
import PreviewNotice from "@/components/PreviewNotice";
import { events } from "@/config/wedding";

// The root URL is the family's view: every event, plus a banner saying so.
// No guest is given this address.
export default function Page() {
  return (
    <>
      <PreviewNotice />
      <InvitePage events={events} />
    </>
  );
}
