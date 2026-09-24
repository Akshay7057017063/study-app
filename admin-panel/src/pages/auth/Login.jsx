
"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  FolderUp,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { loginAdmin } from "../../services/authService";

const features = [
  {
    icon: FolderUp,
    title: "Upload and organize",
    text: "Add notes, papers and videos, and sort them by subject.",
  },
  {
    icon: UserCheck,
    title: "Control access",
    text: "Decide which materials students can see and download.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    text: "Only signed-in admins can change your library.",
  },
];

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setLoading(true);

    try {
      const data = await loginAdmin(
        email.trim(),
        password
      );

      console.log("LOGIN RESPONSE:", data);

      const token = data?.data?.token;
      const admin = data?.data?.admin;

      if (!token || !admin) {
        throw new Error("Invalid login response from server.");
      }

      /*
       * Store JWT
       *
       * We use localStorage because the admin panel
       * needs the token for authenticated API requests.
       */
      localStorage.setItem("studyhub_token", token);

      /*
       * Store admin information
       */
      localStorage.setItem(
        "studyhub_admin",
        JSON.stringify(admin)
      );

      console.log("Login successful");
      console.log("Admin:", admin);

      /*
       * Redirect to dashboard
       */
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login Error:", err);

      setError(
        err.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.12) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(ellipse at 30% 40%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 30% 40%, black 30%, transparent 75%)",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl"
        />

        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <BookOpen size={20} />
          </div>

          <span className="text-lg font-semibold tracking-tight">
            StudyHub
          </span>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Your study library, managed in one place.
          </h1>

          <p className="mt-4 text-base leading-relaxed text-slate-400">
            Sign in to publish materials, keep them organized and see what
            students are using.
          </p>

          <ul className="mt-10 space-y-6">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-blue-400">
                  <Icon size={18} />
                </div>

                <div>
                  <p className="font-medium text-slate-100">
                    {title}
                  </p>

                  <p className="mt-0.5 text-sm text-slate-400">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-slate-500">
          © {new Date().getFullYear()} StudyHub. All rights reserved.
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center bg-slate-50 px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <BookOpen size={20} />
            </div>

            <span className="text-lg font-semibold tracking-tight text-slate-900">
              StudyHub
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">

            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Sign in to your admin account
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Use the email and password for your StudyHub admin panel.
            </p>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0" />

                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
              noValidate
            >

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@studyhub.com"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>

                  <a
                    href="/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-12 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                />

                Keep me signed in on this device
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in

                    <ArrowRight
                      size={18}
                      className="transition group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>

            </form>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Trouble signing in? Contact your StudyHub administrator.
          </p>

        </div>
      </main>
    </div>
  );
}

export default Login;


