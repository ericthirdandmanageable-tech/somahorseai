import type { Metadata } from "next";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Create an Account — Somahorse.ai",
  description: "Join Somahorse.ai to scope your agricultural software projects, connect with certified developers, and build resilient infrastructure.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SignupPage(props: PageProps) {
  const params = await props.searchParams;
  const role = typeof params.role === "string" ? params.role : "client";
  return <SignupForm initialRole={role} />;
}
