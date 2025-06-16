// @review hooks에는 use 를 접두사로 붙이는게 좋을듯 또한 해당 파일은 훅보다는 따로 util 함수로 관리하는게 더 적합
export const hashPassword = async (password: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};
