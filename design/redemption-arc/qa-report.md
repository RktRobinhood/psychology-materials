# Redemption Arc: export maintenance checks

2026-10-24. Targeted regression pass, not a full academic or lesson audit.

- PASS: Q4 start, type in all five sections, finish, lock, and display submission.
- PASS: submission has PDF download/open/print only; editable export controls and handlers removed.
- PASS: embedded PDF generator produces a valid two-page application/pdf document, reloadable by PDFLib; Danish author/title survive. Browser displays the prepared-PDF link.
- PASS: forced QR failure in an ignored local fixture leaves Print enabled and includes the full Q5 answer, escaped special characters, Danish letters, timestamps and session counts. Print invocation verified with a fixture stub; native print dialog not automated.
- PASS: 1366x650 laptop and 375x812 phone layouts, no sideways overflow in submission.
- PASS: local run survives reload; history still available without a JSON export.
- PASS: inline scripts parse, removed export IDs have no remaining handlers; production build passes.
- Source comment records independent-human assessment rules without claiming a technical block.
- Limits: in-app browser download-event capture timed out; file generation validated separately using the embedded generator. Actual iPhone share/save and physical QR scanning not tested.

## Integrity deterrents (v2.4, 2026-10-24)

- Scope: user chose the single HTML file, without a hosted signing service. No client-side secrets, pseudo-signatures, QR passwords or authenticity guarantees were added.
- PASS: normal browser Q5 run completes; the actual QR link opens its report, shows the new counters and explicitly says unsigned. Zero browser console errors.
- PASS: old saved v2.3 run reopens. Automated checks cover full v2 and compact v3 QR decoding, absent counters, malformed new counters, checksum mismatches and the ability to recompute an unsigned checksum.
- PASS: script-dispatched input events with changed text increment counters and flags; no-change events, normal typing and internal audit/composition wrappers do not. Existing clipboard and large insertion protections hold. No raw input content is added to logs.
- PASS: generated three-page PDF rendered with Poppler and every page inspected. Faint run-specific watermarks and identity/fingerprint footers are readable; full hashes appear in the process summary. Text extraction confirms all five complete answers and Danish letters survive page breaks.
- PASS: process report at 1366x650 and 375x812, without horizontal overflow; print-area identity stamp and new summary count present. Browser viewport restored. Native paginated printing and physical phone-camera scanning were not hardware-tested.
- PASS: production build and design/redemption-arc/integrity-checks.mjs. Sample PDF/screenshots remain ignored in work/redemption-integrity/.
- Boundary: script-event counts do not detect all automation and are not findings of misconduct. Watermarks and matching fingerprints are consistency cues; a student controlling the browser can forge/recompute records.
