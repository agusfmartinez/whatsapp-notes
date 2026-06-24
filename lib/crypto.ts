// Hash SHA-256 (hex) usando Web Crypto. Solo para "privacidad casual" del
// bloqueo de chats: evita guardar la clave en texto plano. NO es seguridad
// real (es todo local, sin backend; con DevTools se puede saltear).
export async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}
