import type { CSSProperties } from "react";
type Name =
  | "arrow"
  | "search"
  | "close"
  | "menu"
  | "plus"
  | "chevron"
  | "whatsapp"
  | "globe"
  | "filter"
  | "instagram"
  | "house"
  | "bottle"
  | "drop"
  | "users";
export function Icon({
  name,
  size = 20,
  className,
  style,
}: {
  name: Name;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const paths: Record<Name, React.ReactNode> = {
    arrow: (
      <>
        <path d="M4 12h15M13 5l7 7-7 7" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    plus: <path d="M12 5v14M5 12h14" />,
    chevron: <path d="m8 4 8 8-8 8" />,
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </>
    ),
    house: <><path d="m3 10 9-7 9 7M5 9v12h14V9M10 21v-7h4v7" /></>,
    bottle: <><path d="M9 3h6v4H9zM10 7v3l-4 3v8h12v-8l-4-3V7M6 16h12" /></>,
    drop: <path d="M12 3c-2 4-7 8-7 12a7 7 0 0 0 14 0c0-4-5-8-7-12ZM8 16c0 2 1 3 3 3" />,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M21 21v-2a6 6 0 0 0-4-5" /></>,
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </>
    ),
    filter: (
      <>
        <path d="M4 7h16M4 17h16" />
        <circle cx="8" cy="7" r="2" />
        <circle cx="16" cy="17" r="2" />
      </>
    ),
    whatsapp: (
      <>
        <path d="M20.8 11.6a8.7 8.7 0 0 1-12.7 7.8L3 21l1.6-5A8.7 8.7 0 1 1 20.8 11.6Z" />
        <path d="M8.2 7.6c.2-.5.8-.6 1-.2l1.1 2c.1.3-.1.6-.6 1 .6 1.3 1.5 2.2 2.9 2.8.4-.6.7-.9 1-.7l1.9.9c.5.3.4.9.1 1.4-.5.9-1.7 1.1-2.7.8-3.3-1-5.4-3.1-6.2-5.5-.3-1 .1-1.9.5-2.5Z" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {paths[name]}
    </svg>
  );
}
