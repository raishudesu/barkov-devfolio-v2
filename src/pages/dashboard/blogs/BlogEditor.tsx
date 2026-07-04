import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { RichTextEditor } from "@/components/rich-text-editor";
import { ImageUpload } from "@/components/ImageUpload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function BlogEditor() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (isNew) return;
    supabase.from("blogs").select("*").eq("id", id).single().then(({ data }) => {
      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setContent(data.content ?? "");
        setHeaderImage(data.header_image);
        setPublished(data.published);
        setPassword(data.password ?? "");
      }
    });
  }, [id, isNew]);

  const generateSlug = (t: string) =>
    t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleTitleChange = (t: string) => {
    setTitle(t);
    if (!slugEdited) setSlug(generateSlug(t));
  };

  const save = async () => {
    if (!title.trim() || !slug.trim()) return;
    setSaving(true);

    const record = { title, slug, content, header_image: headerImage, published, password: password || null };

    if (isNew) {
      await supabase.from("blogs").insert(record);
    } else {
      await supabase.from("blogs").update(record).eq("id", id);
    }

    setSaving(false);
    navigate("/dashboard/blogs");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">{isNew ? "New post" : "Edit post"}</h1>
        <Button onClick={save} disabled={saving} className="text-[11px] font-mono uppercase tracking-[0.1em]">
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="space-y-2">
        <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Title</Label>
        <Input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Slug</Label>
        <Input
          type="text"
          value={slug}
          onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Header image</Label>
        <ImageUpload bucket="blog-headers" onUpload={setHeaderImage} currentImage={headerImage} />
      </div>

      <div className="space-y-2">
        <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Content</Label>
        <RichTextEditor content={content} onChange={setContent} />
      </div>

      <div className="space-y-2">
        <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Password (optional — gates access on direct URL)</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Leave empty for no password"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="accent-gray-900 dark:accent-gray-100" />
        <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Published</span>
      </label>
    </div>
  );
}
