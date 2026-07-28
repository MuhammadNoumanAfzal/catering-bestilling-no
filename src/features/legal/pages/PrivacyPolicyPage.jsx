import LegalPageLayout, { LegalSection } from "../components/LegalPageLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Privacy Policy"
      title="How Cateringbestilling handles customer information"
      intro="This privacy policy describes the types of information collected through the client-side ordering experience and how that information supports account access, ordering, delivery, and customer support."
    >
      <LegalSection title="Information we collect">
        <p>
          We may collect information such as your name, email address, phone
          number, delivery location, post code, and account credentials when
          you create an account or submit an order.
        </p>
        <p>
          We may also store order notes, selected menus, saved vendors, and
          checkout preferences to improve your ordering experience.
        </p>
      </LegalSection>

      <LegalSection title="How information is used">
        <p>
          Your information is used to authenticate your account, process
          requests, coordinate deliveries, support vendor communication, and
          provide customer service.
        </p>
        <p>
          We may also use operational data to improve the product, resolve
          issues, and maintain platform security.
        </p>
      </LegalSection>

      <LegalSection title="Sharing and disclosure">
        <p>
          Order and delivery details may be shared with relevant vendors and
          service partners when needed to fulfill your catering request.
        </p>
        <p>
          We do not share customer information beyond what is reasonably needed
          for ordering, support, compliance, or technical operations.
        </p>
      </LegalSection>

      <LegalSection title="Storage and security">
        <p>
          We use reasonable safeguards to protect customer information, but no
          platform can guarantee absolute security.
        </p>
        <p>
          You should use a strong password and avoid sharing account access with
          unauthorized users.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <p>
          You may request updates to your account information or contact support
          about account access and data-related concerns.
        </p>
        <p>
          Continued use of the platform after policy updates means you accept
          the revised privacy practices.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
