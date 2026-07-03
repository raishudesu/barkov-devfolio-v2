"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { GalleryDialog } from "@/components/gallery-dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@phosphor-icons/react";

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  description: string | null;
}

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  useEffect(() => {
    supabase
      .from("gallery")
      .select("*")
      .order("sort_order", { ascending: true })
      .limit(3)
      .then(({ data }) => {
        if (data) setItems(data);
      });
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-400">
          07 — gallery
        </p>
        <Link
          to="/gallery"
          className="text-[11px] font-mono uppercase tracking-[0.1em] text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-1"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
          </Button>
        ))}
      </div>

      {selected && (
        <GalleryDialog
          open={!!selected}
          onOpenChange={(open: boolean) => {
            if (!open) setSelected(null);
          }}
          imageUrl={selected.image_url}
          caption={selected.caption}
          description={selected.description}
        />
      )}
    </section>
  );
}
