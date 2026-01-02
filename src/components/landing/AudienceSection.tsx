import { GraduationCap, Users2, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const audiences = [
  {
    id: "students",
    icon: <GraduationCap className="w-8 h-8" />,
    title: "For Students",
    description: "Discover events, join clubs, and track your complaints — all from your phone.",
    benefits: [
      "Never miss an event again",
      "One-tap event registration",
      "Anonymous complaint submission",
      "Personalized announcements",
    ],
    color: "primary" as const,
  },
  {
    id: "clubs",
    icon: <Users2 className="w-8 h-8" />,
    title: "For Clubs",
    description: "Manage events, grow membership, and engage your community effortlessly.",
    benefits: [
      "Beautiful club profile pages",
      "Easy event creation",
      "Member analytics",
      "Broadcast announcements",
    ],
    color: "accent" as const,
  },
  {
    id: "colleges",
    icon: <Building2 className="w-8 h-8" />,
    title: "For Colleges",
    description: "Get complete visibility into campus life with powerful admin tools.",
    benefits: [
      "Centralized dashboard",
      "Complaint resolution tracking",
      "Engagement analytics",
      "Multi-department support",
    ],
    color: "primary" as const,
  },
];

const AudienceSection = () => {
  return (
    <section className="relative overflow-hidden bg-secondary/30">
      <div className="container-tight section-padding">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Who It's For
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Built for everyone on campus
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you're a student looking to get involved, a club leader managing events, 
            or an admin overseeing operations — we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {audiences.map((audience) => (
            <div
              key={audience.id}
              id={audience.id}
              className="group bg-card rounded-2xl p-8 border border-border/50 card-hover"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
                  audience.color === "primary"
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "gradient-accent text-accent-foreground shadow-glow-accent"
                }`}
              >
                {audience.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{audience.title}</h3>
              <p className="text-muted-foreground mb-6">{audience.description}</p>
              <ul className="space-y-3 mb-8">
                {audience.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        audience.color === "primary"
                          ? "bg-primary/20 text-primary"
                          : "bg-accent/20 text-accent"
                      }`}
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button
                  variant={audience.color === "primary" ? "hero" : "accent"}
                  className="w-full group/btn"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
