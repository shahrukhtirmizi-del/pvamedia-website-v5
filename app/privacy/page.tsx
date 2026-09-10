import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";
import { SITE } from "../lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How PVA Media collects, uses and stores personal data, and the rights you have over it.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "10 September 2026";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      updated={UPDATED}
      intro={`This policy explains what personal data ${SITE.name} collects through this website, why we collect it, how long we keep it, and what you can ask us to do with it.`}
      sections={[
        {
          heading: "Who we are",
          body: [
            `${SITE.name} is a web design and marketing company based in the United Kingdom, working with landscaping companies in the United States and elsewhere. We are the data controller for the personal data described in this policy.`,
            `You can reach us about anything in this policy at ${SITE.email} or on ${SITE.phone}.`,
          ],
        },
        {
          heading: "What we collect",
          body: [
            "When you submit the booking form we collect the details you enter: your name, company name, email address, phone number, current website address if you give one, what you are looking for, and anything you write in the message field.",
            "We also collect limited technical and usage information when you browse the site, such as which pages were viewed, approximate region, referring site, and general device and browser type. This is aggregated and is not used to identify you personally.",
            "We do not collect payment card details through this website, and we never ask for them by email.",
          ],
        },
        {
          heading: "Why we use it, and our lawful basis",
          body: [
            "We use form submissions to reply to your enquiry, arrange a call, and provide the services you ask about. The lawful basis is that processing is necessary to take steps at your request before entering into a contract, and our legitimate interest in responding to business enquiries.",
            "We use usage information to understand which parts of the site are useful and to improve it. The lawful basis is our legitimate interest in maintaining and improving our own website, and your consent where analytics cookies are used.",
            "We will only send you marketing email if you have asked us to, and every such email includes a way to stop receiving them.",
          ],
        },
        {
          heading: "Cookies and analytics",
          body: [
            "Essential cookies and local storage are used to remember your cookie choice and whether the site introduction has already played. These are required for the site to work as expected and are not used for tracking.",
            "We use Vercel Analytics to measure page views and traffic sources. It is privacy-focused: it does not use cross-site tracking cookies and does not build a profile of you across other websites.",
            "You can decline non-essential measurement in the cookie banner, and you can clear cookies and site data at any time in your browser settings.",
          ],
        },
        {
          heading: "Who we share it with",
          body: [
            "We do not sell personal data, and we do not share it for anyone else's marketing.",
            "We use a small number of service providers who process data on our behalf: Formspree to deliver form submissions to our inbox, Vercel to host the site and provide analytics, and our email provider. Each is bound to process the data only on our instructions.",
            "Some of these providers operate servers outside the United Kingdom. Where personal data is transferred internationally, it is protected by the safeguards those providers have in place, such as standard contractual clauses.",
          ],
        },
        {
          heading: "How long we keep it",
          body: [
            "Enquiries that do not become clients are kept for up to 24 months, so we have context if you come back to us, and are then deleted.",
            "Records relating to clients are kept for the length of the engagement and for up to six years afterwards, which is the period we may need them for tax, accounting and legal purposes.",
            "Aggregated analytics data contains no identifying information and may be kept indefinitely.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "You have the right to ask for a copy of the personal data we hold about you, to have it corrected if it is wrong, to have it deleted, to restrict or object to how we use it, and to receive it in a portable format. Where we rely on consent, you can withdraw it at any time.",
            `To exercise any of these, email ${SITE.email}. We will respond within one month.`,
            "If you are unhappy with how we have handled your data, you can complain to the Information Commissioner's Office at ico.org.uk. We would appreciate the chance to put it right first.",
          ],
        },
        {
          heading: "Security and changes",
          body: [
            "The site is served over HTTPS, and access to enquiry data is limited to the people who need it to do their job. No system is perfectly secure, but we take reasonable steps to protect what we hold.",
            "If this policy changes we will update the date at the top of this page. Material changes will be made obvious on the site.",
          ],
        },
      ]}
    />
  );
}
