import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { ImageUpload } from "@/components/ImageUpload";
import { DotsSixVertical, PencilSimple, TrashSimple } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ConfirmDelete } from "@/components/confirm-delete";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  description: string | null;
  created_at: string;
  sort_order: number;
}

function SortableGalleryItem({
  item,
  onEdit,
  onDelete,
}: {
  item: GalleryItem;
  onEdit: (g: GalleryItem) => void;
  onDelete: (g: GalleryItem) => void;
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
    <div ref={setNodeRef} style={style} className="relative group border rounded-lg overflow-hidden">
      <img src={item.image_url} alt={item.caption ?? ""} className="w-full h-40 object-cover" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
        <button
          {...attributes}
          {...listeners}
          className="text-white hover:text-gray-200 cursor-grab active:cursor-grabbing transition-colors"
          aria-label="Drag to reorder"
        >
          <DotsSixVertical size={20} weight="bold" />
        </button>
        <Button
          onClick={() => onEdit(item)}
          variant="ghost"
          size="icon"
          className="bg-white text-gray-700 hover:bg-white rounded-full"
        >
          <PencilSimple size={16} />
        </Button>
        <Button
          onClick={() => onDelete(item)}
          variant="ghost"
          size="icon"
          className="bg-white text-red-500 hover:bg-white rounded-full"
        >
          <TrashSimple size={16} />
        </Button>
      </div>
      {item.caption && (
        <p className="text-[11px] font-mono px-2 py-1 text-gray-500 truncate">{item.caption}</p>
      )}
    </div>
  );
}

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const fetchItems = async () => {
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const persistOrder = useCallback(async (ordered: GalleryItem[]) => {
    await Promise.all(
      ordered.map((item, i) =>
        supabase.from("gallery").update({ sort_order: i }).eq("id", item.id)
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

  const addItem = async () => {
    if (!imageUrl) return;
    const maxOrder = items.reduce((max, i) => Math.max(max, i.sort_order), -1);
    await supabase.from("gallery").insert({
      image_url: imageUrl,
      caption: caption || null,
      description: description || null,
      sort_order: maxOrder + 1,
    });
    setImageUrl(null);
    setCaption("");
    setDescription("");
    fetchItems();
  };

  const deleteItem = async () => {
    if (!deleteTarget) return;
    await supabase.from("gallery").delete().eq("id", deleteTarget.id);
    const path = deleteTarget.image_url.split("/").pop();
    if (path) await supabase.storage.from("gallery-images").remove([path]);
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const openEdit = (item: GalleryItem) => {
    setEditing(item);
    setEditCaption(item.caption ?? "");
    setEditDescription(item.description ?? "");
  };

  const saveEdit = async () => {
    if (!editing) return;
    await supabase
      .from("gallery")
      .update({ caption: editCaption || null, description: editDescription || null })
      .eq("id", editing.id);
    setEditing(null);
    fetchItems();
  };

  return (
    <div>
      <h1 className="text-lg font-bold mb-6">Gallery</h1>

      <div className="border rounded-lg p-4 mb-8 space-y-4 max-w-md">
        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Add new image</p>
        <ImageUpload bucket="gallery-images" onUpload={setImageUrl} currentImage={imageUrl} />
        {imageUrl && (
          <>
            <div className="space-y-2">
              <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Caption (optional)</Label>
              <Input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Description (optional)</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <Button onClick={addItem} className="text-[11px] font-mono uppercase tracking-[0.1em]">
              Add to gallery
            </Button>
          </>
        )}
      </div>

      {loading ? (
        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500">No images yet.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {items.map((item) => (
                <SortableGalleryItem
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

      <ConfirmDelete
        open={!!deleteTarget}
        onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}
        onConfirm={deleteItem}
        title="Delete image"
        description={`Delete this image${deleteTarget?.caption ? ` (${deleteTarget.caption})` : ""}? This action cannot be undone.`}
      />

      <Dialog open={!!editing} onOpenChange={(o) => { if (!o) setEditing(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Edit image</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="w-full aspect-video rounded-lg overflow-hidden border bg-gray-100 dark:bg-gray-800">
                <img src={editing.image_url} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Caption</Label>
                <Input type="text" value={editCaption} onChange={(e) => setEditCaption(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Description</Label>
                <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2">
                <Button onClick={() => setEditing(null)} variant="outline" className="text-[11px] font-mono uppercase tracking-[0.1em]">
                  Cancel
                </Button>
                <Button onClick={saveEdit} className="text-[11px] font-mono uppercase tracking-[0.1em]">
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
