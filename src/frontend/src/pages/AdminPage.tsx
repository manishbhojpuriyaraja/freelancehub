import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Briefcase,
  FileText,
  ShieldAlert,
  TrendingUp,
  Users,
} from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllFreelancers,
  useAllJobs,
  useIsAdmin,
  usePlatformStats,
} from "../hooks/useQueries";

export function AdminPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: stats, isLoading: statsLoading } = usePlatformStats();
  const { data: jobs } = useAllJobs();
  const { data: freelancers } = useAllFreelancers();

  if (!identity || adminLoading)
    return (
      <main className="min-h-screen py-10">
        <div
          className="container mx-auto px-4 text-center py-20"
          data-ocid="admin.loading_state"
        >
          <p className="text-4xl mb-3">🔐</p>
          <h2 className="font-display text-2xl font-700">
            Checking permissions...
          </h2>
        </div>
      </main>
    );

  if (!isAdmin)
    return (
      <main className="min-h-screen py-10">
        <div
          className="container mx-auto px-4 text-center py-20"
          data-ocid="admin.error_state"
        >
          <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="font-display text-2xl font-700 mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            Aapke paas admin access nahi hai.
          </p>
        </div>
      </main>
    );

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers?.toString() ?? "0",
      icon: <Users className="h-6 w-6" />,
      sub: "Registered platform users",
    },
    {
      label: "Total Jobs",
      value: stats?.totalJobs?.toString() ?? "0",
      icon: <Briefcase className="h-6 w-6" />,
      sub: "Jobs posted on platform",
    },
    {
      label: "Total Applications",
      value: stats?.totalApplications?.toString() ?? "0",
      icon: <FileText className="h-6 w-6" />,
      sub: "Applications submitted",
    },
    {
      label: "Active Freelancers",
      value: (freelancers?.length ?? 0).toString(),
      icon: <TrendingUp className="h-6 w-6" />,
      sub: "Verified freelancer profiles",
    },
  ];

  return (
    <main className="min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShieldAlert className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-700">Admin Panel</h1>
            <p className="text-muted-foreground text-sm">
              Platform statistics aur management
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        {statsLoading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            data-ocid="admin.loading_state"
          >
            {["a", "b", "c", "d"].map((k) => (
              <Skeleton key={k} className="h-28" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map((s) => (
              <Card key={s.label} className="gradient-card">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {s.icon}
                    </div>
                  </div>
                  <p className="font-display text-3xl font-700">{s.value}</p>
                  <p className="font-medium text-sm mt-1">{s.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {s.sub}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Recent Jobs & Freelancers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" /> Recent Jobs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {jobs?.slice(0, 5).map((job, i) => (
                <div
                  key={job.id.toString()}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  data-ocid={`admin.row.${i + 1}`}
                >
                  <div>
                    <p className="text-sm font-medium">{job.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {job.category}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    ₹{job.budget.toString()}
                  </span>
                </div>
              ))}
              {(!jobs || jobs.length === 0) && (
                <p
                  className="text-sm text-muted-foreground text-center py-4"
                  data-ocid="admin.empty_state"
                >
                  Koi job nahi hai
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> Recent Freelancers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {freelancers?.slice(0, 5).map((f, i) => (
                <div
                  key={f.id.toString()}
                  className="flex items-center gap-3 py-2 border-b border-border last:border-0"
                  data-ocid={`admin.row.${i + 1}`}
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-display font-700">
                    {f.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{f.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {f.skills.slice(0, 2).join(", ")}
                    </p>
                  </div>
                  <span className="text-xs text-primary">
                    ₹{f.hourlyRate.toString()}/hr
                  </span>
                </div>
              ))}
              {(!freelancers || freelancers.length === 0) && (
                <p
                  className="text-sm text-muted-foreground text-center py-4"
                  data-ocid="admin.empty_state"
                >
                  Koi freelancer nahi hai
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
