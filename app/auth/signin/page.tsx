"use client";
export const dynamic = "force-dynamic";

import { Suspense, FormEvent, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { toast } from "@/lib/toast";

function SignInPage() {
  const params = useSearchParams();
  const router = useRouter();
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

      // Redirect to home page after successful login/signup
      setTimeout(() => {
        router.push("/");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100">
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-2 py-8">
        <div className="w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 bg-white/80 backdrop-blur-md p-8">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-lg mb-6 text-center">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Name
                </label>
                <input
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={mode === "signup"}
                  placeholder="Your Name"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
              />
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-700 to-purple-600 px-4 py-2.5 text-white font-bold shadow-lg hover:scale-105 hover:from-blue-800 hover:to-purple-700 transition-all duration-200 disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : mode === "signin"
                ? "Sign In"
                : "Sign Up"}
            </button>
          </form>
          <div className="my-6 text-center text-sm text-gray-600 font-medium">
            or
          </div>

          <p className="mt-7 text-sm text-center">
            {mode === "signin" ? (
              <>
                New here?{" "}
                <button
                  className="text-blue-600 hover:underline font-semibold"
                  onClick={() => setMode("signup")}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  className="text-blue-600 hover:underline font-semibold"
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
        </div>
      </main>
    </div>
  );
}

export default function SignInPageWrapper() {
  return (
    <Suspense fallback={null}>
      <SignInPage />
    </Suspense>
  );
}
