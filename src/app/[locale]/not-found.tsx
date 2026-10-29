"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getDictionary } from "../../i18n/dictionaries";
export default function NotFound() {
  const params = useParams();
  const locale = params.locale === "ar" ? "ar" : "en";
  const d = getDictionary(locale);
  return (
    <section className="not-found page-width">
      <span className="not-found-mark">?</span>
      <h1>{d.notFound}</h1>
      <p>{d.notFoundCopy}</p>
      <Link href={`/${locale}/catalogue`} className="button">
        {d.explore}
      </Link>
    </section>
  );
}
