import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Component to generate sitemap.xml dynamically
 * This should be used in a server-side context or as a build-time script
 * For now, it logs the sitemap structure
 */
export const SitemapGenerator = () => {
  useEffect(() => {
    const generateSitemap = async () => {
      try {
        // Fetch all approved businesses
        const { data: businesses, error } = await supabase
          .from("businesses")
          .select("slug, updated_at")
          .eq("status", "approved");

        if (error) throw error;

        const baseUrl = window.location.origin;
        
        let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
        sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        // Homepage
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${baseUrl}/</loc>\n`;
        sitemap += `    <changefreq>daily</changefreq>\n`;
        sitemap += `    <priority>1.0</priority>\n`;
        sitemap += `  </url>\n`;
        
        // FAQ
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${baseUrl}/faq</loc>\n`;
        sitemap += `    <changefreq>monthly</changefreq>\n`;
        sitemap += `    <priority>0.7</priority>\n`;
        sitemap += `  </url>\n`;
        
        // Business pages
        businesses?.forEach((business) => {
          sitemap += `  <url>\n`;
          sitemap += `    <loc>${baseUrl}/empresa/${business.slug}</loc>\n`;
          sitemap += `    <lastmod>${new Date(business.updated_at).toISOString()}</lastmod>\n`;
          sitemap += `    <changefreq>weekly</changefreq>\n`;
          sitemap += `    <priority>0.8</priority>\n`;
          sitemap += `  </url>\n`;
        });
        
        sitemap += '</urlset>';
        
        console.log("Sitemap gerado:", sitemap);
        
        // In production, this would be saved to public/sitemap.xml
        // or served dynamically through an edge function
      } catch (error) {
        console.error("Erro ao gerar sitemap:", error);
      }
    };

    generateSitemap();
  }, []);

  return null;
};
