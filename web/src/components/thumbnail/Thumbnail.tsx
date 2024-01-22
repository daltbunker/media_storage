import { useEffect, useState } from "react";
import { getImage } from "../../api/media";

interface Props {
  name: string;
  size: number;
  id: number;
  display: boolean;
}

export function Thumbnail(props: Props) {
  const { name, size, id } = props;
  const [url, setUrl] = useState("");

  // todo: use react way to get element
  const dialog: HTMLDialogElement | null =
    document.querySelector("#previewDialog");

  async function init() {
    const file = await getImage(id);
    setUrl(URL.createObjectURL(file));
  }

  useEffect(() => {
    init();
  }, []);

  function openPreview() {
    dialog?.showModal();
  }

  if (!props.display) {
    return undefined;
  }

  return (
    <div className="flex flex-col justify-end items-center">
      <img src={url} alt="" onClick={openPreview} className="w-4/5 mb-4"/>
      <p className="text-white text-sm">
        {name} ({size} bytes)
      </p>
    </div>
  );
}
