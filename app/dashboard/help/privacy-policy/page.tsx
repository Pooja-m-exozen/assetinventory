"use client";

import { Smile } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Smile className="h-6 w-6 text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
          Privacy Policy
        </h1>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none dark:prose-invert" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          {/* Introduction */}
          <p className="text-base leading-relaxed">
            AssetTiger is operated by SmartSign who knows that your privacy matters to you, and so we have established this privacy policy to let you know how we use your information. Our privacy policy is also subject to our <Link href="/dashboard/help/terms-of-service" className="text-orange-500 hover:underline font-semibold">Terms of service</Link>.
          </p>

          {/* Section 1: Information we collect */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4">1. Information we collect</h2>
            <p className="text-base leading-relaxed">
              We do not collect personal information unless you voluntarily provide it to us. If during your visit to one of our websites you complete a form, send an e-mail, or perform some other transaction, this website may collect your name, company name, business address, business e-mail address, business phone number, business fax number, job title, industry sector, and/or credit card information.
            </p>
            <p className="text-base leading-relaxed">
              To protect credit card numbers, we outsource this information to a certified payment processor via a hosted payment page on our website in accordance with PCI DSS regulations. The provider returns the credit card number to us as a token. We do not see, process or store customers' raw credit card information in any of our systems or databases. We are PCI compliant and attest to such via an annual SAQ-C and quarterly vulnerability scans performed by and attested to by an outside agency.
            </p>
            <p className="text-base leading-relaxed">
              Please note that there are instances where we share your volunteered information with third parties in order to fulfill your request.
            </p>
            <p className="text-base leading-relaxed">
              We, like many companies that provide products and services to customers, may employ other companies and individuals to perform specific functions on our behalf. Examples include, but are not limited to: mail, and e-mail; address hygiene; credit card processing services; research that improves the quality of services or offers provided to you, including customer satisfaction surveys; or performing a credit check as part of your order. These providers have access to the information that they require to perform their functions but are strictly forbidden from using it for any other purposes. You may, however, "opt-out" of this use of your volunteered information at any time, but doing so may impair our ability to provide you with proper service and to process your orders.
            </p>
            <p className="text-base leading-relaxed">
              This site also uses cookies. Cookies are small data files stored on your computer, and most browsers are set up to accept cookies by default. Cookies do not track any personal information, but we may use them to identify you as a past customer, for instance. We use third-party cookies, like Google, for analytics, and those third-party cookies may be placed on your computer. You can opt out of advertising cookies by <a href="#" className="text-orange-500 hover:underline">clicking this link</a>. We do not respond to web browser "do not track" signals. We do not collect data on your online activities over time across third-party websites.
            </p>
            <p className="text-base leading-relaxed">
              Our servers automatically log some information that comes from you, like which browser you are using, your IP address, what IP address you came to AssetTiger from, and how you navigate within our site. This information cannot be used to identify you personally, but it helps us to determine if someone else is accessing your account without authorization.
            </p>
            <p className="text-base leading-relaxed">
              We also track your usage history, such as your search history and which content you have accessed. This history lets you easily backtrack to a location you've previously visited.
            </p>
            <p className="text-base leading-relaxed">
              If you receive emails from us, we use web beacon technology to track whether you have clicked on individual email advertisements.
            </p>
          </section>

          {/* Section 2: How we use your information */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4">2. How we use your information</h2>
            <p className="text-base leading-relaxed">
              We may use your personal information to personalize your profile, maintain AssetTiger, make improvements to the site, and to communicate with you. We will share your personal information with third parties only under the following conditions:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To provide products or services you have requested. Among other things, this includes order confirmations, invoices, and customer service communications.</li>
              <li>For marketing purposes, like to send you catalogues or marketing emails. SmartSign may share your name and physical address but no other personally identifiable information with our third-party affiliates, to distribute third-party catalogues that may be of interest to you.</li>
              <li>When disclosure is required by law. For instance, we will disclose your personal information if we receive a court order instructing us to turn over data. We do not give your data to law enforcement unless they present us with a court order.</li>
              <li>To investigate suspected fraud, illegal activities, threats to any person, or violations of our Terms of Service</li>
              <li>When we hire contractors to perform services for us. This includes companies that do payment processing, order fulfilment, catalogue printing and marketing for us. For instance, if you check out through PayPal or Amazon, we submit your personal information to them.</li>
              <li>If you donate to any of AssetTigers charity partners at checkout, AssetTiger will give that charity partner your contact information.</li>
              <li>If AssetTiger is purchased by or merged with another company. We will provide you with reasonable notice if that happens by updating this page.</li>
            </ul>
          </section>

          {/* Section 3: Control of your information */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4">3. Control of your information</h2>
            <p className="text-base leading-relaxed">
              If you do not want to us to share your personal information with our partners, receive catalogues, or marketing emails, you can unsubscribe by emailing us at <a href="mailto:Info@assettiger.com" className="text-orange-500 hover:underline">Info@assettiger.com</a>. Even if you do opt out, we may still use your personal information to communicate with you regarding your account, fulfil your orders, or if required by law.
            </p>
            <p className="text-base leading-relaxed">
              To deactivate your account, please email <a href="mailto:Info@assettiger.com" className="text-orange-500 hover:underline">Info@assettiger.com</a> or call us at <a href="tel:8882907750" className="text-orange-500 hover:underline">888-290-7750</a>.
            </p>
          </section>

          {/* Section 4: Your rights */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4">4. Your rights</h2>
            <p className="text-base leading-relaxed">
              You have the choice to share your personal data with us. You also have the right to request us to rectify or erase your personal data as far as this does not interfere with the execution of any contractual obligations. You acknowledge that a refusal to share data or a request to erase these data will make the delivery of certain services and/or products impossible. You can also request the processing of your personal data to be restricted.
            </p>
            <p className="text-base leading-relaxed">
              You also have the right to object to the use of your personal data for purposes of direct marketing.
            </p>
            <p className="text-base leading-relaxed">
              You can exercise your rights by contacting us in the following ways:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Phone:</strong> <a href="tel:+18882907750" className="text-orange-500 hover:underline">+1 (888) 290-7750</a> or <a href="tel:+17187971900" className="text-orange-500 hover:underline">+1 (718) 797-1900</a></li>
              <li><strong>Fax:</strong> +1 (718) 504-4448</li>
              <li><strong>E-mail:</strong> <a href="mailto:Info@assettiger.com" className="text-orange-500 hover:underline">Info@assettiger.com</a></li>
              <li><strong>Mail:</strong> 203 Jay St, Suite 800, Brooklyn, NY 11201, USA</li>
              <li><strong>Website:</strong> via the <Link href="/dashboard/help/contact-us" className="text-orange-500 hover:underline">"Contact Us"</Link> link</li>
            </ul>
          </section>

          {/* Section 5: Security */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4">5. Security</h2>
            <p className="text-base leading-relaxed">
              The personal information you provide us, including your payment information, is stored on access-controlled, secure servers, and the people who work on AssetTiger data are all required to keep your information confidential and secure. All data you submit to AssetTiger is stored in PCI-compliant data centers. In the event a security breach happens, we will promptly inform you. <a href="#" className="text-orange-500 hover:underline">Click here to review our penetration test statement</a>.
            </p>
          </section>

          {/* Section 6: Privacy of minors */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4">6. Privacy of minors</h2>
            <p className="text-base leading-relaxed">
              We do not collect information from anyone that we know is a minor under 18. If we become aware that you are a minor under 18, your account is subject to cancellation and your data is subject to deletion.
            </p>
          </section>

          {/* Section 7: Deleted data */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4">7. Deleted data</h2>
            <p className="text-base leading-relaxed">
              When you cancel your account, your data will be deleted automatically within 30 days.
            </p>
          </section>

          {/* Section 8: Duration of the Processing */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4">8. Duration of the Processing</h2>
            <p className="text-base leading-relaxed">
              We will store and process your personal data during the period necessary depending on the purposes of the processing, the contractual relationship between us and to comply with record retention laws and regulations.
            </p>
          </section>

          {/* Section 9: Contact Information */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4">9. Contact Information</h2>
            <p className="text-base leading-relaxed">
              If you have questions or concerns about our privacy policy, you may contact us at <a href="mailto:legal@smartsign.com" className="text-orange-500 hover:underline">legal@smartsign.com</a> or by any of the means outlined in "Your rights" section above.
            </p>
          </section>

          {/* Section 10: Changes & Questions */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mt-8 mb-4">10. Changes & Questions</h2>
            <p className="text-base leading-relaxed">
              We will notify you if we change this policy by listing it on your account or by posting changes on this page. If you have any comments or questions about our privacy policy, email us at <a href="mailto:legal@smartsign.com" className="text-orange-500 hover:underline">legal@smartsign.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

