/**
 * Every business fact the site publishes lives here, with where it came from.
 * `confirmed` turns true once Laura has checked it. Components only render facts
 * that are confirmed, or sourced from reliable public information (`sourced`).
 * Anything still unknown is `null` and is left out of the page, never guessed.
 */
import type { ImageMetadata } from "astro";
import hairWaves from "../assets/photos/hair-waves.jpg";
import salonChair from "../assets/photos/salon-chair.jpg";
import chignon from "../assets/photos/occasion-chignon.jpg";
import colourTools from "../assets/photos/colour-tools.jpg";

export type Fact<T> = { value: T; source: string; confirmed: boolean };

export const salon = {
  name: "Laura Anderson Hair",
  legalName: { value: "Laura Anderson Hair Ltd", source: "Companies House, no. 12300311", confirmed: false } as Fact<string>,
  companyNumber: { value: "12300311", source: "Companies House", confirmed: false } as Fact<string>,
  descriptor: "Hair · Beauty · Morpeth",
  phone: { value: { display: "01670 516113", href: "tel:+441670516113", e164: "+441670516113" }, source: "Business listings", confirmed: false } as Fact<{ display: string; href: string; e164: string }>,
  address: {
    value: { street: "1B Newgate Street", town: "Morpeth", county: "Northumberland", postcode: "NE61 1AL", country: "GB" },
    source: "Business listings",
    confirmed: false,
  } as Fact<{ street: string; town: string; county: string; postcode: string; country: string }>,
  award: {
    value: { title: "Business of the Year", event: "Heart of Morpeth Business Awards", year: 2017, note: "Voted for by the public" },
    source: "Sanderson Arcade news report on the 2017 Heart of Morpeth Business Awards",
    confirmed: false,
  } as Fact<{ title: string; event: string; year: number; note: string }>,
  /** Unknown until Laura confirms. While null, the site says to call for opening times. */
  openingHours: null as null | { day: string; opens: string; closes: string }[],
  /** Unverified rating from earlier research; not rendered until confirmed. */
  googleRating: { value: { rating: 5.0, count: 91 }, source: "Google Business Profile, checked during lead research", confirmed: false } as Fact<{ rating: number; count: number }>,
  googleReviewsUrl: "https://www.google.com/maps/search/?api=1&query=Laura+Anderson+Hair+1B+Newgate+Street+Morpeth+NE61+1AL",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=1B+Newgate+Street%2C+Morpeth+NE61+1AL",
  /** No verified booking URL or social accounts yet: these stay empty, and nothing links to them. */
  bookingUrl: null as string | null,
  social: [] as { label: string; href: string }[],
};

export type Photo = {
  src: ImageMetadata;
  alt: string;
  /** CSS object-position for the crop at each size. */
  focus?: string;
  /** True until replaced with the salon's own photography. Illustrative, never presented as Laura's work. */
  placeholder: boolean;
};

export const photos = {
  hairWaves: { src: hairWaves, alt: "Long copper hair falling in soft, glossy waves, seen from behind", focus: "50% 30%", placeholder: true },
  salonChair: { src: salonChair, alt: "A styling chair in front of a round mirror in a softly lit salon", focus: "50% 60%", placeholder: true },
  chignon: { src: chignon, alt: "A soft, low chignon with loose face-framing tendrils and pearl pins", focus: "50% 35%", placeholder: true },
  colourTools: { src: colourTools, alt: "A colour bowl and brush, folded foils, scissors and a comb laid out on linen", focus: "50% 50%", placeholder: true },
} satisfies Record<string, Photo>;

export type Service = { id: string; title: string; summary: string; photo: Photo; enquiry: string };

/**
 * Services drawn from the salon's name, listings and recent posts (colour, balayage),
 * and lead research (grey blending, correction, occasion hair). Confirm before launch.
 * Not listed until confirmed: extensions, specific beauty and health treatments, prices, durations.
 */
export const services: Service[] = [
  { id: "cut", title: "Cutting & styling", summary: "Cuts shaped around how your hair grows and how you really wear it, finished with a blow-dry and advice for styling at home.", photo: photos.hairWaves, enquiry: "Cutting & styling" },
  { id: "colour", title: "Colour", summary: "From a gloss or root refresh to a full change of colour, planned with you at a consultation and always patch tested first.", photo: photos.colourTools, enquiry: "Colour" },
  { id: "balayage", title: "Highlights & balayage", summary: "Hand-painted or foiled brightness placed to suit your cut and your skin tone, and to grow out softly.", photo: photos.hairWaves, enquiry: "Highlights & balayage" },
  { id: "grey", title: "Grey blending", summary: "Softening the contrast of grey rather than hiding it, for colour that is easier to live with between visits.", photo: photos.colourTools, enquiry: "Grey blending" },
  { id: "correction", title: "Corrective colour", summary: "An honest assessment of where your colour is now, and a realistic plan to get it where you want it, sometimes over more than one visit.", photo: photos.colourTools, enquiry: "Corrective colour" },
  { id: "occasion", title: "Occasion & bridal hair", summary: "Up-dos and finished styles for weddings and special days, with a trial beforehand so the morning itself is calm.", photo: photos.chignon, enquiry: "Occasion & bridal hair" },
];

/** Gallery: illustrative until Laura's own work is supplied. Ratios give the asymmetric rhythm. */
export const gallery: { photo: Photo; ratio: "tall" | "wide" | "square"; caption: string }[] = [
  { photo: photos.hairWaves, ratio: "wide", caption: "Copper, soft waves" },
  { photo: photos.chignon, ratio: "tall", caption: "Low chignon" },
  { photo: photos.colourTools, ratio: "square", caption: "Colour, mixed by hand" },
  { photo: photos.salonChair, ratio: "tall", caption: "The chair" },
];

/** Verbatim Google reviews, each with the reviewer's permission. Empty until approved. */
export const reviews: { quote: string; name: string; service?: string; url: string }[] = [];

/** Team members as supplied by the salon. Laura is named in the business itself. */
export const team: { name: string; role: string; bio?: string; portrait?: Photo }[] = [
  { name: "Laura Anderson", role: "Salon owner" },
];

export const nav = [
  { label: "Services", href: "#services" },
  { label: "Our salon", href: "#salon" },
  { label: "Hair gallery", href: "#gallery" },
  { label: "Contact", href: "#visit" },
];

export const enquiryEndpoint = (import.meta.env.PUBLIC_ENQUIRY_ENDPOINT as string | undefined) || "";

/** Responsive widths up to the source's own width, so a small placeholder is never upscaled. */
export const widthsFor = (src: ImageMetadata, wanted = [400, 640, 960, 1280, 1600, 2000]) => {
  const ws = wanted.filter((w) => w < src.width);
  return [...ws, src.width];
};
