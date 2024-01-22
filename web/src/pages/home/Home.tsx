import { useEffect, useRef, useState } from "react";
import { getImages } from "../../api/media";
import { Thumbnail } from "../../components/thumbnail/Thumbnail";
import { LoadingThumbnail } from "../../components/thumbnail/LoadingThumbnail";
import { Search } from "../../components/search/Search";
import { Image, ImageState } from "../../types/Image";
import { Sort } from "../../components/sort/Sort";
import { UploadForm } from "../../components/uploadForm/UploadForm";

const LIMIT = 9;

export function Home() {
  const [imageState, setImageState] = useState({
    images: [],
    offset: 0,
    endOfResults: false,
    sort: undefined
  } as ImageState);
  const [loading, setLoading] = useState(false);
  const uploadRef = useRef<HTMLDialogElement>(null);

  async function populateImages() {
    if (imageState.endOfResults) {
      return;
    }
    const response: Image[] = await getImages(LIMIT, imageState.offset, imageState.sort);
    setImageState((prevState) => {
      const images = [
          ...prevState.images,
          ...response.map((image) => {
            return {
              ...image,
              display: true,
            };
          }),
        ]
      return {
        ...prevState,
        offset: prevState.offset + LIMIT,
        endOfResults: response.length < 9,
        images
      };
    });
  }

  function validateSort(sortBy: string) {
    switch (sortBy) {
      case "size":
        return sortBy;
      default:
        return undefined;

    }
  }

  async function sortImages(sortBy: string) {
    const validatedSort = validateSort(sortBy);
    // Use offset 0 to reset results
    const response: Image[] = await getImages(LIMIT, 0, validatedSort);
    setImageState(() => {
      const images = [
          ...response.map((image) => {
            return {
              ...image,
              display: true,
            };
          }),
        ]
      return {
        offset: LIMIT,
        endOfResults: false,
        sort: validatedSort,
        images
      };
    });

  }

  function createThumbnails() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    populateImages();
  }

  useEffect(() => {
    createThumbnails();
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-8">
        <button
          className="bg-white p-2 hover:bg-gray-300"
          onClick={() => {
            uploadRef.current?.showModal();
          }}
        >
          Upload +
        </button>
        <div className="flex justify-center gap-x-4">
          <Search images={imageState.images} setImageState={setImageState} />
          <Sort
            sortImages={sortImages}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-y-8 gap-x-8 mb-8">
        {loading ? (
          <LoadingThumbnail />
        ) : (
          imageState.images.map((image) => {
            return (
              <Thumbnail
                key={image.imageId}
                name={image.fileName}
                size={image.size}
                id={image.imageId}
                display={image.display}
              />
            );
          })
        )}
      </div>
      <div className="flex justify-center">
        <button
          onClick={populateImages as any} //button can't have return type Promise
          className="bg-white p-2 hover:bg-gray-300 disabled:bg-gray-500"
          style={{display: imageState.endOfResults ? "none" : "block"}}
        >
          Show More
        </button>
      </div>
      <dialog ref={uploadRef} className="p-4">
        <UploadForm dialogRef={uploadRef} />
      </dialog>
      {/* <Preview /> */}
      {/* <Saved /> */}
    </div>
  );
}

export default Home;
