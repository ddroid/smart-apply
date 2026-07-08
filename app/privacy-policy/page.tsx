import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Navbar />
      <main className="flex-1 p-8 max-w-[800px] mx-auto w-full">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Privacy Policy</h1>
        <p className="text-sm text-text-muted mb-8">Last updated: July 8, 2026</p>

        <div className="flex flex-col gap-6 text-sm text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-text-primary mb-2">
              Information We Collect
            </h2>
            <p>
              Smart Apply collects information you provide when creating an account,
              completing your profile, uploading a resume, and using job search features.
              This may include your name, email address, contact details, employment history,
              skills, and job preferences.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-primary mb-2">
              How We Use Your Information
            </h2>
            <p>
              We use your information to authenticate your account, personalize job matching,
              generate resume content, run company research, and improve the product experience.
              We do not sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-primary mb-2">
              Data Storage and Security
            </h2>
            <p>
              Your data is stored securely using industry-standard infrastructure. Access to
              your profile and job data is restricted to your authenticated account.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-primary mb-2">
              Third-Party Services
            </h2>
            <p>
              Smart Apply integrates with authentication providers, analytics tools, and job
              data sources to deliver core functionality. These services process data according
              to their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-primary mb-2">Contact</h2>
            <p>
              If you have questions about this Privacy Policy, contact us at
              {" "}
              <a
                href="mailto:privacy@smartapply.app"
                className="text-accent hover:text-accent-dark transition-colors"
              >
                privacy@smartapply.app
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
