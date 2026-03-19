import { ContactData } from "@/types";
import { Navbar } from "@/components/layout/Navbar";

export default function PrivacyPolicy() {
    const landingContact: ContactData = {
        title: "",
        description: "",
        email: "",
        personalEmail: "",
        cta: "",
        secondaryCta: "",
    };

    return (
        <main className="min-h-screen bg-[#0A0A0A] text-white/80 pb-20">
            <Navbar
                name="Atom"
                data={{
                    items: [
                        { label: "Home", href: "/" }
                    ],
                    logoText: "ATOM",
                    ctaText: "Get Atom",
                    ctaHref: "/#mobile"
                }}
                contact={landingContact}
            />

            <div className="max-w-4xl mx-auto px-6 pt-32 space-y-8">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-white/50">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </header>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
                    <p>
                        We collect personal information that you voluntarily provide to us when you register on the App/Website,
                        express an interest in obtaining information about us or our products and services, when you participate
                        in activities on the App/Website or otherwise when you contact us.
                    </p>
                    <p>
                        The personal information that we collect depends on the context of your interactions with us and the
                        App/Website, the choices you make and the products and features you use. The personal information we collect
                        may include the following:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-white/70">
                        <li><strong>Account Data:</strong> Name, email address, passwords, authentication data from third-party providers.</li>
                        <li><strong>Profile Data:</strong> Social media links, career history, skills, and portfolio projects you choose to upload.</li>
                        <li><strong>Media:</strong> Images, documents (like resumes), and other content you upload.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">2. How We Use Your Information</h2>
                    <p>We use personal information collected via our App/Website for a variety of business purposes described below:</p>
                    <ul className="list-disc pl-6 space-y-2 text-white/70">
                        <li>To facilitate account creation and logon process.</li>
                        <li>To build, serve, and display your personalized digital portfolio on the web.</li>
                        <li>To request feedback and to contact you about your use of our App/Website.</li>
                        <li>To process your payments and manage your premium subscription (such as Custom Domains).</li>
                        <li>To protect our Services (for example, fraud monitoring and prevention).</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">3. Third-Party Services</h2>
                    <p>
                        We may share your data with third-party vendors, service providers, contractors or agents who perform services for us or on our behalf and require access to such information to do that work.
                    </p>
                    <p>These may include:</p>
                    <ul className="list-disc pl-6 space-y-2 text-white/70">
                        <li><strong>Firebase/Google Cloud:</strong> For hosting, database storage (Firestore), and authentication.</li>
                        <li><strong>Payment Processors (Razorpay):</strong> For securely processing transactions.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">4. Data Security</h2>
                    <p>
                        We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">5. Your Privacy Rights</h2>
                    <p>
                        Depending on your location, you may have rights under privacy laws regarding your personal data.
                        You can review, change, or terminate your account at any time by logging into your account settings and updating your profile, or by contacting us directly.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">6. Contact Us</h2>
                    <p>
                        If you have questions or comments about this notice, you may email us at your designated support email address.
                    </p>
                </section>
            </div>
        </main>
    );
}
