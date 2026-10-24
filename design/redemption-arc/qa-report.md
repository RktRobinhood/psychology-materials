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

## Paper printing, brief summaries and active typing (v2.5, 2026-10-24)

- PASS: final Print on paper / Save as PDF route and Mac Command+P / Windows Ctrl+P instructions preserved; full static answer text, print-specific typography, A4 margins, wrapping, QR and identity footer. Setup native printing prepares a question sheet; Print current work marks an unfinished run as a draft and does not lock/pause it.
- PASS: isolated browser fixture stubs only the native print dialog and forces QR failure. Both draft/final print buttons invoke printing and contain the complete escaped answer, Danish letters and a concise summary; the final run remains locked and print stays enabled while PDF preparation is unavailable. Zero console errors. Native Mac/physical printer output was not hardware-tested.
- PASS: actual browser Q4 writing in all five fields, finish/lock and four-row student summary. Teacher QR report still decodes and includes active-only rates/sample status and the reference explanation. Laptop 1366x650 and phone 375x812 have no horizontal overflow; browser viewport restored.
- PASS: cadence tests for 60 WPM, five-minute idle gap, field changes, blur/reset, deletion/composition, hidden/unfocused input, insufficient samples and partial legacy runs. No idle tail enters the new average. A stable 80 WPM average creates the above-reference note; a sustained 150 WPM peak creates the high-rate review flag. Average, peak and their signed difference are retained in the QR.
- PASS: old QR decoding, checksum handling, clipboard/large-insertion protections and input-source counters. New rate values are validated; missing old rates remain unavailable rather than invented.
- PASS: three-page PDF rendered and visually checked; full essay and Danish characters retained. Sample summary shows 59 WPM average, 96 WPM five-second peak and +37 WPM difference, with concise table and fingerprints. Detailed event/counter lists remain in the QR report rather than the student table.
- Reference: Aalto/Cambridge keyboard transcription study, 168,000 volunteers, mean 52 WPM and typical range 30-60 WPM. https://www.aalto.fi/en/news/the-traits-of-fast-typists-discovered-by-analysing-136-million-keystrokes . Above 120 WPM is a contextual review policy, not a validated human ceiling. The active-only essay metric differs from the study task.
- Automated checks: node design/redemption-arc/integrity-checks.mjs; production build. No new asset downloads, services or editable exports.
