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
