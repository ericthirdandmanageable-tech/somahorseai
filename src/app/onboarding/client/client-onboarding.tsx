"use client";

import { useState, useTransition } from "react";
import { Sparkles } from "lucide-react";

import type { ClientOnboarding } from "@/lib/auth/types";
import {
  CLIENT_BUDGETS,
  CLIENT_PROJECT_TYPES,
  CLIENT_SECTORS,
  CLIENT_TIMELINES,
} from "@/lib/onboarding/options";
import {
  OnboardingCard,
  OnboardingShell,
  OptionGrid,
  StepHeading,
  StepNav,
  StepProgress,
} from "@/components/onboarding/onboarding-ui";

import { saveClientProgress, submitClientOnboarding } from "./actions";

const STEPS = ["Sector", "Build", "Timeline", "Details", "Budget"];

interface FormState {
  sector: string | null;
  project_type: string | null;
  timeline: string | null;
  company_name: string;
  problem: string;
  budget_range: string | null;
}

export function ClientOnboarding({
  initial,
  firstName,
}: {
  initial: ClientOnboarding;
  firstName: string | null;
}) {
  const [step, setStep] = useState(
    Math.min(initial.current_step ?? 0, STEPS.length - 1)
  );
  const [form, setForm] = useState<FormState>({
    sector: initial.sector,
    project_type: initial.project_type,
    timeline: initial.timeline,
    company_name: initial.company_name ?? "",
    problem: initial.problem ?? "",
    budget_range: initial.budget_range,
  });
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const payload = (nextStep: number) => ({
    current_step: nextStep,
    sector: form.sector,
    project_type: form.project_type,
    timeline: form.timeline,
    company_name: form.company_name || null,
    problem: form.problem || null,
    budget_range: form.budget_range,
  });

  const goTo = (nextStep: number, persist: boolean) => {
    setError("");
    setStep(nextStep);
    if (persist) {
      startTransition(async () => {
        try {
          await saveClientProgress(payload(nextStep));
        } catch (e) {
          setError(e instanceof Error ? e.message : "Could not save progress.");
        }
      });
    }
  };

  const finish = () => {
    setError("");
    startTransition(async () => {
      try {
        await submitClientOnboarding(payload(STEPS.length - 1));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not finish onboarding.");
      }
    });
  };

  const canAdvance = (() => {
    switch (step) {
      case 0:
        return Boolean(form.sector);
      case 1:
        return Boolean(form.project_type);
      case 2:
        return Boolean(form.timeline);
      case 3:
        return true;
      case 4:
        return Boolean(form.budget_range);
      default:
        return false;
    }
  })();

  return (
    <OnboardingShell eyebrow="Client onboarding" accent="teal">
      <StepProgress steps={STEPS} current={step} />
      <OnboardingCard>
        {error ? (
          <div className="mb-5 rounded-xl border border-accent-amber/20 bg-accent-amber/10 p-3 text-center text-xs font-medium text-accent-amber">
            {error}
          </div>
        ) : null}

        {step === 0 ? (
          <>
            <StepHeading
              title={`Welcome${firstName ? `, ${firstName}` : ""}`}
              subtitle="Which sector are you building for? This helps our Intake Agent scope the right solution."
            />
            <OptionGrid
              options={CLIENT_SECTORS}
              value={form.sector}
              onSelect={(value) => setForm((f) => ({ ...f, sector: value }))}
            />
          </>
        ) : null}

        {step === 1 ? (
          <>
            <StepHeading
              title="What do you want to build?"
              subtitle="Pick the closest fit — our AI refines the exact scope with you later."
            />
            <OptionGrid
              options={CLIENT_PROJECT_TYPES}
              value={form.project_type}
              onSelect={(value) => setForm((f) => ({ ...f, project_type: value }))}
            />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <StepHeading
              title="When do you need it?"
              subtitle="A rough timeline is fine. It guides how we assemble your team."
            />
            <OptionGrid
              options={CLIENT_TIMELINES}
              value={form.timeline}
              onSelect={(value) => setForm((f) => ({ ...f, timeline: value }))}
            />
          </>
        ) : null}

        {step === 3 ? (
          <>
            <StepHeading
              title="Tell us a little more"
              subtitle="Optional — but it gives our Intake Agent a head start."
            />
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="company_name"
                  className="font-display text-xs font-bold uppercase tracking-wide text-navy-mid/80"
                >
                  Company name
                </label>
                <input
                  id="company_name"
                  value={form.company_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, company_name: e.target.value }))
                  }
                  placeholder="e.g. Kalahari Fresh Produce"
                  className="w-full min-h-11 rounded-xl border border-border-strong bg-white/50 px-4 text-sm text-navy placeholder-muted-foreground/50 transition focus:border-blue-vivid focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-vivid/10"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="problem"
                  className="font-display text-xs font-bold uppercase tracking-wide text-navy-mid/80"
                >
                  Describe the problem
                </label>
                <textarea
                  id="problem"
                  value={form.problem}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, problem: e.target.value }))
                  }
                  rows={4}
                  placeholder="In plain language — the same way you'd explain it to a colleague."
                  className="w-full rounded-xl border border-border-strong bg-white/50 px-4 py-3 text-sm text-navy placeholder-muted-foreground/50 transition focus:border-blue-vivid focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-vivid/10"
                />
              </div>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <StepHeading
              title="What's your budget?"
              subtitle="A range is all we need. Our AI prices the exact scope and guarantees a fixed quote."
            />
            <OptionGrid
              options={CLIENT_BUDGETS}
              value={form.budget_range}
              onSelect={(value) => setForm((f) => ({ ...f, budget_range: value }))}
            />
            <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-blue-vivid/15 bg-blue-light/40 p-4 text-xs text-navy-mid">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-blue-vivid" />
              <p>
                Once you finish, our Intake Agent reviews your answers and prepares
                a scoped, costed plan in your dashboard.
              </p>
            </div>
          </>
        ) : null}

        <StepNav
          showBack={step > 0}
          onBack={() => goTo(step - 1, false)}
          onNext={() =>
            step === STEPS.length - 1 ? finish() : goTo(step + 1, true)
          }
          nextLabel={step === STEPS.length - 1 ? "Finish & go to dashboard" : "Continue"}
          nextDisabled={!canAdvance}
          loading={pending}
        />
      </OnboardingCard>
    </OnboardingShell>
  );
}
