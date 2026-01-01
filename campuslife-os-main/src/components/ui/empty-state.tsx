import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  emoji?: string;
}

export const EmptyState = ({ icon: Icon, title, description, emoji }: EmptyStateProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center py-16"
    >
      <motion.div
        initial={{ y: 10 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative inline-block"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
        {emoji && (
          <span className="absolute -top-1 -right-1 text-lg">{emoji}</span>
        )}
      </motion.div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mx-auto">{description}</p>
    </motion.div>
  );
};
