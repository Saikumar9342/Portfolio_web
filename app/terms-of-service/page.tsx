import { ContactData } from "@/types";
import { Navbar } from "@/components/layout/Navbar";

export default function TermsOfService() {
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
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Terms of Service</h1>
                    <p className="text-white/50">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </header>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">1. Agreement to Terms</h2>
                    <p>
                        By accessing our App/Website, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site/app.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">2. Use License</h2>
                    <p>
                        Permission is granted to temporarily download one copy of the materials (information or software) on our App/Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                    </p>
                    <p>Under this license you may not:</p>
                    <ul className="list-disc pl-6 space-y-2 text-white/70">
                        <li>Modify or copy the materials.</li>
                        <li>Use the materials for any commercial purpose.</li>
                        <li>Attempt to decompile or reverse engineer any software contained on the App/Website.</li>
                        <li>Remove any copyright or other proprietary notations from the materials.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">3. User Content</h2>
                    <p>
                        You retain full ownership of all the content, projects, and personal data you upload to your portfolio. However, by uploading content, you grant us a worldwide, non-exclusive license to host, store, and display your data publicly as part of your web portfolio.
                    </p>
                    <p>
                        You agree not to upload any content that is illegal, abusive, harassing, or violates any third-party intellectual rights. We reserve the right to remove any content or terminate accounts that violate these terms.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">4. Premium Features and Payments</h2>
                    <p>
                        Some features of the App/Website (such as custom domains or premium templates) may require payment. All payments are securely processed through our third-party payment gateway (Razorpay).
                    </p>
                    <p>
                        Payments are generally non-refundable unless required by law, or as explicitly stated in our Refund Policy. We reserve the right to change our pricing at any time.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">5. Disclaimer</h2>
                    <p>
                        The materials on our App/Website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">6. Limitations</h2>
                    <p>
                        In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our App/Website.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">7. Revisions and Updates</h2>
                    <p>
                        We may revise these terms of service for its web site at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
                    </p>
                </section>
            </div>
        </main>
    );
}
