import type { ButtonHTMLAttributes } from "react"

import styles from "./Button.module.css"

export type ButtonVariant = "primary" | "secondary" | "ghost"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	/** Gaya visual tombol. Default: "primary". */
	variant?: ButtonVariant
}

/**
 * Button primitive TinyVerse.
 * Semua warna berasal dari design tokens (var(--...)), bukan hex hard-code.
 */
export function Button({
	variant = "primary",
	className,
	type = "button",
	...props
}: ButtonProps) {
	const classNames = [styles.btn, styles[variant], className]
		.filter(Boolean)
		.join(" ")

	return <button type={type} className={classNames} {...props} />
}
