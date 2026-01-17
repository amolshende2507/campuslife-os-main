import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function StaticPage() {
  const { type } = useParams();

  const content = {
    about: {
      title: "About CampusLife OS",
      body: "CampusLife OS is an open-source initiative to digitize campus operations. Built with React, Supabase, and Tailwind, it aims to replace manual registers and WhatsApp chaos with a unified operating system."
    },
    privacy: {
      title: "Privacy Policy",
      body: "We take your privacy seriously. Student data is encrypted. Anonymous complaints utilize strict Row Level Security (RLS) to ensure your identity remains hidden from administrators."
    },
    terms: {
      title: "Terms of Service",
      body: "By using this platform, you agree to maintain academic integrity. Uploading inappropriate content to the Academic Vault or Lost & Found will result in an immediate ban."
    }
  };

  const data = content[type as keyof typeof content] || content.about;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">{data.title}</h1>
      <p className="text-lg text-muted-foreground leading-relaxed mb-10">
        {data.body}
      </p>
      <Link to="/">
        <Button variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back Home
        </Button>
      </Link>
    </div>
  );
}