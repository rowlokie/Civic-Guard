import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Clock, 
  Users, 
  AlertTriangle, 
  Lightbulb, 
  Camera,
  CheckCircle2,
  Zap,
  Shield
} from "lucide-react";

const MissionBoard = () => {
  const missions = [
    {
      id: 1,
      title: "Broken Streetlight on Oak Avenue",
      description: "Streetlight has been out for 3 days, making the area unsafe at night",
      location: "Oak Ave & 5th Street",
      urgency: "high",
      reward: 150,
      timeLeft: "2 days",
      participants: 3,
      type: "infrastructure",
      icon: Lightbulb,
      status: "active"
    },
    {
      id: 2,
      title: "Community Garden Cleanup",
      description: "Help organize volunteers for monthly community garden maintenance",
      location: "Central Park Community Garden",
      urgency: "medium",
      reward: 100,
      timeLeft: "1 week",
      participants: 12,
      type: "community",
      icon: Users,
      status: "active"
    },
    {
      id: 3,
      title: "Document Pothole Issues",
      description: "Take photos and report multiple potholes along Main Street",
      location: "Main Street (Various)",
      urgency: "medium",
      reward: 75,
      timeLeft: "5 days",
      participants: 1,
      type: "documentation",
      icon: Camera,
      status: "active"
    },
    {
      id: 4,
      title: "Graffiti Removal Initiative",
      description: "Coordinate with local businesses to remove graffiti from downtown area",
      location: "Downtown Business District",
      urgency: "low",
      reward: 200,
      timeLeft: "2 weeks",
      participants: 8,
      type: "cleanup",
      icon: CheckCircle2,
      status: "completed"
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'infrastructure': return 'bg-primary/10 text-primary';
      case 'community': return 'bg-success/10 text-success';
      case 'documentation': return 'bg-warning/10 text-warning';
      case 'cleanup': return 'bg-accent/10 text-accent';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">Active Missions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose your next heroic mission and start making a difference in your community
          </p>
          
          {/* Mission filters */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" size="sm">All Missions</Button>
            <Button variant="outline" size="sm" className="bg-destructive/10 border-destructive/30">
              <AlertTriangle className="w-4 h-4" />
              Urgent
            </Button>
            <Button variant="outline" size="sm">Near Me</Button>
            <Button variant="outline" size="sm">High Reward</Button>
          </div>
        </div>

        {/* Mission Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {missions.slice(0, 3).map((mission) => (
            <Card key={mission.id} className="mission-card bg-card/80 backdrop-blur-sm relative overflow-hidden">
              {mission.status === 'completed' && (
                <div className="absolute top-4 right-4 bg-success/20 text-success px-2 py-1 rounded-full text-xs font-semibold">
                  Completed
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(mission.type)}`}>
                    <mission.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight mb-2">{mission.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{mission.location}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{mission.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getUrgencyColor(mission.urgency)}>
                    {mission.urgency} priority
                  </Badge>
                  <Badge variant="outline" className={getTypeColor(mission.type).replace('bg-', 'border-').replace('/10', '/30')}>
                    {mission.type}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{mission.timeLeft}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{mission.participants} active</span>
                    </div>
                  </div>
                  <div className="font-bold power-text">+{mission.reward} UC</div>
                </div>
                
                {mission.status === 'active' ? (
                  <Button 
                    variant={mission.urgency === 'high' ? 'destructive' : 'hero'} 
                    className="w-full"
                  >
                    <Zap className="w-4 h-4" />
                    Accept Mission
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    <CheckCircle2 className="w-4 h-4" />
                    Mission Complete
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          
          {/* Feature mission card */}
          <Card className="mission-card bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
            
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-accent text-accent-foreground font-bold">Featured</Badge>
                <Badge variant="outline">+50% Bonus UC</Badge>
              </div>
              <CardTitle className="text-xl gradient-text">
                Emergency Response Team Recruitment
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Join our elite emergency response team for rapid civic issue resolution. 
                Requires level 5+ Guardian status.
              </p>
              
              <div className="bg-card/50 rounded-lg p-4 border border-accent/20">
                <div className="text-2xl font-bold power-text mb-1">+500 UC</div>
                <div className="text-sm text-muted-foreground">Base reward + bonus</div>
              </div>
              
              <Button variant="power" className="w-full">
                <Shield className="w-4 h-4" />
                Apply Now
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* View all missions CTA */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="border-primary/30 hover:border-primary">
            View All 24 Active Missions
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MissionBoard;