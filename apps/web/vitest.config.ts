import { defineConfig } from "vitest/config"

/**
 * Konfigurasi test untuk apps/web.
 *
 * WHY: tiga file test logika murni (skor klinis, z-score pertumbuhan, racik
 * puyer) sudah lama ada di src/ tetapi belum pernah bisa dijalankan karena
 * vitest tidak terpasang di paket ini. Cakupan sengaja dibatasi pada file
 * `*.test.ts` (bukan `.tsx`): yang diuji adalah fungsi murni, sehingga
 * environment `node` cukup dan tidak perlu jsdom maupun plugin React.
 */
export default defineConfig({
	test: {
		environment: "node",
		include: ["src/**/*.test.ts"],
	},
})
