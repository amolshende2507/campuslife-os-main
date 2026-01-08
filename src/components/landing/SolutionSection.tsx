import { Calendar, Users, Shield, Bell, CheckCircle2, TrendingUp, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const SolutionSection = () => {
  return (
    <section id="features" className="py-24 bg-secondary/20 overflow-hidden">
      <div className="container-tight px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-semibold tracking-wide uppercase text-sm"
          >
            Features
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-bold mt-2 mb-6"
          >
            A complete upgrade for your campus.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg sm:text-xl"
          >
            We've digitized the manual workflows. Every feature is designed to make student life easier and admin life saner.
          </motion.p>
        </div>

        {/* RICH BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. EVENTS CARD (Large) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 relative overflow-hidden rounded-3xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="p-8 pb-0 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Events & Ticketing</h3>
              <p className="text-muted-foreground max-w-sm mb-8">
                Generate unique QR codes for every registration. Scan tickets at the door with our built-in admin scanner.
              </p>
            </div>

            {/* VISUAL: Floating Ticket UI */}
            <div className="absolute right-0 bottom-0 w-full sm:w-2/3 h-48 bg-secondary/50 rounded-tl-3xl border-t border-l border-border/50 p-6 flex flex-col gap-3 transition-transform group-hover:translate-x-2 group-hover:translate-y-2">
               {/* Fake Ticket */}
               <div className="bg-white dark:bg-card p-4 rounded-xl border shadow-sm flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-lg flex flex-col items-center justify-center text-white text-xs font-bold">
                    <span>JAN</span>
                    <span className="text-xl">15</span>
                  </div>
                  <div className="flex-1">
                    <div className="h-4 w-3/4 bg-muted rounded mb-2" />
                    <div className="h-3 w-1/2 bg-muted/50 rounded" />
                  </div>
                  <div className="h-12 w-12 bg-black rounded md:block hidden opacity-10" />
               </div>
               {/* Secondary Fake Ticket */}
               <div className="bg-white dark:bg-card p-4 rounded-xl border shadow-sm flex items-center gap-4 opacity-50">
                  <div className="w-16 h-16 bg-purple-500 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 bg-muted rounded" />
                  </div>
               </div>
            </div>
          </motion.div>

          {/* 2. COMPLAINTS CARD (Tall) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="p-8">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Anonymous Complaints</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Students can report issues safely. Admins get a dashboard to resolve them.
              </p>
              
              {/* VISUAL: Status List */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Issue Resolved</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-100 opacity-80">
                  <div className="w-5 h-5 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />
                  <span className="text-sm font-medium text-yellow-800">In Review</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3. CLUBS CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="p-8">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Club Management</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Manage members, roles, and events.
              </p>

              {/* VISUAL: Avatars */}
              <div className="flex items-center -space-x-3 mb-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br from-gray-200 to-gray-300" />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-xs font-bold">
                  +42
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full">
                Join Club
              </Button>
            </div>
          </motion.div>

          {/* 4. ANALYTICS CARD (Large Span) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 relative overflow-hidden rounded-3xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
              <div className="p-8">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Admin Analytics</h3>
                <p className="text-muted-foreground mb-4">
                  Real-time data on campus engagement. See which events are popular and track complaint resolution times.
                </p>
                <div className="flex items-center text-primary font-medium cursor-pointer hover:underline">
                  View Admin Dashboard <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              {/* VISUAL: Chart */}
              <div className="relative h-64 sm:h-auto bg-secondary/30 border-l border-border/50 p-6 flex items-end justify-between gap-2 group-hover:bg-secondary/50 transition-colors">
                 {[40, 70, 50, 90, 60, 80].map((height, i) => (
                   <div 
                     key={i} 
                     className="w-full bg-primary/20 rounded-t-lg transition-all duration-1000 ease-out group-hover:bg-primary"
                     style={{ height: `${height}%` }}
                   />
                 ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default SolutionSection;