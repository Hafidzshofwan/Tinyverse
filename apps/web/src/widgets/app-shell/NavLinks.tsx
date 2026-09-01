"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavGroup } from "./nav-config";
import {
  SidebarIcon,
  usePembelajaranMenuTitle,
} from "@/shared/ui";

export interface NavLinksProps {
  groups: ReadonlyArray<NavGroup>;
  query?: string;
}

export function NavLinks({ groups, query }: NavLinksProps) {
  const pathname = usePathname();
  const pembelajaranTitle = usePembelajaranMenuTitle();

  const q = (query ?? "").trim().toLowerCase();
  const shown = q
    ? groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => {
            const label =
              item.slug === "pembelajaran"
                ? pembelajaranTitle.label
                : item.label;
            return label.toLowerCase().includes(q);
          }),
        }))
        .filter((group) => group.items.length > 0)
    : groups;

  if (shown.length === 0) {
    return <p className="tv-nav-empty">Tidak ada menu yang cocok.</p>;
  }

  return (
    <nav className="tv-nav">
      {shown.map((group) => {
        return (
          <div key={group.title} className="tv-side-grup">
            <div className="tv-side-judul">
              <span>{group.title}</span>
            </div>
            {group.items.map((item) => {
              const active = pathname === item.href;
              const cls =
                "tv-nav-item" +
                (active ? " aktif" : "") +
                (item.emergency ? " emergency" : "");
              const label =
                item.slug === "pembelajaran"
                  ? pembelajaranTitle.label
                  : item.label;

              return (
                <Link key={item.slug} href={item.href} className={cls}>
                  <span
                    className="tv-nav-ico"
                    aria-hidden
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <SidebarIcon slug={item.slug} size={20} />
                  </span>
                  <span className="tv-nav-label">{label}</span>
                  {item.built ? null : (
                    <span className="tv-nav-soon">Segera</span>
                  )}
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}


