import { Helmet } from "react-helmet-async";
import { BusinessSchemaData, generateBusinessSchema } from "@/lib/schema";

interface SchemaMarkupProps {
  business: BusinessSchemaData;
  baseUrl?: string;
}

/**
 * Component that injects Schema.org JSON-LD structured data into the page head
 * Optimized for local SEO and Google rich results
 */
export const SchemaMarkup = ({
  business,
  baseUrl = "https://seusite.com",
}: SchemaMarkupProps) => {
  const schema = generateBusinessSchema(business, {
    baseUrl,
    currentPath: `/empresa/${business.id}`,
  });

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>
        {business.name} - {business.category} em{" "}
        {business.addressLocality || "Maringá"}
      </title>
      <meta name="title" content={`${business.name} - ${business.category}`} />
      <meta name="description" content={business.description} />
      <link rel="canonical" href={`${baseUrl}/empresa/${business.id}`} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="business.business" />
      <meta
        property="og:url"
        content={`${baseUrl}/empresa/${business.id}`}
      />
      <meta
        property="og:title"
        content={`${business.name} - ${business.category}`}
      />
      <meta property="og:description" content={business.description} />
      <meta property="og:image" content={business.image} />
      <meta property="business:contact_data:street_address" content={business.streetAddress || business.address} />
      <meta property="business:contact_data:locality" content={business.addressLocality || "Maringá"} />
      <meta property="business:contact_data:region" content={business.addressRegion || "PR"} />
      <meta property="business:contact_data:postal_code" content={business.postalCode || "87000-000"} />
      <meta property="business:contact_data:country_name" content="Brasil" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta
        property="twitter:url"
        content={`${baseUrl}/empresa/${business.id}`}
      />
      <meta
        property="twitter:title"
        content={`${business.name} - ${business.category}`}
      />
      <meta property="twitter:description" content={business.description} />
      <meta property="twitter:image" content={business.image} />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
