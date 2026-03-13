// Service worker for Next Train notifications

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// Fallback: setTimeout-based scheduling for browsers without TimestampTrigger
self.addEventListener('message', event => {
  if (event.data?.type !== 'SCHEDULE') return;
  const { delay, title, body, tag } = event.data;
  if (delay <= 0) return;
  setTimeout(() => {
    self.registration.showNotification(title, { body, tag, renotify: true });
  }, delay);
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      if (clients.length) return clients[0].focus();
      return self.clients.openWindow('./');
    })
  );
});
