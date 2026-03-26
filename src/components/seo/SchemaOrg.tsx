export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "НЕЙРО32",
    description: "Практические встречи по освоению навыков работы с нейросетями и ИИ-технологиями в Новозыбкове",
    url: "https://neuro32.ru",
    logo: "https://neuro32.ru/favicon.svg",
    founder: {
      "@type": "Person",
      name: "Денис Степан Марьянович",
      jobTitle: "Основатель",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Новозыбков",
      addressRegion: "Брянская область",
      addressCountry: "RU",
    },
    areaServed: {
      "@type": "City",
      name: "Новозыбков",
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "НЕЙРО32",
    description: "Практические встречи по освоению навыков работы с нейросетями",
    image: "https://neuro32.ru/favicon.svg",
    priceRange: "₽₽",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Новозыбков",
      addressRegion: "Брянская область",
      addressCountry: "RU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "52.5341",
      longitude: "31.9353",
    },
    openingHoursSpecification: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Russian",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
