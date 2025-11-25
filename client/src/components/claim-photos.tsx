import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, X } from "lucide-react";
import { useState } from "react";

interface ClaimPhotosProps {
  photos?: string[];
  claimantName: string;
}

export default function ClaimPhotos({ photos, claimantName }: ClaimPhotosProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  if (!photos || photos.length === 0) {
    return (
      <div className="border border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
        <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No photos uploaded for this claim</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Claim Photos ({photos.length})</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {photos.map((photo, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <div
                className="cursor-pointer rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                onClick={() => setSelectedPhotoIndex(index)}
              >
                <img
                  src={photo}
                  alt={`${claimantName} claim photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1606611013016-969c19d4a42f?w=500&h=400&fit=crop";
                  }}
                />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <div className="relative">
                <img
                  src={photo}
                  alt={`${claimantName} claim photo ${index + 1}`}
                  className="w-full rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1606611013016-969c19d4a42f?w=500&h=400&fit=crop";
                  }}
                />
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Photo {index + 1} of {photos.length}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
