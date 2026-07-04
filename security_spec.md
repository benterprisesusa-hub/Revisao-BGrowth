# Security Specification for BGrowth Review Studio Firestore

## 1. Data Invariants
- A screen cannot be loaded or modified without a valid project mapping (`projectId`).
- A comment is an annotation bound to an existing screen and must map to a valid `screenId`.
- History entries record audit trails, they are append-only. No updates or deletions are allowed on history records.
- Document IDs must match the `isValidId` helper pattern and be limited in size to prevent injection attacks.
- All text strings, arrays, and lists must have size restrictions to prevent "Denial of Wallet" exhaustion.

## 2. The "Dirty Dozen" Payloads
These payloads attempt to bypass validation and security checks, and should return `PERMISSION_DENIED`:
1. Project with missing fields or incorrect keys.
2. Project with extremely long name (> 256 characters).
3. Project with corrupted status value type.
4. Screen with invalid `projectId` format (containing special chars).
5. Screen with too many checklist items (> 100 items).
6. Screen with non-string `reviewStatus`.
7. Comment with non-boolean `resolved` field.
8. Comment with extremely large shapes count.
9. Comment with missing `screenId` or incorrect key sizes.
10. History entry with malicious/oversized details.
11. Attempting to update an existing history entry.
12. Attempting to delete a history entry.

## 3. The Test Runner
A test suite (e.g. `firestore.rules.test.ts`) would execute these payloads against the Firestore emulator, validating that they all get rejected by security rules.
