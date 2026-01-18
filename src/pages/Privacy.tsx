import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container-tight px-4 max-w-3xl mx-auto prose dark:prose-invert">
          
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2024</p>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">1. Data Collection</h2>
            <p className="text-muted-foreground">
              We collect minimal data necessary to function: your Name, Email, and College ID. We do not track your location unless you explicitly tag it in a 'Lost & Found' post.
            </p>
          </section>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">2. Anonymous Complaints</h2>
            <p className="text-muted-foreground">
              We take anonymity seriously. When you select "Anonymous" on a complaint:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Your User ID is legally separated from the complaint view for Admins.</li>
              <li>Row Level Security (RLS) policies in our database enforce this separation at the engine level.</li>
              <li>Only you can see that you wrote the complaint.</li>
            </ul>
          </section>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">3. Data Sharing</h2>
            <p className="text-muted-foreground">
              We do not sell your data. Your data is only visible to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>You:</strong> Your profile and tickets.</li>
              <li><strong>Your Faculty:</strong> Academic data and non-anonymous complaints.</li>
              <li><strong>Club Admins:</strong> Only if you join their specific club.</li>
            </ul>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}