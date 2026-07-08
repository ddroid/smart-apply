import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TermsAndConditionsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Navbar />
      <main className="flex-1 p-8 max-w-[800px] mx-auto w-full">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Terms and Conditions
        </h1>
        <p className="text-sm text-text-muted mb-8">Last updated: July 8, 2026</p>

        <div className="flex flex-col gap-6 text-sm text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-text-primary mb-2">
              Acceptance of Terms
            </h2>
            <p>
              By accessing or using Smart Apply, you agree to these Terms and Conditions.
              If you do not agree, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-primary mb-2">
              Use of the Service
            </h2>
            <p>
              Smart Apply helps you discover jobs, evaluate fit, and research companies.
              You are responsible for the accuracy of information in your profile and for
              reviewing job listings before applying.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-primary mb-2">
              Account Responsibilities
            </h2>
            <p>
              You must keep your login credentials secure and notify us of unauthorized access.
              You may not misuse the platform, attempt to disrupt its operation, or use it for
              unlawful purposes.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-primary mb-2">
              AI-Generated Content
            </h2>
            <p>
              Smart Apply may generate summaries, match scores, and research based on available
              data. These outputs are provided for informational purposes and should be reviewed
              before use in applications or decisions.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-primary mb-2">
              Limitation of Liability
            </h2>
            <p>
              Smart Apply is provided on an as-is basis. We do not guarantee job placement,
              interview outcomes, or the completeness of third-party job listings.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-text-primary mb-2">Contact</h2>
            <p>
              For questions about these terms, contact us at
              {" "}
              <a
                href="mailto:legal@smartapply.app"
                className="text-accent hover:text-accent-dark transition-colors"
              >
                legal@smartapply.app
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
