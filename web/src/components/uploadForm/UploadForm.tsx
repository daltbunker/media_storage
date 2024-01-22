import { ChangeEvent, FormEvent, useState } from "react";
import { postImage } from "../../api/media";

interface Props {
  dialogRef: any;
}

export function UploadForm(props: Props) {
  const [file, setFile] = useState<Blob>();

  function submitForm(e: FormEvent<HTMLFormElement>) {
    //todo: update imageState if success
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      postImage(formData);
      props.dialogRef.current?.close();
    }
  }

  function updateFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  return (
    <>
      <div className="flex justify-between items-start">
        <h3 className="text-xl mb-4">Upload</h3>
        <button
          className="text-gray-800"
          onClick={() => {
            props.dialogRef.current?.close();
          }}
        >
          &times;
        </button>
      </div>
      <form onSubmit={submitForm}>
        <label htmlFor="file">File: </label>
        <input type="file" name="file" id="file" onChange={updateFile} />
        <div className="flex justify-center gap-x-5 mt-4">
          <button
            className="bg-white border border-gray-800 p-2 hover:bg-gray-300"
            type="button"
            onClick={() => {
              props.dialogRef.current?.close();
            }}
          >
            close
          </button>
          <button className="bg-white border border-gray-800 p-2 hover:bg-gray-300">
            submit
          </button>
        </div>
      </form>
    </>
  );
}
