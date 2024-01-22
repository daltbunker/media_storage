
export interface Image {
  imageId: number;
  fileName: string;
  size: number;
  display: boolean;
}

export interface ImageState {
  images: Image[];
  offset: number;
  endOfResults: boolean;
  sort: string | undefined;
}