import type { LocalePageProps } from "@/types/page-props";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GuestVoices } from "@/components/site/reviews/guest-voices";
import { ReviewSubmissionSection } from "@/components/site/reviews/review-submission-section";
import { ReviewsClosingScene } from "@/components/site/reviews/reviews-closing";
import { ReviewsFooterTransition } from "@/components/site/reviews/reviews-footer-transition";
import { ReviewsIntroduction } from "@/components/site/reviews/reviews-introduction";
import { ReviewsPageShell } from "@/components/site/reviews/reviews-page-shell";
import { ReviewsProcessScene } from "@/components/site/reviews/reviews-process-scene";
import { ReviewsSpatialHero } from "@/components/site/reviews/reviews-spatial-hero";
import { ReviewsTransparencyFaq } from "@/components/site/reviews/reviews-transparency-faq";
import type { PublicReview, ReviewPhotoSlot } from "@/components/site/reviews/types";
import { girlPhoto } from "@/lib/content/girl-photos";
import { homePhoto } from "@/lib/content/home-photos";
import { listApprovedReviews } from "@/server/repositories/reviews";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  return buildPageMetadata({ locale, path: "/reviews", titleKey: "Reviews.title" });
}

export default async function ReviewsPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Reviews");
  const home = await getTranslations("Home");
  const common = await getTranslations("Common");
  const nav = await getTranslations("Nav");

  const rawReviews = await listApprovedReviews().catch(() => []);
  const reviews: PublicReview[] = rawReviews.map((review) => ({
    id: String(review._id),
    authorDisplayName: review.authorDisplayName,
    text: review.text,
    rating: typeof review.rating === "number" ? review.rating : undefined,
    ratingLabel: typeof review.rating === "number" ? t("ratingOfFive", { rating: review.rating }) : undefined,
  }));

  const alt = t("title");
  const heroPhotos: ReviewPhotoSlot[] = [
    { src: homePhoto("bedroom"), alt, depth: -300, rotateY: -5, x: "8%", y: "18%", width: "w-[24vw]", focal: false },
    { src: girlPhoto("suiteBed"), alt, depth: -150, rotateY: 6, x: "62%", y: "12%", width: "w-[22vw]", focal: false },
    { src: homePhoto("seaRoom"), alt, depth: 0, rotateY: -3, x: "28%", y: "26%", width: "w-[38vw]", focal: true },
    { src: homePhoto("terrace"), alt, depth: 120, rotateY: 4, x: "54%", y: "48%", width: "w-[20vw]", focal: false },
    { src: girlPhoto("beachfrontDining"), alt, depth: -80, rotateY: 2, x: "12%", y: "52%", width: "w-[18vw]", focal: false },
  ];

  const steps = [
    { index: "01", text: t("howPointOne") },
    { index: "02", text: t("howPointTwo") },
    { index: "03", text: t("howPointThree") },
  ];

  return (
    <ReviewsPageShell>
      <ReviewsSpatialHero
        scene="01"
        eyebrow={t("filmEyebrow")}
        title={t("title")}
        lede={t("intro")}
        displayLine1={t("filmDisplayLine1")}
        displayLine2={t("filmDisplayLine2")}
        scrollLabel={t("scrollLabel")}
        photos={heroPhotos}
      />
      <ReviewsIntroduction scene="02" lede={t("lede")} image={homePhoto("lounge")} detailImage={homePhoto("balcony")} alt={alt} />
      <ReviewsProcessScene scene="03" title={t("howTitle")} body={t("howBody")} steps={steps} />
      <GuestVoices
        scene="04"
        kicker={t("voicesKicker")}
        title={t("voicesTitle")}
        sideNote={t("intro")}
        emptyPrimary={common("emptyReviews")}
        emptySecondary={t("voicesEmptyNote")}
        shareCta={t("emptyShareCta")}
        submitHref={`/${locale}/reviews#submit-review`}
        reviews={reviews}
        prevLabel={t("reviewPrev")}
        nextLabel={t("reviewNext")}
      />
      <ReviewsTransparencyFaq
        scene="05"
        questionsEyebrow={home("questionsEyebrow")}
        transparencyHeading={t("transparencyHeading")}
        transparencyNote={t("howBody")}
        question={home("questionReviews")}
        answer={t("faqAnswer")}
      />
      <ReviewSubmissionSection
        scene="06"
        submitTitle={t("submitTitle")}
        submitLede={t("submitLede")}
        image={homePhoto("balcony")}
        alt={alt}
        locale={locale as "en" | "ru"}
      />
      <ReviewsClosingScene
        scene="07"
        line1={t("filmClosingLine1")}
        line2={t("filmClosingLine2")}
        exploreRooms={home("exploreRooms")}
        roomsHref={`/${locale}/rooms`}
        introFooter={`${nav("reviews")} · ${t("intro")}`}
        image={homePhoto("bedroom")}
        alt={alt}
      />
      <ReviewsFooterTransition closingLabel={t("filmFooterLabel")} />
    </ReviewsPageShell>
  );
}