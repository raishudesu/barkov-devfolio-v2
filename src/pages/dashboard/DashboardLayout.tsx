import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { List } from "@phosphor-icons/react";

const navItems = [
  { to: "/dashboard", label: "Overview" },
  { to: "/dashboard/profile", label: "Profile" },
  { to: "/dashboard/tech-stack", label: "Tech Stack" },
  { to: "/dashboard/projects", label: "Projects" },
  { to: "/dashboard/experience", label: "Experience" },
  { to: "/dashboard/socials", label: "Socials" },
  { to: "/dashboard/blogs", label: "Blogs" },
  { to: "/dashboard/gallery", label: "Gallery" },
  { to: "/dashboard/inquiries", label: "Inquiries" },
];

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const { signOut } = useAuth();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-[60vh] gap-6">
      <aside className="lg:w-48 shrink-0">
        {/* Mobile nav — collapsible accordion */}
        <Accordion
          type="single"
          collapsible
          value={navOpen ? "nav" : ""}
          onValueChange={(v) => setNavOpen(v === "nav")}
          className="lg:hidden"
        >
          <AccordionItem value="nav" className="border-none">
            <AccordionTrigger className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.1em] px-3 py-2">
              <List size={14} />
              Navigation
            </AccordionTrigger>
            <AccordionContent>
              <nav className="space-y-1 pt-2">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setNavOpen(false)}
                    className={`block text-[11px] font-mono uppercase tracking-[0.1em] px-3 py-2 rounded ${
                      pathname === item.to
                        ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-foreground"
                        : "text-gray-400 hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <hr className="my-3 border-gray-200 dark:border-gray-800" />
                <Link
                  to="/"
                  onClick={() => setNavOpen(false)}
                  className="block text-[11px] font-mono uppercase tracking-[0.1em] px-3 py-2 rounded text-gray-400 hover:text-foreground"
                >
                  Back to site
                </Link>
                <Button
                  onClick={() => { signOut(); setNavOpen(false); }}
                  variant="ghost"
                  className="w-full justify-start text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 hover:text-foreground px-3"
                >
                  Sign out
                </Button>
              </nav>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Desktop nav — always visible */}
        <nav className="hidden lg:block space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`block text-[11px] font-mono uppercase tracking-[0.1em] px-3 py-2 rounded ${
                pathname === item.to
                  ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-foreground"
                  : "text-gray-400 hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <hr className="my-3 border-gray-200 dark:border-gray-800" />
          <Link
            to="/"
            className="block text-[11px] font-mono uppercase tracking-[0.1em] px-3 py-2 rounded text-gray-400 hover:text-foreground"
          >
            Back to site
          </Link>
          <Button
            onClick={signOut}
            variant="ghost"
            className="w-full justify-start text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 hover:text-foreground px-3"
          >
            Sign out
          </Button>
        </nav>
      </aside>
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
