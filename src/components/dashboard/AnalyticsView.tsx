import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { Loader2 } from "lucide-react";

export const AnalyticsView = () => {
  const [loading, setLoading] = useState(true);
  const [complaintData, setComplaintData] = useState<any[]>([]);
  const [clubData, setClubData] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);

    // 1. Get Complaints by Category
    const { data: complaints } = await supabase
      .from('complaints')
      .select('category');
    
    // Process data: Count occurrences
    const categoryMap: Record<string, number> = {};
    complaints?.forEach(c => {
      categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
    });
    
    const processedComplaints = Object.keys(categoryMap).map(key => ({
      name: key,
      count: categoryMap[key]
    }));

    // 2. Get Club Popularity (Member counts)
    const { data: clubs } = await supabase
      .from('clubs')
      .select('name, club_members(count)');

    const processedClubs = clubs?.map((c: any) => ({
      name: c.name,
      members: c.club_members[0].count
    })) || [];

    setComplaintData(processedComplaints);
    setClubData(processedClubs);
    setLoading(false);
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      
      {/* CHART 1: Issues Overview */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold mb-4">Complaint Categories</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={complaintData}>
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px' }}
                cursor={{ fill: 'transparent' }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART 2: Club Popularity */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold mb-4">Club Popularity</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={clubData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="members"
              >
                {clubData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--accent))"} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 text-xs text-muted-foreground mt-2">
           {clubData.map((entry, index) => (
             <div key={index} className="flex items-center gap-1">
               <div className={`w-2 h-2 rounded-full ${index % 2 === 0 ? "bg-primary" : "bg-accent"}`} />
               {entry.name}
             </div>
           ))}
        </div>
      </div>

    </div>
  );
};