import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center overflow-hidden relative">
      
      {/* Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10 animate-pulse delay-700" />

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <h1 className="text-9xl font-extrabold text-foreground/5 tracking-widest select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Lost on Campus?
          </span>
        </div>
      </motion.div>

      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-muted-foreground max-w-md mt-4 mb-8 text-lg"
      >
        We couldn't find the page you were looking for. It might have graduated or moved to a different hostel.
      </motion.p>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link to="/dashboard">
          <Button variant="hero" size="lg" className="gap-2">
            <Home className="w-4 h-4" /> Back to Dashboard
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" size="lg" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Home
          </Button>
        </Link>
      </motion.div>

    </div>
  );
};

export default NotFound;