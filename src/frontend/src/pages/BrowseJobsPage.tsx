import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Clock, IndianRupee, Search } from "lucide-react";
import { useState } from "react";
import { useJobsByCategory } from "../hooks/useQueries";

const CATEGORIES = [
  "all",
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

export function BrowseJobsPage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const { data: jobs, isLoading } = useJobsByCategory(category);

  const filtered =
    jobs?.filter(
      (j) =>
        search.trim() === "" ||
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.description.toLowerCase().includes(search.toLowerCase()),
    ) ?? [];

  return (
    <main className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-700 mb-2">
            Jobs Browse Karo
          </h1>
          <p className="text-muted-foreground">
            Hazaron opportunities, ek jagah
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Job search karo..."
              className="pl-10"
              data-ocid="jobs.search_input"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-52" data-ocid="jobs.select">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c === "all" ? "All Categories" : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Count */}
        {!isLoading && (
          <p className="text-sm text-muted-foreground mb-4">
            {filtered.length} job{filtered.length !== 1 ? "s" : ""} available
          </p>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4" data-ocid="jobs.loading_state">
            {["a", "b", "c", "d", "e"].map((k) => (
              <Card key={k}>
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-5 w-64" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16" data-ocid="jobs.empty_state">
            <p className="text-4xl mb-3">📋</p>
            <h3 className="font-display text-xl font-600 mb-2">
              Koi job nahi mili
            </h3>
            <p className="text-muted-foreground">
              Category badlo ya search clear karo
            </p>
          </div>
        )}

        {/* Job List */}
        {!isLoading && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map((job, i) => (
              <Card
                key={job.id.toString()}
                className="hover:shadow-card hover:border-primary/20 transition-all"
                data-ocid={`jobs.item.${i + 1}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="font-display text-lg">
                        {job.title}
                      </CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {job.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-primary font-semibold flex-shrink-0">
                      <IndianRupee className="h-4 w-4" />
                      <span>{job.budget.toString()}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {job.requiredSkills.slice(0, 5).map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                    {job.requiredSkills.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{job.requiredSkills.length - 5}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> Posted recently
                    </div>
                    <Link
                      to="/job/$id"
                      params={{ id: job.id.toString() }}
                      data-ocid={`jobs.item.${i + 1}`}
                    >
                      <Button size="sm" className="gap-1">
                        Apply Now <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
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
