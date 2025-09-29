import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Crown, Shield, Star, Zap, Trophy, Coins } from "lucide-react";
import badgeImage from "@/assets/badges.jpg";

const GamificationShowcase = () => {
  const badges = [
    { icon: Shield, name: "City Guardian", earned: true, rarity: "Common" },
    { icon: Star, name: "Issue Spotter", earned: true, rarity: "Common" },
    { icon: Zap, name: "Quick Responder", earned: false, rarity: "Rare" },
    { icon: Crown, name: "Community Leader", earned: false, rarity: "Epic" },
  ];

  const leaderboard = [
    { name: "SuperCitizen47", coins: 12500, badge: "legend", position: 1 },
    { name: "UrbanHero", coins: 11200, badge: "master", position: 2 },
    { name: "CivicChampion", coins: 9800, badge: "expert", position: 3 },
    { name: "You", coins: 2350, badge: "guardian", position: 8 },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">Level Up</span> Your City Impact
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Earn UrbanCoins, unlock badges, and climb the leaderboard as you make your community better
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress & Coins */}
          <Card className="mission-card bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-accent to-warning rounded-full flex items-center justify-center mx-auto mb-4 power-glow">
                <Coins className="w-8 h-8 text-accent-foreground" />
              </div>
              <CardTitle className="power-text">Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Current Level: Guardian</span>
                  <span className="power-text font-semibold">2,350 UC</span>
                </div>
                <Progress value={47} className="h-3" />
                <p className="text-xs text-muted-foreground mt-1">
                  1,650 UC to reach Expert level
                </p>
              </div>
              
              <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                <div className="text-2xl font-bold power-text mb-1">+150 UC</div>
                <div className="text-sm text-muted-foreground">Earned this week</div>
              </div>

              <Button variant="power" className="w-full">
                <Zap className="w-4 h-4" />
                Claim Daily Bonus
              </Button>
            </CardContent>
          </Card>

          {/* Badge Collection */}
          <Card className="mission-card bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 hero-glow">
                <Trophy className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="gradient-text">Badge Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {badges.map((badge, index) => (
                  <div 
                    key={badge.name}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      badge.earned 
                        ? 'border-accent/50 bg-accent/5 badge-pulse' 
                        : 'border-muted/30 bg-muted/10 opacity-60'
                    }`}
                  >
                    <badge.icon className={`w-8 h-8 mx-auto mb-2 ${
                      badge.earned ? 'text-accent' : 'text-muted-foreground'
                    }`} />
                    <div className="text-xs text-center">
                      <div className="font-semibold">{badge.name}</div>
                      <Badge variant={badge.earned ? "default" : "secondary"} className="text-xs mt-1">
                        {badge.rarity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full">
                View All Badges (12/28)
              </Button>
            </CardContent>
          </Card>

          {/* Leaderboard Preview */}
          <Card className="mission-card bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-success to-success/80 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-success-foreground" />
              </div>
              <CardTitle className="text-success">This Week's Heroes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {leaderboard.map((user, index) => (
                  <div 
                    key={user.name}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      user.name === 'You' 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'bg-muted/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      user.position === 1 ? 'bg-accent text-accent-foreground' :
                      user.position === 2 ? 'bg-muted text-muted-foreground' :
                      user.position === 3 ? 'bg-warning/20 text-warning' :
                      'bg-muted/50 text-muted-foreground'
                    }`}>
                      {user.position}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.coins.toLocaleString()} UC
                      </div>
                    </div>
                    {user.position <= 3 && (
                      <Trophy className={`w-4 h-4 ${
                        user.position === 1 ? 'text-accent' :
                        user.position === 2 ? 'text-muted-foreground' :
                        'text-warning'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              
              <Button variant="mission" className="w-full">
                View Full Leaderboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GamificationShowcase;