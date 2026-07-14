import type { Config } from "tailwindcss"
import sharedPreset from "@tinyverse/config/tailwind"

const config: Config = {
	presets: [sharedPreset],
	content: ["./src/**/*.{ts,tsx,mdx}"],
	theme: { extend: {} },
	plugins: [],
}

export default config
