import { ChangeEvent } from "react";

interface Props {
  sortImages: (sortBy: string) => Promise<void>;
}

enum Options {
  PlaceHolder = "sort by",
  FileName = "file name (default)",
  Size = "size",
}

export function Sort(props: Props) {
  const options = Object.values(Options);

  function sortImages(e: ChangeEvent<HTMLSelectElement>) {
    const sortBy = e.target.value;
    props.sortImages(sortBy);
  }

  return (
    <div>
      <select onChange={sortImages} className="p-2 h-10">
        {options.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
}
