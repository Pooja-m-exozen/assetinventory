"use client";

import { Heart } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Heart className="me-2" style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
        <h1 className="mb-0 fw-bold" style={{ fontSize: '20px', color: '#000' }}>
          Terms of Service
        </h1>
      </div>

      {/* Main Content Card with Square Edges */}
      <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '0', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="space-y-4" style={{ color: '#000' }}>
          {/* Introduction */}
          <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
            By using AssetExozen (the "Service"), you agree to the following terms and conditions ("Terms of Service"). AssetExozen is owned and operated by SmartSign, LLC (the "Company"), based in Brooklyn, New York. The Company reserves the right to update and change these Terms of Service without notice. Your account may be terminated if you violate any of the Terms of Service.
          </p>

          {/* Section 1: Purpose of the Service */}
          <section style={{ marginTop: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#000', marginBottom: '12px' }}>1. Purpose of the Service.</h2>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>1.1</strong> The Service exists to assist you in creating, tracking, and maintaining an inventory of assets, including information regarding business assets, personal property, insurance policies, and warranties.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>1.2</strong> The Service is not intended to provide legal, tax, or financial advice, and the Service does not provide proof of ownership or possession of assets. You should consult an attorney, accountant, or other financial adviser who is fully aware of your individual circumstances before making any decisions based on information and advice provided by the Service.
            </p>
          </section>

          {/* Section 2: Use of the Service */}
          <section style={{ marginTop: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#000', marginBottom: '12px' }}>2. Use of the Service</h2>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>2.1</strong> You agree that you will only use the Service for your own personal use and internal business purposes.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>2.2</strong> Your right to access the Service is personal to you and may not be transferred to any other entity or person. It is your obligation to maintain accurate registration and account information. The Service may not function effectively if your account information is not maintained.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>2.3</strong> You agree that the Company may use your feedback, suggestions or ideas in any way, including in modifications to the Service, other products or services, or in publicity materials, and grant the Company a perpetual, royalty-free, unencumbered license to use the feedback you provide.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>2.4</strong> You are aware that the technical processing and transmission of the Service, including your content, may be transferred unencrypted and involve transmissions over various networks, and changed to conform and adapt to technical requirements of connecting networks or devices.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>2.5</strong> By uploading content to the Service, you authorize the Company to display your company name and logo on its website, customer list, and publicity materials, free of charge. The Company claims no intellectual property rights over any other content you upload to the Service.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>2.6</strong> You agree to provide all equipment and software necessary to connect to the Service, including but not limited to a web-enabled device that is suitable to connect with and use the Service. You are solely responsible for any fees, including Internet connection or mobile fees, that you incur when accessing the Service.
            </p>
          </section>

          {/* Section 3: Prohibited acts */}
          <section style={{ marginTop: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#000', marginBottom: '12px' }}>3. Prohibited acts.</h2>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>3.1</strong> You agree you will not upload any content that is in violation of any applicable laws in your jurisdiction.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>3.2</strong> You agree you will not use any robot, spider, or other automated data-gathering device to access or monitor the Service or any portion thereof without explicit written consent of the Company.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>3.3</strong> You agree you will not interfere with the ability of the Company to operate and maintain the Service by uploading or transmitting any worms, viruses, Trojan horses, keyloggers, or other malware.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>3.4</strong> You agree you will not use the Service to send unsolicited bulk messages ("spam").
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>3.5</strong> You agree you will not upload any content that is defamatory, harassing, obscene, or pornographic.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>3.6</strong> You agree to not reverse-engineer, decompile or disassemble any of the software that makes up the Service.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>3.7</strong> You agree to not take any action that will impose an unreasonable or disproportionate load on the Service's infrastructure.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>3.8</strong> You agree you will not upload any content that infringes on or misappropriates any third party's intellectual property rights, privacy rights, contractual rights, proprietary rights, or publicity rights.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>3.9</strong> You agree you will not upload any individually identifiable health information that violates the HIPAA Privacy Rule.
            </p>
          </section>

          {/* Section 4: User accounts */}
          <section style={{ marginTop: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#000', marginBottom: '12px' }}>4. User accounts.</h2>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>4.1</strong> You must provide your company's name, a valid email address, and your name in order to complete the signup process.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>4.2</strong> You must be human. Accounts registered by automated methods, such as by "bot," are not allowed.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>4.3</strong> You are responsible for maintaining the security of your account and password. The Company cannot and will not be responsible for any damage or loss resulting from your failure to secure your account or password. If you suspect that your account has been breached, it is your obligation to notify the Company of any unauthorized use of your account.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>4.4</strong> The Service is not intended for minors under the age of 18. By accepting these Terms of Service, you represent and warrant that you are not a minor, and are at least 18 years old.
            </p>
          </section>

          {/* Section 5: Subscription Terms */}
          <section style={{ marginTop: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#000', marginBottom: '12px' }}>5. Subscription Terms.</h2>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>5.1</strong> All paid plans for the Service are billed in advance and renew automatically unless canceled. Payment is due at the beginning of each subscription period. Subscriptions must be paid via credit card unless your organization is approved to pay by check, ACH, or wire transfer.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>5.2</strong> For check, ACH, or wire payments, full payment must be received and processed within 14 calendar days of your subscription start date. Initiating a payment (e.g. mailing a check or submitting a transfer) does not constitute receipt. To avoid disruption, users are responsible for initiating payment early enough to allow for 3–5 business days of processing time after arrival.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>5.3</strong> Your subscription begins on the date of order confirmation, with access granted immediately. If payment is not received and processed within 14 days, your account will be suspended, and you will no longer be able to access any part of the Service.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>5.4</strong> Suspended accounts will be retained for 30 days following the suspension date. After 30 days, AssetExozen cannot guarantee that account data will remain recoverable, even if technically retained in our systems.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>5.5</strong> If your subscription is reinstated after suspension, the new subscription period will begin on the date payment is received and processed—not retroactively from the original subscription start date.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>5.6</strong> Users who pay by check, ACH, or wire will receive a courtesy reminder in advance of their renewal date. However, it is the user's sole responsibility to ensure that payment is submitted and received on time to avoid interruption.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>5.7</strong> You may cancel your subscription at any time. Access to paid features will continue through the end of your current billing period.
            </p>
          </section>

          {/* Section 6: User content */}
          <section style={{ marginTop: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#000', marginBottom: '12px' }}>6. User content.</h2>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>6.1</strong> You are responsible for all content posted under your account, as well as any activity that occurs under your account.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>6.2</strong> The Company does not pre-screen uploaded user content, but reserves the right in its sole discretion to refuse or remove any content made available by the Service.
            </p>
          </section>

          {/* Section 7: Third-party accounts */}
          <section style={{ marginTop: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#000', marginBottom: '12px' }}>7. Third-party accounts.</h2>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>7.1</strong> The Service may permit you to log in using third-party websites and accounts, such as Facebook and LinkedIn.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>7.2</strong> By providing your third-party account credentials to the Company, you authorize the Company to access your third-party account as your agent. You authorize the Company to disclose, use and store those credentials to log in to the Service. The Company will not share your personal information with third-party websites, except to the extent necessary to verify your identity.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>7.3</strong> The Service is not sponsored or endorsed by any third parties accessible through the Service.
            </p>
          </section>

          {/* Section 8: Links to and from other websites */}
          <section style={{ marginTop: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#000', marginBottom: '12px' }}>8. Links to and from other websites.</h2>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>8.1</strong> The Service may provide links to third-party websites. The Company is not responsible for the content on third-parties' websites, and a link does not imply sponsorship or endorsement of the third-party website's content.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>8.2</strong> The Company may maintain accounts on social media platforms such as Facebook, Twitter, and Instagram. Any content you post on the Company's social media accounts is subject to the social media platform's terms of service and privacy policies.
            </p>
          </section>

          {/* Section 9: Intellectual property rights */}
          <section style={{ marginTop: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#000', marginBottom: '12px' }}>9. Intellectual property rights.</h2>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>9.1</strong> All data not provided by users remains intellectual property or proprietary content owned or licensed by the Company. All such intellectual property or proprietary rights are reserved by the Company and any third-party owners of those rights.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>9.2</strong> You agree you will not use the Company's intellectual property or proprietary content on behalf of any third party, to create derivative works, or in connection with any product or service without the express written consent of the Company.
            </p>
          </section>

          {/* Section 10: Use of cookies */}
          <section style={{ marginTop: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#000', marginBottom: '12px' }}>10. Use of cookies.</h2>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>10.1</strong> A cookie is a small piece of information stored on your computer in the form of a file. The Company uses cookies to monitor performance and to facilitate functionality of the Service.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>10.2</strong> You may refuse the use of cookies by adjusting your browser settings, but if you do so you may not be able to use the full functionality of the Service. By using the Service, you consent to the use of cookies and the use of the data they provide.
            </p>
          </section>

          {/* Section 11: Disclaimer of warranties; limitation of liability */}
          <section style={{ marginTop: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#000', marginBottom: '12px' }}>11. Disclaimer of warranties; limitation of liability</h2>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              The Company does not warrant that:
            </p>
            <ol style={{ listStyle: 'none', paddingLeft: '0', marginBottom: '12px', counterReset: 'item' }}>
              <li style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '8px', counterIncrement: 'item', paddingLeft: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0', fontWeight: 'bold' }}>11.1.</span>
                <span style={{ marginLeft: '20px' }}>The Service will meet your specific requirements;</span>
              </li>
              <li style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '8px', counterIncrement: 'item', paddingLeft: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0', fontWeight: 'bold' }}>11.2.</span>
                <span style={{ marginLeft: '20px' }}>The Service will be uninterrupted, timely, secure, or error-free;</span>
              </li>
              <li style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '8px', counterIncrement: 'item', paddingLeft: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0', fontWeight: 'bold' }}>11.3.</span>
                <span style={{ marginLeft: '20px' }}>The results that may be obtained from the use of the Service will be accurate or reliable;</span>
              </li>
              <li style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '8px', counterIncrement: 'item', paddingLeft: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0', fontWeight: 'bold' }}>11.4.</span>
                <span style={{ marginLeft: '20px' }}>The quality of any products, services, information, or other material obtained by you through the Service will meet your expectations; and</span>
              </li>
              <li style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '8px', counterIncrement: 'item', paddingLeft: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0', fontWeight: 'bold' }}>11.5.</span>
                <span style={{ marginLeft: '20px' }}>Any errors in the Service will be corrected.</span>
              </li>
            </ol>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              You expressly understand and agree that the Company shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages, including but not limited to damages for loss of profits, goodwill, use, data or other intangible losses (even if the Company has been advised of the possibility of such damages), resulting from:
            </p>
            <ol style={{ listStyle: 'none', paddingLeft: '0', marginBottom: '12px', counterReset: 'item' }}>
              <li style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '8px', counterIncrement: 'item', paddingLeft: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0', fontWeight: 'bold' }}>11.6.</span>
                <span style={{ marginLeft: '20px' }}>The use or the inability to use the Service;</span>
              </li>
              <li style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '8px', counterIncrement: 'item', paddingLeft: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0', fontWeight: 'bold' }}>11.7.</span>
                <span style={{ marginLeft: '20px' }}>The cost of procurement of substitute goods and services resulting from any goods, data, information or services purchased or obtained or messages received or transactions entered into through or from the Service;</span>
              </li>
              <li style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '8px', counterIncrement: 'item', paddingLeft: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0', fontWeight: 'bold' }}>11.8.</span>
                <span style={{ marginLeft: '20px' }}>Unauthorized access to or alteration of your transmissions or data;</span>
              </li>
              <li style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '8px', counterIncrement: 'item', paddingLeft: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0', fontWeight: 'bold' }}>11.9.</span>
                <span style={{ marginLeft: '20px' }}>Statements or conduct of any third party on the Service; or</span>
              </li>
              <li style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '8px', counterIncrement: 'item', paddingLeft: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0', fontWeight: 'bold' }}>11.10.</span>
                <span style={{ marginLeft: '20px' }}>Any other matter relating to the Service.</span>
              </li>
            </ol>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              You understand and agree, in no event will the Company's aggregate liability to you in any matter arising from or related to the Service exceed one hundred dollars, or the cost of the services provided, whichever is less.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              The Service is not an archival or storage service, and the Company reserves the right to limit the period of time that uploaded content is available on the Service.
            </p>
          </section>

          {/* Section 12: Intellectual property complaints */}
          <section style={{ marginTop: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#000', marginBottom: '12px' }}>12. Intellectual property complaints.</h2>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              If you have a good faith belief that your work has been copied in a way that constitutes copyright infringement, or that your intellectual property rights have been otherwise violated, please provide the Company's designated agent with the following information:
            </p>
            <ol style={{ listStyle: 'none', paddingLeft: '0', marginBottom: '12px', counterReset: 'item' }}>
              <li style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '8px', counterIncrement: 'item', paddingLeft: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0', fontWeight: 'bold' }}>12.1.</span>
                <span style={{ marginLeft: '20px' }}>A physical or electronic signature of the person authorized to act on behalf of the owner of the copyright or other intellectual property interest that is allegedly infringed;</span>
              </li>
              <li style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '8px', counterIncrement: 'item', paddingLeft: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0', fontWeight: 'bold' }}>12.2.</span>
                <span style={{ marginLeft: '20px' }}>Identification or description of the copyrighted work or other intellectual property that you claim has been infringed. If you are asserting infringement of an intellectual property right other than copyright, please specify the intellectual property right at issue (for example, trademark or patent);</span>
              </li>
              <li style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '8px', counterIncrement: 'item', paddingLeft: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0', fontWeight: 'bold' }}>12.3.</span>
                <span style={{ marginLeft: '20px' }}>Identification or description of where the material that you claim is infringing is located on the Service, with enough detail that we may find it on the Service;</span>
              </li>
              <li style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '8px', counterIncrement: 'item', paddingLeft: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0', fontWeight: 'bold' }}>12.4.</span>
                <span style={{ marginLeft: '20px' }}>Your postal address, telephone number, and email address;</span>
              </li>
              <li style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '8px', counterIncrement: 'item', paddingLeft: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0', fontWeight: 'bold' }}>12.5.</span>
                <span style={{ marginLeft: '20px' }}>A statement by you that you have a good faith belief that the use of the material complained of is not authorized by the copyright or intellectual property owner, its agent, or the law; and</span>
              </li>
              <li style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '8px', counterIncrement: 'item', paddingLeft: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0', fontWeight: 'bold' }}>12.6.</span>
                <span style={{ marginLeft: '20px' }}>A statement by you, made under penalty of perjury, that the information in your notice is accurate and that you are the copyright or intellectual property owner or authorized to act on the copyright or intellectual property owner's behalf.</span>
              </li>
            </ol>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              The Company's agent designated to receive claims of copyright or other intellectual property infringement may be contacted by email at <a href="mailto:support@exozen.co.in" style={{ color: '#FF8C00', textDecoration: 'underline' }}>support@exozen.co.in</a>. The Company has adopted and implements a policy that provides for the termination in appropriate circumstances of the accounts of users who repeatedly infringe copyrights or other intellectual property rights of the Company and others. For more details on the information required for valid DMCA notification, see 17 U.S.C. § 512(c)(3). You should be aware that, under the DMCA, claimants who make misrepresentations concerning copyright infringement may be liable for damages incurred as a result of the removal or blocking of the material, court costs, and attorney fees.
            </p>
          </section>

          {/* Section 13: Assignability */}
          <section style={{ marginTop: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#000', marginBottom: '12px' }}>13. Assignability.</h2>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              The Company may assign its rights under these Terms of Service to an affiliated company, or in the event of a merger or acquisition, to its surviving or successor entity. The Company will provide you with reasonable notice in the event of any such assignment by updating this page.
            </p>
          </section>

          {/* Section 14: Termination */}
          <section style={{ marginTop: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#000', marginBottom: '12px' }}>14. Termination.</h2>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              These Terms of Service apply when you first use the Service, and will continue until:
            </p>
            <ol style={{ listStyle: 'none', paddingLeft: '0', marginBottom: '12px', counterReset: 'item' }}>
              <li style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '8px', counterIncrement: 'item', paddingLeft: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0', fontWeight: 'bold' }}>14.1.</span>
                <span style={{ marginLeft: '20px' }}>your account is terminated; or</span>
              </li>
              <li style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '8px', counterIncrement: 'item', paddingLeft: '24px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0', fontWeight: 'bold' }}>14.2.</span>
                <span style={{ marginLeft: '20px' }}>the Company ceases to provide the Service.</span>
              </li>
            </ol>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              You are solely responsible for properly cancelling your account.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              All of your content will be immediately inaccessible from the service upon cancellation. Within 30 days of cancellation, this content will be deleted from all backups and logs. This information cannot be recovered.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              The Company reserves the right to suspend or cancel your account and refuse you use of the Service for any reason at any time.
            </p>
          </section>

          {/* Section 15: Privacy policy */}
          <section style={{ marginTop: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#000', marginBottom: '12px' }}>15. Privacy policy.</h2>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              Data provided to the Service is subject to the AssetExozen Privacy Policy. The Company reserves the right to update the Privacy Policy at any time.
            </p>
          </section>

          {/* Section 16: Disputes */}
          <section style={{ marginTop: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#000', marginBottom: '12px' }}>16. Disputes.</h2>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              These Terms of Service are governed by the law of the State of New York. Any dispute regarding the foregoing shall be venued in Kings County, New York.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              Any claim or controversy arising from or relating to these Terms of Service, or the breach thereof, shall be settled by arbitration administered by the American Arbitration Association. The arbitration hearing shall take place before a single arbitrator. Judgment on the award rendered by the arbitrator may be entered in any court having jurisdiction thereof. Notwithstanding the foregoing, either party may immediately bring a proceeding seeking preliminary injunctive relief in a court having jurisdiction thereof which shall remain in effect until a final award is made in the arbitration.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              You agree to indemnify, defend, and hold harmless the Company, its agents, licensors, and service providers, and their respective past and present officers, directors, employees, and representatives, from and against any and all claims, actions, demands, liabilities, costs, and expenses, including but not limited to reasonable attorney fees resulting from your breach of any provision of these Terms of Service or resulting from your use of the Service.
            </p>
          </section>

          {/* Section 17: General provisions */}
          <section style={{ marginTop: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#000', marginBottom: '12px' }}>17. General provisions.</h2>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              The failure of the Company to exercise or enforce any right or provision of the Terms of Service is not a waiver of such right or provision. The Terms of Service constitute the entire agreement between you and the Company and govern your use of the Service, superseding any prior agreements between you and the Company (including, but not limited to, any prior versions of the Terms of Service).
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              If any provision of these Terms of Service is determined to be void or unenforceable, the remaining provisions of these Terms of Service will remain in force.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              These Terms of Service and Privacy Policy constitute the entire agreement between you and the Company, superseding any other agreements, both oral and written.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              Agreeing to these Terms of Service does not affect any engagement letter or other agreements in force between you and the Company. In the event of a conflict between the Terms of Service and other agreements in force between you and the Company, these Terms of Service shall govern where they pertains to your use of the Service.
            </p>
          </section>
          </div>
        </div>
      </div>
    </div>
  );
}

