
const root = "http://localhost:8080/v1" //TODO: make this global

export async function getImages(limit: number, offset: number, sortValue?: string) {
  const sortQuery = sortValue ? "&sort=" + sortValue : "";
  const resp = await fetch(`${root}/images?limit=${limit}&offset=${offset}${sortQuery}`) 
  return await resp.json();
}

export async function getImage(id: number) {
  const resp = await fetch(root + "/images/" + id)
  return await resp.blob();
}

export async function postImage(formData: FormData) {
  const resp = await fetch(root + "/images", {
    method: 'POST',
    body: formData,
  })
  return await resp.json();
}

export async function deleteImage(id: number) {
  const resp = await fetch(root + "/images/" + id, {
    method: 'DELETE'
  })
  return await resp.json();
}
