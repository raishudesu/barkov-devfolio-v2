import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PencilSimple, TrashSimple, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDelete } from "@/components/confirm-delete";
import { toast } from "sonner";

interface TechItem {
  id: number;
  category: string;
  name: string;
  sort_order: number;
}

const CATEGORIES = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "developer_tools", label: "Developer Tools" },
];

export default function TechStackManager() {
  const [items, setItems] = useState<TechItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<TechItem | null>(null);
  const [editing, setEditing] = useState<{ name: string; category: string } | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("frontend");
  const [showAdd, setShowAdd] = useState(false);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("tech_stack")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const addItem = async () => {
    if (!newName.trim()) return;
    const maxOrder = items
      .filter((i) => i.category === newCategory)
      .reduce((max, i) => Math.max(max, i.sort_order), 0);
    await supabase.from("tech_stack").insert({
      category: newCategory,
      name: newName.trim(),
      sort_order: maxOrder + 1,
    });
    setNewName("");
    setShowAdd(false);
    fetchItems();
    toast.success("Item added");
  };

  const openEdit = (item: TechItem) => {
    setEditId(item.id);
    setEditing({ name: item.name, category: item.category });
  };

  const saveEdit = async () => {
    if (!editing || editId === null) return;
    await supabase.from("tech_stack").update(editing).eq("id", editId);
    setEditId(null);
    setEditing(null);
    fetchItems();
    toast.success("Item updated");
  };

  const deleteItem = async () => {
    if (!deleteTarget) return;
    await supabase.from("tech_stack").delete().eq("id", deleteTarget.id);
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success("Item deleted");
  };

  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    items: items.filter((i) => i.category === cat.value),
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold">Tech Stack</h1>
        <Button onClick={() => setShowAdd(true)} className="text-[11px] font-mono uppercase tracking-[0.1em]">
          <Plus size={14} className="mr-1" /> Add item
        </Button>
      </div>

      {showAdd && (
        <div className="border rounded-lg p-4 mb-6 space-y-3 max-w-md">
          <div className="space-y-2">
            <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Name</Label>
            <Input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Category</Label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="h-8 w-full rounded-none border border-input bg-transparent px-2.5 py-1 text-xs"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button onClick={addItem} className="text-[11px] font-mono uppercase tracking-[0.1em]">Add</Button>
            <Button onClick={() => setShowAdd(false)} variant="outline" className="text-[11px] font-mono uppercase tracking-[0.1em]">Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Loading...</p>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ label, items: catItems }) => (
            <div key={label}>
              <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mb-2">{label}</p>
              <div className="flex flex-wrap gap-2">
                {catItems.map((item) => (
                  <div key={item.id} className="group flex items-center gap-1 px-2.5 py-1 border rounded-full text-[11px] uppercase tracking-[0.08em] text-gray-500">
                    {editId === item.id ? (
                      <>
                        <Input
                          type="text"
                          value={editing?.name ?? ""}
                          onChange={(e) => setEditing((prev) => prev ? { ...prev, name: e.target.value } : null)}
                          className="h-6 w-28 text-[11px]"
                        />
                        <Button size="xs" onClick={saveEdit}>Save</Button>
                        <Button size="xs" variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        {item.name}
                        <button onClick={() => openEdit(item)} className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-gray-400 hover:text-foreground">
                          <PencilSimple size={10} />
                        </button>
                        <button onClick={() => setDeleteTarget(item)} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500">
                          <TrashSimple size={10} />
                        </button>
                      </>
                    )}
                  </div>
                ))}
                {catItems.length === 0 && (
                  <p className="text-xs text-gray-400">No items</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDelete
        open={!!deleteTarget}
        onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}
        onConfirm={deleteItem}
        title="Delete tech stack item"
        description={`Delete "${deleteTarget?.name}"?`}
      />
    </div>
  );
}
