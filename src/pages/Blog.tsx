import { BookOpenText } from "@phosphor-icons/react";

function Blog() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 w-full">
      <BookOpenText size={64} className="text-gray-400" />
      <h2 className="text-2xl font-bold">Blog</h2>
      <p className="text-gray-500 text-center max-w-md">
        Blog posts are coming soon. Stay tuned for articles about my journey and
        learnings on software development
      </p>
    </div>
  );
}

export default Blog;
