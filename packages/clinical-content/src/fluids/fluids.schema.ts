import { z } from "zod"
import { versionedContentSchema, type VersionedContent } from "../content/versioned"

const maintenanceSchema = z.object({
	method: z.literal("Holliday-Segar"),
	firstTierMaxKg: z.number().positive(),
	firstTierMlPerKg: z.number().positive(),
	secondTierMaxKg: z.number().positive(),
	secondTierBaseMl: z.number().positive(),
	secondTierMlPerKg: z.number().positive(),
	thirdTierBaseMl: z.number().positive(),
	thirdTierMlPerKg: z.number().positive(),
})

const dripFactorsSchema = z.object({
	makro: z.number().positive(),
	mikro: z.number().positive(),
})

const stageSchema = z.object({
	mlPerKg: z.number().positive(),
	hours: z.number().positive(),
})

const stagePairSchema = z.object({
	stage1: stageSchema,
	stage2: stageSchema,
})

const rehydrationSchema = z.object({
	planB: z.object({
		mlPerKg: z.number().positive(),
		overHours: z.number().positive(),
	}),
	planC: z.object({
		bayi: stagePairSchema,
		anak: stagePairSchema,
	}),
})

/** Skema bentuk data konten Fluids (tanpa provenance). */
export const fluidsDataSchema = z.object({
	maintenance: maintenanceSchema,
	dripFactors: dripFactorsSchema,
	rehydration: rehydrationSchema,
})

/** Skema lengkap: data Fluids + provenance. */
export const fluidsContentSchema = versionedContentSchema(fluidsDataSchema)

export type FluidsData = z.infer<typeof fluidsDataSchema>
export type FluidsContent = VersionedContent<FluidsData>
