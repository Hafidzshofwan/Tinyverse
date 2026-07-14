/**
 * apps/web ESLint config.
 * Extends the shared TinyVerse config (FSD boundary rules) plus the
 * official Next.js Core Web Vitals ruleset.
 */
module.exports = {
	root: true,
	extends: [
    require.resolve("@tinyverse/config/eslint"),
    "next/core-web-vitals",
  ],
}
