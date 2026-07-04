import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, LockKey } from "@phosphor-icons/react";

interface BlogPostData {
  title: string;
  content: string;
  header_image: string | null;
  created_at: string;
  published: boolean;
  password: string | null;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase
        .from("blogs")
        .select("title, content, header_image, created_at, published, password")
        .eq("slug", slug)
        .single();
      if (data && !data.published && !data.password) {
        setPost(null);
      } else {
        setPost(data);
      }
      setLoading(false);
    })();
  }, [slug]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === post?.password) {
      setUnlocked(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

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

  if (post.password && !unlocked) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LockKey size={32} className="text-gray-400 mb-4" />
        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mb-1">Protected</p>
        <h2 className="text-lg font-bold mb-1">{post.title}</h2>
        <p className="text-sm text-gray-500 mb-6">Enter the password to access this post.</p>
        <form onSubmit={handleUnlock} className="w-full max-w-xs space-y-3">
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => { setPasswordInput(e.target.value); setError(""); }}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600"
            autoFocus
          />
          {error && (
            <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-red-500">{error}</p>
          )}
          <button
            type="submit"
            className="w-full text-[11px] font-mono uppercase tracking-[0.1em] border rounded-lg px-3 py-2 text-gray-500 hover:text-foreground hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
          >
            Unlock
          </button>
        </form>
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
