import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ExternalLink, IndianRupee, Search } from "lucide-react";
import { useState } from "react";
import { useFreelancersBySkill } from "../hooks/useQueries";

const POPULAR_SKILLS = [
  "React",
  "Python",
  "Figma",
  "Node.js",
  "WordPress",
  "SEO",
  "Content Writing",
  "Flutter",
];

export function BrowseFreelancersPage() {
  const [skillQuery, setSkillQuery] = useState("");
  const [activeSkill, setActiveSkill] = useState("");
  const { data: freelancers, isLoading } = useFreelancersBySkill(activeSkill);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSkill(skillQuery.trim());
  };

  return (
    <main className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-700 mb-2">
            Freelancers Browse Karo
          </h1>
          <p className="text-muted-foreground">
            Apne project ke liye perfect talent dhundho
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={skillQuery}
              onChange={(e) => setSkillQuery(e.target.value)}
              placeholder="Skill se search karo (e.g. React, Python)"
              className="pl-10"
              data-ocid="freelancers.search_input"
            />
          </div>
          <Button type="submit" data-ocid="freelancers.primary_button">
            Search
          </Button>
          {activeSkill && (
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setActiveSkill("");
                setSkillQuery("");
              }}
              data-ocid="freelancers.secondary_button"
            >
              Clear
            </Button>
          )}
        </form>

        {/* Popular Skills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {POPULAR_SKILLS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setActiveSkill(s);
                setSkillQuery(s);
              }}
              data-ocid="freelancers.tab"
            >
              <Badge
                variant={activeSkill === s ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary/20 transition-colors"
              >
                {s}
              </Badge>
            </button>
          ))}
        </div>

        {/* Results count */}
        {!isLoading && freelancers && (
          <p className="text-sm text-muted-foreground mb-4">
            {freelancers.length} freelancer{freelancers.length !== 1 ? "s" : ""}{" "}
            mila{freelancers.length !== 1 ? "e" : ""}
            {activeSkill ? ` for "${activeSkill}"` : ""}
          </p>
        )}

        {/* Loading */}
        {isLoading && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="freelancers.loading_state"
          >
            {["a", "b", "c", "d", "e", "f"].map((k) => (
              <Card key={k}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && freelancers?.length === 0 && (
          <div
            className="text-center py-16"
            data-ocid="freelancers.empty_state"
          >
            <p className="text-4xl mb-3">🔍</p>
            <h3 className="font-display text-xl font-600 mb-2">
              Koi freelancer nahi mila
            </h3>
            <p className="text-muted-foreground">
              Dusri skill try karo ya search clear karo
            </p>
          </div>
        )}

        {/* Freelancer Grid */}
        {!isLoading && freelancers && freelancers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {freelancers.map((f, i) => (
              <Card
                key={f.id.toString()}
                className="hover:shadow-card hover:border-primary/20 transition-all"
                data-ocid={`freelancers.item.${i + 1}`}
              >
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-display font-600">
                        {f.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-600 truncate">
                        {f.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <IndianRupee className="h-3.5 w-3.5" />
                        <span>{f.hourlyRate.toString()}/hr</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {f.bio || "Bio not provided"}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {f.skills.slice(0, 4).map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                    {f.skills.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{f.skills.length - 4}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Link
                      to="/freelancer/$id"
                      params={{ id: f.id.toString() }}
                      className="flex-1"
                      data-ocid={`freelancers.item.${i + 1}`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1"
                      >
                        Profile Dekho <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    {f.portfolio && (
                      <a href={f.portfolio} target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="sm">
                          Portfolio
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
