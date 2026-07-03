import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/rich-text-editor";
import { supabase } from "@/lib/supabase";
import { ChatsCircle } from "@phosphor-icons/react";

export function InquiryForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSending(true);
    setError(null);

    const { error: err } = await supabase.from("inquiries").insert({
      name,
      email,
      message,
    });

    setSending(false);
    if (err) {
      setError(err.message);
    } else {
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSent(false);
    setError(null);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-foreground text-background px-4 py-3 rounded-full shadow-lg hover:opacity-90 transition-opacity"
        aria-label="Send inquiry"
      >
        <ChatsCircle size={18} />
        <span className="text-[11px] font-mono uppercase tracking-[0.08em]">Message</span>
      </button>

      <Sheet open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
        <SheetContent side="right" className="w-full sm:max-w-md p-6 flex flex-col">
          <SheetTitle className="text-sm font-bold">Send a message</SheetTitle>
          <SheetDescription className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">
            I'll get back to you as soon as possible
          </SheetDescription>

          {sent ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <p className="text-sm">Message sent successfully!</p>
              <Button onClick={handleClose} variant="outline" className="text-[11px] font-mono uppercase tracking-[0.1em]">
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 mt-6 min-h-0">
              <div className="space-y-2">
                <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Name</Label>
                <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2 flex-1 flex flex-col min-h-0">
                <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Message</Label>
                <div className="flex-1 overflow-auto">
                  <RichTextEditor content={message} onChange={setMessage} />
                </div>
              </div>

              {error && (
                <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-red-500">{error}</p>
              )}

              <Button type="submit" disabled={sending} className="text-[11px] font-mono uppercase tracking-[0.1em]">
                {sending ? "Sending..." : "Send message"}
              </Button>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
