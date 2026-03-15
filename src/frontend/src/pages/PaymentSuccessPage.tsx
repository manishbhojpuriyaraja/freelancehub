import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { CheckCircle, LayoutDashboard } from "lucide-react";
import { motion } from "motion/react";

export function PaymentSuccessPage() {
  return (
    <main className="min-h-screen py-16 flex items-center justify-center">
      <div
        className="container mx-auto px-4 max-w-md text-center"
        data-ocid="payment_success.section"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h1 className="font-display text-3xl font-700 mb-3">
            Payment Successful! 🎉
          </h1>
          <p className="text-muted-foreground mb-8">
            Aapka payment successfully complete ho gaya hai. Freelancer ko
            payment release ho jayega.
          </p>

          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-4">
              <p className="text-sm text-green-700 font-medium">
                ✅ Transaction complete ho gaya hai
              </p>
              <p className="text-xs text-green-600 mt-1">
                Aapko confirmation email milega
              </p>
            </CardContent>
          </Card>

          <Link to="/dashboard">
            <Button
              className="gap-2 w-full h-11"
              data-ocid="payment_success.primary_button"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard Par Jao
            </Button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
