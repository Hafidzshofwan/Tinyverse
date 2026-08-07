import {
  ORGANIZATION_EMAIL,
  ORGANIZATION_SOCIAL_LINKS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "./siteConfig";

/**
 * Data terstruktur (JSON-LD) tingkat situs: Organization, WebSite, dan
 * MedicalWebApplication.
 *
 * WHY di sini, bukan di setiap halaman: ketiga skema ini menjelaskan situs
 * secara keseluruhan (siapa pengelolanya, alamat resminya, aplikasi macam apa
 * ini) -- bukan konten satu halaman tertentu. Dipasang sekali di layout akar
 * agar setiap halaman mewarisi skema yang sama tanpa duplikasi markup di
 * setiap page.tsx.
 *
 * Hanya merender <script type="application/ld+json"> berisi data murni --
 * tidak memengaruhi tampilan (UI) apa pun di halaman.
 */
export function StructuredData() {
  const organization = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    email: ORGANIZATION_EMAIL,
    sameAs: ORGANIZATION_SOCIAL_LINKS,
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "id-ID",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  const medicalWebApplication = {
    "@type": "MedicalWebApplication",
    "@id": `${SITE_URL}/#app`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    applicationCategory: "MedicalApplication",
    operatingSystem: "Web",
    inLanguage: "id-ID",
    audience: {
      "@type": "Audience",
      audienceType: "Tenaga kesehatan",
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [organization, website, medicalWebApplication],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
