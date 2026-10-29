# Bulk CSV import plan — 1,000 products

**Deliverable:** implementation plan only. There is no bulk uploader/import job in the demo. `admin:seed` initializes the existing 100 curated records; it is not a general CSV importer.

## Contract and scope

Use UTF-8 (optional BOM), comma-separated CSV with RFC-style double-quote escaping and one header row. Use a real streaming CSV parser in the future implementation; do not split lines on commas because descriptions/JSON cells can contain commas and quoted newlines. Enforce file/row/field size limits before work is queued. Start with 20 MB/file, 2,000 rows/file and the field limits in `product-validation.ts`; make these server-enforced, documented limits.

Required headers, in this order for generated templates:

```text
id,slug,brand,name,sizeLabel,concentrationEn,concentrationAr,gender,familyIds,notesEn,notesAr,descriptionEn,descriptionAr,imageSrc,caveatEn,caveatAr,featured
```

| Column | Rule |
| --- | --- |
| `id` | Stable ID, 1–50 letters/digits/underscore/hyphen; never reuse an unrelated supplier's identifier without mapping |
| `slug` | Stable lowercase ASCII hyphenated URL slug, at most 160 characters; immutable after first creation |
| `brand`, `name`, `sizeLabel` | Nonempty text, at most 200 characters; preserve official names and supplied size |
| `concentrationEn`, `concentrationAr` | Exact supported pair from `src/i18n/taxonomy.ts` |
| `gender` | `men`, `women`, or `unisex`; do not invent a classification to fill a required cell |
| `familyIds` | JSON array of supported family IDs; at least one; no free-text categories |
| `notesEn`, `notesAr` | JSON arrays, at most 50 paired entries in corresponding order; empty arrays allowed; no invented note pyramid |
| `descriptionEn`, `descriptionAr` | Nonempty, at most 3,000 characters each; approved factual content |
| `imageSrc` | Asset manifest key/path for an approved existing local image; no URL fetches or path traversal from CSV |
| `caveatEn`, `caveatAr` | Nonempty photo/reference disclosure, at most 3,000 characters |
| `featured` | Literal `true` or `false`, parsed strictly |

Unknown columns are errors, especially prices/costs/private research. The current public `Product` schema remains an explicit allowlist. The eventual importer must define any additional schema/version changes before accepting them.

## Valid bilingual example

This illustrative row uses the existing P0028 identity and approved local image. It is not a claim of client stock or a command to overwrite current content.

```csv
id,slug,brand,name,sizeLabel,concentrationEn,concentrationAr,gender,familyIds,notesEn,notesAr,descriptionEn,descriptionAr,imageSrc,caveatEn,caveatAr,featured
P0028,armaf-club-de-nuit-iconic-p0028,Armaf,Club de Nuit Iconic,105 ml,Eau de Parfum,ماء عطر,men,"[""amber""]","[""Mint""]","[""النعناع""]",Discover the selected notes and enquire for availability.,تعرّف على النفحات المختارة واستفسر عن التوفر.,/perfumes/P0028.webp,Reference photograph; size and packaging may differ.,صورة مرجعية؛ قد يختلف الحجم والتغليف.,false
```

## Invalid examples and expected errors

- Two rows with `id=P0028`: both affected row numbers reported as duplicate ID; neither silently wins.
- A new ID with existing slug `armaf-club-de-nuit-iconic-p0028`: slug conflict; no overwrite by slug.
- Empty `descriptionAr`: `Arabic description is required` on that row.
- `familyIds=["unknown"]`: unsupported family; do not automatically create a taxonomy term.
- `notesEn=["Mint","Lemon"]`, `notesAr=["النعناع"]`: unpaired note counts.
- `imageSrc=../../.env` or a remote URL: unsafe image reference.
- Safe-looking but absent image path: missing approved asset; hold the row until asset preparation completes.
- `featured=yes`: invalid boolean; only `true`/`false` accepted.
- Existing ID with a different slug: immutable identity conflict; requires an explicit separate URL-migration process.
- Supplier `cost`/`prices` column: forbidden schema input, even if every other cell is valid.

