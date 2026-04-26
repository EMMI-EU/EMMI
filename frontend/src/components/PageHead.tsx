import { useEffect } from "react";

interface PageHeadProps {
  title: string;
  description?: string;
  canonical?: string;
}

export default function PageHead({ title, description, canonical }: PageHeadProps) {
  useEffect(() => {
    document.title = `${title} | EMMI Europe Tech`;
    if (description) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
    if (canonical) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = `https://emmi-eu.com${canonical}`;
    }
  }, [title, description, canonical]);

  return null;
}
