import { Link } from "react-router-dom";
import { GraduationCap, Twitter, Linkedin, Github, Mail } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: "Features", href: "/#features" },
      { name: "For Students", href: "/#students" },
      { name: "For Clubs", href: "/#clubs" },
      { name: "Admin Tools", href: "/#colleges" },
    ],
    Company: [
      { name: "About Us", href: "/about" },
      { name: "Contact Support", href: "mailto:support@campuslife.os" }, // meaningful link
    ],
    Legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/privacy" }, // Reusing privacy for now
    ],
  };

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
    { icon: <Github className="w-5 h-5" />, href: "https://github.com", label: "GitHub" }, // Swapped Insta for Github (more dev focused)
    { icon: <Mail className="w-5 h-5" />, href: "mailto:hello@campuslife.os", label: "Email" },
  ];

  return (
    <footer className="border-t border-border/50 bg-secondary/20 pt-16">
      <div className="container-tight px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          
          {/* Brand Column (Spans 2) */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                Campus<span className="text-primary">Life</span> OS
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
              The operating system for modern campus life. Events, clubs, complaints, 
              and announcements — centralized.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="col-span-1">
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith("http") || link.href.startsWith("mailto") ? (
                      // External Link
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : (
                      // Internal Router Link
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-border/50 gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 CampusLife OS. Open Source Project.
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-sm text-muted-foreground font-medium">
              All Systems Operational
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;