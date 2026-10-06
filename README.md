# Tender Document Package Builder

> **AI DevFest Competition Entry**  
> A pure client-side web application for automated tender compliance verification, exact duplicate detection, and unified PDF document package generation.

---

## 🌟 Overview & Key Features

The **Tender Document Package Builder** simplifies and automates the preparation of public procurement and tender bid document packages. All processing happens locally in the user's browser—guaranteeing 100% data privacy without any backend or external server uploads.

### Core Capabilities

1. **Dynamic Requirements Loading (`requirements.json`)**
   - Supports arbitrary tender requirements structure with mandatory/optional flags and expiry constraints.
   - Professional Tender Information card displaying Tender ID, Title, Procuring Entity, Bidder, and Submission Deadline (e.g. `Submission Deadline: 20 Oct 2026`).

2. **Smart PDF Ingestion & Validation**
   - Drag-and-drop or file selector supporting multiple PDF files (up to 30 files, 50 MB total).
   - Rejection of non-PDF files with clear, user-friendly error messages.
   - Integration with `pdf.js` for precise page count extraction.
   - Resilient error handling for password-protected or corrupted PDFs without crashing.

3. **Binary-Level Exact Duplicate Detection (SHA-256)**
   - Computes cryptographic SHA-256 hashes of raw file byte streams using the browser's native `crypto.subtle.digest`.
   - Detects identical files even if they have completely different filenames.
   - Prevents duplicate files from being assigned to different requirements and blocks invalid package generation with clear explanations.

4. **Document Compliance & Status Engine**
   - Every requirement strictly resolves to exactly one status:
     - **OK**: File matched, valid expiry date on or after submission deadline.
     - **Missing**: Mandatory document with no file matched (*Blocking*).
     - **Expiry date needed**: Expiry required, file matched, date input missing (*Blocking*).
     - **Expired**: Expiry date is before the tender submission deadline (*Blocking*).
     - **Not provided**: Optional document without an assigned file (*Non-blocking*).
   - Real-time recalculation on every user interaction (no page reload needed).

5. **Executive Status Dashboard & Readiness Banner**
   - Live metrics summary: Total Documents, OK, Missing, Expired, Expiry Date Needed, and Optional Not Provided.
   - Prominent **"Package is READY"** or **"Package is NOT READY"** banner with a detailed breakdown of blocking compliance issues.
   - Intelligent **"Auto Match Files"** feature that pairs uploaded documents with checklist items based on token similarity.

