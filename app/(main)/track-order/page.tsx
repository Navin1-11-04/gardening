import { redirect } from "next/navigation";

// Track Order has been merged into My Orders.
// Any saved links or bookmarks will land here and be sent to the right place.
export default function TrackOrderRedirect() {
  redirect("/orders");
}