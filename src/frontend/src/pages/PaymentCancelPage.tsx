import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useRouter } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, LayoutDashboard } from "lucide-react";
import { motion } from "motion/react";

export function PaymentCancelPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen py-16 flex items-center justify-center">
      <div
        className="container mx-auto px-4 max-w-md text-center"
        data-ocid="payment_cancel.section"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-amber-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h1 className="font-display text-3xl font-700 mb-3">
            Payment Cancel Hua
          </h1>
          <p className="text-muted-foreground mb-8">
            Aapne payment cancel kar diya. Koi charge nahi kiya gaya. Aap dobara
            try kar sakte hain.
          </p>

          <Card className="mb-6 bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <p className="text-sm text-amber-700 font-medium">
                ⚠️ Payment complete nahi hua
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Aapka koi amount deduct nahi hua hai
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1 gap-2 h-11"
              onClick={() => router.history.back()}
              data-ocid="payment_cancel.secondary_button"
            >
              <ArrowLeft className="h-4 w-4" /> Dobara Try Karo
            </Button>
            <Link to="/dashboard" className="flex-1">
              <Button
                className="w-full gap-2 h-11"
                data-ocid="payment_cancel.primary_button"
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard Par Jao
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
