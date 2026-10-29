type Props = { id: string; group: "notes" | "families"; label: string; className: string };
const familyMotifs: Record<string, string> = {
  aquatic: "water", woody: "wood", aromatic: "herb", citrus: "lemon", amber: "amber",
  fruity: "pear", gourmand: "vanilla", floral: "rose", green: "herb", spicy: "oud", musky: "jasmine",
};

/** Original ingredient/category illustrations, never a perfume bottle labelled as a note. */
export function ScentVisual({ id, group, label, className }: Props) {
  const motif = group === "families" ? familyMotifs[id] || "herb" : id;
  return <svg className={className} data-scent={id} role="img" aria-label={label} viewBox="0 0 180 150" fill="none">
    <ellipse cx="90" cy="132" rx="57" ry="6" fill="#07363c" opacity=".07" />
    {motif === "lavender" ? <>
      {[[-22, -8], [0, 0], [25, -5]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${(i - 1) * 13} 90 125)`}>
        <path d="M90 130V41M90 105q-18-15-23-5 4 13 23 5M90 94q18-15 23-6-5 13-23 6" stroke="#58744e" strokeWidth="3" strokeLinecap="round" />
        {[0, 1, 2, 3, 4].map((n) => <g key={n} transform={`translate(0 ${n * 11})`}><ellipse cx="85" cy="37" rx="5" ry="8" transform="rotate(-32 85 37)" fill="#8d78ab" /><ellipse cx="95" cy="35" rx="5" ry="8" transform="rotate(32 95 35)" fill="#b6a2cf" /></g>)}
      </g>)}
    </> : motif === "lemon" || motif === "bergamot" ? <>
      <path d="M81 37q12-26 41-17-7 23-41 17" fill="#6d8b55" />
      <ellipse cx="77" cy="85" rx="47" ry="33" transform="rotate(-28 77 85)" fill={motif === "lemon" ? "#e4be42" : "#8ba955"} />
      <path d="M39 93q-8 10-13 4M113 60q8-10 14-3" stroke={motif === "lemon" ? "#d1a82e" : "#718d42"} strokeWidth="6" strokeLinecap="round" />
      <circle cx="115" cy="100" r="33" fill={motif === "lemon" ? "#e7c456" : "#91ab62"} />
      <circle cx="115" cy="100" r="28" fill="#fff4cb" />
      <circle cx="115" cy="100" r="24" fill={motif === "lemon" ? "#f0d35e" : "#bbcf80"} />
      {[0, 45, 90, 135].map((r) => <path key={r} d="M115 77v46" transform={`rotate(${r} 115 100)`} stroke="#fff8dc" strokeWidth="2.5" />)}
    </> : motif === "amber" ? <>
      <path d="m39 83 21-40 45-13 30 34-12 58-51 11Z" fill="#bd7f35" />
      <path d="m60 43 45-13 10 43-43 18Z" fill="#e8bc69" />
      <path d="m72 91 43-18 8 49-51 11Z" fill="#d49a43" />
      <path d="m105 30 30 34-20 9Z" fill="#f1cf8c" />
      <path d="m30 113 13-15 21 13-8 23-23-4Z" fill="#dcb260" />
      <path d="m123 123 9-20 23 4-5 24Z" fill="#bd873d" />
      <path d="m70 54 26-9M81 100l22-10" stroke="#fff0c4" strokeWidth="4" strokeLinecap="round" opacity=".7" />
    </> : motif === "oud" || motif === "wood" ? <>
      <path d="m33 101 19-61 53 9-21 77Z" fill="#76513b" />
      <path d="m57 46 10 2-20 61-8-5ZM78 50l10 2-20 67-9-3" fill="#a17a55" />
      <path d="m90 121 12-67 39 14 7 58Z" fill="#5c4232" />
      <path d="m112 70-7 46M124 76l-5 39M75 67l-9 31" stroke="#bd966b" strokeWidth="3" strokeLinecap="round" />
      {motif === "wood" && <><ellipse cx="119" cy="70" rx="26" ry="14" fill="#cda77b" /><ellipse cx="119" cy="70" rx="17" ry="8" stroke="#8f6846" /><ellipse cx="119" cy="70" rx="7" ry="3" stroke="#8f6846" /></>}
    </> : motif === "jasmine" ? <>
      <path d="M72 128q8-50 51-83M88 93q-27-15-39 1 20 17 39-1M105 71q7 24 28 18-2-23-28-18" fill="#698b61" />
      <path d="M72 128q8-50 51-83" stroke="#4e7456" strokeWidth="3" />
      {[[68, 66], [118, 47], [115, 106]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}>
        {[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cx="0" cy="-13" rx="9" ry="17" transform={`rotate(${r})`} fill="#fffef6" stroke="#dfd9c7" />)}
        <circle r="6" fill="#d4b15c" />
      </g>)}
    </> : motif === "vanilla" ? <>
      <path d="M49 123Q63 71 114 32M62 128Q82 84 139 58M79 130q16-39 46-56" stroke="#584436" strokeWidth="9" strokeLinecap="round" />
      <path d="M49 123Q63 71 114 32M62 128Q82 84 139 58" stroke="#a47c4d" strokeWidth="1.5" />
      <g transform="translate(57 57)">{[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cx="0" cy="-13" rx="9" ry="19" transform={`rotate(${r})`} fill="#fff1c2" stroke="#d4b991" />)}<circle r="9" fill="#d2a94f" /></g>
    </> : motif === "rose" ? <>
      <path d="M90 129V85M90 112q-28-26-41-11 10 25 41 11M90 123q29-24 42-11-14 23-42 11" fill="#618267" />
      <path d="M90 129V85" stroke="#3c6654" strokeWidth="3" />
      <path d="M88 94Q39 82 52 48q-7-21 19-20 17-23 35-4 30-1 27 25 17 31-13 41Z" fill="#c77d85" />
      <path d="M88 86Q59 72 67 49q10-16 27-8 23-9 28 12-2 27-34 33Z" fill="#dfa0a2" />
      <path d="M88 77Q73 58 88 49q18-6 23 9-4 14-23 19Z" fill="#b96977" />
      <path d="M87 70q-4-13 9-14 9 4 2 12" stroke="#f2bfc0" strokeWidth="4" strokeLinecap="round" />
    </> : motif === "water" ? <>
      <circle cx="106" cy="54" r="25" fill="#d4b991" />
      {[0, 1, 2].map((n) => <path key={n} d="M28 85q20-22 40 0t40 0t40 0" transform={`translate(0 ${n * 17})`} stroke={["#436f75", "#71999d", "#a8c4c2"][n]} strokeWidth="8" strokeLinecap="round" />)}
    </> : motif === "pear" ? <>
      <path d="M90 41q-9-17 0-24" stroke="#74543a" strokeWidth="5" strokeLinecap="round" />
      <path d="M92 32q9-22 30-12-8 18-30 12" fill="#648157" />
      <path d="M90 36c-24 0-16 31-37 49-26 27-4 51 37 51s64-24 37-51c-22-18-13-49-37-49" fill="#b0b669" />
      <path d="M76 51q-7 32-23 49" stroke="#d9dba0" strokeWidth="7" strokeLinecap="round" />
    </> : <>
      <path d="M88 133V33M88 65Q49 25 36 45q8 30 52 20M88 88Q47 58 35 80q15 25 53 8M88 115q-37-27-49-7 14 24 49 7M88 54q31-35 49-19-7 28-49 19M88 78q38-24 51-3-13 26-51 3M88 105q34-23 47-3-13 25-47 3" fill="#789670" />
      <path d="M88 133V33" stroke="#466d54" strokeWidth="3" strokeLinecap="round" />
    </>}
  </svg>;
}
