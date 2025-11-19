import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { BusinessSchemaData, generateBusinessSchema } from "@/lib/schema";
import { supabase } from "@/integrations/supabase/client";

interface SchemaMarkupProps {
  business: BusinessSchemaData;
  baseUrl?: string;
}

interface Review {
  rating: number;
  comment: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
  };
}

/**
 * Component that injects Schema.org JSON-LD structured data into the page head
 * Optimized for local SEO and Google rich results
 */
export const SchemaMarkup = ({
  business,
  baseUrl = "https://seusite.com",
}: SchemaMarkupProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data: reviewsData } = await supabase
          .from("reviews")
          .select("rating, comment, created_at, user_id")
          .eq("business_id", String(business.id))
          .order("created_at", { ascending: false })
          .limit(10);

        if (reviewsData) {
          const userIds = reviewsData.map((r) => r.user_id);
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", userIds);

          const reviewsWithProfiles = reviewsData.map((review) => ({
            ...review,
            profiles: profilesData?.find((p) => p.id === (review as any).user_id),
          }));

          setReviews(reviewsWithProfiles as any);
        }
      } catch (error) {
        console.error("Error fetching reviews for schema:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [business.id]);

  // Create business data with reviews for schema generation
  const businessWithReviews = {
    ...business,
    reviews: reviews.map((r) => ({
      author: (r as any).profiles?.full_name || "Usuário",
      reviewRating: r.rating,
      reviewBody: r.comment,
      datePublished: r.created_at,
    })),
  };

  const schema = generateBusinessSchema(businessWithReviews, {
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
