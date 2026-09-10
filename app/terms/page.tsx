import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";
import { SITE } from "../lib/site";

export const metadata: Metadata = {
  title: "Terms and conditions",
  description:
    "The terms that apply to using the PVA Media website and to the services we provide.",
  alternates: { canonical: "/terms" },
};

const UPDATED = "10 September 2026";

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
          heading: "Enquiries and quotes",
          body: [
            "Submitting the booking form is an enquiry, not an order, and does not create a contract. Nothing on this site is an offer capable of acceptance.",
            "Prices shown on this site, including AI Receptionist plan prices, are indicative and quoted in US dollars. The price that applies to you is the one set out in the written proposal we send after your call. Quotes are valid for 30 days unless stated otherwise.",
          ],
        },
        {
          heading: "Services and timelines",
          body: [
            "The five day build timeline runs from the point we have everything we need from you: content, photography, brand assets, domain access, and sign-off on the direction. Delays in providing those move the timeline accordingly.",
            "Search rankings, advertising results and enquiry volume depend on factors outside our control, including competitor activity, seasonality and changes to search engines. Except for the guarantee set out below, we do not promise a particular position or volume.",
          ],
        },
        {
          heading: "The 60 day guarantee",
          body: [
            "We guarantee a 60% increase in enquiries within 90 days of your new site going live, measured against the 90 days immediately before launch. If we do not achieve it, you do not pay for the build.",
            "The guarantee applies where you have taken the website build with local SEO, tracking has been in place for the full comparison period, and you have not paused, restricted or materially changed the work during it. It also requires that enquiries are answered, since we cannot count a lead you never responded to.",
            "To claim, email us within 30 days of the end of the 90 day period and we will review the tracking together. Ongoing fees already incurred for hosting, advertising spend and third party services are not refundable.",
          ],
        },
        {
          heading: "Payment",
          body: [
            "Setup fees are payable before work begins unless the proposal says otherwise. Monthly fees are billed in advance and continue until cancelled.",
            "Monthly services can be cancelled with 30 days written notice. Advertising spend paid to Google, Meta or any other platform is separate from our fees and is not refundable by us.",
            "We may suspend services on accounts more than 14 days overdue, after telling you first.",
          ],
        },
        {
          heading: "Ownership",
          body: [
            "On full payment, you own the website design, the written content we produce for you, and your domain. You keep ownership of anything you supply to us.",
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
            `Questions about these terms can go to ${SITE.email} or ${SITE.phone}.`,
          ],
        },
      ]}
    />
  );
}
