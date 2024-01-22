import { observer } from "mobx-react-lite";
import { useContext } from "react";
import ImageStore from "../store/ImageStore";

function Saved() {
  const imageStore = useContext(ImageStore);
  return (
    <div>
      <button
        onClick={() => {
          imageStore.addImage(4);
        }}
      >
        Add Saved Image
      </button>
      Saved Images: {imageStore.savedImageCount}
    </div>
  );
}

export default observer(Saved);
