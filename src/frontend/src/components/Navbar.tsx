import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Briefcase,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCallerProfile, useIsAdmin } from "../hooks/useQueries";

export function Navbar() {
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();
  const { data: profile } = useCallerProfile();
  const { data: isAdmin } = useIsAdmin();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: "/jobs", label: "Jobs", icon: <Briefcase className="h-4 w-4" /> },
    {
      to: "/freelancers",
      label: "Freelancers",
      icon: <Users className="h-4 w-4" />,
    },
    ...(identity
      ? [
          {
            to: "/dashboard",
            label: "Dashboard",
            icon: <LayoutDashboard className="h-4 w-4" />,
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            to: "/admin",
            label: "Admin",
            icon: <ShieldCheck className="h-4 w-4" />,
          },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-display font-700 text-xl"
          data-ocid="nav.link"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Briefcase className="h-4 w-4" />
          </div>
          <span className="text-gradient">FreelanceHub</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid="nav.link"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {identity ? (
            <>
              {profile && (
                <Badge variant="secondary" className="font-medium">
                  {profile.role}
                </Badge>
              )}
              {!profile && (
                <Link to="/register" data-ocid="nav.link">
                  <Button size="sm" variant="outline">
                    Complete Profile
                  </Button>
                </Link>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={clear}
                data-ocid="nav.primary_button"
              >
                <LogOut className="h-4 w-4 mr-1.5" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={login}
                disabled={isLoggingIn}
                data-ocid="nav.primary_button"
              >
                <LogIn className="h-4 w-4 mr-1.5" />
                {isLoggingIn ? "Connecting..." : "Login"}
              </Button>
              <Link to="/register" data-ocid="nav.link">
                <Button size="sm" data-ocid="nav.secondary_button">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md"
          onClick={() => setMobileOpen(!mobileOpen)}
          data-ocid="nav.toggle"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid="nav.link"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium ${
                isActive(link.to)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border">
            {identity ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  clear();
                  setMobileOpen(false);
                }}
                className="w-full justify-start"
                data-ocid="nav.primary_button"
              >
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => {
                  login();
                  setMobileOpen(false);
                }}
                className="w-full"
                disabled={isLoggingIn}
                data-ocid="nav.primary_button"
              >
                <LogIn className="h-4 w-4 mr-2" />{" "}
                {isLoggingIn ? "Connecting..." : "Login"}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
