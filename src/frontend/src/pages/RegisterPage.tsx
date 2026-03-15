import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Briefcase, Loader2, Users, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRegisterClient, useRegisterFreelancer } from "../hooks/useQueries";

type Role = "freelancer" | "client" | null;

export function RegisterPage() {
  const navigate = useNavigate();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const [role, setRole] = useState<Role>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState("");
  const [portfolio, setPortfolio] = useState("");

  const registerFreelancer = useRegisterFreelancer();
  const registerClient = useRegisterClient();

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills((prev) => [...prev, s]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) =>
    setSkills((prev) => prev.filter((s) => s !== skill));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      login();
      return;
    }
    try {
      if (role === "freelancer") {
        await registerFreelancer.mutateAsync({
          name,
          bio,
          skills,
          hourlyRate: BigInt(Math.round(Number.parseFloat(hourlyRate) || 0)),
          portfolio,
        });
        toast.success("Freelancer profile created! 🎉");
      } else {
        await registerClient.mutateAsync({ name });
        toast.success("Client account created! 🎉");
      }
      navigate({ to: "/dashboard" });
    } catch {
      toast.error("Registration failed. Please try again.");
    }
  };

  const isPending = registerFreelancer.isPending || registerClient.isPending;

  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-700 mb-2">
            Register karo FreelanceHub pe
          </h1>
          <p className="text-muted-foreground">
            Apna account banao aur shuru karo
          </p>
        </div>

        {!identity && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="p-5 flex items-center justify-between gap-4">
              <p className="text-sm font-medium">
                Pehle login karo apne Internet Identity se
              </p>
              <Button
                onClick={login}
                disabled={isLoggingIn}
                size="sm"
                data-ocid="register.primary_button"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Role Selection */}
        {!role && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              className="cursor-pointer hover:shadow-card hover:border-primary/40 transition-all group"
              onClick={() => setRole("freelancer")}
              data-ocid="register.freelancer.card"
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Briefcase className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="font-display text-xl">
                  Freelancer
                </CardTitle>
                <CardDescription>
                  Apni skills dikhao, projects pao, paise kamao
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li>✓ Skills & portfolio showcase</li>
                  <li>✓ Jobs ke liye apply karo</li>
                  <li>✓ Hourly rate set karo</li>
                </ul>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:shadow-card hover:border-accent/40 transition-all group"
              onClick={() => setRole("client")}
              data-ocid="register.client.card"
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
                  <Users className="h-7 w-7 text-accent-foreground" />
                </div>
                <CardTitle className="font-display text-xl">Client</CardTitle>
                <CardDescription>
                  Best freelancers hire karo apne projects ke liye
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li>✓ Job post karo</li>
                  <li>✓ Applications manage karo</li>
                  <li>✓ Best talent hire karo</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Registration Form */}
        {role && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-2xl">
                  {role === "freelancer"
                    ? "Freelancer Profile"
                    : "Client Account"}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRole(null)}
                  data-ocid="register.cancel_button"
                >
                  Back
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Aapka Naam *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    required
                    data-ocid="register.input"
                  />
                </div>

                {role === "freelancer" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio / About You *</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Apne baare mein batao — experience, specialization..."
                        rows={3}
                        required
                        data-ocid="register.textarea"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Skills *</Label>
                      <div className="flex gap-2">
                        <Input
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          placeholder="e.g. React, Python, Figma"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addSkill();
                            }
                          }}
                          data-ocid="register.search_input"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addSkill}
                          data-ocid="register.secondary_button"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {skills.map((s) => (
                          <Badge key={s} variant="secondary" className="gap-1">
                            {s}
                            <button
                              type="button"
                              onClick={() => removeSkill(s)}
                              data-ocid="register.delete_button"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rate">Hourly Rate (₹)</Label>
                        <Input
                          id="rate"
                          type="number"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(e.target.value)}
                          placeholder="500"
                          min="0"
                          data-ocid="register.input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="portfolio">Portfolio URL</Label>
                        <Input
                          id="portfolio"
                          value={portfolio}
                          onChange={(e) => setPortfolio(e.target.value)}
                          placeholder="https://yourportfolio.com"
                          data-ocid="register.input"
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPending || !identity}
                  data-ocid="register.submit_button"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register Karo"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
