import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { DotsSixVertical, PencilSimple, TrashSimple, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ImageUpload";
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

interface Project {
  id: number;
  title: string;
  description: string;
  link: string;
  tech_stack: string[];
  image_url: string | null;
  sort_order: number;
}

const emptyProject = {
  title: "",
  description: "",
  link: "",
  tech_stack: [] as string[],
  image_url: "",
  sort_order: 0,
};

function SortableProject({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: (p: Project) => void;
  onDelete: (p: Project) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
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
        {project.image_url && (
          <img src={project.image_url} alt="" className="size-8 rounded object-cover border shrink-0" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium">{project.title}</p>
          <p className="text-[11px] font-mono text-gray-400 truncate max-w-xs">{project.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button onClick={() => onEdit(project)} variant="ghost" size="icon">
          <PencilSimple size={16} />
        </Button>
        <Button onClick={() => onDelete(project)} variant="ghost" size="icon" className="text-red-500">
          <TrashSimple size={16} />
        </Button>
      </div>
    </div>
  );
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [editing, setEditing] = useState<Project | null>(null);
  const [editForm, setEditForm] = useState(emptyProject);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setProjects(data);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const persistOrder = useCallback(async (ordered: Project[]) => {
    await Promise.all(
      ordered.map((item, i) =>
        supabase.from("projects").update({ sort_order: i }).eq("id", item.id)
      )
    );
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setProjects((prev) => {
      const oldIndex = prev.findIndex((p) => p.id === active.id);
      const newIndex = prev.findIndex((p) => p.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      persistOrder(reordered);
      return reordered;
    });
  }, [persistOrder]);

  const resetForm = () => {
    setEditing(null);
    setEditForm(emptyProject);
  };

  const openNew = () => {
    setEditForm({ ...emptyProject, sort_order: projects.length + 1 });
    setEditing({} as Project);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setEditForm({
      title: project.title,
      description: project.description,
      link: project.link,
      tech_stack: project.tech_stack,
      image_url: project.image_url ?? "",
      sort_order: project.sort_order,
    });
  };

  const save = async () => {
    const payload = {
      title: editForm.title,
      description: editForm.description,
      link: editForm.link,
      tech_stack: editForm.tech_stack,
      image_url: editForm.image_url || null,
      sort_order: editForm.sort_order,
    };

    if (editing?.id) {
      await supabase.from("projects").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("projects").insert(payload);
    }
    resetForm();
    fetchProjects();
    toast.success(editing?.id ? "Project updated" : "Project added");
  };

  const deleteItem = async () => {
    if (!deleteTarget) return;
    await supabase.from("projects").delete().eq("id", deleteTarget.id);
    setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success("Project deleted");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold">Projects</h1>
        <Button onClick={openNew} className="text-[11px] font-mono uppercase tracking-[0.1em]">
          <Plus size={14} className="mr-1" /> New project
        </Button>
      </div>

      {loading ? (
        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-gray-500">No projects yet.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {projects.map((project) => (
                <SortableProject
                  key={project.id}
                  project={project}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => { if (!o) resetForm(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">
              {editing?.id ? "Edit project" : "New project"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Title</Label>
              <Input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Description</Label>
              <Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Link</Label>
              <Input type="text" value={editForm.link} onChange={(e) => setEditForm({ ...editForm, link: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">
                Tech stack (comma separated)
              </Label>
              <Input
                type="text"
                value={editForm.tech_stack.join(", ")}
                onChange={(e) => setEditForm({ ...editForm, tech_stack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Image</Label>
              <ImageUpload bucket="project-images" onUpload={(url) => setEditForm({ ...editForm, image_url: url })} currentImage={editForm.image_url} />
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
        title="Delete project"
        description={`Delete "${deleteTarget?.title}"?`}
      />
    </div>
  );
}
