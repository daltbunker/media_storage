import { ChangeEvent, useState } from "react";
import { Image, ImageState } from "../../types/Image";

interface Props {
  images: Image[];
  setImageState: React.Dispatch<React.SetStateAction<ImageState>>;
}

export function Search(props: Props) {
  const [searchInput, setSearchInput] = useState("");

  function searchFunction(value: string, query: string): boolean {
    return value.toLowerCase().includes(query.toLowerCase());
  }

  function filterImages(query: string) {
    props.setImageState(prevState => {
      const images = [
        ...props.images.map((image) => {
          if (!image.fileName.includes(query)) {
            image.display = false;
          }
          return {
            ...image,
            display: searchFunction(image.fileName, query),
          };
        }),
      ];
      return {
        ...prevState,
        images
      }
    });
  }

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    const query = e.target.value.toLowerCase();
    setSearchInput(query);
    filterImages(query);
  }

  function clearSearch() {
    setSearchInput("");
    filterImages("");
  }

  return (
    <div className="relative">
      <input
        className="p-2"
        placeholder="Search..."
        type="search"
        value={searchInput}
        onChange={handleSearch}
      />
      {searchInput.length > 0 && (
        <button
          className="absolute right-2 top-2 text-gray-800"
          onClick={clearSearch}
        >
          &times;
        </button>
      )}
    </div>
  );
}
