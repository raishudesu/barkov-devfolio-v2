import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PencilSimple, TrashSimple, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDelete } from "@/components/confirm-delete";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Social {
  id: number;
  name: string;
  url: string;
  icon_name: string;
  sort_order: number;
}

const ICON_OPTIONS = [
  { label: "GithubLogo", value: "GithubLogo" },
  { label: "LinkedinLogo", value: "LinkedinLogo" },
  { label: "Other", value: "Link" },
];

const emptyForm = {
  name: "",
  url: "",
  icon_name: "GithubLogo",
  sort_order: 0,
};

export default function SocialsManager() {
  const [items, setItems] = useState<Social[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Social | null>(null);
  const [editing, setEditing] = useState<Social | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [profileEmail, setProfileEmail] = useState("");

  const fetchItems = async () => {
    const { data } = await supabase
      .from("socials")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  const fetchProfileEmail = async () => {
    const { data } = await supabase
      .from("profile")
      .select("email")
      .eq("id", 1)
      .single();
    if (data) setProfileEmail(data.email);
  };

  useEffect(() => {
    fetchItems();
    fetchProfileEmail();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const openNew = () => {
    setForm({ ...emptyForm, sort_order: items.length + 1 });
    setEditing({} as Social);
  };

  const openEdit = (item: Social) => {
    setEditing(item);
    setForm({ name: item.name, url: item.url, icon_name: item.icon_name, sort_order: item.sort_order });
  };

  const save = async () => {
    const payload = { name: form.name, url: form.url, icon_name: form.icon_name, sort_order: form.sort_order };

    if (editing?.id) {
      await supabase.from("socials").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("socials").insert(payload);
    }
    resetForm();
    fetchItems();
    toast.success(editing?.id ? "Social link updated" : "Social link added");
  };

  const saveProfileEmail = async () => {
    const { error } = await supabase
      .from("profile")
      .update({ email: profileEmail })
      .eq("id", 1);
    if (error) {
      toast.error("Failed to save email");
    } else {
      toast.success("Email saved");
    }
  };

  const deleteItem = async () => {
    if (!deleteTarget) return;
    await supabase.from("socials").delete().eq("id", deleteTarget.id);
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success("Social link deleted");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold">Socials</h1>
        <Button onClick={openNew} className="text-[11px] font-mono uppercase tracking-[0.1em]">
          <Plus size={14} className="mr-1" /> Add social
        </Button>
      </div>

      {/* Profile email editor */}
      <div className="border rounded-lg px-4 py-3 mb-4">
        <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mb-2 block">Contact email</Label>
        <p className="text-[11px] font-mono text-gray-500 mb-2">
          Displayed in the side nav and socials section
        </p>
        <div className="flex items-center gap-2">
          <Input
            type="email"
            value={profileEmail}
            onChange={(e) => setProfileEmail(e.target.value)}
            className="flex-1"
            placeholder="your@email.com"
          />
          <Button
            onClick={saveProfileEmail}
            variant="outline"
            className="text-[11px] font-mono uppercase tracking-[0.1em] shrink-0"
          >
            Save
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500">No social links yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border rounded-lg px-4 py-3">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-[11px] font-mono text-gray-400">{item.url}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => openEdit(item)} variant="ghost" size="icon">
                  <PencilSimple size={16} />
                </Button>
                <Button onClick={() => setDeleteTarget(item)} variant="ghost" size="icon" className="text-red-500">
                  <TrashSimple size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => { if (!o) resetForm(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">
              {editing?.id ? "Edit social link" : "Add social link"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Name</Label>
              <Input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">URL</Label>
              <Input type="text" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Icon</Label>
              <select
                value={form.icon_name}
                onChange={(e) => setForm({ ...form, icon_name: e.target.value })}
                className="h-8 w-full rounded-none border border-input bg-transparent px-2.5 py-1 text-xs"
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={resetForm} variant="outline" className="text-[11px] font-mono uppercase tracking-[0.1em]">Cancel</Button>
              <Button onClick={save} className="text-[11px] font-mono uppercase tracking-[0.1em]">Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDelete
        open={!!deleteTarget}
        onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}
        onConfirm={deleteItem}
        title="Delete social link"
        description={`Delete "${deleteTarget?.name}"?`}
      />
    </div>
  );
}
