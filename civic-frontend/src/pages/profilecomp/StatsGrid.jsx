import { Card, CardContent } from "@/components/ui/card";
import { Activity, Calendar, Target, TrendingUp, Users, Zap } from "lucide-react";

const stats = [
  {
    title: "Total Activity",
    value: "1,247",
    icon: <Activity className="w-5 h-5" />,
    trend: "+12%",
    trendUp: true,
    color: "primary",
  },
  {
    title: "Days Active",
    value: 156,
    icon: <Calendar className="w-5 h-5" />,
    trend: "+3 days",
    trendUp: true,
    color: "secondary",
  },
  {
    title: "Goals Completed",
    value: 89,
    icon: <Target className="w-5 h-5" />,
    trend: "94%",
    trendUp: true,
    color: "accent",
  },
  {
    title: "Network Rank",
    value: "#247",
    icon: <Users className="w-5 h-5" />,
    trend: "+12 spots",
    trendUp: true,
    color: "gold",
  },
  {
    title: "Power Score",
    value: "9,654",
    icon: <Zap className="w-5 h-5" />,
    trend: "+157",
    trendUp: true,
    color: "primary",
  },
  {
    title: "Weekly Growth",
    value: "23.4%",
    icon: <TrendingUp className="w-5 h-5" />,
    trend: "+5.2%",
    trendUp: true,
    color: "accent",
  },
];

export const StatsGrid = () => {
  const getColorClasses = (color) => {
    const colors = {
      primary: "text-primary border-primary/20 bg-primary/5",
      secondary: "text-secondary border-secondary/20 bg-secondary/5",
      accent: "text-accent border-accent/20 bg-accent/5",
      gold: "text-gold border-gold/20 bg-gold/5",
    };
    return colors[color];
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className={`bg-card shadow-card border-border hover:scale-105 transition-all duration-300 ${getColorClasses(
            stat.color
          )}`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-current/10">{stat.icon}</div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {stat.title}
                  </p>
                  <p className="text-xl font-bold text-current">
                    {typeof stat.value === "number"
                      ? stat.value.toLocaleString()
                      : stat.value}
                  </p>
                </div>
                {stat.trend && (
                  <div className="flex items-center space-x-1">
                    <TrendingUp
                      className={`w-3 h-3 ${
                        stat.trendUp ? "text-accent" : "text-destructive"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        stat.trendUp ? "text-accent" : "text-destructive"
                      }`}
                    >
                      {stat.trend}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
