/*
 * Ikon layar Racik Puyer — disalin PERSIS dari public/puyer-tool.html.
 * Tidak ada bentuk, ukuran, maupun warna yang diubah.
 */
import type { JSX } from "react";

const sejajar = { display: "inline-block", verticalAlign: "middle", marginRight: 4 } as const;

export function IkonJudulPuyer(): JSX.Element {
	return (
		<svg width="32" height="32" viewBox="0 0 24 24" fill="none">
			<rect width="24" height="24" rx="6" fill="#F5F3FF" />
			<path d="M5 11C5 11 4 17 12 17C20 17 19 11 19 11H5Z" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1.8" strokeLinejoin="round" />
			<path d="M15 4L11 12" stroke="#6D28D9" strokeWidth="2.2" strokeLinecap="round" />
			<rect x="4" y="19" width="16" height="2" rx="1" fill="#7C3AED" />
		</svg>
	);
}

export function IkonPeringatanBesar(): JSX.Element {
	return (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
			<path d="M12 3L1 21H23L12 3Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.8" strokeLinejoin="round" />
			<path d="M12 9V14M12 17H12.01" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
		</svg>
	);
}

export function IkonPasien(): JSX.Element {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
			<circle cx="12" cy="8" r="4" fill="#C4B5FD" stroke="#7C3AED" strokeWidth="1.5" />
			<path d="M5 20C5 16.1 8.1 13 12 13C15.9 13 19 16.1 19 20" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

export function IkonTimbangan(): JSX.Element {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
			<path d="M12 3V21M6 7H18M4 14L8 7M16 7L20 14M5 14H11M13 14H19" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

export function IkonUsia(): JSX.Element {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
			<circle cx="12" cy="12" r="8" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1.5" />
			<circle cx="9" cy="11" r="1" fill="#6D28D9" />
			<circle cx="15" cy="11" r="1" fill="#6D28D9" />
			<path d="M9.5 15C10.2 16 11 16.5 12 16.5C13 16.5 13.8 16 14.5 15" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round" />
		</svg>
	);
}

export function IkonHitungOtomatis(): JSX.Element {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
			<rect x="3" y="3" width="18" height="18" rx="4" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
			<path d="M7 8H11M9 6V12M13 10H17M13 16H17M15 14V18" stroke="#854D0E" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

export function IkonDaftarObat(): JSX.Element {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
			<rect width="24" height="24" rx="6" fill="#F3E8FF" />
			<path d="M14 14.5L18 10.5" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" />
			<circle cx="9" cy="15" r="3.5" fill="#C084FC" stroke="#7E22CE" strokeWidth="1.5" />
			<path d="M11 6V11" stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" />
			<circle cx="11" cy="13" r="2" fill="#9333EA" />
		</svg>
	);
}

export function IkonTambah(): JSX.Element {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
			<path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
		</svg>
	);
}

export function IkonHitung(): JSX.Element {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
			<rect x="4" y="3" width="16" height="18" rx="3" fill="#BBF7D0" stroke="#15803D" strokeWidth="1.5" />
			<path d="M8 7H16M8 11H12M8 15H16" stroke="#166534" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

export function IkonReset(): JSX.Element {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
			<path d="M4 12C4 7.6 7.6 4 12 4C15.5 4 18.5 6.3 19.5 9.5M20 12C20 16.4 16.4 20 12 20C8.5 20 5.5 17.7 4.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			<path d="M20 5V10H15M4 19V14H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

export function IkonMap(): JSX.Element {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
			<path d="M3 7C3 5.9 3.9 5 5 5H10L12 7H19C20.1 7 21 7.9 21 9V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V7Z" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1.5" />
		</svg>
	);
}

export function IkonSimpan(): JSX.Element {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
			<path d="M19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H16L21 8V19C21 20.1 20.1 21 19 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M17 21V13H7V21M7 3V8H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

export function IkonPakaiTemplate(): JSX.Element {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
			<path d="M3 7C3 5.9 3.9 5 5 5H10L12 7H19C20.1 7 21 7.9 21 9V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V7Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" />
		</svg>
	);
}

export function IkonHapus(): JSX.Element {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
			<path d="M3 6H21M8 6V4C8 3.4 8.4 3 9 3H15C15.6 3 16 3.4 16 4V6M19 6V20C19 20.6 18.6 21 18 21H6C5.4 21 5 20.6 5 20V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

export function IkonDokumen({ size = 20, stroke = "#7C3AED", isian = "#F5F3FF" }: { size?: number; stroke?: string; isian?: string }): JSX.Element {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
			<path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill={isian} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M14 2V8H20" stroke={stroke} strokeWidth="1.8" />
			<path d="M8 13H16M8 17H13" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

export function IkonSalin(): JSX.Element {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
			<rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
			<path d="M5 15H4C3.4 15 3 14.6 3 14V4C3 3.4 3.4 3 4 3H14C14.6 3 15 3.4 15 4V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

export function IkonRingkasan(): JSX.Element {
	return <IkonDokumen size={16} stroke="currentColor" isian="none" />;
}

/* ===== Ikon sebaris untuk catatan hasil ===== */

export function IkonCatatanWarn(): JSX.Element {
	return (
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={sejajar}>
			<path d="M12 3L1 21H23L12 3Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.8" strokeLinejoin="round" />
			<path d="M12 9V14M12 17H12.01" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
		</svg>
	);
}

export function IkonCatatanStop(): JSX.Element {
	return (
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={sejajar}>
			<circle cx="12" cy="12" r="9" fill="#FCA5A5" stroke="#DC2626" strokeWidth="1.8" />
			<path d="M7 12H17" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" />
		</svg>
	);
}

export function IkonCatatanInfo(): JSX.Element {
	return (
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={sejajar}>
			<circle cx="12" cy="12" r="9" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.8" />
			<path d="M12 8V12M12 16H12.01" stroke="#0369A1" strokeWidth="2" strokeLinecap="round" />
		</svg>
	);
}

export function IkonResep(): JSX.Element {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }}>
			<path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#F5F3FF" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M14 2V8H20" stroke="#7C3AED" strokeWidth="1.8" />
			<path d="M8 13H16M8 17H13" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

export function IkonLup(): JSX.Element {
	return (
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={sejajar}>
			<circle cx="11" cy="11" r="7" stroke="#64748B" strokeWidth="1.8" />
			<path d="M16 16L21 21" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}
