import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "@tanstack/react-router";
import {
  Briefcase,
  CheckCircle2,
  IndianRupee,
  Loader2,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAllJobs, useApplyToJob } from "../hooks/useQueries";

export function JobDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { identity, login } = useInternetIdentity();
  const { data: jobs, isLoading } = useAllJobs();
  const applyToJob = useApplyToJob();
  const [proposal, setProposal] = useState("");
  const [applied, setApplied] = useState(false);

  const job = jobs?.find((j) => j.id.toString() === id);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      login();
      return;
    }
    if (!job) return;
    try {
      await applyToJob.mutateAsync({ jobId: job.id, proposal });
      toast.success("Application submit ho gaya! 🎉");
      setApplied(true);
    } catch {
      toast.error("Apply karne mein error aaya.");
    }
  };

  if (isLoading)
    return (
      <main className="min-h-screen py-10">
        <div
          className="container mx-auto px-4 max-w-3xl space-y-4"
          data-ocid="jobdetail.loading_state"
        >
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-48" />
        </div>
      </main>
    );

  if (!job)
    return (
      <main className="min-h-screen py-10">
        <div
          className="container mx-auto px-4 text-center py-20"
          data-ocid="jobdetail.error_state"
        >
          <p className="text-4xl mb-3">📋</p>
          <h2 className="font-display text-2xl font-700">Job nahi mila</h2>
          <p className="text-muted-foreground">Yeh job exist nahi karta.</p>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Job Details */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="font-display text-2xl">
                      {job.title}
                    </CardTitle>
                    <Badge variant="outline" className="mt-2">
                      {job.category}
                    </Badge>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-primary font-bold text-xl">
                      <IndianRupee className="h-5 w-5" />
                      {job.budget.toString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" /> Job
                    Description
                  </h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" /> Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((s) => (
                      <Badge key={s} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Apply Sidebar */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-display text-lg">
                  Apply Karo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {applied ? (
                  <div
                    className="text-center py-6"
                    data-ocid="jobdetail.success_state"
                  >
                    <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-3" />
                    <p className="font-semibold">Application Send Ho Gaya!</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Client review karega aur reply karega.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="proposal">Proposal *</Label>
                      <Textarea
                        id="proposal"
                        value={proposal}
                        onChange={(e) => setProposal(e.target.value)}
                        placeholder="Kyon tum best candidate ho? Apna experience batao..."
                        rows={5}
                        required
                        data-ocid="jobdetail.textarea"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={applyToJob.isPending || !identity}
                      data-ocid="jobdetail.submit_button"
                    >
                      {applyToJob.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : identity ? (
                        "Apply Now"
                      ) : (
                        "Login to Apply"
                      )}
                    </Button>
                    {!identity && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={login}
                        type="button"
                        data-ocid="jobdetail.primary_button"
                      >
                        Login Karo
                      </Button>
                    )}
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
