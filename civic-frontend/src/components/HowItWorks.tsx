import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Camera, Trophy, Users, Zap, Shield } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Spot & Report",
      description: "Notice a civic issue in your neighborhood? Take a photo and pin it on our map with details.",
      icon: Camera,
      color: "primary",
      features: ["GPS auto-location", "Photo validation", "Issue categorization"]
    },
    {
      number: "02", 
      title: "Take Action",
      description: "Choose missions that match your skills and interests. Work solo or team up with other heroes.",
      icon: Zap,
      color: "accent",
      features: ["Skill-based matching", "Team collaboration", "Real-time updates"]
    },
    {
      number: "03",
      title: "Earn Recognition",
      description: "Complete missions to earn UrbanCoins, unlock badges, and climb the community leaderboard.",
      icon: Trophy,
      color: "success",
      features: ["UrbanCoin rewards", "Achievement badges", "Leaderboard ranking"]
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Your <span className="gradient-text">Hero Journey</span> Starts Here
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform from ordinary citizen to community champion in three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent z-0" />
              )}
              
              <Card className="mission-card bg-card/50 backdrop-blur-sm relative z-10 text-center">
                <CardContent className="p-8">
                  {/* Step number */}
                  <div className="text-6xl font-black text-muted/20 mb-4">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                    step.color === 'primary' ? 'bg-primary/20 text-primary hero-glow' :
                    step.color === 'accent' ? 'bg-accent/20 text-accent power-glow' :
                    'bg-success/20 text-success'
                  }`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground mb-6">{step.description}</p>
                  
                  {/* Features */}
                  <ul className="space-y-2">
                    {step.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          step.color === 'primary' ? 'bg-primary' :
                          step.color === 'accent' ? 'bg-accent' :
                          'bg-success'
                        }`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Success stories */}
        <div className="bg-gradient-to-r from-success/10 to-primary/10 rounded-2xl p-8 border border-success/20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-success">Real Impact,</span> Real Heroes
              </h3>
              <p className="text-muted-foreground mb-6">
                "I've fixed 23 streetlights, organized 5 community cleanups, and earned over 3,000 UrbanCoins. 
                CivicGuard made me realize that every small action adds up to big change."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-success" />
                </div>
                <div>
                  <div className="font-semibold">Sarah Chen</div>
                  <div className="text-sm text-muted-foreground">Level 7 Community Guardian</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-card/30 rounded-lg">
                <div className="text-2xl font-bold text-success">500+</div>
                <div className="text-sm text-muted-foreground">Issues Resolved</div>
              </div>
              <div className="text-center p-4 bg-card/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">UrbanCoins Earned</div>
              </div>
              <div className="text-center p-4 bg-card/30 rounded-lg">
                <div className="text-2xl font-bold text-accent">15</div>
                <div className="text-sm text-muted-foreground">Badges Unlocked</div>
              </div>
              <div className="text-center p-4 bg-card/30 rounded-lg">
                <div className="text-2xl font-bold text-warning">#3</div>
                <div className="text-sm text-muted-foreground">City Ranking</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">Ready to Become a City Hero?</h3>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Join thousands of citizens making their communities better, one mission at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg">
              <MapPin className="w-5 h-5" />
              Start Your First Mission
            </Button>
            <Button variant="outline" size="lg" className="border-primary/30">
              <Users className="w-5 h-5" />
              Join Community
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;