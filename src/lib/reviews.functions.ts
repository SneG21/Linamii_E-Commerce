import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type ProductReview = {
  id: number;
  title: string | null;
  body: string;
  rating: number;
  name: string;
  verified: boolean;
  createdAt: string;
  pictures: string[];
};

const SHOP_DOMAIN = "4uvgaa-qr.myshopify.com";

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(html: string): string {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
      .replace(/<[^>]+>/g, "")
  ).trim();
}

function pick(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m && m[1] !== undefined ? m[1] : null;
}

function parseWidget(widget: string): ProductReview[] {
  const blocks = widget.split(/<div class='jdgm-rev jdgm-divider-top'/).slice(1);
  return blocks.map((block, i) => {
    const verified = /data-verified-buyer='true'/.test(block);
    const rating = Number(pick(block, /jdgm-rev__rating' data-score='(\d+)'/) ?? 0);
    const createdAt = pick(block, /datetime='([^']+)'/) ?? "";
    const name = stripTags(pick(block, /<span class='jdgm-rev__author'>([\s\S]*?)<\/span>/) ?? "") || "Anonymous";
    const titleRaw = stripTags(pick(block, /<b class='jdgm-rev__title'>([\s\S]*?)<\/b>/) ?? "");
    const body = stripTags(pick(block, /<div class='jdgm-rev__body'>([\s\S]*?)<\/div>/) ?? "");
    const picsHtml = pick(block, /<div class='jdgm-rev__pics'>([\s\S]*?)<\/div>/) ?? "";
    const pictures = [...picsHtml.matchAll(/(?:src|data-src)='(https:[^']+)'/g)]
      .map((m) => m[1])
      .filter((u): u is string => !!u);
    return {
      id: i + 1,
      title: titleRaw || null,
      body,
      rating,
      name,
      verified,
      createdAt,
      pictures,
    };
  });
}

export const getProductReviews = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ handle: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }): Promise<ProductReview[]> => {
    const token = process.env["JUDGEME_API_TOKEN"];
    if (!token) return [];
    const base = `https://judge.me/api/v1/widgets/product_review?shop_domain=${SHOP_DOMAIN}&api_token=${encodeURIComponent(token)}&handle=${encodeURIComponent(data.handle)}&per_page=20`;
    const all: ProductReview[] = [];
    try {
      for (let page = 1; page <= 20; page++) {
        const res = await fetch(`${base}&page=${page}`);
        if (!res.ok) break;
        const json = (await res.json()) as { widget?: string };
        const batch = parseWidget(json.widget ?? "");
        all.push(...batch);
        if (batch.length < 20) break;
      }
    } catch {
      return [];
    }
    return all
      .map((r, i) => ({ ...r, id: i + 1 }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  });
