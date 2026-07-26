import React from "react";
import { type DenverSector, DENVER_SECTORS } from "./data";

interface SectorIconProps {
  sektor: DenverSector;
  useSvg?: boolean;
  size?: number;
  color?: string;
  className?: string;
}

/**
 * Custom Vector SVG Icons for Denver II Developmental Screening Sectors
 * Designed specifically for Pediatric Development Monitoring.
 */
export const SectorIcon: React.FC<SectorIconProps> = ({
  sektor,
  useSvg = true,
  size = 20,
  color,
  className = "",
}) => {
  const secInfo = DENVER_SECTORS[sektor];
  const activeColor = color || secInfo?.warna || "currentColor";

  if (!useSvg) {
    return <span style={{ fontSize: size, lineHeight: 1 }}>{secInfo?.emoji || "📌"}</span>;
  }

  switch (sektor) {
    case "personal-social":
      // Personal Sosial: Interconnected caring hands & smiling heart child icon
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: "inline-block", verticalAlign: "middle" }}
        >
          {/* Main Parent & Child silhouette with warm interaction */}
          <path
            d="M12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z"
            fill={activeColor}
            fillOpacity="0.2"
            stroke={activeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M6.5 19.5C6.5 16.5 8.8 14 12 14C15.2 14 17.5 16.5 17.5 19.5"
            stroke={activeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Social bonding heart badge */}
          <path
            d="M18.5 7.5C18.5 6.5 17.5 5.5 16.5 6C15.5 6.5 15 7.5 15 7.5C15 7.5 14.5 6.5 13.5 6C12.5 5.5 11.5 6.5 11.5 7.5C11.5 9 15 11 15 11C15 11 18.5 9 18.5 7.5Z"
            fill="#EF4444"
            stroke="#DC2626"
            strokeWidth="0.8"
            transform="scale(0.85) translate(4, 0)"
          />
          {/* Holding hands arc */}
          <path
            d="M4 14.5C5.5 12.5 8 12 10 13"
            stroke={activeColor}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="2 2"
          />
        </svg>
      );

    case "fine-motor-adaptive":
      // Motorik Halus Adaptif: Developmental toy blocks & precision drawing pencil
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: "inline-block", verticalAlign: "middle" }}
        >
          {/* Toy Cube 1 */}
          <rect
            x="3"
            y="11"
            width="8"
            height="8"
            rx="2"
            fill={activeColor}
            fillOpacity="0.18"
            stroke={activeColor}
            strokeWidth="1.8"
          />
          <path d="M7 13.5V16.5M5.5 15H8.5" stroke={activeColor} strokeWidth="1.5" strokeLinecap="round" />
          
          {/* Precision Pencil / Stylus */}
          <path
            d="M20.2 4.8C20.8 5.4 20.8 6.3 20.2 6.9L12.5 14.6L9.5 15.5L10.4 12.5L18.1 4.8C18.7 4.2 19.6 4.2 20.2 4.8Z"
            fill={activeColor}
            fillOpacity="0.3"
            stroke={activeColor}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Fine dexterity arc line */}
          <path
            d="M3 7C6 4 10 4 13.5 6"
            stroke={activeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case "language":
      // Bahasa & Bicara: Speech bubble with vocal resonance waves & music note
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: "inline-block", verticalAlign: "middle" }}
        >
          {/* Main Chat / Speech Bubble */}
          <path
            d="M12 3C7.02944 3 3 6.58172 3 11C3 13.125 4.02058 15.045 5.6885 16.438C5.2343 18.057 4.1558 19.349 4.1205 19.3909C3.9678 19.5606 3.9602 19.8131 4.1017 19.9909C4.2432 20.1687 4.502 20.232 4.7171 20.142C6.8839 19.237 8.6534 18.232 9.5398 17.682C10.334 17.891 11.154 18 12 18C16.9706 18 21 14.4183 21 11C21 6.58172 16.9706 3 12 3Z"
            fill={activeColor}
            fillOpacity="0.18"
            stroke={activeColor}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Vocal sound waves inside */}
          <path
            d="M8.5 11H8.51M12 11H12.01M15.5 11H15.51"
            stroke={activeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Expressive resonance spark */}
          <path
            d="M18.5 5.5L19.5 3.5L21.5 2.5L19.5 1.5L18.5 -0.5L17.5 1.5L15.5 2.5L17.5 3.5L18.5 5.5Z"
            fill="#10B981"
            transform="scale(0.6) translate(14, 2)"
          />
        </svg>
      );

    case "gross-motor":
      // Motorik Kasar: Running/Active child motion with balance footprint
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ display: "inline-block", verticalAlign: "middle" }}
        >
          {/* Head */}
          <circle cx="13.5" cy="5.5" r="2.5" fill={activeColor} fillOpacity="0.25" stroke={activeColor} strokeWidth="1.8" />
          {/* Active posture body */}
          <path
            d="M8 12L12 9.5L15.5 11.5L19 10"
            stroke={activeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 9.5V14.5L9 19.5M12 14.5L16 19.5"
            stroke={activeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Motion velocity line */}
          <path d="M3 15H6M4 18H7" stroke={activeColor} strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
        </svg>
      );

    default:
      return <span>{secInfo?.emoji || "📌"}</span>;
  }
};
