import crypto from 'crypto';

// ===== PASSWORD HASHING =====

const SALT = 'soundflow_salt_2024';

/**
 * Hash a password using SHA-256 with a salt.
 * In production, use bcrypt or argon2 instead.
 */
export function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password + SALT)
    .digest('hex');
}

/**
 * Verify a password against a hash.
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// ===== JWT-LIKE TOKEN HELPERS =====

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'soundflow_jwt_secret_2024';
const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

/**
 * Generate a signed token for a user.
 * Uses HMAC-SHA256 for signing (simple JWT-like approach).
 */
export function generateToken(userId: string): string {
  const iat = Date.now();
  const exp = iat + TOKEN_EXPIRY;

  const payload = JSON.stringify({ userId, iat, exp });

  // Base64url encode the payload
  const encodedPayload = Buffer.from(payload).toString('base64url');

  // Sign with HMAC-SHA256
  const signature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

/**
 * Verify a token and return the userId if valid.
 * Returns null if token is invalid or expired.
 */
export function verifyToken(token: string): string | null {
  try {
    const [encodedPayload, signature] = token.split('.');

    if (!encodedPayload || !signature) return null;

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', TOKEN_SECRET)
      .update(encodedPayload)
      .digest('base64url');

    if (signature !== expectedSignature) return null;

    // Decode payload
    const payload: TokenPayload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf-8')
    );

    // Check expiration
    if (Date.now() > payload.exp) return null;

    return payload.userId;
  } catch {
    return null;
  }
}
