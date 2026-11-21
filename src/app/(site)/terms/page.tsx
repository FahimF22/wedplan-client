import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/LegalPage";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="November 22, 2026">
      <p>By creating an account or using WedPlan you agree to these terms.</p>
      <h2>Accounts</h2>
      <ul>
        <li>You must provide accurate information and keep your password secure.</li>
        <li>Each account is either a customer or a vendor account. Administrator access is granted only by WedPlan.</li>
        <li>We may block accounts that break these terms or misuse the platform.</li>
      </ul>
      <h2>Vendors</h2>
      <ul>
        <li>Services you publish must be accurate and lawful. Every service is reviewed before it becomes public, and we may reject or remove services.</li>
        <li>Free accounts may keep up to 3 active services. Premium is a monthly subscription billed through Stripe; you can cancel anytime and keep Premium until the end of the paid period.</li>
      </ul>
      <h2>Bookings</h2>
      <p>
        A booking request is an inquiry between a customer and a vendor. WedPlan does not provide the wedding services itself
        and is not a party to any agreement made between customers and vendors.
      </p>
      <h2>Liability</h2>
      <p>
        WedPlan is provided &quot;as is&quot;. We are not responsible for the quality of services provided by vendors or for any
        dispute between users.
      </p>
      <h2>Contact</h2>
      <p>
        Questions? Email <a className="text-primary underline" href="mailto:hello@wedplan.app">hello@wedplan.app</a>.
      </p>
    </LegalPage>
  );
}
