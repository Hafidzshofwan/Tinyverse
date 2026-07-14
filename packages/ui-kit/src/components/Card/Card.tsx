import type { HTMLAttributes } from "react"

import styles from "./Card.module.css"

export type CardProps = HTMLAttributes<HTMLDivElement>

/**
 * Card primitive TinyVerse.
 * Menggunakan token permukaan (--putih), garis (--etail-line),
 * dan bayangan lembut (--etail-soft-shadow).
 */
export function Card({ className, ...props }: CardProps) {
	const classNames = [styles.card, className].filter(Boolean).join(" ")

	return <div className={classNames} {...props} />
}
