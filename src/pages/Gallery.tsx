import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GalleryDialog } from "@/components/gallery-dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ImageSquare, ArrowLeft } from "@phosphor-icons/react";

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  description: string | null;
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  useEffect(() => {
    supabase
      .from("gallery")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) setItems(data);
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

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Link
          to="/"
          className="self-start flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-gray-400 hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={12} />
          back
        </Link>
        <ImageSquare size={32} className="text-gray-400" />
        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400 mt-6 mb-2">gallery</p>
        <p className="text-sm text-gray-500 text-center max-w-sm mt-2">No images yet.</p>
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
        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">gallery</p>
        <h1 className="text-lg font-bold mt-1">Photos</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <Button
            key={item.id}
            onClick={() => setSelected(item)}
            variant="ghost"
            className="group h-auto w-full flex-col items-stretch border rounded-lg overflow-hidden text-left cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors p-0"
          >
            <div className="w-full aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={item.image_url}
                alt={item.caption ?? "Gallery image"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            {item.caption && (
              <p className="text-[11px] font-mono px-2 py-1.5 text-gray-500 truncate">{item.caption}</p>
            )}
          </Button>
        ))}
      </div>

      {selected && (
        <GalleryDialog
          open={!!selected}
          onOpenChange={(open: boolean) => { if (!open) setSelected(null); }}
          imageUrl={selected.image_url}
          caption={selected.caption}
          description={selected.description}
        />
      )}
    </div>
  );
}
