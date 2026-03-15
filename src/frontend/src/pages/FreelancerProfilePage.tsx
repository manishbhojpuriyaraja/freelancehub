import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Principal } from "@icp-sdk/core/principal";
import { useParams } from "@tanstack/react-router";
import { Briefcase, ExternalLink, IndianRupee, Star } from "lucide-react";
import { useFreelancerProfile } from "../hooks/useQueries";

export function FreelancerProfilePage() {
  const { id } = useParams({ strict: false }) as { id: string };

  let principal: Principal | null = null;
  try {
    principal = Principal.fromText(id ?? "");
  } catch {
    /* invalid */
  }

  const { data: profile, isLoading, error } = useFreelancerProfile(principal);

  if (isLoading)
    return (
      <main className="min-h-screen py-10">
        <div
          className="container mx-auto px-4 max-w-3xl space-y-6"
          data-ocid="profile.loading_state"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-32" />
          <Skeleton className="h-24" />
        </div>
      </main>
    );

  if (error || !profile)
    return (
      <main className="min-h-screen py-10">
        <div
          className="container mx-auto px-4 text-center py-20"
          data-ocid="profile.error_state"
        >
          <p className="text-4xl mb-3">😕</p>
          <h2 className="font-display text-2xl font-700 mb-2">
            Profile nahi mila
          </h2>
          <p className="text-muted-foreground">
            Yeh freelancer exist nahi karta ya koi error aaya.
          </p>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary/10 text-primary font-display font-700 text-2xl">
                  {profile.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="font-display text-2xl font-700">
                  {profile.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-primary font-semibold">
                    <IndianRupee className="h-4 w-4" />
                    <span>{profile.hourlyRate.toString()}/hr</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span>Top Rated</span>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <Briefcase className="h-3.5 w-3.5" /> Available
                  </Badge>
                </div>
              </div>
              {profile.portfolio && (
                <a
                  href={profile.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  data-ocid="profile.primary_button"
                >
                  <Button variant="outline" className="gap-2">
                    Portfolio <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bio */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {profile.bio || "Bio not provided."}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Skills Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                  {profile.skills.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No skills listed
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-5 text-center">
                <p className="font-display font-600 text-2xl text-primary">
                  ₹{profile.hourlyRate.toString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">per hour</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
