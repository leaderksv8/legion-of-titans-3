import { Helmet } from "react-helmet-async";
import { useLocale } from "@/shared/lib/localeContext";

const SEO_DATA = {
  uk: {
    title: "ГО «Легіон Титанів» - Підтримка ветеранів України",
    description: "Громадська організація на підтримку ветеранів АТО/ООС та їх адаптації. Допомога, психологічна підтримка, реабілітація.",
    keywords: "ветерани, АТО, ООС, адаптація, допомога ветеранам, Легіон Титанів, Буча",
  },
  en: {
    title: "NGO Legion of Titans - Support for Ukrainian Veterans",
    description: "Public organization supporting ATO/JFO veterans and their adaptation. Assistance, psychological support, rehabilitation.",
    keywords: "veterans, ATO, JFO, adaptation, veteran support, Legion of Titans, Bucha",
  },
};

export default function SEOHead() {
  const { locale } = useLocale();
  const seo = SEO_DATA[locale];

  return (
    <Helmet>
      <html lang={locale} />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Legion of Titans" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={`https://legion-of-titans.org${locale === 'en' ? '?lang=en' : ''}`} />
    </Helmet>
  );
}
