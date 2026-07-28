/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// Package internal diekspor sebagai source TS/TSX, jadi Next harus ikut meng-compile-nya.
	transpilePackages: ["@tinyverse/ui-kit", "@tinyverse/clinical-core", "@tinyverse/data-access", "@tinyverse/billing"],
}

export default nextConfig
