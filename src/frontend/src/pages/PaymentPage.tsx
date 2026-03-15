import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CreditCard,
  IndianRupee,
  Loader2,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { useActor } from "../hooks/useActor";
import { useAllJobs } from "../hooks/useQueries";

export function PaymentPage() {
  const { jobId } = useParams({ from: "/payment/$jobId" });
  const { actor } = useActor();
  const { data: allJobs, isLoading: jobsLoading } = useAllJobs();
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const job = allJobs?.find((j) => j.id.toString() === jobId);

  const commission = job ? Number(job.budget) * 0.1 : 0;
  const total = job ? Number(job.budget) + commission : 0;

  const handlePay = async () => {
    if (!actor || !job) return;
    setIsPaying(true);
    setError(null);
    try {
      const successUrl = `${window.location.origin}/payment-success`;
      const cancelUrl = `${window.location.origin}/payment-cancel`;
      const checkoutUrl = await actor.createJobPayment(
        job.id,
        successUrl,
        cancelUrl,
      );
      window.location.href = checkoutUrl;
    } catch {
      setError("Payment shuru karne mein error aaya. Dobara try karein.");
      setIsPaying(false);
    }
  };

  if (jobsLoading) {
    return (
      <main className="min-h-screen py-16">
        <div
          className="container mx-auto px-4 max-w-lg text-center"
          data-ocid="payment.loading_state"
        >
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            Job details load ho rahe hain...
          </p>
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen py-16">
        <div
          className="container mx-auto px-4 max-w-lg text-center"
          data-ocid="payment.error_state"
        >
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="font-display text-xl font-700 mb-2">Job Nahi Mila</h2>
          <p className="text-muted-foreground mb-6">
            Yeh job exist nahi karta ya delete ho gaya hai.
          </p>
          <Link to="/dashboard">
            <Button variant="outline" data-ocid="payment.cancel_button">
              <ArrowLeft className="h-4 w-4 mr-2" /> Dashboard Par Jao
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-lg">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          data-ocid="payment.link"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard Par Wapas Jao
        </Link>

        <div className="text-center mb-8">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-700">Job Payment</h1>
          <p className="text-muted-foreground mt-1">
            Neeche payment summary check karein
          </p>
        </div>

        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">
              Job Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold text-lg">{job.title}</p>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {job.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{job.category}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Job Budget</span>
              <span className="flex items-center gap-0.5 font-medium">
                <IndianRupee className="h-3.5 w-3.5" />
                {Number(job.budget).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Platform Commission (10%)
              </span>
              <span className="flex items-center gap-0.5 font-medium text-accent-foreground">
                <IndianRupee className="h-3.5 w-3.5" />
                {commission.toLocaleString("en-IN")}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-base">
              <span>Total Amount</span>
              <span className="flex items-center gap-0.5 text-primary">
                <IndianRupee className="h-4 w-4" />
                {total.toLocaleString("en-IN")}
              </span>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div
            className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-4"
            data-ocid="payment.error_state"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <Button
          className="w-full h-12 text-base gap-2"
          onClick={handlePay}
          disabled={isPaying || !actor}
          data-ocid="payment.primary_button"
        >
          {isPaying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" /> Abhi Pay Karo
            </>
          )}
        </Button>

        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
          <Shield className="h-3.5 w-3.5" />
          Stripe se secure payment — aapki card details safe hain
        </div>
      </div>
    </main>
  );
}
