import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, Code2 } from "lucide-react";

const ROLES = [
  {
    href: "/signup?role=client",
    eyebrow: "I'm a",
    title: "Client",
    body: "Describe your agricultural problem in plain language. Our AI scopes it, prices it, and a certified team builds it.",
    icon: Building2,
    iconWrap: "bg-client-tint text-client",
    ring: "hover:border-client/40 hover:shadow-[0_24px_60px_-30px_hsl(160_84%_30%/0.45)]",
    cta: "text-client",
    bar: "from-client to-client-bright",
  },
  {
    href: "/signup?role=developer",
    eyebrow: "I'm a",
    title: "Developer",
    body: "Join a vetted network of African engineers. Get matched with funded projects and earn milestone-based payouts.",
    icon: Code2,
    iconWrap: "bg-talent-tint text-talent",
    ring: "hover:border-talent/40 hover:shadow-[0_24px_60px_-30px_hsl(224_82%_56%/0.45)]",
    cta: "text-talent",
    bar: "from-talent to-talent-bright",
  },
] as const;

export function RoleSelect() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background hero-field dotted-grid">
      <div className="pointer-events-none absolute -top-40 left-1/4 size-[520px] rounded-full bg-client-bright/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 size-[520px] rounded-full bg-talent/10 blur-[140px]" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <Image
            src="/somahorse-logo.png"
            alt="Somahorse.ai"
            width={34}
            height={34}
            className="size-8 rounded-full object-contain"
            priority
          />
          <span className="font-display text-base font-bold text-navy">
            Somahorse<span className="text-blue-vivid">.ai</span>
          </span>
        </Link>
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-navy-mid shadow-soft backdrop-blur-md transition hover:bg-white font-ui"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to site
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12">
        <span className="cue text-navy-mid">Create your account</span>
        <h1 className="mt-3 text-center font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl">
          Welcome to <span className="text-gradient">Somahorse.ai</span>
        </h1>
        <p className="mt-3 max-w-md text-center text-sm italic text-muted-foreground sm:text-base">
          First things first — which side of the platform are you on?
        </p>

        <div className="mt-10 grid w-full max-w-2xl gap-5 sm:grid-cols-2">
          {ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <Link
                key={role.title}
                href={role.href}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-white/80 p-6 shadow-card backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 sm:p-7 ${role.ring}`}
              >
                <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${role.bar}`} />
                <span className={`mb-6 grid size-11 place-items-center rounded-full ${role.iconWrap}`}>
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="cue text-muted-foreground/70">{role.eyebrow}</span>
                <span className="mt-1 font-display text-2xl font-bold text-navy">
                  {role.title}
                </span>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {role.body}
                </p>
                <span className={`mt-6 inline-flex items-center gap-1.5 text-sm font-bold font-ui ${role.cta}`}>
                  Continue
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-8 text-sm text-muted-foreground font-ui">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-blue-vivid hover:underline">
            Sign in
          </Link>
        </p>
      </main>
    </div>
  );
}
