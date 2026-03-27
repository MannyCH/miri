import Pusher from 'pusher';

let pusherInstance;

/**
 * Lazy-initialized shared Pusher server instance.
 * Reused across all API routes within the same function invocation.
 */
export function getPusher() {
  if (!pusherInstance) {
    pusherInstance = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER,
      useTLS: true,
    });
  }
  return pusherInstance;
}
