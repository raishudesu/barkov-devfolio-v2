import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "@phosphor-icons/react";

interface BlogPostData {
  title: string;
  content: string;
  header_image: string | null;
  created_at: string;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("blogs")
      .select("title, content, header_image, created_at")
      .eq("slug", slug)
      .eq("published", true)
      .single()
      .then(({ data }) => {
        setPost(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mb-4">Post not found</p>
        <Link to="/blog" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-1">
          <ArrowLeft size={14} /> Back to blog
        </Link>
      </div>
    );
  }

  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article>
      <Link to="/blog" className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6">
        <ArrowLeft size={14} /> Back to blog
      </Link>

      {post.header_image && (
        <div className="w-full aspect-video rounded-lg overflow-hidden mb-6 bg-gray-100 dark:bg-gray-800">
          <img src={post.header_image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mb-2">{date}</p>
      <h1 className="text-xl font-bold mb-6">{post.title}</h1>

      <div
        className="prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
