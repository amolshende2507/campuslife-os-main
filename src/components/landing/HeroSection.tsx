import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, Bell, Search, Menu, MoreHorizontal, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b from-background via-secondary/20 to-background">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] opacity-40" />
      </div>

      <div className="container-tight px-4 text-center">
        
        {/* 1. Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-white/10 border border-black/5 dark:border-white/10 backdrop-blur-md mb-8 text-sm font-medium text-muted-foreground shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live at 50+ Colleges
        </motion.div>

        {/* 2. Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]"
        >
          The Operating System for <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Campus Life.
          </span>
        </motion.h1>

        {/* 3. Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Replace WhatsApp chaos and lost Google Forms with one beautiful platform. Events, Clubs, and Complaints—centralized.
        </motion.p>

        {/* 4. CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
        >
          <Link to="/signup">
            <Button size="xl" variant="hero" className="w-full sm:w-auto h-12 px-8 text-base shadow-xl shadow-primary/20 transition-transform hover:-translate-y-1">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/#features">
            <Button size="xl" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base bg-white/50 backdrop-blur-sm border-2">
              View Features
            </Button>
          </Link>
        </motion.div>

        {/* 5. HIGH FIDELITY DASHBOARD MOCKUP */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative max-w-5xl mx-auto perspective-1000"
        >
          {/* Main Window Frame */}
          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-border shadow-2xl overflow-hidden relative z-10">
            
            {/* Window Header */}
            <div className="h-10 bg-muted/30 border-b flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="ml-4 flex-1 max-w-[200px] h-5 bg-muted/50 rounded-md flex items-center px-2">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/20 mr-2" />
                <div className="w-20 h-2 bg-muted-foreground/10 rounded" />
              </div>
            </div>

            {/* Window Body */}
            <div className="flex h-[500px] text-left">
              
              {/* SIDEBAR */}
              <div className="w-16 sm:w-64 border-r bg-muted/10 p-4 hidden sm:flex flex-col gap-6">
                {/* Sidebar Logo */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">CL</div>
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                {/* Sidebar Menu */}
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${i === 1 ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}>
                      <div className={`w-5 h-5 rounded ${i === 1 ? 'bg-indigo-200 dark:bg-indigo-800' : 'bg-gray-200 dark:bg-gray-700'}`} />
                      <div className={`h-2.5 rounded ${i === 1 ? 'w-20 bg-indigo-200 dark:bg-indigo-800' : 'w-16 bg-gray-200 dark:bg-gray-700'}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* MAIN CONTENT AREA */}
              <div className="flex-1 bg-background p-6 overflow-hidden">
                
                {/* Top Nav */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Welcome back, Student!</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted border" />
                    <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold">RS</div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {/* Stat 1 */}
                  <div className="p-4 rounded-xl border bg-card shadow-sm">
                    <div className="flex justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"><Calendar className="w-4 h-4" /></div>
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs text-muted-foreground">Upcoming Events</div>
                  </div>
                  {/* Stat 2 */}
                  <div className="p-4 rounded-xl border bg-card shadow-sm">
                    <div className="flex justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600"><Users className="w-4 h-4" /></div>
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">4</div>
                    <div className="text-xs text-muted-foreground">Clubs Joined</div>
                  </div>
                  {/* Stat 3 */}
                  <div className="p-4 rounded-xl border bg-card shadow-sm">
                    <div className="flex justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600"><Bell className="w-4 h-4" /></div>
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">2</div>
                    <div className="text-xs text-muted-foreground">New Notices</div>
                  </div>
                </div>

                {/* Content Split */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Main Chart/List Area */}
                  <div className="col-span-2 space-y-4">
                    <div className="h-40 rounded-xl border bg-secondary/20 flex items-end justify-between p-4 gap-2">
                       {/* Fake Bars */}
                       {[40, 70, 45, 90, 60, 75, 50].map((h, i) => (
                         <div key={i} className="w-full bg-indigo-500 rounded-t-sm opacity-80" style={{ height: `${h}%` }} />
                       ))}
                    </div>
                    {/* List Items */}
                    {[1, 2].map(i => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-lg border bg-card">
                        <div className="w-10 h-10 rounded-lg bg-gray-100" />
                        <div className="flex-1 space-y-1">
                          <div className="h-3 w-1/3 bg-gray-200 rounded" />
                          <div className="h-2 w-1/4 bg-gray-100 rounded" />
                        </div>
                        <div className="h-8 w-20 bg-indigo-50 rounded text-indigo-600 text-xs flex items-center justify-center font-medium">View</div>
                      </div>
                    ))}
                  </div>

                  {/* Right Panel */}
                  <div className="col-span-1 space-y-4">
                    <div className="h-full rounded-xl border bg-card p-4 space-y-4">
                      <div className="h-4 w-1/2 bg-gray-200 rounded" />
                      <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <div className="h-2 w-full bg-gray-100 rounded" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Floating Notification (Decoration) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute -right-4 top-20 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border border-border max-w-[200px] z-20 hidden lg:block"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold mb-1">Complaint Resolved</p>
                <p className="text-[10px] text-muted-foreground">Admin fixed the "Broken Fan" issue.</p>
              </div>
            </div>
          </motion.div>

          {/* Glow Effect */}
          <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl -z-10 rounded-[3rem]" />
        </motion.div>

        {/* 6. Social Proof */}
        <div className="mt-24 pt-10 border-t border-border/40">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground mb-6 uppercase">Trusted by Top Campuses</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['MIT', 'IIT Bombay', 'BITS Pilani', 'COEP', 'VIT'].map((college) => (
              <span key={college} className="text-xl font-bold text-foreground/80">{college}</span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;