import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  CheckCircle,
  CreditCard,
  IndianRupee,
  Loader2,
  Plus,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppUserRole } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAcceptApplication,
  useAllFreelancers,
  useAllJobs,
  useCallerProfile,
  useJobApplications,
  useRejectApplication,
} from "../hooks/useQueries";
import type { Job } from "../hooks/useQueries";

function ClientJobCard({ job, index }: { job: Job; index: number }) {
  const { data: applications, isLoading } = useJobApplications(job.id);
  const accept = useAcceptApplication();
  const reject = useRejectApplication();

  const handleAccept = async (
    freelancer: import("@icp-sdk/core/principal").Principal,
  ) => {
    try {
      await accept.mutateAsync({ jobId: job.id, freelancer });
      toast.success("Application accept ho gaya!");
    } catch {
      toast.error("Error aaya.");
    }
  };

  const handleReject = async (
    freelancer: import("@icp-sdk/core/principal").Principal,
  ) => {
    try {
      await reject.mutateAsync({ jobId: job.id, freelancer });
      toast.success("Application reject ho gaya.");
    } catch {
      toast.error("Error aaya.");
    }
  };

  const hasApplications = !isLoading && applications && applications.length > 0;

  return (
    <Card data-ocid={`dashboard.item.${index}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-display text-base">
              {job.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {job.category}
              </Badge>
              <span className="flex items-center gap-0.5 text-sm text-primary font-semibold">
                <IndianRupee className="h-3.5 w-3.5" />
                {job.budget.toString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {isLoading ? "..." : `${applications?.length ?? 0} Applications`}
            </Badge>
            <Link to="/payment/$jobId" params={{ jobId: job.id.toString() }}>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 h-8 text-xs border-primary/40 text-primary hover:bg-primary/10"
                data-ocid={`dashboard.primary_button.${index}`}
              >
                <CreditCard className="h-3.5 w-3.5" /> Pay
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      {hasApplications && (
        <CardContent className="pt-0 space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            Applications:
          </p>
          {applications.map((app, j) => (
            <div
              key={app.freelancer.toString()}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
              data-ocid={`dashboard.row.${j + 1}`}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {app.freelancer.toString().slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">
                  {app.freelancer.toString()}
                </p>
                <p className="text-sm mt-0.5 line-clamp-2">{app.proposal}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
                  onClick={() => handleAccept(app.freelancer)}
                  disabled={accept.isPending}
                  data-ocid={`dashboard.confirm_button.${j + 1}`}
                >
                  {accept.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                  onClick={() => handleReject(app.freelancer)}
                  disabled={reject.isPending}
                  data-ocid={`dashboard.delete_button.${j + 1}`}
                >
                  {reject.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}

export function DashboardPage() {
  const { identity, login } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useCallerProfile();
  const { data: allJobs } = useAllJobs();
  const { data: allFreelancers } = useAllFreelancers();
  const [activeTab, setActiveTab] = useState("overview");

  if (!identity)
    return (
      <main className="min-h-screen py-10">
        <div className="container mx-auto px-4 text-center py-20">
          <p className="text-4xl mb-4">🔐</p>
          <h2 className="font-display text-2xl font-700 mb-3">
            Login Required
          </h2>
          <p className="text-muted-foreground mb-6">
            Dashboard dekhne ke liye login karo
          </p>
          <Button onClick={login} data-ocid="dashboard.primary_button">
            Login Karo
          </Button>
        </div>
      </main>
    );

  if (profileLoading)
    return (
      <main className="min-h-screen py-10">
        <div
          className="container mx-auto px-4 max-w-4xl space-y-4"
          data-ocid="dashboard.loading_state"
        >
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      </main>
    );

  if (!profile)
    return (
      <main className="min-h-screen py-10">
        <div className="container mx-auto px-4 text-center py-20">
          <p className="text-4xl mb-4">👤</p>
          <h2 className="font-display text-2xl font-700 mb-3">
            Profile Complete Nahi Hai
          </h2>
          <p className="text-muted-foreground mb-6">Pehle register karo</p>
          <Link to="/register">
            <Button data-ocid="dashboard.primary_button">Register Karo</Button>
          </Link>
        </div>
      </main>
    );

  const isClient = profile.role === AppUserRole.client;
  const isFreelancer = profile.role === AppUserRole.freelancer;

  return (
    <main className="min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary/10 text-primary font-display font-700 text-xl">
                {profile.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-display text-2xl font-700">
                Namaste, {profile.name}! 👋
              </h1>
              <Badge variant="secondary" className="mt-1 capitalize">
                {profile.role}
              </Badge>
            </div>
          </div>
          {isClient && (
            <Link to="/post-job" data-ocid="dashboard.primary_button">
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Post Job
              </Button>
            </Link>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" data-ocid="dashboard.tab">
              Overview
            </TabsTrigger>
            {isClient && (
              <TabsTrigger value="myjobs" data-ocid="dashboard.tab">
                My Jobs
              </TabsTrigger>
            )}
            {isFreelancer && (
              <TabsTrigger value="browse" data-ocid="dashboard.tab">
                Browse Jobs
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-700">
                      {allJobs?.length ?? 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Jobs</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-700">
                      {allFreelancers?.length ?? 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Freelancers</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-5 text-center">
                  <p className="text-lg font-display font-700 text-primary capitalize">
                    {profile.role}
                  </p>
                  <p className="text-sm text-muted-foreground">Account Type</p>
                </CardContent>
              </Card>
            </div>

            {isFreelancer && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Link to="/jobs">
                    <Button
                      variant="outline"
                      className="gap-2"
                      data-ocid="dashboard.secondary_button"
                    >
                      <Briefcase className="h-4 w-4" /> Browse Jobs
                    </Button>
                  </Link>
                  <Link to="/freelancers">
                    <Button
                      variant="outline"
                      className="gap-2"
                      data-ocid="dashboard.secondary_button"
                    >
                      <User className="h-4 w-4" /> See Other Freelancers
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {isClient && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Link to="/post-job">
                    <Button
                      className="gap-2"
                      data-ocid="dashboard.primary_button"
                    >
                      <Plus className="h-4 w-4" /> Post New Job
                    </Button>
                  </Link>
                  <Link to="/freelancers">
                    <Button
                      variant="outline"
                      className="gap-2"
                      data-ocid="dashboard.secondary_button"
                    >
                      <User className="h-4 w-4" /> Browse Freelancers
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {isClient && (
            <TabsContent value="myjobs">
              <div className="space-y-4">
                {allJobs?.filter(
                  (j) =>
                    j.client.toString() === identity?.getPrincipal().toString(),
                ).length === 0 && (
                  <div
                    className="text-center py-12"
                    data-ocid="dashboard.empty_state"
                  >
                    <p className="text-4xl mb-3">📋</p>
                    <h3 className="font-display text-xl font-600 mb-2">
                      Abhi tak koi job post nahi ki
                    </h3>
                    <Link to="/post-job">
                      <Button
                        className="mt-3 gap-2"
                        data-ocid="dashboard.primary_button"
                      >
                        <Plus className="h-4 w-4" /> Pehli Job Post Karo
                      </Button>
                    </Link>
                  </div>
                )}
                {allJobs
                  ?.filter(
                    (j) =>
                      j.client.toString() ===
                      identity?.getPrincipal().toString(),
                  )
                  .map((job, i) => (
                    <ClientJobCard
                      key={job.id.toString()}
                      job={job}
                      index={i + 1}
                    />
                  ))}
              </div>
            </TabsContent>
          )}

          {isFreelancer && (
            <TabsContent value="browse">
              <div className="space-y-4">
                {allJobs?.length === 0 && (
                  <div
                    className="text-center py-12"
                    data-ocid="dashboard.empty_state"
                  >
                    <p className="text-4xl mb-3">🔍</p>
                    <h3 className="font-display text-xl font-600">
                      Abhi koi job available nahi hai
                    </h3>
                  </div>
                )}
                {allJobs?.map((job, i) => (
                  <Card
                    key={job.id.toString()}
                    className="hover:shadow-card transition-all"
                    data-ocid={`dashboard.item.${i + 1}`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-display font-600">{job.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {job.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {job.requiredSkills.slice(0, 3).map((s) => (
                              <Badge
                                key={s}
                                variant="secondary"
                                className="text-xs"
                              >
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Link
                          to="/job/$id"
                          params={{ id: job.id.toString() }}
                          data-ocid={`dashboard.item.${i + 1}`}
                        >
                          <Button size="sm">Apply</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </main>
  );
}
