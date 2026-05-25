/**
 * In-memory navigation command store.
 *
 * Holds pending commands (when no poller is waiting) and live waiters
 * (when a poll is in progress). On Vercel, each serverless invocation
 * is a separate process so this in-memory store only works for demo/dev
 * with a single serverless instance. For production at scale, swap the
 * `_store` and `_waiters` maps for a Redis adapter.
 *
 * Sections:
 * - Types
 * - Store singleton
 */

// ------------------------------------------------------------------------------
// Types
// ------------------------------------------------------------------------------
export interface NavigateCommand {
  url?: string;
  section?: string;
}

// ------------------------------------------------------------------------------
// Store singleton
// ------------------------------------------------------------------------------
// Module-level maps — shared across requests in the same serverless warm instance.
const _pending = new Map<string, NavigateCommand>();
const _waiters = new Map<
  string,
  { resolve: (cmd: NavigateCommand) => void; timer: ReturnType<typeof setTimeout> }
>();

export const commandStore = {
  /** Deliver a command — wakes a waiting poller or stores for later pickup. */
  deliver(sessionId: string, cmd: NavigateCommand): void {
    const waiter = _waiters.get(sessionId);
    if (waiter) {
      clearTimeout(waiter.timer);
      _waiters.delete(sessionId);
      waiter.resolve(cmd);
    } else {
      _pending.set(sessionId, cmd);
    }
  },

  /** Long-poll: resolves when a command arrives or after timeoutMs. */
  poll(
    sessionId: string,
    timeoutMs = 29_000,
  ): Promise<NavigateCommand | null> {
    const pending = _pending.get(sessionId);
    if (pending) {
      _pending.delete(sessionId);
      return Promise.resolve(pending);
    }

    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        _waiters.delete(sessionId);
        resolve(null); // timeout — client should re-poll
      }, timeoutMs);
      _waiters.set(sessionId, { resolve, timer });
    });
  },
};
