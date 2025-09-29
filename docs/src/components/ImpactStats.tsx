import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Users, 
  CheckCircle2, 
  Coins, 
  TrendingUp, 
  Clock,
  Shield,
  Star
} from "lucide-react";

const ImpactStats = () => {
  const [counters, setCounters] = useState({
    issues: 0,
    heroes: 0,
    coins: 0,
    cities: 0
  });

  const finalValues = {
    issues: 15847,
    heroes: 32194,
    coins: 2847593,
    cities: 127
  };

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounters({
        issues: Math.floor(finalValues.issues * progress),
        heroes: Math.floor(finalValues.heroes * progress),
        coins: Math.floor(finalValues.coins * progress),
        cities: Math.floor(finalValues.cities * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(finalValues);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      icon: CheckCircle2,
      label: "Issues Resolved",
      value: counters.issues.toLocaleString(),
      change: "+12% this month",
      color: "success",
      description: "Community problems solved"
    },
    {
      icon: Users,
      label: "Active Heroes",
      value: counters.heroes.toLocaleString(),
      change: "+8% this week",
      color: "primary",
      description: "Citizens making a difference"
    },
    {
      icon: Coins,
      label: "UrbanCoins Earned",
      value: counters.coins.toLocaleString(),
      change: "+24% this month",
      color: "accent",
      description: "Rewards distributed to heroes"
    },
    {
      icon: MapPin,
      label: "Cities Served",
      value: counters.cities.toString(),
      change: "+3 new cities",
      color: "warning",
      description: "Communities we're helping"
    }
  ];

  const recentActivity = [
    {
      action: "Streetlight fixed on Elm Street",
      hero: "UrbanGuardian42",
      time: "2 minutes ago",
      reward: 150,
      type: "infrastructure"
    },
    {
      action: "Community garden cleanup organized",
      hero: "GreenHero",
      time: "15 minutes ago", 
      reward: 200,
      type: "community"
    },
    {
      action: "Pothole reported and verified",
      hero: "CivicWatcher",
      time: "1 hour ago",
      reward: 75,
      type: "documentation"
    },
    {
      action: "Graffiti removal completed",
      hero: "CleanupCrew",
      time: "3 hours ago",
      reward: 125,
      type: "cleanup"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-success/10 text-success border-success/20">
            <TrendingUp className="w-4 h-4 mr-2" />
            Live Impact Dashboard
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">Real-Time</span> City Impact
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch as heroes across the nation work together to make communities better
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={stat.label} className="mission-card bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  stat.color === 'success' ? 'bg-success/20 text-success' :
                  stat.color === 'primary' ? 'bg-primary/20 text-primary hero-glow' :
                  stat.color === 'accent' ? 'bg-accent/20 text-accent power-glow' :
                  'bg-warning/20 text-warning'
                }`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground mb-3">{stat.description}</div>
                
                <Badge variant="outline" className={`text-xs ${
                  stat.color === 'success' ? 'border-success/30 text-success' :
                  stat.color === 'primary' ? 'border-primary/30 text-primary' :
                  stat.color === 'accent' ? 'border-accent/30 text-accent' :
                  'border-warning/30 text-warning'
                }`}>
                  {stat.change}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live Activity Feed */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                  <h3 className="text-lg font-semibold">Live Activity Feed</h3>
                </div>
                
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        activity.type === 'infrastructure' ? 'bg-primary/20 text-primary' :
                        activity.type === 'community' ? 'bg-success/20 text-success' :
                        activity.type === 'documentation' ? 'bg-warning/20 text-warning' :
                        'bg-accent/20 text-accent'
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-medium text-sm">{activity.action}</div>
                        <div className="text-xs text-muted-foreground">
                          by {activity.hero} • {activity.time}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="power-text font-bold text-sm">+{activity.reward} UC</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Top Performers */}
          <div>
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent" />
                  Today's Top Heroes
                </h3>
                
                <div className="space-y-4">
                  {[
                    { name: "SuperCitizen47", coins: 847, badge: "Legend" },
                    { name: "UrbanGuardian", coins: 623, badge: "Master" },
                    { name: "CivicChampion", coins: 541, badge: "Expert" },
                    { name: "CommunityHero", coins: 398, badge: "Guardian" }
                  ].map((hero, index) => (
                    <div key={hero.name} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-accent text-accent-foreground' :
                        index === 1 ? 'bg-primary/20 text-primary' :
                        index === 2 ? 'bg-warning/20 text-warning' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-medium text-sm">{hero.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {hero.badge}
                        </Badge>
                      </div>
                      
                      <div className="power-text font-bold text-sm">
                        {hero.coins} UC
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;