6. **Final PDF Generation (`pdf-lib`)**
   - **Page 1 (Cover Page)**: Clean English cover page featuring Tender ID, Tender Title, Procuring Entity, Bidder, Submission Deadline, Package Made Date (today's browser date), and an ordered list of included documents.
   - **Document Order**: Matched documents are appended strictly by `requirements.order` (not upload order).
   - **Dynamic Footers**: Stamped on **every page** (including cover page) in the format `<tender_id> | Page X of Y` with safe bottom margins.
   - Automatic download as `<tender_id>_Package.pdf` (e.g., `T-2026-0417_Package.pdf`) with in-browser preview modal.

7. **Bilingual Support (English | বাংলা)**
   - Instant toggle between English and Bangla across the entire interface: headers, table columns, statuses, readiness alerts, and requirement names (`title_en` vs `title_bn`).

---

## 📁 Project Structure

```text
├── index.html            # Main HTML markup and semantic layout
├── style.css             # Executive modern CSS design system
├── script.js             # State management, PDF processing, validation & generation logic
├── README.md             # Project documentation and guide
├── vendor/               # Offline copies of PDF libraries
│   ├── pdf-lib.min.js    # pdf-lib v1.17.9 (PDF generation, merging & footers)
│   ├── pdf.min.js        # pdf.js v3.11.174 (PDF reading & page counting)
│   └── pdf.worker.min.js # pdf.js web worker
├── sample-pack/          # Extracted official competition sample-pack.zip
│   ├── requirements.json # Official competition requirements schema
│   ├── README.txt        # Pack description
│   └── documents/        # PDF & PNG test documents
│       ├── 01_financial_proposal.pdf
│       ├── 02_technical_proposal.pdf
│       ├── 03_tin_certificate.pdf
│       ├── 04_vat_certificate.pdf
│       ├── bank_solvency.pdf
│       ├── company_logo.png         (PNG file: tests rejection of non-PDFs)
│       ├── experience_cert.pdf
│       ├── experience_cert (1).pdf  (Exact binary duplicate via SHA-256)
│       ├── scan_0042.pdf
│       ├── trade_license_2025.pdf   (Expired license)
│       └── trade_license_2026.pdf   (Valid license)
└── test-data/            # Synthetic unit test data pack
```

---

## 🚀 How to Run

Because this is a pure client-side application, you can run it using any standard local web server.

### Option 1: VS Code Live Server (Recommended)
1. Open the project folder in **Visual Studio Code**.
2. Right-click `index.html` and click **"Open with Live Server"**.
3. The app will open in Google Chrome at `http://127.0.0.1:5500/index.html`.

### Option 2: Python Built-in Server
Open PowerShell or Terminal in the project root:
```bash
python -m http.server 8000
```
Then navigate to: `http://localhost:8000`

### Option 3: Node.js (npx serve or http-server)
```bash
npx serve .
```

---

## 🧪 Testing with Competition Data (`sample-pack.zip`)

1. **Load Requirements**:
   - Drag and drop your `requirements.json` into the upload zone or click **"Open requirements.json"**.
   - Or click **"Load Sample Tender"** in the top navigation bar for instant demonstration.
2. **Upload PDF Documents**:
   - Drag & drop the PDFs from your test pack.
   - Check the **Uploaded Files** table for extracted page counts, file sizes, and duplicate indicators.
3. **Match Documents**:
   - Click **"Auto Match Files"** for automatic smart suggestion, or manually choose from the dropdown.
   - Enter expiry dates for documents that require them.
   - Notice how the status immediately updates to `OK`, `Expired`, `Missing`, or `Expiry date needed`.
4. **Generate Package**:
   - Once all blocking conditions are satisfied, the **"Generate Package"** button activates.
   - Click to compile the combined PDF with English cover page and footer stamping.
   - The file automatically downloads as `<tender_id>_Package.pdf`.
   - Click **"Preview in Browser"** to view the document right inside the app.

---

## 🛡️ Edge Cases & Validation Rules Handled

| Edge Case | Expected Result | Handling in Application |
|---|---|---|
| Non-PDF uploaded (`.txt`, `.docx`, `.png`) | Rejected with clear message | File rejected; error toast: *"Only PDF files are accepted."* |
| Damaged or password-protected PDF | Friendly error, no crash | Identified during `pdf.js` parse; tagged unreadable without crashing |
| Identical content with different filename | Marked as duplicate | SHA-256 computed on bytes; duplicate warning badge & matched filenames listed |
| Duplicate assigned to different requirements | Blocked from package generation | Prevented in dropdown selection & validated before generation |
| Expiry date on exact submission deadline | Status is OK | `expiryDate >= submissionDeadline` evaluates to `OK` |
| Expiry date before submission deadline | Status is Expired | Tagged as `Expired`; blocks package generation |
| Optional document without file | Status is Not provided | Tagged as `Not provided`; does NOT block package generation |
| Language switched to বাংলা | Full UI translations | All labels and requirement titles (`title_bn`) switch instantly |
| Final Cover Page language | English only | Cover page strictly rendered in English per problem statement |

---

## 📜 Compliance & Technologies

- **HTML5 & CSS3**: Vanilla modern styling, responsive typography, WCAG-conscious contrast.
- **JavaScript (ES2022)**: Vanilla JS, Web Crypto API (`SubtleCrypto`).
- **pdf-lib**: Document creation, page merging, English cover page typography, footer stamping.
- **pdf.js**: In-browser PDF parsing and page count determination.
