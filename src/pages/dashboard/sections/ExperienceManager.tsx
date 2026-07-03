import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { DotsSixVertical, PencilSimple, TrashSimple, Plus } from "@phosphor-icons/react";
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
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Experience {
  id: number;
  title: string;
  company: string;
  is_current: boolean;
  date_start: string;
  date_end: string | null;
  sort_order: number;
}

const emptyForm = {
  title: "",
  company: "",
  is_current: false,
  date_start: "",
  date_end: "",
  sort_order: 0,
};

function SortableExperience({
  item,
  onEdit,
  onDelete,
}: {
  item: Experience;
  onEdit: (e: Experience) => void;
  onDelete: (e: Experience) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    position: (isDragging ? "relative" : undefined) as React.CSSProperties["position"],
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between border rounded-lg px-4 py-3 bg-card"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          {...attributes}
          {...listeners}
          className="text-gray-400 hover:text-foreground cursor-grab active:cursor-grabbing shrink-0"
          aria-label="Drag to reorder"
        >
          <DotsSixVertical size={16} />
        </button>
        <div className="min-w-0">
          <p className="text-sm font-medium">{item.title}</p>
          <p className="text-[11px] font-mono text-gray-400">
            {item.company} &middot; {item.date_start} — {item.date_end ?? "Present"}
            {item.is_current && " (Current)"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button onClick={() => onEdit(item)} variant="ghost" size="icon">
          <PencilSimple size={16} />
        </Button>
        <Button onClick={() => onDelete(item)} variant="ghost" size="icon" className="text-red-500">
          <TrashSimple size={16} />
        </Button>
      </div>
    </div>
  );
}

export default function ExperienceManager() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState(emptyForm);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const fetchItems = async () => {
    const { data } = await supabase
      .from("experience")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const persistOrder = useCallback(async (ordered: Experience[]) => {
    await Promise.all(
      ordered.map((item, i) =>
        supabase.from("experience").update({ sort_order: i }).eq("id", item.id)
      )
    );
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((p) => p.id === active.id);
      const newIndex = prev.findIndex((p) => p.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      persistOrder(reordered);
      return reordered;
    });
  }, [persistOrder]);

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const openNew = () => {
    setForm({ ...emptyForm, sort_order: items.length + 1 });
    setEditing({} as Experience);
  };

  const openEdit = (item: Experience) => {
    setEditing(item);
    setForm({
      title: item.title,
      company: item.company,
      is_current: item.is_current,
      date_start: item.date_start,
      date_end: item.date_end ?? "",
      sort_order: item.sort_order,
    });
  };

  const save = async () => {
    const payload = {
      title: form.title,
      company: form.company,
      is_current: form.is_current,
      date_start: form.date_start,
      date_end: form.date_end || null,
      sort_order: form.sort_order,
    };

    if (editing?.id) {
      await supabase.from("experience").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("experience").insert(payload);
    }
    resetForm();
    fetchItems();
    toast.success(editing?.id ? "Experience updated" : "Experience added");
  };

  const deleteItem = async () => {
    if (!deleteTarget) return;
    await supabase.from("experience").delete().eq("id", deleteTarget.id);
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success("Experience deleted");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold">Experience</h1>
        <Button onClick={openNew} className="text-[11px] font-mono uppercase tracking-[0.1em]">
          <Plus size={14} className="mr-1" /> Add entry
        </Button>
      </div>

      {loading ? (
        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500">No experience entries yet.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map((item) => (
                <SortableExperience
                  key={item.id}
                  item={item}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => { if (!o) resetForm(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">
              {editing?.id ? "Edit experience" : "Add experience"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Title / Position</Label>
              <Input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Company</Label>
              <Input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Start date</Label>
              <Input type="text" value={form.date_start} onChange={(e) => setForm({ ...form, date_start: e.target.value })} placeholder="2025" />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">End date (leave empty for Present)</Label>
              <Input type="text" value={form.date_end} onChange={(e) => setForm({ ...form, date_end: e.target.value })} placeholder="2025" />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_current}
                onChange={(e) => setForm({ ...form, is_current: e.target.checked })}
                className="rounded"
              />
              <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Current position</span>
            </label>
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
        title="Delete experience"
        description={`Delete "${deleteTarget?.title}"?`}
      />
    </div>
  );
}
