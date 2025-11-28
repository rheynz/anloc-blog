import React, { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  keywords?: string;
}

const Seo: React.FC<SeoProps> = ({ title, description, keywords }) => {
  useEffect(() => {
    const defaultTitle = 'ANLOC.ID - Official Website';
    document.title = title ? `${title} | ANLOC.ID` : defaultTitle;

    const setMetaTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('description', description);

    if (keywords) {
      setMetaTag('keywords', keywords);
    }
    
  }, [title, description, keywords]);

  return null;
};

export default Seo;
