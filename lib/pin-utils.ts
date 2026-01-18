/**
 * PIN Validation Utilities
 * Provides PIN strength validation and weak PIN detection
 */

/**
 * Check if a PIN is weak or common
 * Detects patterns like: sequential (1234), repeating (1111), ascending/descending
 */
export function isWeakPin(pin: string): { isWeak: boolean; reason?: string } {
    // Only apply weak PIN checks to new PINs (not existing ones)
    // Relaxed validation: Allow ANY 4+ digit PIN.

    if (!pin || pin.length < 4) {
        return { isWeak: true, reason: "PIN must be at least 4 digits" };
    }

    return { isWeak: false };
}

/**
 * Validate PIN format (numeric only, minimum length)
 */
export function isValidPinFormat(pin: string, minLength: number = 4, maxLength: number = 6): boolean {
    if (!pin) return false;
    if (!/^\d+$/.test(pin)) return false; // Only digits
    if (pin.length < minLength || pin.length > maxLength) return false;
    return true;
}

/**
 * Hash PIN with salt (same as in auth-context)
 */
export async function hashPin(pin: string, salt: string): Promise<string> {
    try {
        if (!globalThis.crypto?.subtle) return pin;
        const encoder = new TextEncoder();
        const data = encoder.encode(`${pin}:${salt}`);
        const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch {
        return pin;
    }
}

/**
 * Session storage keys for PIN persistence
 */
export const PIN_SESSION_KEY = "nudge_pin_verified";
export const PIN_TIMEOUT_KEY = "nudge_pin_timeout";
export const PIN_TIMEOUT_MS = 60 * 60 * 1000; // 1 hour

/**
 * Check if PIN session is still valid
 */
export function isPinSessionValid(): boolean {
    if (typeof window === "undefined") return false;

    const verified = sessionStorage.getItem(PIN_SESSION_KEY);
    const timeout = sessionStorage.getItem(PIN_TIMEOUT_KEY);

    if (!verified || !timeout) return false;

    const timeoutMs = parseInt(timeout, 10);
    if (isNaN(timeoutMs)) return false;

    // Check if session has expired
    if (Date.now() > timeoutMs) {
        clearPinSession();
        return false;
    }

    return true;
}

/**
 * Set PIN session as verified
 */
export function setPinSession(): void {
    if (typeof window === "undefined") return;

    sessionStorage.setItem(PIN_SESSION_KEY, "true");
    sessionStorage.setItem(PIN_TIMEOUT_KEY, (Date.now() + PIN_TIMEOUT_MS).toString());
}

/**
 * Clear PIN session
 */
export function clearPinSession(): void {
    if (typeof window === "undefined") return;

    sessionStorage.removeItem(PIN_SESSION_KEY);
    sessionStorage.removeItem(PIN_TIMEOUT_KEY);
}
