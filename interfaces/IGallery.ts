export interface IGallery {
  images: Array<{
    id: number;
    image: string;
    compressedImage: string;
  }>;
}

export const DEFAULT_GALLERY = {
  images: [],
} as IGallery;
