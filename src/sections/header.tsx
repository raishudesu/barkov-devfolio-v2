import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  List,
  Envelope,
  GameController,
} from "@phosphor-icons/react";
import { useAuth } from "@/contexts/auth-context";
import type { Profile } from "@/lib/types";

const NAV_ITEMS = [
  { to: "/", label: "home" },
  { to: "/projects", label: "projects" },
  { to: "/blog", label: "blog" },
  { to: "/gallery", label: "gallery" },
  { to: "/game", label: "game" },
];

function NavLink({ to, label }: { to: string; label: string }) {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 py-1.5 text-sm transition-colors ${
        isActive ? "text-foreground" : "text-gray-400 hover:text-foreground"
      }`}
    >
      {isActive && <span className="text-[11px]">→</span>}
      {!isActive && <span className="text-[11px] invisible">→</span>}
      <span className="text-[11px] uppercase tracking-[0.08em]">{label}</span>
    </Link>
  );
}

const Header = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [name, setName] = useState("Barysh Bacaltos");
  const [email, setEmail] = useState("bacaltosbaryshnikov@gmail.com");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.from("profile").select("name, email").eq("id", 1).single().then(({ data }) => {
      if (data) {
        const p = data as Profile;
        setName(p.name);
        setEmail(p.email);
      }
      setLoaded(true);
    });
  }, []);

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-background/90 backdrop-blur-sm border-b border-gray-200 lg:hidden">
        <Link to="/" className="text-sm font-bold">
          {loaded ? name : "Barysh Bacaltos"}
        </Link>
        <div className="flex items-center gap-3">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Open menu">
                <List size={18} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" showCloseButton={false} className="w-64 p-0">
              <div className="flex flex-col gap-6 h-full py-6 px-5">
                <SheetClose asChild>
                  <Link to="/" className="text-sm font-bold">
                    {loaded ? name : "Barysh Bacaltos"}
                  </Link>
                </SheetClose>

                <div className="h-px bg-gray-200" />

                <nav className="flex flex-col gap-1">
                  {NAV_ITEMS.map(({ to, label }) => {
                    const isActive = pathname === to;
                    return (
                      <SheetClose key={to} asChild>
                        <Link
                          to={to}
                          className={`flex items-center gap-2 py-1.5 text-sm transition-colors ${
                            isActive ? "text-foreground" : "text-gray-400 hover:text-foreground"
                          }`}
                        >
                          <span className="text-[11px]">{isActive ? "→" : "\u00A0\u00A0"}</span>
                          <span className="text-[11px] uppercase tracking-[0.08em]">{label}</span>
                        </Link>
                      </SheetClose>
                    );
                  })}
                  {user && (
                    <SheetClose asChild>
                      <Link
                        to="/dashboard"
                        className={`flex items-center gap-2 py-1.5 text-sm transition-colors ${
                          pathname.startsWith("/dashboard") ? "text-foreground" : "text-gray-400 hover:text-foreground"
                        }`}
                      >
                        <span className="text-[11px]">{pathname.startsWith("/dashboard") ? "→" : "\u00A0\u00A0"}</span>
                        <span className="text-[11px] uppercase tracking-[0.08em]">dashboard</span>
                      </Link>
                    </SheetClose>
                  )}
                </nav>

                <div className="h-px bg-gray-200" />

                <div className="flex flex-col gap-3 mt-auto">
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-gray-400 hover:text-foreground transition-colors overflow-hidden"
                    title={email}
                  >
                    <Envelope size={12} className="shrink-0" />
                    <span className="truncate">{email}</span>
                  </a>
                  <div className="flex items-center justify-between">
                    <Link
                      to="/game"
                      className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-gray-400 hover:text-foreground transition-colors"
                    >
                      <GameController size={12} />
                      game
                    </Link>
                    <ModeToggle />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-56 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-background lg:py-8 lg:px-6">
        <div className="flex flex-col gap-6 h-full py-6 px-5">
          <Link to="/" className="text-sm font-bold">
            {loaded ? name : "Barysh Bacaltos"}
          </Link>

          <div className="h-px bg-gray-200" />

          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ to, label }) => (
              <NavLink key={to} to={to} label={label} />
            ))}
            {user && (
              <NavLink to="/dashboard" label="dashboard" />
            )}
          </nav>

          <div className="h-px bg-gray-200" />

          <div className="flex flex-col gap-3 mt-auto">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-gray-400 hover:text-foreground transition-colors overflow-hidden"
              title={email}
            >
              <Envelope size={12} className="shrink-0" />
              <span className="truncate">{email}</span>
            </a>
            <div className="flex items-center justify-between">
              <Link
                to="/game"
                className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-gray-400 hover:text-foreground transition-colors"
              >
                <GameController size={12} />
                game
              </Link>
              <ModeToggle />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Header;
