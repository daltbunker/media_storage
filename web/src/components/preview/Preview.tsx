import { deleteImage } from "../../api/media";

interface Props {
  url: string;
  id: number;
}

export function Preview(props: Props) {
  // todo: use react way to get element
  const dialog: HTMLDialogElement | null =
    document.querySelector("#previewDialog");

  function handleDelete() {
    deleteImage(props.id);
    dialog?.close();
  }

  return (
    <dialog id="previewDialog">
      <div className="image-container">
        <img src={props.url} alt=""/>
      </div>
      <div className="button-container">
        <button
          className="dark-button"
          type="button"
          onClick={() => {
            dialog?.close();
          }}
        >
          close
        </button>
        <button className="dark-button" onClick={handleDelete}>delete</button>
      </div>
    </dialog>
  );
}
