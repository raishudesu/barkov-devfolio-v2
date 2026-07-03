import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ProfileEditor() {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [aboutParagraphs, setAboutParagraphs] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("profile").select("*").eq("id", 1).single().then(({ data }) => {
      if (data) {
        setName(data.name);
        setPosition(data.position);
        setAboutParagraphs((data.about_paragraphs as string[]).join("\n\n"));
        setAvatarUrl(data.avatar_url ?? "");
      }
      setLoading(false);
    });
  }, []);

  const save = async () => {
    const paragraphs = aboutParagraphs.split("\n\n").filter(Boolean);
    const { error } = await supabase
      .from("profile")
      .update({ name, position, about_paragraphs: paragraphs, avatar_url: avatarUrl || null })
      .eq("id", 1);
    if (error) {
      toast.error("Failed to save profile");
    } else {
      toast.success("Profile saved");
    }
  };

  if (loading) {
    return <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-lg font-bold mb-6">Profile</h1>
      <div className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Name</Label>
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Position</Label>
          <Input type="text" value={position} onChange={(e) => setPosition(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Avatar</Label>
          <ImageUpload bucket="avatars" onUpload={setAvatarUrl} currentImage={avatarUrl} />
        </div>
        <div className="space-y-2">
          <Label className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">
            About paragraphs (separate with a blank line)
          </Label>
          <Textarea value={aboutParagraphs} onChange={(e) => setAboutParagraphs(e.target.value)} rows={6} />
        </div>
        <Button onClick={save} className="text-[11px] font-mono uppercase tracking-[0.1em]">
          Save profile
        </Button>
      </div>
    </div>
  );
}
