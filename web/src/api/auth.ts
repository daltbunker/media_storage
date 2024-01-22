const root = "http://localhost:8080/v1"; //TODO: make this global

export async function login(user: FormData) {
  const resp = await fetch(root + "/login", {
    method: "POST",
    credentials: "include",
    body: user,
  });
  if (resp.status !== 200) {
    let unauthResp = await resp.json();
    throw new Error(unauthResp.error);
  }

  return await resp.json();
}

export async function test() {
  const resp = await fetch(root + "/test", {
    credentials: "include",
  });
  return await resp.json();
}

export async function verifyUser() {
  const resp = await fetch(root + "/user", {
    credentials: "include",
  });
  if (resp.status !== 200) {
    let unauthResp = await resp.json();
    throw new Error(unauthResp.error);
  }
  return await resp.json();
}
