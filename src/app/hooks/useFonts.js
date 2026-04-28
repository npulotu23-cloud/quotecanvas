import { useEffect, useState } from 'react';

const FONT_URL = 'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Anton&family=Bebas+Neue&family=Oswald:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Serif+Display:ital@0;1&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,400&family=Caveat:wght@400;700&family=Space+Grotesk:wght@300;400;500;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,700;1,9..144,400&display=swap';

export function useFonts() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (document.querySelector('link[data-qc-fonts]')) {
      document.fonts.ready.then(() => setReady(true));
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_URL;
    link.setAttribute('data-qc-fonts', 'true');
    document.head.appendChild(link);
    document.fonts.ready.then(() => setReady(true));
  }, []);
  return ready;
}
