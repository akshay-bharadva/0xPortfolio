// This TOTP implementation is for client-side generation/verification if needed
// outside of Supabase's built-in MFA. Supabase MFA handles this server-side.
// If this file is for a custom MFA solution that's been replaced by Supabase MFA, it might be redundant.
// Assuming it might be used for other purposes or as a reference:

/**
 * Time-based One-Time Password (TOTP) Generator and Verifier.
 * Note: For production use with Supabase, rely on Supabase's built-in MFA mechanisms.
 * This client-side implementation is more for understanding or specific use cases
 * where client-side TOTP handling is explicitly required (which is rare for auth).
 */
export class TOTP {
  private static readonly BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  private static readonly DEFAULT_TIME_STEP = 30; // seconds
  private static readonly DEFAULT_DIGITS = 6;
  private static readonly DEFAULT_WINDOW = 1; // Number of previous/next tokens to check

  /**
   * Generates a Base32 encoded secret key.
   * @param length - The byte length of the secret before Base32 encoding. Default is 20 bytes (160 bits).
   * @returns A Base32 encoded secret string.
   */
  static generateSecret(length = 20): string {
    const buffer = new Uint8Array(length);
    if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
      window.crypto.getRandomValues(buffer);
    } else {
      // Fallback for environments without secure crypto (Node.js or older browsers)
      // This fallback is NOT cryptographically secure and should not be used for production secrets.
      console.warn(
        "Web Crypto API not available for secure secret generation. Using Math.random (INSECURE).",
      );
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = Math.floor(Math.random() * 256);
      }
    }
    return this.base32Encode(buffer);
  }

  private static base32Encode(buffer: Uint8Array): string {
    let result = "";
    let bits = 0;
    let value = 0;

    for (let i = 0; i < buffer.length; i++) {
      value = (value << 8) | buffer[i];
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
    const numBytes = Math.floor((cleanInput.length * 5) / 8);
    const result = new Uint8Array(numBytes);
    let bits = 0;
    let value = 0;
    let index = 0;

    for (let i = 0; i < cleanInput.length; i++) {
      const charValue = this.BASE32_CHARS.indexOf(cleanInput[i]);
      if (charValue === -1) {
        // Should not happen with cleaned input
        throw new Error("Invalid Base32 character encountered.");
      }
      value = (value << 5) | charValue;
      bits += 5;
      if (bits >= 8) {
        result[index++] = (value >>> (bits - 8)) & 0xff;
        bits -= 8;
      }
    }
    return result;
  }

  private static async hmacSha1(
    key: Uint8Array,
    data: Uint8Array,
  ): Promise<Uint8Array> {
    if (typeof window === "undefined" || !window.crypto?.subtle) {
      throw new Error(
        "Web Crypto API (subtle) is not available. HMAC-SHA1 cannot be performed securely.",
      );
    }
    try {
      const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        key,
        { name: "HMAC", hash: "SHA-1" },
        false,
        ["sign"],
      );
      const signature = await window.crypto.subtle.sign(
        "HMAC",
        cryptoKey,
        data,
      );
      return new Uint8Array(signature);
    } catch (error) {
      console.error("HMAC-SHA1 Error:", error);
      throw new Error(
        `HMAC-SHA1 operation failed: ${(error as Error).message}`,
      );
    }
  }

  private static timeToCounter(timeStep: number, time?: number): Uint8Array {
    const epochSeconds = Math.floor((time ?? Date.now()) / 1000);
    const counter = Math.floor(epochSeconds / timeStep);
    const buffer = new ArrayBuffer(8); // 64-bit counter
    const view = new DataView(buffer);
    // JavaScript numbers are 64-bit floats, but bitwise ops treat them as 32-bit.
    // For counter values fitting in 32 bits, this is okay.
    // High bits (view.setUint32(0, ...)) are 0 for typical epoch times.
    view.setUint32(4, counter, false); // Big-endian for the lower 32 bits
    return new Uint8Array(buffer);
  }

  /**
   * Generates a TOTP code.
   * @param secret - The Base32 encoded secret key.
   * @param time - Optional. The time in milliseconds to generate the TOTP for. Defaults to Date.now().
   * @param digits - Optional. The number of digits in the TOTP code. Defaults to 6.
   * @param timeStep - Optional. The time step in seconds. Defaults to 30.
   * @returns A promise that resolves to the TOTP code as a string.
   */
  static async generateTOTP(
    secret: string,
    time?: number,
    digits = this.DEFAULT_DIGITS,
    timeStep = this.DEFAULT_TIME_STEP,
  ): Promise<string> {
    try {
      const key = this.base32Decode(secret);
      const timeBuffer = this.timeToCounter(timeStep, time);
      const hmac = await this.hmacSha1(key, timeBuffer);

      const offset = hmac[hmac.length - 1] & 0x0f;
      const code =
        (((hmac[offset] & 0x7f) << 24) |
          ((hmac[offset + 1] & 0xff) << 16) |
          ((hmac[offset + 2] & 0xff) << 8) |
          (hmac[offset + 3] & 0xff)) %
        Math.pow(10, digits);

      return code.toString().padStart(digits, "0");
    } catch (error) {
      console.error("Error generating TOTP:", error);
      throw new Error(
        `Failed to generate TOTP code: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Verifies a TOTP code.
   * @param token - The TOTP code to verify.
   * @param secret - The Base32 encoded secret key.
   * @param windowSize - Optional. The number of previous/next tokens to check. Defaults to 1.
   * @param digits - Optional. The number of digits in the TOTP code. Defaults to 6.
   * @param timeStep - Optional. The time step in seconds. Defaults to 30.
   * @returns A promise that resolves to true if the token is valid, false otherwise.
   */
  static async verifyTOTP(
    token: string,
    secret: string,
    windowSize = this.DEFAULT_WINDOW,
    digits = this.DEFAULT_DIGITS,
    timeStep = this.DEFAULT_TIME_STEP,
  ): Promise<boolean> {
    if (!token || token.length !== digits || !/^\d+$/.test(token)) {
      return false;
    }

    try {
      const currentTime = Date.now();
      for (let i = -windowSize; i <= windowSize; i++) {
        const stepTime = currentTime + i * timeStep * 1000;
        const expectedToken = await this.generateTOTP(
          secret,
          stepTime,
          digits,
          timeStep,
        );
        if (expectedToken === token) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error verifying TOTP:", error);
      return false; // Fail verification on error
    }
  }

  /**
   * Generates a key URI for QR code generation (e.g., for Google Authenticator).
   * @param accountName - The account name (e.g., user's email).
   * @param issuer - The issuer name (e.g., application name).
   * @param secret - The Base32 encoded secret key.
   * @param digits - Optional. The number of digits in the TOTP code. Defaults to 6.
   * @param timeStep - Optional. The time step in seconds. Defaults to 30.
   * @returns The OTPAuth key URI.
   */
  static generateKeyUri(
    accountName: string,
    issuer: string,
    secret: string,
    digits = this.DEFAULT_DIGITS,
    timeStep = this.DEFAULT_TIME_STEP,
  ): string {
    const params = new URLSearchParams({
      secret: secret,
      issuer: issuer,
      algorithm: "SHA1", // Standard for TOTP
      digits: digits.toString(),
      period: timeStep.toString(),
    });
    return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?${params.toString()}`;
  }

  /**
   * Gets the remaining time in seconds for the current TOTP window.
   * @param timeStep - Optional. The time step in seconds. Defaults to 30.
   * @returns The remaining time in seconds.
   */
  static getRemainingTime(timeStep = this.DEFAULT_TIME_STEP): number {
    const epochSeconds = Math.floor(Date.now() / 1000);
    return timeStep - (epochSeconds % timeStep);
  }
}
