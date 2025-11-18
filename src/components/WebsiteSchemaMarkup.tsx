import { Helmet } from "react-helmet-async";
import { generateWebSiteSchema } from "@/lib/schema";

interface WebsiteSchemaMarkupProps {
  baseUrl?: string;
  siteName?: string;
  description?: string;
}

/**
 * Component that injects WebSite Schema.org JSON-LD for the homepage
 */
export const WebsiteSchemaMarkup = ({
  baseUrl = "https://seusite.com",
  siteName = "Diretório de Empresas Locais",
  description = "Encontre empresas e serviços locais de qualidade. Busque por categorias e localize negócios próximos a você.",
}: WebsiteSchemaMarkupProps) => {
  const schema = generateWebSiteSchema(baseUrl, siteName);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteName} - Encontre Empresas e Serviços Locais</title>
      <meta name="title" content={siteName} />
      <meta name="description" content={description} />
      <link rel="canonical" href={baseUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={baseUrl} />
      <meta property="og:title" content={siteName} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${baseUrl}/placeholder.svg`} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={baseUrl} />
      <meta property="twitter:title" content={siteName} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${baseUrl}/placeholder.svg`} />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
