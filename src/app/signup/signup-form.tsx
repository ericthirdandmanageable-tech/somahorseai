"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User, Check, Loader2 } from "lucide-react";

import { getPostAuthRedirect, signupRoleToUserRole } from "@/lib/auth/redirect";
import { fetchProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/client";

export function SignupForm({ initialRole }: { initialRole?: string }) {
  const isDevContext = initialRole === "developer";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all credentials.");
      return;
    }
    if (!agreeTerms) {
      setError("You must agree to the Terms of Service.");
      return;
    }
    setError("");
    setIsLoading(true);

    const supabase = createClient();
    const role = signupRoleToUserRole(initialRole);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setIsLoading(false);
      setError(signUpError.message);
      return;
    }

    if (data.user && !data.session) {
      setIsLoading(false);
      setNeedsEmailConfirmation(true);
      setIsSuccess(true);
      return;
    }

    if (data.user) {
      const profile = await fetchProfile(supabase, data.user.id);
      const destination = profile
        ? getPostAuthRedirect(profile.role, profile.onboarding_status)
        : role === "talent"
          ? "/onboarding/talent"
          : "/onboarding/client";

      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        window.location.href = destination;
      }, 1200);
      return;
    }

    setIsLoading(false);
    setError("Unable to create your account. Please try again.");
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-background hero-field dotted-grid">
      {/* Background radial highlights */}
      <div className="pointer-events-none absolute -top-40 right-1/4 size-[600px] rounded-full bg-blue-sky/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 size-[600px] rounded-full bg-navy-mid/10 blur-[140px]" />

      {/* Header / Back Link */}
      <header className="relative z-10 px-6 py-6 max-w-6xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-xs font-semibold text-navy-mid shadow-soft backdrop-blur-md transition hover:bg-white hover:text-navy hover:shadow-card"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to home
        </Link>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
          <span className="size-1.5 rounded-full bg-accent-teal animate-glow-pulse" />
          Secure Connection
        </span>
      </header>

      {/* Card container */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-[460px] transform transition-all duration-300">
          <div className="rounded-3xl border border-border/80 bg-white/80 p-6 shadow-elevated backdrop-blur-xl sm:p-9">
            
            {/* Logo, Premium Tag, and Greeting */}
            <div className="mb-6 text-center flex flex-col items-center">
              <Link href="/" className="inline-flex items-center gap-2 mb-4 justify-center">
                <Image
                  src="/somahorse-logo.png"
                  alt="Somahorse.ai Logo"
                  width={38}
                  height={38}
                  className="size-9 rounded-full object-contain"
                  priority
                />
                <span className="font-display text-lg font-bold text-navy">
                  Somahorse<span className="text-blue-vivid">.ai</span>
                </span>
              </Link>

              {/* Dynamic Context Tag */}
              {isDevContext ? (
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-vivid/20 bg-blue-light/65 px-4 py-1.5 text-xs font-semibold text-navy-mid shadow-soft animate-fade-up">
                  <span className="size-2 rounded-full bg-blue-vivid animate-glow-pulse" />
                  Joining as a Certified Developer
                </div>
              ) : (
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-teal/20 bg-accent-teal/10 px-4 py-1.5 text-xs font-semibold text-accent-teal shadow-soft animate-fade-up">
                  <span className="size-2 rounded-full bg-accent-teal animate-glow-pulse" />
                  Joining as a Project Client
                </div>
              )}

              <h1 className="font-ui text-2xl sm:text-3xl font-bold tracking-tight text-navy">
                {isDevContext ? "Create developer profile" : "Create client account"}
              </h1>
              
              <p className="mt-2 text-sm text-muted-foreground">
                {isDevContext 
                  ? "Get matched with funded projects and start building." 
                  : "Describe agricultural requirements and watch our AI build them."
                }
              </p>
            </div>

            {isSuccess ? (
              <div className="py-10 text-center animate-fade-up">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-accent-teal/15 text-accent-teal">
                  <Check className="size-6 stroke-[3]" />
                </div>
                <h3 className="font-ui text-lg font-bold text-navy">
                  {needsEmailConfirmation ? "Confirm your email" : "Account created"}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {needsEmailConfirmation
                    ? "We sent a confirmation link to your inbox. Open it to finish signing up."
                    : "Preparing your onboarding workspace..."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-xl bg-accent-amber/10 border border-accent-amber/20 p-3.5 text-xs font-medium text-accent-amber text-center">
                    {error}
                  </div>
                )}

                {/* Name input */}
                <div className="space-y-1">
                  <label htmlFor="name" className="text-xs font-bold text-navy-mid/80 tracking-wide uppercase font-ui">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/60 pointer-events-none">
                      <User className="size-4.5" />
                    </span>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isDevContext ? "e.g. Sipho Ndlovu" : "e.g. Agri Logistics Lead"}
                      className="w-full min-h-11 rounded-xl border border-border-strong bg-white/50 pl-10.5 pr-4 text-sm text-navy placeholder-muted-foreground/50 transition-all focus:border-blue-vivid focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-vivid/10"
                      required
                    />
                  </div>
                </div>

                {/* Email input */}
                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-bold text-navy-mid/80 tracking-wide uppercase font-ui">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/60 pointer-events-none">
                      <Mail className="size-4.5" />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@supplychain.com"
                      className="w-full min-h-11 rounded-xl border border-border-strong bg-white/50 pl-10.5 pr-4 text-sm text-navy placeholder-muted-foreground/50 transition-all focus:border-blue-vivid focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-vivid/10"
                      required
                    />
                  </div>
                </div>

                {/* Password input */}
                <div className="space-y-1">
                  <label htmlFor="password" className="text-xs font-bold text-navy-mid/80 tracking-wide uppercase font-ui">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/60 pointer-events-none">
                      <Lock className="size-4.5" />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full min-h-11 rounded-xl border border-border-strong bg-white/50 pl-10.5 pr-11 text-sm text-navy placeholder-muted-foreground/50 transition-all focus:border-blue-vivid focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-vivid/10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground/75 hover:text-navy-mid transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                    </button>
                  </div>
                </div>

                {/* Terms agreement checkbox */}
                <div className="flex items-start py-1">
                  <input
                    id="agree-terms"
                    name="agree-terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 size-4.5 rounded-md border-border-strong text-navy-mid focus:ring-navy-mid/20 accent-navy-mid cursor-pointer"
                  />
                  <label htmlFor="agree-terms" className="ml-2.5 text-xs font-medium text-muted-foreground select-none cursor-pointer leading-normal">
                    I agree to the{" "}
                    <Link href="#" className="font-semibold text-blue-vivid hover:underline">Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="#" className="font-semibold text-blue-vivid hover:underline">Privacy Policy</Link>.
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full min-h-11 flex items-center justify-center gap-2 rounded-full bg-navy-mid text-sm font-semibold text-white shadow-glow transition hover:bg-navy disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer font-ui"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create free account"
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-4 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <span className="relative bg-white/0 px-3 text-xs font-semibold text-muted-foreground/60 uppercase font-ui">
                    Or register with
                  </span>
                </div>

                {/* Dynamic OAuth buttons (GitHub hidden for Clients) */}
                <div className={isDevContext ? "grid grid-cols-2 gap-3" : "grid grid-cols-1"}>
                  <button
                    type="button"
                    className="flex min-h-10.5 items-center justify-center gap-2 rounded-full border border-border-strong bg-white/70 text-xs font-bold text-navy shadow-soft hover:bg-white transition-all cursor-pointer font-ui"
                  >
                    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    Google
                  </button>
                  {isDevContext && (
                    <button
                      type="button"
                      className="flex min-h-10.5 items-center justify-center gap-2 rounded-full border border-border-strong bg-white/70 text-xs font-bold text-navy shadow-soft hover:bg-white transition-all cursor-pointer font-ui"
                    >
                      <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
                      </svg>
                      GitHub
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* Role Helper Switch Link */}
            <div className="mt-5 text-center text-xs text-muted-foreground border-t border-border/60 pt-4 font-ui">
              {isDevContext ? (
                <span>
                  Not a developer?{" "}
                  <Link href="/signup?role=client" className="font-bold text-blue-vivid hover:underline">
                    Sign up as a client
                  </Link>
                </span>
              ) : (
                <span>
                  Are you an engineer?{" "}
                  <Link href="/signup?role=developer" className="font-bold text-blue-vivid hover:underline">
                    Join our developer network
                  </Link>
                </span>
              )}
            </div>

            {/* Bottom login link */}
            <div className="mt-4 text-center text-sm text-muted-foreground font-ui">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-blue-vivid hover:text-navy hover:underline transition-all"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-6 border-t border-border/40 bg-white/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-ui">
          <span>© {new Date().getFullYear()} Somahorse.ai · Durban & Cape Town</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-navy">Privacy Policy</Link>
            <Link href="#" className="hover:text-navy">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
