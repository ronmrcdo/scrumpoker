function getSecureRandomIndex(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] ?? 0) % max;
}

export function generateRoomCode(): string {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const alphanumeric = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 3; i++) {
    code += letters[getSecureRandomIndex(letters.length)];
  }
  code += "-";
  for (let i = 0; i < 3; i++) {
    code += alphanumeric[getSecureRandomIndex(alphanumeric.length)];
  }
  return code;
}
