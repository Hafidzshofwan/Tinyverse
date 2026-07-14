import type { Preview } from "@storybook/react"

// Muat design tokens (P2) agar semua CSS variable tersedia di Storybook.
import "../src/tokens/tokens.css"

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
}

export default preview
