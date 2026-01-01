import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

const CTASection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container-tight section-padding">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to transform your{" "}
            <span className="gradient-text">campus experience?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join 50+ colleges already using CampusLife OS. Get started in minutes, not months.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button variant="hero" size="xl" className="group min-w-[200px]">
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="hero-outline" size="xl" className="min-w-[200px]">
              <Mail className="w-5 h-5" />
              Request Demo
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • Free for small clubs • Setup in 5 minutes
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
