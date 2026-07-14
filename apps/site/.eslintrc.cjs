/**
 * apps/site ESLint config.
 * Mengikuti config TinyVerse bersama + ruleset resmi Next.js Core Web Vitals,
 * sama seperti apps/web.
 */
module.exports = {
	root: true,
	extends: [
    require.resolve("@tinyverse/config/eslint"),
    "next/core-web-vitals",
  ],
}
