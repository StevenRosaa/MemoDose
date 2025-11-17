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
  // Cerca se c'è già una finestra aperta, altrimenti ne apre una nuova
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Se c'è già una tab aperta, usala
      for (let client of windowClients) {
        if (client.url.includes('/') && 'focus' in client) {
          return client.focus();
        }
      }
      // Altrimenti apri la home
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// 3. ✅ AGGIUNTA FONDAMENTALE PER PWA (Evento Fetch)
// La presenza di questo ascoltatore (anche se semplice) dice al browser:
// "Questa è un'app capace di gestire il traffico di rete".
// Questo sblocca il banner "Aggiungi a Schermata Home" su Android.
self.addEventListener('fetch', (event) => {
  // Per ora lasciamo passare tutte le richieste direttamente alla rete.
  // Non facciamo caching offline complesso per evitare problemi con i dati live.
  return;
});