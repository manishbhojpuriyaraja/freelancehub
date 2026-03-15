import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { usePostJob } from "../hooks/useQueries";

const CATEGORIES = [
  "Web Development",
  "Mobile App",
  "Design & Creative",
  "Content Writing",
  "Digital Marketing",
  "Translation",
  "AI & Data Science",
  "Video & Animation",
  "Other",
];

export function PostJobPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const postJob = usePostJob();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [category, setCategory] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills((prev) => [...prev, s]);
    setSkillInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      login();
      return;
    }
    try {
      await postJob.mutateAsync({
        title,
        description,
        budget: BigInt(Math.round(Number.parseFloat(budget) || 0)),
        requiredSkills: skills,
        category,
      });
      toast.success("Job successfully post ho gaya! 🎉");
      navigate({ to: "/dashboard" });
    } catch {
      toast.error("Job post karne mein error aaya.");
    }
  };

  return (
    <main className="min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-700 mb-2">
            Naya Job Post Karo
          </h1>
          <p className="text-muted-foreground">
            India ke best freelancers tak pahuncho
          </p>
        </div>

        {!identity && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="p-5 flex items-center justify-between">
              <p className="text-sm font-medium">
                Job post karne ke liye login karo
              </p>
              <Button
                size="sm"
                onClick={login}
                data-ocid="postjob.primary_button"
              >
                Login
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-xl">Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. React Developer Chahiye E-commerce Project ke liye"
                  required
                  data-ocid="postjob.input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Project ke baare mein detail mein batao..."
                  rows={4}
                  required
                  data-ocid="postjob.textarea"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (₹) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="5000"
                    min="0"
                    required
                    data-ocid="postjob.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger data-ocid="postjob.select">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Required Skills</Label>
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="e.g. React, TypeScript"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    data-ocid="postjob.search_input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSkill}
                    data-ocid="postjob.secondary_button"
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
                        onClick={() =>
                          setSkills((prev) => prev.filter((x) => x !== s))
                        }
                        data-ocid="postjob.delete_button"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={postJob.isPending || !identity}
                data-ocid="postjob.submit_button"
              >
                {postJob.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Job Post Karo"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
