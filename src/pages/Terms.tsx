import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container-tight px-4 max-w-3xl mx-auto prose dark:prose-invert">
          
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">1. Acceptable Use</h2>
            <p className="text-muted-foreground">
              CampusLife OS is a professional tool. You agree not to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Post fake events or spam announcements.</li>
              <li>Upload inappropriate content to the Academic Vault.</li>
              <li>Abuse the anonymous complaint system for harassment.</li>
            </ul>
          </section>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">2. Account Termination</h2>
            <p className="text-muted-foreground">
              Faculty Administrators reserve the right to ban or suspend students who violate these terms. If you are banned, you will lose access to all tickets and club memberships.
            </p>
          </section>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">3. Liability</h2>
            <p className="text-muted-foreground">
              CampusLife OS is a facilitator. We are not responsible for cancelled events, lost items that are not found, or the accuracy of academic notes uploaded by peers.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}