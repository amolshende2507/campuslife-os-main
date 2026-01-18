import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Heart, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container-tight px-4 max-w-4xl mx-auto text-center">
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            We are digitizing <span className="text-primary">Campus Life.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-16 leading-relaxed">
            CampusLife OS started with a simple observation: Why is managing a college fest harder than launching a startup? We are here to kill the paperwork.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left mb-20">
            <div className="p-6 rounded-2xl bg-secondary/20 border border-border/50">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Speed</h3>
              <p className="text-muted-foreground">Information travels instantly. No more waiting for circulars to be pinned on a notice board.</p>
            </div>
            <div className="p-6 rounded-2xl bg-secondary/20 border border-border/50">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Community</h3>
              <p className="text-muted-foreground">Colleges are about people, not processes. We help students find their tribe through clubs.</p>
            </div>
            <div className="p-6 rounded-2xl bg-secondary/20 border border-border/50">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Open Source</h3>
              <p className="text-muted-foreground">Built by students, for students. We believe in transparency and modern tech stacks.</p>
            </div>
          </div>

          <div className="bg-primary/5 rounded-3xl p-12 border border-primary/10">
            <h2 className="text-3xl font-bold mb-4">Ready to upgrade?</h2>
            <p className="text-muted-foreground mb-8">Join 50+ colleges using the OS today.</p>
            <Link to="/signup">
              <Button size="lg" variant="hero" className="gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}