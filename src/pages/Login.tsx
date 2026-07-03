import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const msg = await signIn(email, password);
    setSubmitting(false);
    if (msg) {
      setError(msg);
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
        <div>
          <h1 className="text-lg font-bold">Sign in</h1>
          <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mt-1">
            Dashboard access
          </p>
        </div>

        {error && (
          <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-red-500">
            {error}
          </p>
        )}

        <div className="space-y-2">
          <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">
            Email
          </Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">
            Password
          </Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
