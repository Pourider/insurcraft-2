# Vendored libraries (InsurCraft Fácil)

These files are copied from npm, not installed by a package manager, so Dependabot cannot see
them. Check the advisories for each one at least monthly and before every release:

| File | Package | Version | Licence | Advisories |
|---|---|---|---|---|
| `pdf-lib.esm.min.js` | `@cantoo/pdf-lib` | 2.11.1 | MIT | https://github.com/advisories?query=pdf-lib |
| `pdf.min.mjs`, `pdf.worker.min.mjs` | `pdfjs-dist` (legacy build) | 4.10.38 | Apache-2.0 | https://github.com/mozilla/pdf.js/security/advisories |
| `fflate.js` | `fflate` (esm/browser.js) | 0.8.2 | MIT | https://github.com/advisories?query=fflate |

To update: `npm i <package>@<version>` in a scratch folder, copy the same files over these, run
the browser tests, and update this table and `vendor/licenses/`.

Note on pdf.js: versions before 4.2.67 were affected by CVE-2024-4367 (arbitrary JavaScript when
rendering a crafted font). 4.10.38 is not affected, and the app also loads documents with
`isEvalSupported: false`.
