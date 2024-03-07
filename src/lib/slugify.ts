import slugify from "slugify";

export function slugifyString(slug: string): string {
    const slugified = slugify(slug);
    return slugified.toLowerCase();
}