import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface GalleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  caption?: string | null;
  description?: string | null;
}

export function GalleryDialog({ open, onOpenChange, imageUrl, caption, description }: GalleryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-transparent border-none shadow-none">
        <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
          <img src={imageUrl} alt={caption ?? ""} className="w-full max-h-[70vh] object-contain bg-black/5" />
          {(caption || description) && (
            <div className="p-4 space-y-1">
              {caption && (
                <DialogTitle className="text-sm font-medium">{caption}</DialogTitle>
              )}
              {description && (
                <DialogDescription className="text-[11px] font-mono text-gray-500">{description}</DialogDescription>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
