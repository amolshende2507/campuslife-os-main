import { Check, Calendar, Users, Shield, Megaphone, BarChart3 } from "lucide-react";

const solutions = [
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Events & Registrations",
    description: "One-click registration. QR check-ins. Automatic reminders. Zero spreadsheets.",
    features: ["Event discovery", "Digital tickets", "Attendance tracking"],
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Clubs & Committees",
    description: "Every club has a profile. Members can join, explore, and stay updated.",
    features: ["Club profiles", "Member management", "Activity timeline"],
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Anonymous Complaints",
    description: "Report issues safely. Track resolution. Full transparency, zero fear.",
    features: ["100% anonymous", "Status tracking", "Admin accountability"],
  },
  {
    icon: <Megaphone className="w-6 h-6" />,
    title: "Smart Announcements",
    description: "No more missed notices. Targeted updates reach the right students.",
    features: ["Push notifications", "Category filters", "Read receipts"],
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Admin Analytics",
    description: "Real data for real decisions. Engagement metrics, participation trends.",
    features: ["Live dashboards", "Export reports", "Trend analysis"],
  },
];

const SolutionSection = () => {
  return (
    <section id="features" className="relative overflow-hidden">
      <div className="container-tight section-padding">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            The Solution
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            One platform. <span className="gradient-text">Everything you need.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            CampusLife OS brings all your campus operations into one beautiful, easy-to-use platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className={`group bg-card rounded-2xl p-6 border border-border/50 card-hover ${
                index === 4 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-xl gradient-primary text-primary-foreground flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-glow">
                {solution.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{solution.title}</h3>
              <p className="text-muted-foreground mb-4">{solution.description}</p>
              <ul className="space-y-2">
                {solution.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
