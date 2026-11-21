import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="November 22, 2026">
      <p>
        WedPlan (&quot;we&quot;, &quot;us&quot;) is a wedding planning platform that connects couples with wedding service vendors. This
        policy explains what information we collect and how we use it.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>Account details: your name, email address, profile photo and the account type you choose (customer or vendor).</li>
        <li>If you sign in with Google, we receive your name, email address and profile picture from Google. We do not access any other Google data.</li>
        <li>Profile details you add, such as phone number, city, business name and bio.</li>
        <li>Booking requests you send or receive, including event date, location and messages.</li>
        <li>For vendors who upgrade, subscription status and payment records. Card details are handled entirely by Stripe and never stored by WedPlan.</li>
      </ul>
      <h2>How we use information</h2>
      <ul>
        <li>To create and secure your account and keep you signed in.</li>
        <li>To show services, process booking requests and share the details a vendor or customer needs to respond.</li>
        <li>To manage Premium subscriptions and keep payment records.</li>
        <li>To moderate the platform and prevent misuse.</li>
      </ul>
      <h2>Sharing</h2>
      <p>
        We do not sell your data. Booking details are shared only between the customer and the vendor involved. We use trusted
        providers to run the service: MongoDB Atlas (database), Vercel (hosting), Stripe (payments), ImgBB (image hosting) and
        Google (optional sign-in).
      </p>
      <h2>Your choices</h2>
      <p>
        You can update your profile at any time from Profile Settings. To delete your account or ask a question about your
        data, email <a className="text-primary underline" href="mailto:hello@wedplan.app">hello@wedplan.app</a>.
      </p>
    </LegalPage>
  );
}
