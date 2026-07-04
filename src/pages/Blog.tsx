import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { BlogCard } from "@/components/blog-card";
import { BookOpenText, ArrowLeft } from "@phosphor-icons/react";

interface BlogItem {
  title: string;
  slug: string;
  header_image: string | null;
  created_at: string;
}

function Blog() {
  const [posts, setPosts] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("blogs")
      .select("title, slug, header_image, created_at")
      .eq("published", true)
      .is("password", null)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setPosts(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-gray-400 hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={12} />
          back
        </Link>
        <div className="flex items-center justify-center py-20">
          <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Link
          to="/"
          className="self-start flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-gray-400 hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={12} />
          back
        </Link>
        <BookOpenText size={32} className="text-gray-400" />
        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mt-6 mb-2">blog</p>
        <h2 className="text-lg font-bold">Coming Soon</h2>
        <p className="text-sm text-gray-500 text-center max-w-sm mt-2">
          Blog posts are coming soon. Stay tuned for articles about my journey and
          learnings on software development.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-gray-400 hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={12} />
        back
      </Link>
      <div className="mb-6">
        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">blog</p>
        <h1 className="text-lg font-bold mt-1">Posts</h1>
      </div>
      <div className="grid gap-4">
        {posts.map((post) => (
          <BlogCard key={post.slug} {...post} />
        ))}
      </div>
    </div>
  );
}

export default Blog;
