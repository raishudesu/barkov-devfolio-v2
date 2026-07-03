import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { PencilSimple, TrashSimple, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ConfirmDelete } from "@/components/confirm-delete";

interface Blog {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);

  const fetchBlogs = async () => {
    const { data } = await supabase
      .from("blogs")
      .select("id, title, slug, published, created_at")
      .order("created_at", { ascending: false });
    if (data) setBlogs(data);
    setLoading(false);
  };

  useEffect(() => { fetchBlogs(); }, []);

  const deleteBlog = async () => {
    if (!deleteTarget) return;
    await supabase.from("blogs").delete().eq("id", deleteTarget.id);
    setBlogs((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold">Blogs</h1>
        <Button asChild className="text-[11px] font-mono uppercase tracking-[0.1em]">
          <Link to="/dashboard/blogs/new" className="flex items-center gap-1">
            <Plus size={14} /> New post
          </Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Loading...</p>
      ) : blogs.length === 0 ? (
        <p className="text-sm text-gray-500">No blog posts yet.</p>
      ) : (
        <div className="space-y-2">
          {blogs.map((blog) => (
            <div key={blog.id} className="flex items-center justify-between border rounded-lg px-4 py-3">
              <div>
                <p className="text-sm font-medium">{blog.title}</p>
                <p className="text-[11px] font-mono text-gray-400">
                  /blog/{blog.slug} &middot; {blog.published ? "Published" : "Draft"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="icon">
                  <Link to={`/dashboard/blogs/${blog.id}`}>
                    <PencilSimple size={16} />
                  </Link>
                </Button>
                <Button
                  onClick={() => setDeleteTarget(blog)}
                  variant="ghost"
                  size="icon"
                  className="text-red-500"
                >
                  <TrashSimple size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDelete
        open={!!deleteTarget}
        onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}
        onConfirm={deleteBlog}
        title="Delete blog post"
        description={`Delete "${deleteTarget?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
