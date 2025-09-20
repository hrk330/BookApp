"use client";
export const dynamic = "force-dynamic";
import { FormEvent, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { toast } from "@/lib/toast";

export default function SignInPage() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        action: mode,
        name: mode === "signup" ? name : undefined,
      });
      if (!res || res.error) {
        throw new Error(res?.error || "Authentication failed");
      }

      if (mode === "signup") {
        toast.success("Account created successfully! Welcome!");
      } else {
        toast.success("Signed in successfully!");
      }

      // Force session re-fetch and reload to ensure client gets updated session
      await getSession();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      const errorMessage = err.message || "Authentication failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {mode === "signin" ? "Sign In" : "Create Account"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={mode === "signup"}
                placeholder="Your Name"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 transition-colors font-medium disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "signin"
              ? "Sign In"
              : "Sign Up"}
          </button>
        </form>
        <div className="my-6 text-center text-sm text-gray-600">or</div>
        <button
          onClick={() => {
            toast.info("Redirecting to Google...");
            signIn("google");
          }}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors font-medium"
        >
          Continue with Google
        </button>
        <p className="mt-6 text-sm text-center">
          {mode === "signin" ? (
            <>
              New here?{" "}
              <button
                className="text-blue-600 hover:underline font-medium"
                onClick={() => setMode("signup")}
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-blue-600 hover:underline font-medium"
                onClick={() => setMode("signin")}
              >
                Sign in
              </button>
            </>
          )}
        </p>
        <p className="mt-4 text-xs text-gray-500 text-center">
          Back to{" "}
          <Link href="/" className="underline hover:text-gray-700">
            home
          </Link>
        </p>
      </main>
    </>
  );
}
