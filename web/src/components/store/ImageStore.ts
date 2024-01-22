import { action, autorun, computed, makeObservable, observable } from "mobx";
import { createContext } from "react";

class ImageStore {

  savedImages: number[] = []; // array of image ID's

  constructor() {
    makeObservable(this, {
      savedImages: observable,
      savedImageCount: computed,
      report: computed,
      addImage: action
    });

    // runs once on init, then on every state change
    // autorun(() => console.log(this.savedImageCount));
  }

  get savedImageCount() {
    return this.savedImages.length;
  }

  get report() {
    if (this.savedImageCount === 0) {
      return "<none>"
    }
    return "image id: " + this.savedImages[0];
  }

  addImage(imageId: number) {
    this.savedImages.push(imageId);
  }
}

export default createContext(new ImageStore());