## Future execution flow

1. **Prepare assets separately.** Confirm rights and identity, derive safe filenames, generate an allowlisted asset manifest, and review crops/labels. Current validation only accepts the 100 curated image paths; new images require a reviewed manifest change. Never auto-download arbitrary CSV URLs.
2. **Authenticated upload + dry run.** Validate operator permission and origin, apply size limits, store input outside `public/`, compute a SHA-256 file hash, parse every row, normalize whitespace and validate against the product/asset contract. Report physical record number, field, code and a safe message.
3. **Explicit mode.** Choose create-only or upsert-by-ID. Create-only rejects existing IDs. Upsert shows every proposed changed field and rejects changes to immutable ID/slug. Omitted rows are never deleted. Read existing versions/checksums so later admin edits cannot be overwritten silently.
4. **Review and confirm.** Display counts: total, valid, invalid, creates, updates, unchanged. Block execution until all errors are resolved. Require explicit confirmation of the diff, file hash and mode; changing the file invalidates approval.
5. **Back up.** Take a consistent database snapshot and asset-manifest snapshot before mutation. Record a job ID, schema version, file hash and operator ID, without credentials or secret data in logs.
6. **Stage and apply.** Stage validated rows under that job. Process bounded batches of 100 in a single-writer job queue; each batch transaction stores before-images and its checkpoint alongside product writes. A failure rolls back the whole failed batch. Earlier committed batches are explicitly marked applied, not falsely described as rolled back.
7. **Resume safely.** Verify the same file hash/schema/mode. Resume from committed checkpoints, use stable IDs and expected existing-record versions, and do not reapply successful batches. Stop on a concurrent-edit conflict for human reconciliation.
8. **Rollback/reconcile.** Pause new writes, preview rollback from recorded before-images and newly created IDs. Undo only rows whose current version still matches the import's version; newer manual edits require explicit conflict resolution. Restore the consistent full backup only with maintenance downtime and approval if whole-site rollback is chosen. Do not silently discard later work.
9. **Verify and report.** Reconcile total input against created/updated/unchanged/rejected counts and run product/asset safety checks. Check English/Arabic catalogue search, each locale's routes, sitemap refresh and a representative mobile/RTL sample. Archive the job summary and securely expire raw CSVs on a documented retention schedule.

Re-running an already completed job with the same file hash and mode returns its prior result or an explicit unchanged preview, never duplicate records. Import errors must never partially overwrite a record. A transaction alone does not solve cross-batch rollback or concurrent editing; use the checkpoints/version checks above.

## Spreadsheet and data safety

Render submitted text as text, not HTML. Error-report CSVs and spreadsheet-facing exports must neutralize cells beginning with `=`, `+`, `-`, `@`, tab or carriage return (for example by prefixing a single quote) and quote/escape them with the CSV library. Keep the original validated value internally; document export escaping rather than rewriting legitimate names in the database.

Do not put raw upload files, supplier commercial data, original research or error exports under `public/`. Replacing the temporary demo inventory requires a separate approved dataset/version and reconciliation; it is not an accidental consequence of uploading a CSV.

## Acceptance tests for the later importer

- A 1,000-row valid fixture results in exactly 1,000 accepted distinct identities (or the documented create/update/unchanged split against existing data).
- Repeating the same import creates zero duplicate IDs/slugs and preserves stable URLs.
- Invalid UTF-8/CSV/JSON cells, duplicate IDs/slugs, missing Arabic, unknown taxonomy and unsafe/missing assets fail with actionable row errors.
- Injected failure mid-batch leaves that batch unchanged; restart resumes only after the last committed checkpoint.
- Concurrent admin edits trigger a conflict rather than silent lost updates.
- Rollback restores eligible before-images and reports newer conflicting changes separately.
- Public product data contains no unexpected/private fields; spreadsheet reports cannot execute formulas.
- Bilingual search, metadata, sitemap and WhatsApp identity match the imported records.

Implementation estimates for this production-oriented importer are outside the current demo. The checklist asks for this plan, not its execution.
