import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Calendar, Users, MessageSquare, Bell } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="container-tight section-padding">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Now live at 50+ colleges across India
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up">
            The Operating System for{" "}
            <span className="gradient-text">Campus Life</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Events, clubs, complaints, and announcements — all in one beautiful platform. 
            Say goodbye to WhatsApp chaos and lost Google Forms.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/signup">
              <Button variant="hero" size="xl" className="group">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="hero-outline" size="xl" className="group">
              <Play className="w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Floating Feature Cards */}
          <div className="relative max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {/* Main Dashboard Preview */}
            <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <FeatureCard
                  icon={<Calendar className="w-5 h-5" />}
                  label="Events"
                  value="24"
                  color="primary"
                />
                <FeatureCard
                  icon={<Users className="w-5 h-5" />}
                  label="Clubs"
                  value="12"
                  color="accent"
                />
                <FeatureCard
                  icon={<MessageSquare className="w-5 h-5" />}
                  label="Complaints"
                  value="3"
                  color="primary"
                />
                <FeatureCard
                  icon={<Bell className="w-5 h-5" />}
                  label="Announcements"
                  value="8"
                  color="accent"
                />
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 sm:-left-8 bg-card rounded-xl shadow-lg border border-border/50 p-3 animate-float">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-accent" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">New Members</p>
                  <p className="text-sm font-semibold">+128 today</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 sm:-right-8 bg-card rounded-xl shadow-lg border border-border/50 p-3 animate-float" style={{ animationDelay: "-2s" }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Registrations</p>
                  <p className="text-sm font-semibold">1,247 this week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "primary" | "accent";
}) => (
  <div className="bg-secondary/50 rounded-xl p-4 text-center card-hover cursor-default">
    <div
      className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center mb-2 ${
        color === "primary" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
      }`}
    >
      {icon}
    </div>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

export default HeroSection;
