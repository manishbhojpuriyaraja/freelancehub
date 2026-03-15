import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { AdminPage } from "./pages/AdminPage";
import { BrowseFreelancersPage } from "./pages/BrowseFreelancersPage";
import { BrowseJobsPage } from "./pages/BrowseJobsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { FreelancerProfilePage } from "./pages/FreelancerProfilePage";
import { JobDetailPage } from "./pages/JobDetailPage";
import { LandingPage } from "./pages/LandingPage";
import { PaymentCancelPage } from "./pages/PaymentCancelPage";
import { PaymentPage } from "./pages/PaymentPage";
import { PaymentSuccessPage } from "./pages/PaymentSuccessPage";
import { PostJobPage } from "./pages/PostJobPage";
import { RegisterPage } from "./pages/RegisterPage";

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const freelancersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/freelancers",
  component: BrowseFreelancersPage,
});

const freelancerProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/freelancer/$id",
  component: FreelancerProfilePage,
});

const jobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/jobs",
  component: BrowseJobsPage,
});

const jobDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/job/$id",
  component: JobDetailPage,
});

const postJobRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/post-job",
  component: PostJobPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const paymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment/$jobId",
  component: PaymentPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: PaymentSuccessPage,
});

const paymentCancelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-cancel",
  component: PaymentCancelPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  registerRoute,
  freelancersRoute,
  freelancerProfileRoute,
  jobsRoute,
  jobDetailRoute,
  postJobRoute,
  dashboardRoute,
  adminRoute,
  paymentRoute,
  paymentSuccessRoute,
  paymentCancelRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
