import { MessageCircle, FileQuestion, AlertCircle, BarChart3 } from "lucide-react";

const problems = [
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "WhatsApp Chaos",
    description: "Important event details buried under 500+ unread messages. No way to find registrations or track RSVPs.",
  },
  {
    icon: <FileQuestion className="w-6 h-6" />,
    title: "Lost Google Forms",
    description: "Every club creates new forms. No central database. Duplicate registrations everywhere.",
  },
  {
    icon: <AlertCircle className="w-6 h-6" />,
    title: "No Complaint Tracking",
    description: "Students complain, but nothing changes. No transparency. No accountability.",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Zero Engagement Data",
    description: "Clubs don't know who's attending. Admins can't measure impact. Everyone's guessing.",
  },
];

const ProblemSection = () => {
  return (
    <section className="relative overflow-hidden bg-secondary/30">
      <div className="container-tight section-padding">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
            The Problem
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Campus life is broken
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every college faces the same chaos. Different tools, fragmented data, zero visibility.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-6 border border-border/50 card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {problem.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{problem.title}</h3>
              <p className="text-sm text-muted-foreground">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
