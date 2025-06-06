// Optimized TOTP implementation
export class TOTP {
  private static readonly BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  private static readonly TIME_STEP = 30
  private static readonly DIGITS = 6
  private static readonly WINDOW = 1

  static generateSecret(length = 32): string {
    const buffer = new Uint8Array(length)
    if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
      window.crypto.getRandomValues(buffer)
    } else {
      // Fallback for environments without crypto
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = Math.floor(Math.random() * 256)
      }
    }
    return this.base32Encode(buffer)
  }

private static base32Encode(buffer: Uint8Array): string {
  let result = "";
  let bits = 0;
  let value = 0;

  for (let i = 0; i < buffer.length; i++) {
    const byte = buffer[i];
    value = (value << 8) | byte;
    bits += 8;

    while (bits >= 5) {
      result += this.BASE32_CHARS[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    result += this.BASE32_CHARS[(value << (5 - bits)) & 31];
  }

  return result;
}

private static base32Decode(encoded: string): Uint8Array {
  const cleanInput = encoded.toUpperCase().replace(/[^A-Z2-7]/g, "");
  const result = new Uint8Array(Math.floor((cleanInput.length * 5) / 8));
  let bits = 0;
  let value = 0;
  let index = 0;

  for (let i = 0; i < cleanInput.length; i++) {
    const char = cleanInput[i];
    const charValue = this.BASE32_CHARS.indexOf(char);
    if (charValue === -1) continue;

    value = (value << 5) | charValue;
    bits += 5;

    if (bits >= 8) {
      result[index++] = (value >>> (bits - 8)) & 255;
      bits -= 8;
    }
  }

  return result.slice(0, index);
}

  private static async hmacSha1(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
    if (typeof window === "undefined" || !window.crypto?.subtle) {
      throw new Error("Web Crypto API not available")
    }

    try {
      const cryptoKey = await window.crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-1" }, false, [
        "sign",
      ])
      const signature = await window.crypto.subtle.sign("HMAC", cryptoKey, data)
      return new Uint8Array(signature)
    } catch (error) {
      throw new Error(`HMAC-SHA1 operation failed: ${error}`)
    }
  }

  private static timeToCounter(time?: number): Uint8Array {
    const timeValue = Math.floor((time || Date.now()) / 1000 / this.TIME_STEP)
    const buffer = new ArrayBuffer(8)
    const view = new DataView(buffer)
    view.setUint32(4, timeValue, false) // Big-endian
    return new Uint8Array(buffer)
  }

  static async generateTOTP(secret: string, time?: number): Promise<string> {
    try {
      const key = this.base32Decode(secret)
      const timeBuffer = this.timeToCounter(time)
      const hmac = await this.hmacSha1(key, timeBuffer)

      const offset = hmac[hmac.length - 1] & 0xf
      const code =
        ((hmac[offset] & 0x7f) << 24) |
        ((hmac[offset + 1] & 0xff) << 16) |
        ((hmac[offset + 2] & 0xff) << 8) |
        (hmac[offset + 3] & 0xff)

      return (code % Math.pow(10, this.DIGITS)).toString().padStart(this.DIGITS, "0")
    } catch (error) {
      console.error("Error generating TOTP:", error)
      throw new Error("Failed to generate TOTP code")
    }
  }

  static async verifyTOTP(token: string, secret: string, window = this.WINDOW): Promise<boolean> {
    if (!token || token.length !== this.DIGITS || !/^\d+$/.test(token)) {
      return false
    }

    try {
      const currentTime = Date.now()

      // Check current time and adjacent time windows
      for (let i = -window; i <= window; i++) {
        const testTime = currentTime + i * this.TIME_STEP * 1000
        const expectedToken = await this.generateTOTP(secret, testTime)

        if (expectedToken === token) {
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Error verifying TOTP:", error)
      return false
    }
  }

  static generateKeyUri(accountName: string, issuer: string, secret: string): string {
    const params = new URLSearchParams({
      secret: secret,
      issuer: issuer,
      algorithm: "SHA1",
      digits: this.DIGITS.toString(),
      period: this.TIME_STEP.toString(),
    })

    return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?${params.toString()}`
  }

  static getRemainingTime(): number {
    return this.TIME_STEP - Math.floor((Date.now() / 1000) % this.TIME_STEP)
  }
}
