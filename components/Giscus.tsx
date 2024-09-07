import React, { useEffect, useRef } from 'react';

export default function Giscus() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    const attributes = {
      src: 'https://giscus.app/client.js',
      'data-repo': 'Antraxmin/tech-blog',
      'data-repo-id': "R_kgDOMn8E3w",
      'data-category': "General",
      'data-category-id': "DIC_kwDOMn8E384CiSkr",
      'data-mapping': 'pathname',
      'data-strict': '0',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'bottom',
      'data-theme': 'light',
      'data-lang': 'ko',
      crossorigin: 'anonymous',
      async: 'true'
    };

    Object.entries(attributes).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });

    const existingScript = ref.current?.querySelector('script[src="https://giscus.app/client.js"]');

    if (!existingScript) {
      ref.current?.appendChild(script);
    }

    return () => {
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return <div className="giscus" ref={ref} />;
}