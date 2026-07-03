import { Link } from "react-router-dom";

interface BlogCardProps {
  title: string;
  slug: string;
  headerImage?: string | null;
  created_at: string;
}

export function BlogCard({ title, slug, headerImage, created_at }: BlogCardProps) {
  const date = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link to={`/blog/${slug}`} className="block border rounded-lg overflow-hidden hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
      {headerImage && (
        <div className="w-full aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img src={headerImage} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mb-1">{date}</p>
        <h2 className="text-sm font-bold">{title}</h2>
      </div>
    </Link>
  );
}
