import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { TrashSimple, Envelope } from "@phosphor-icons/react";
import { ConfirmDelete } from "@/components/confirm-delete";
import DOMPurify from "dompurify";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export default function InquiriesManager() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);

  useEffect(() => {
    supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setInquiries(data);
        setLoading(false);
      });
  }, []);

  const deleteInquiry = async () => {
    if (!deleteTarget) return;
    await supabase.from("inquiries").delete().eq("id", deleteTarget.id);
    setInquiries((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div>
      <h1 className="text-lg font-bold mb-6">Inquiries</h1>

      {loading ? (
        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Loading...</p>
      ) : inquiries.length === 0 ? (
        <p className="text-sm text-gray-500">No inquiries yet.</p>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div key={inq.id} className="border rounded-lg overflow-hidden">
              <div
                onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded(expanded === inq.id ? null : inq.id); }}
                className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{inq.name}</p>
                  <p className="text-[11px] font-mono text-gray-400">
                    {inq.email} &middot; {new Date(inq.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${inq.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-foreground"
                  >
                    <Envelope size={16} />
                  </a>
                  <Button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(inq); }}
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                  >
                    <TrashSimple size={16} />
                  </Button>
                </div>
              </div>
              {expanded === inq.id && (
                <div className="px-4 pb-4 pt-1 border-t border-gray-100 dark:border-gray-800">
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(inq.message) }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDelete
        open={!!deleteTarget}
        onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}
        onConfirm={deleteInquiry}
        title="Delete inquiry"
        description={`Delete inquiry from ${deleteTarget?.name}? This action cannot be undone.`}
      />
    </div>
  );
}
