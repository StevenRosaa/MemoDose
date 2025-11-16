// public/sw.js

// 1. Ascoltatore per l'evento "push" (la notifica che arriva dal server)
self.addEventListener('push', (event) => {
  // Leggiamo i dati inviati dal server (titolo, corpo, ecc.)
  const data = event.data.json();

  const title = data.title || "MemoDose"; // Titolo di default
  const options = {
    body: data.body, // Il testo del farmaco
    icon: '/icon-192.png', // Assicurati di avere un'icona qui
    badge: '/icon-192.png', // E qui
    vibrate: [200, 100, 200], // Vibrazione per i dispositivi mobili
  };

  // Diciamo al service worker di mostrare la notifica
  event.waitUntil(self.registration.showNotification(title, options));
});

// 2. Gestisce il click sulla notifica
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // Apri l'app quando l'utente clicca sulla notifica
  event.waitUntil(clients.openWindow('/')); 
});