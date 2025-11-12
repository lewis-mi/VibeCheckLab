/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or a database-backed solution
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private store: Map<string, RateLimitEntry>;
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.store = new Map();
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // Cleanup old entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Check if the request should be rate limited
   * @param identifier - Usually an IP address or user ID
   * @returns true if request is allowed, false if rate limited
   */
  checkLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.store.get(identifier);

    // No entry or window expired - allow and create new entry
    if (!entry || now > entry.resetTime) {
      const resetTime = now + this.windowMs;
      this.store.set(identifier, { count: 1, resetTime });
      return { allowed: true, remaining: this.maxRequests - 1, resetTime };
    }

    // Check if limit exceeded
    if (entry.count >= this.maxRequests) {
      return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }

    // Increment count and allow
    entry.count++;
    return { allowed: true, remaining: this.maxRequests - entry.count, resetTime: entry.resetTime };
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Get current stats (for monitoring)
   */
  getStats(): { totalEntries: number } {
    return { totalEntries: this.store.size };
  }

  /**
   * Reset limit for a specific identifier (useful for testing or admin override)
   */
  reset(identifier: string): void {
    this.store.delete(identifier);
  }
}
