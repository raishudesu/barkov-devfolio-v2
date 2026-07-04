import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { BlogCard } from "@/components/blog-card";
import { ArrowRight } from "@phosphor-icons/react";

interface BlogItem {
  title: string;
  slug: string;
  header_image: string | null;
  created_at: string;
}

export default function BlogsSection() {
  const [posts, setPosts] = useState<BlogItem[]>([]);

  useEffect(() => {
    supabase
      .from("blogs")
      .select("title, slug, header_image, created_at")
      .eq("published", true)
      .is("password", null)
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setPosts(data);
      });
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">05 — blogs</p>
        <Link
          to="/blog"
          className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-1"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      <div className="grid gap-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} {...post} />
        ))}
      </div>
    </section>
  );
}
