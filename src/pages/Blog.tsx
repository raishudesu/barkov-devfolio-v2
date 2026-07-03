import { BookOpenText } from "@phosphor-icons/react";

function Blog() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <BookOpenText size={32} className="text-gray-400" />
      <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mt-6 mb-2">
        blog
      </p>
      <h2 className="text-lg font-bold">Coming Soon</h2>
      <p className="text-sm text-gray-500 text-center max-w-sm mt-2">
        Blog posts are coming soon. Stay tuned for articles about my journey and
        learnings on software development.
      </p>
    </div>
  );
}

export default Blog;
