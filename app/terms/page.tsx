import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";
import { SITE } from "../lib/site";

export const metadata: Metadata = {
  title: "Terms and conditions",
  description:
    "The terms that apply to using the PVA Media website and to the growth partner services we provide.",
  alternates: { canonical: "/terms" },
};

const UPDATED = "25 November 2026";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms and conditions"
      updated={UPDATED}
      intro={`These terms apply to your use of this website and to the services ${SITE.name} provides. Where we agree a separate written proposal or contract with you, that document takes precedence over anything here that conflicts with it.`}
      sections={[
        {
          heading: "Using this website",
          body: [
            "You may view and print pages from this site for your own use. You may not copy the design, code, written content or photography for use elsewhere without our written permission.",
            "We work to keep the site accurate and available, but we do not guarantee that it will be uninterrupted or free of errors, and we may change or remove content without notice.",
          ],
        },
        {
          heading: "Inquiries and quotes",
          body: [
            "Submitting the booking form is an inquiry, not an order, and does not create a contract. Nothing on this site is an offer capable of acceptance.",
            "The price that applies to you is the one set out in the written proposal we send after your call. Quotes are valid for 30 days unless stated otherwise.",
          ],
        },
        {
          heading: "Services and timelines",
          body: [
            "Any launch timeline we give you runs from the point we have everything we need from you: content, photography, brand assets, domain access, and sign-off on the direction. Delays in providing those move the timeline accordingly.",
            "Search rankings, advertising results and inquiry volume depend on factors outside our control, including competitor activity, seasonality and changes to search engines. We do not promise a particular position or volume.",
          ],
        },
        {
          heading: "Payment",
          body: [
            "Setup fees are payable before work begins unless the proposal says otherwise. Monthly fees are billed in advance and continue until canceled.",
            "Monthly services can be canceled with 30 days written notice. Advertising spend is paid directly to Google, Meta or any other platform from accounts in your name. It is separate from our fees and is not refundable by us.",
            "We may suspend services on accounts more than 14 days overdue, after telling you first.",
          ],
        },
        {
          heading: "Ownership",
          body: [
            "On full payment, you own the website design, the written content we produce for you, and your domain. Your ad accounts and their data stay in your name throughout. You keep ownership of anything you supply to us.",
            "We keep ownership of our underlying tools, code libraries, templates and processes, and of anything we build for use across multiple clients. We may show completed work in our portfolio unless you ask us in writing not to.",
          ],
        },
        {
          heading: "Liability",
          body: [
            "Nothing in these terms limits liability for death or personal injury caused by negligence, for fraud, or for anything else that cannot lawfully be limited.",
            "Subject to that, our total liability in connection with the services is limited to the fees you have paid us in the 12 months before the claim. We are not liable for lost profits, lost business or lost data.",
          ],
        },
        {
          heading: "Governing law and contact",
          body: [
            "These terms are governed by the laws of England and Wales, and the courts of England and Wales have exclusive jurisdiction.",
            `${SITE.name} is the trading name of ${SITE.company.legalName}, company number ${SITE.company.number}, registered office ${SITE.company.address}.`,
            `Questions about these terms can go to ${SITE.email} or ${SITE.phone}.`,
          ],
        },
      ]}
    />
  );
}
