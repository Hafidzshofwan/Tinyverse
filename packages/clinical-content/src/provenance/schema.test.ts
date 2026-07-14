import { describe, it, expect } from "vitest"
import { provenanceSchema } from "./schema"

describe("provenanceSchema", () => {
	it("menerima provenance valid", () => {
		const p = provenanceSchema.parse({
			source: "TinyVerse v17",
			version: "v17",
			effectiveDate: "2026-07-12",
		})
		expect(p.source).toBe("TinyVerse v17")
	})

	it("menolak effectiveDate non-ISO", () => {
		expect(() =>
			provenanceSchema.parse({
				source: "x",
				version: "v1",
				effectiveDate: "12-07-2026",
			}),
		).toThrow()
	})

	it("menolak source kosong", () => {
		expect(() =>
			provenanceSchema.parse({ source: "", version: "v1", effectiveDate: "2026-07-12" }),
		).toThrow()
	})
})
