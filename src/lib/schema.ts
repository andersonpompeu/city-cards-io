import { getSchemaTypes } from "./schemaTypes";

export interface BusinessSchemaData {
  id: number | string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  email?: string | null;
  website?: string | null;
  rating: number | null;
  image: string;
  // SEO fields
  slug?: string | null;
  meta_description?: string | null;
  keywords?: string[] | null;
  neighborhood?: string | null;
  long_description?: string | null;
  // Extended fields for Schema.org
  streetAddress?: string | null;
  addressLocality?: string | null;
  addressRegion?: string | null;
  postalCode?: string | null;
  addressCountry?: string;
  latitude?: string | number | null;
  longitude?: string | number | null;
  priceRange?: string | null;
  openingHours?: string[] | null;
  foundingDate?: string | null;
  reviewCount?: number;
  areaServedRadius?: string;
  reviews?: ReviewData[];
}

export interface ReviewData {
  author: string;
  reviewRating: number;
  reviewBody: string;
  datePublished: string;
}

interface SchemaContext {
  baseUrl: string;
  currentPath: string;
}

/**
 * Generates LocalBusiness Schema with dynamic types based on category
 */
export function generateLocalBusinessSchema(
  business: BusinessSchemaData,
  context: SchemaContext
) {
  const types = getSchemaTypes(business.category);
  const businessUrl = `${context.baseUrl}/empresa/${business.id}`;

  return {
    "@type": types,
    "@id": `${businessUrl}#business`,
    name: business.name,
    image: business.image,
    description: business.description,
    url: businessUrl,
    telephone: business.phone,
    email: business.email,
    priceRange: business.priceRange || "R$",
    address: {
      "@type": "PostalAddress",
      streetAddress: business.streetAddress || business.address,
      addressLocality: business.addressLocality || "Maringá",
      addressRegion: business.addressRegion || "PR",
      postalCode: business.postalCode || "87000-000",
      addressCountry: business.addressCountry || "BR",
    },
    ...(business.latitude &&
      business.longitude && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: business.latitude,
          longitude: business.longitude,
        },
      }),
    ...(business.openingHours && {
      openingHours: business.openingHours,
    }),
    ...(business.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: business.rating.toString(),
        bestRating: "5",
        reviewCount: (business.reviewCount || 42).toString(),
      },
    }),
    ...(business.latitude &&
      business.longitude &&
      business.areaServedRadius && {
        areaServed: {
          "@type": "GeoCircle",
          geoMidpoint: {
            "@type": "GeoCoordinates",
            latitude: business.latitude,
            longitude: business.longitude,
          },
          geoRadius: business.areaServedRadius,
        },
      }),
    ...(business.foundingDate && {
      foundingDate: business.foundingDate,
    }),
  };
}

/**
 * Generates Place Schema for geographic location
 */
export function generatePlaceSchema(
  business: BusinessSchemaData,
  context: SchemaContext
) {
  if (!business.latitude || !business.longitude) return null;

  const businessUrl = `${context.baseUrl}/empresa/${business.id}`;

  return {
    "@type": "Place",
    "@id": `${businessUrl}#place`,
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.latitude,
      longitude: business.longitude,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`,
    address: {
      "@type": "PostalAddress",
      postalCode: business.postalCode || "87000-000",
      streetAddress: business.streetAddress || business.address,
      addressLocality: business.addressLocality || "Maringá",
      addressRegion: business.addressRegion || "PR",
      addressCountry: business.addressCountry || "Brasil",
    },
  };
}

/**
 * Generates Organization Schema
 */
export function generateOrganizationSchema(
  business: BusinessSchemaData,
  context: SchemaContext
) {
  const businessUrl = `${context.baseUrl}/empresa/${business.id}`;

  return {
    "@type": "Organization",
    "@id": `${businessUrl}#organization`,
    name: business.name,
    url: businessUrl,
    email: business.email,
    telephone: business.phone,
    logo: business.image,
    ...(business.streetAddress && {
      address: {
        "@type": "PostalAddress",
        postalCode: business.postalCode || "87000-000",
        streetAddress: business.streetAddress || business.address,
        addressLocality: business.addressLocality || "Maringá",
        addressRegion: business.addressRegion || "PR",
        addressCountry: business.addressCountry || "Brasil",
      },
    }),
  };
}

/**
 * Generates WebPage Schema
 */
export function generateWebPageSchema(
  business: BusinessSchemaData,
  context: SchemaContext
) {
  const businessUrl = `${context.baseUrl}/empresa/${business.id}`;

  return {
    "@type": "WebPage",
    "@id": `${businessUrl}#webpage`,
    url: businessUrl,
    name: `${business.name} - ${business.category} em ${business.addressLocality || "Maringá"}`,
    description: business.description,
    inLanguage: "pt-BR",
    isPartOf: {
      "@id": `${context.baseUrl}#website`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      "@id": business.image,
      url: business.image,
      caption: `${business.name} - ${business.description}`,
    },
  };
}

/**
 * Generates Service Schema
 */
export function generateServiceSchema(
  business: BusinessSchemaData,
  context: SchemaContext
) {
  const businessUrl = `${context.baseUrl}/empresa/${business.id}`;

  return {
    "@type": "Service",
    "@id": `${businessUrl}#service`,
    serviceType: `Serviços de ${business.category}`,
    provider: {
      "@id": `${businessUrl}#business`,
    },
    ...(business.latitude &&
      business.longitude && {
        areaServed: {
          "@type": "GeoCircle",
          geoMidpoint: {
            "@type": "GeoCoordinates",
            latitude: business.latitude,
            longitude: business.longitude,
          },
          geoRadius: business.areaServedRadius || "20000",
        },
      }),
  };
}

/**
 * Generates Review Schema for individual reviews
 */
export function generateReviewSchema(
  review: ReviewData,
  business: BusinessSchemaData,
  context: SchemaContext
) {
  return {
    "@type": "Review",
    author: {
      "@type": "Person",
      name: review.author,
    },
    datePublished: review.datePublished,
    reviewBody: review.reviewBody,
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.reviewRating.toString(),
      bestRating: "5",
      worstRating: "1",
    },
    itemReviewed: {
      "@type": "LocalBusiness",
      name: business.name,
      url: `${context.baseUrl}/empresa/${business.id}`,
    },
  };
}

/**
 * Generates complete Schema.org @graph for a business
 */
export function generateBusinessSchema(
  business: BusinessSchemaData,
  context: SchemaContext
) {
  const graph: any[] = [
    generateLocalBusinessSchema(business, context),
    generateOrganizationSchema(business, context),
    generateWebPageSchema(business, context),
    generateServiceSchema(business, context),
  ];

  // Add Place schema only if coordinates are available
  const placeSchema = generatePlaceSchema(business, context);
  if (placeSchema) {
    graph.splice(1, 0, placeSchema);
  }

  // Add individual Review schemas if reviews are available
  if (business.reviews && business.reviews.length > 0) {
    business.reviews.forEach((review) => {
      graph.push(generateReviewSchema(review, business, context));
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/**
 * Generates WebSite Schema for the directory homepage
 */
export function generateWebSiteSchema(baseUrl: string, siteName: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}#website`,
        url: baseUrl,
        name: siteName,
        inLanguage: "pt-BR",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        name: siteName,
        url: baseUrl,
        logo: `${baseUrl}/placeholder.svg`,
      },
    ],
  };
}
