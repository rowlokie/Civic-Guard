import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Shield, Users, Trophy, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import { Link } from "react-router-dom";
const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/95" />
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 right-20 floating-element glow-primary">
        <Shield className="w-12 h-12 text-primary/30" />
      </div>
      <div
        className="absolute bottom-32 left-16 floating-element glow-accent"
        style={{ animationDelay: "2s" }}
      >
        <Trophy className="w-8 h-8 text-accent/40" />
      </div>
      <div
        className="absolute top-1/3 right-1/4 floating-element glow-success"
        style={{ animationDelay: "4s" }}
      >
        <Users className="w-10 h-10 text-success/30" />
      </div>

      {/* Theme Toggle - Fixed position */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl">
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8 glow-primary">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Join 10,000+ City Guardians
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="  ">Become Your</span>
            <br />
            <span className="power-text">City's Hero</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
            Report civic issues, help your community, and earn{" "}
            <span className="power-text font-semibold">UrbanCoins</span> while
            making your city a better place to live.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-8 mb-12">
            <div className="text-center">
              <div className="gradient-text text-3xl font-bold">2,847</div>
              <div className="text-sm text-muted-foreground">Issues Resolved</div>
            </div>
            <div className="text-center">
              <div className="power-text text-3xl font-bold">10,294</div>
              <div className="text-sm text-muted-foreground">Active Heroes</div>
            </div>
            <div className="text-center">
              <div className="text-success text-3xl font-bold">847K</div>
              <div className="text-sm text-muted-foreground">
                UrbanCoins Earned
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/report">
        <Button size="lg" className="text-lg px-8 py-6">
          <MapPin className="w-5 h-5" />
          Start Your First Mission
        </Button>
      </Link>

      <Link to="/leaderboard">
        <Button
          variant="outline"
          size="lg"
          className="text-lg px-8 py-6 border-primary/30 hover:border-primary"
        >
          <Trophy className="w-5 h-5" />
          View Leaderboard
        </Button>
      </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center gap-6 mt-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span>Live issue tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Verified by city officials</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-accent" />
              <span>Gamified rewards system</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
