import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  Code2,
  Cpu,
  Globe,
  Palette,
  PenLine,
  Star,
  Users,
} from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const FEATURES = [
  {
    icon: <Users className="h-6 w-6" />,
    title: "10,000+ Freelancers",
    desc: "Verified professionals across all categories",
  },
  {
    icon: <Briefcase className="h-6 w-6" />,
    title: "5,000+ Jobs Posted",
    desc: "New opportunities added daily",
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: "Secure Payments",
    desc: "Blockchain-backed transparency",
  },
  {
    icon: <CheckCircle2 className="h-6 w-6" />,
    title: "Quality Guaranteed",
    desc: "Vetted talent, real results",
  },
];

const CATEGORIES = [
  {
    icon: <Code2 className="h-5 w-5" />,
    label: "Web Development",
    count: "1,200+ jobs",
  },
  {
    icon: <Palette className="h-5 w-5" />,
    label: "Design & Creative",
    count: "850+ jobs",
  },
  {
    icon: <PenLine className="h-5 w-5" />,
    label: "Content Writing",
    count: "640+ jobs",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    label: "Digital Marketing",
    count: "520+ jobs",
  },
  {
    icon: <Globe className="h-5 w-5" />,
    label: "Translation",
    count: "310+ jobs",
  },
  {
    icon: <Cpu className="h-5 w-5" />,
    label: "AI & Data Science",
    count: "430+ jobs",
  },
];

const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    role: "Freelance Developer",
    text: "FreelanceHub ne meri zindagi badal di. Teen mahine mein 5 projects mil gaye!",
    rating: 5,
  },
  {
    name: "Priya Verma",
    role: "UI/UX Designer",
    text: "Clients dhundna itna aasaan kabhi nahi tha. Platform bahut user-friendly hai.",
    rating: 5,
  },
  {
    name: "Amit Patel",
    role: "Content Writer",
    text: "Ghar baithe kaam karo aur accha paisa kamao — yahi toh chahiye tha!",
    rating: 5,
  },
];

export function LandingPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-20 md:py-32">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "url(/assets/generated/freelancehub-hero.dim_1200x600.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background/90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge
              className="mb-6 bg-primary/10 text-primary border-primary/20 font-medium"
              data-ocid="hero.card"
            >
              🇮🇳 India ka #1 Freelance Marketplace
            </Badge>
            <h1 className="font-display text-5xl md:text-7xl font-800 leading-tight mb-6">
              Apni Skills se
              <span className="text-gradient"> Kamao </span>
              Unlimited
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Freelancers — apna talent dikhao aur dream projects pao.
              <br />
              Clients — India ke best professionals hire karo, fast aur
              hassle-free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {identity ? (
                <Link to="/dashboard" data-ocid="hero.primary_button">
                  <Button size="lg" className="text-base px-8 gap-2">
                    Dashboard Dekho <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register" data-ocid="hero.primary_button">
                    <Button size="lg" className="text-base px-8 gap-2">
                      Freelancer Bano <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={login}
                    disabled={isLoggingIn}
                    className="text-base px-8"
                    data-ocid="hero.secondary_button"
                  >
                    {isLoggingIn ? "Connecting..." : "Client Login"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center space-y-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto">
                  {f.icon}
                </div>
                <h3 className="font-display font-700 text-base">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-700 mb-3">
              Popular Categories
            </h2>
            <p className="text-muted-foreground text-lg">
              Har skill ke liye opportunity hai
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map((cat, idx) => (
              <Link
                key={cat.label}
                to="/jobs"
                data-ocid={`categories.item.${idx + 1}`}
              >
                <Card className="hover:shadow-card hover:border-primary/30 transition-all cursor-pointer group">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex-shrink-0">
                      {cat.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{cat.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {cat.count}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-700 mb-3">
              Log Kya Kehte Hain
            </h2>
            <p className="text-muted-foreground">
              Real stories from real freelancers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <Card
                key={t.name}
                className="gradient-card"
                data-ocid={`testimonials.item.${idx + 1}`}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-0.5">
                    {["1st", "2nd", "3rd", "4th", "5th"]
                      .slice(0, t.rating)
                      .map((pos) => (
                        <Star
                          key={pos}
                          className="h-4 w-4 fill-accent text-accent"
                        />
                      ))}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    "{t.text}"
                  </p>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-700 mb-4">
            Ready to Start?{" "}
            <span className="text-gradient">Abhi Shuru Karo!</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Free registration, no hidden fees
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" data-ocid="cta.primary_button">
              <Button size="lg" className="text-base px-8">
                Register as Freelancer
              </Button>
            </Link>
            <Link to="/jobs" data-ocid="cta.secondary_button">
              <Button size="lg" variant="outline" className="text-base px-8">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
