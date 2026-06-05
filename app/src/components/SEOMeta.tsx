import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOMetaProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
}

export const SEOMeta: React.FC<SEOMetaProps> = ({ 
  title = 'Shobhoday | Modern Premium Fashion', 
  description = 'Shop the latest oversized t-shirts, hoodies, and premium streetwear at Shobhoday.', 
  canonical, 
  ogImage = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg' // default fallback
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:type" content="website" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};
