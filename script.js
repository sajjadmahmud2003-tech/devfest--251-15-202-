/**
 * Tender Document Package Builder
 * AI DevFest Competition - 100% Client-Side Architecture
 */

(function () {
  'use strict';

  // -------------------------------------------------------------
  // Configuration & Constants
  // -------------------------------------------------------------
  const MAX_FILES = 30;
  const MAX_TOTAL_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

  // Configure pdf.js worker
  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';
  }

  // -------------------------------------------------------------
  // Bilingual Translations (English & Bangla)
  // -------------------------------------------------------------
  const i18n = {
    en: {
      appTitle: 'Tender Document Package Builder',
      appSubtitle: 'AI Procurement Compliance & PDF Generator',
      btnLoadSample: 'Load Sample Requirements',
      btnLoadSampleDocs: 'Load Sample Documents',
      step1Title: 'Requirements',
      step1Desc: 'Load JSON & Tender Info',
      step2Title: 'Upload PDFs',
      step2Desc: 'Drag & drop files',
      step3Title: 'Match & Verify',
      step3Desc: 'Check compliance',
      step4Title: 'Generate Package',
      step4Desc: 'Merged PDF & Download',
      tenderInfoHeading: 'Tender Information',
      tenderInfoSubheading: 'Load requirements.json to inspect tender specifications and mandatory documents.',
      btnSelectJson: 'Open requirements.json',
      dropJsonMain: 'Drag and drop <span class="highlight-code">requirements.json</span> here, or click to browse',
      dropJsonHint: 'Expected format: tender metadata & requirements list',
      labelTenderId: 'Tender ID:',
      labelSubmissionDeadline: 'Submission Deadline',
      labelTenderTitle: 'Tender Title',
      labelProcuringEntity: 'Procuring Entity',
      labelBidder: 'Bidder',
      uploadSectionHeading: 'Upload Tender Documents',
      uploadSectionSubheading: 'Upload tender PDF files. Non-PDF files are automatically rejected. Exact duplicates are detected via SHA-256 binary hash.',
      btnClearUploads: 'Clear All Uploads',
      btnBrowsePdf: 'Select PDF Files',
      dropPdfMain: 'Drag & drop your PDF documents here, or click to browse',
      ruleOnlyPdf: '✓ Only PDF files accepted',
      ruleMaxFiles: '✓ Max 30 files',
      ruleMaxSize: '✓ Max 50 MB total',
      ruleDupDetect: '✓ SHA-256 duplicate detection',
      labelUploadedFiles: 'Uploaded Files:',
      labelTotalSize: 'Total Size:',
      labelDuplicatesFound: 'Duplicates:',
      colFileName: 'File Name',
      colPages: 'Pages',
      colSize: 'Size',
      colDuplicateStatus: 'Duplicate Status',
      colMatchedRequirement: 'Matched Requirement',
      colActions: 'Action',
      checklistHeading: 'Document Compliance & Matching',
      checklistSubheading: 'Match uploaded PDFs to required tender documents and specify validity dates where required.',
      btnAutoMatch: 'Auto Match Files',
      dashTotalDocs: 'Total Documents',
      dashOk: 'OK',
      dashMissing: 'Missing',
      dashExpired: 'Expired',
      dashExpiryNeeded: 'Expiry Date Needed',
      dashNotProvided: 'Optional Not Provided',
      packageReady: 'Package is READY',
      packageReadyDesc: 'All required documents are verified and compliant. Ready to generate.',
      packageNotReady: 'Package is NOT READY',
      packageNotReadyDesc: 'Please resolve the blocking compliance issues below before generating.',
      packageCannotGenerate: 'Package cannot be generated because:',
      emptyRequirements: 'Please load requirements.json above to view document checklist.',
      colOrder: '#',
      colDocName: 'Document Name',
      colRequirement: 'Requirement',
      colExpiryReq: 'Expiry Req.',
      colMatchFile: 'Matched File',
      colExpiryDate: 'Expiry Date',
      colStatus: 'Status',
      mandatoryTag: 'Mandatory',
      optionalTag: 'Optional',
      yesTag: 'Yes',
      noTag: 'No',
      statusOk: 'OK',
      statusMissing: 'Missing',
      statusExpiryNeeded: 'Expiry date needed',
      statusExpired: 'Expired',
      statusNotProvided: 'Not provided',
      duplicateTag: 'Duplicate',
      unassigned: 'Unassigned',
      selectFilePrompt: '-- Select uploaded PDF --',
      generateHeading: 'Generate & Download Package',
      generateSubheading: 'Creates a final combined PDF with English cover page, strict order concatenation, and page-numbered footers.',
      genRule1: 'Cover page (English) with tender metadata, submission deadline & included document list',
      genRule2: 'Documents merged in strict requirements.order',
      genRule3: 'Dynamic footer on EVERY page: <tender_id> | Page X of Y',
      genRule4: 'Automatic download as <tender_id>_Package.pdf',
      btnGeneratePackage: 'Generate Package',
      msgPackageSuccess: 'Package generated successfully.',
      labelFilename: 'File:',
      btnDownloadAgain: 'Download Package',
      btnPreviewPdf: 'Preview in Browser',
      previewHeading: 'Document Preview',
      removeBtnTitle: 'Remove file',
      unmatchBtn: 'Unmatch',
      previewBtn: 'Preview',
      errNonPdf: 'Only PDF files are accepted.',
      errCorruptPdf: 'Unable to read this PDF. Please check that the file is not damaged or password protected.',
      errMaxFiles: 'Maximum 30 files allowed.',
      errMaxSize: 'Maximum total size of 50 MB exceeded.',
      errInvalidJson: 'Invalid requirements.json format. Missing tender or requirements data.',
      errDuplicateConflict: 'Duplicate files cannot be assigned to different requirements.',
      deadlinePrefix: 'Submission Deadline:'
    },
    bn: {
      appTitle: 'দরপত্র নথি প্যাকেজ প্রস্তুতকারক',
      appSubtitle: 'স্বয়ংক্রিয় দরপত্র নথি যাচাইকরণ ও পিডিএফ প্রস্তুতকারক',
      btnLoadSample: 'নমুনা রিকোয়ারমেন্টস লোড করুন',
      btnLoadSampleDocs: 'নমুনা ফাইল লোড করুন',
      step1Title: 'প্রয়োজনীয়তা',
      step1Desc: 'JSON ও দরপত্র তথ্য',
      step2Title: 'পিডিএফ আপলোড',
      step2Desc: 'নথি ড্র্যাগ ও ড্রপ করুন',
      step3Title: 'যাচাই ও মিলকরণ',
      step3Desc: 'নিয়মাবলি যাচাই করুন',
      step4Title: 'প্যাকেজ তৈরি',
      step4Desc: 'সংযুক্ত পিডিএফ ও ডাউনলোড',
      tenderInfoHeading: 'দরপত্র সংক্রান্ত তথ্য',
      tenderInfoSubheading: 'দরপত্রের বিবরণ ও বাধ্যতামূলক নথির তালিকা দেখতে requirements.json ফাইলটি খুলুন।',
      btnSelectJson: 'requirements.json খুলুন',
      dropJsonMain: '<span class="highlight-code">requirements.json</span> ফাইলটি এখানে ড্র্যাগ করুন অথবা নির্বাচন করুন',
      dropJsonHint: 'প্রত্যাশিত ফরম্যাট: দরপত্র মেটাডাটা ও নথির তালিকা',
      labelTenderId: 'দরপত্র নম্বর:',
      labelSubmissionDeadline: 'দাখিলের শেষ সময়',
      labelTenderTitle: 'দরপত্রের শিরোনাম',
      labelProcuringEntity: 'ক্রয়কারী সংস্থা',
      labelBidder: 'দরদাতা প্রতিষ্ঠান',
      uploadSectionHeading: 'দরপত্র নথি আপলোড করুন',
      uploadSectionSubheading: 'দরপত্রের পিডিএফ ফাইলগুলো আপলোড করুন। পিডিএফ ছাড়া অন্য ফাইল বাতিল করা হবে। SHA-256 হ্যাশের মাধ্যমে ডুপ্লিকেট শনাক্ত করা হয়।',
      btnClearUploads: 'সব আপলোড মুছুন',
      btnBrowsePdf: 'পিডিএফ ফাইল নির্বাচন করুন',
      dropPdfMain: 'আপনার পিডিএফ ফাইলগুলো এখানে ড্রপ করুন অথবা নির্বাচন করতে ক্লিক করুন',
      ruleOnlyPdf: '✓ শুধুমাত্র পিডিএফ ফাইল গ্রহণযোগ্য',
      ruleMaxFiles: '✓ সর্বোচ্চ ৩০টি ফাইল',
      ruleMaxSize: '✓ মোট সর্বোচ্চ ৫০ মেগাবাইট',
      ruleDupDetect: '✓ SHA-256 ডুপ্লিকেট শনাক্তকরণ',
      labelUploadedFiles: 'আপলোডকৃত ফাইল:',
      labelTotalSize: 'মোট সাইজ:',
      labelDuplicatesFound: 'ডুপ্লিকেট:',
      colFileName: 'ফাইলের নাম',
      colPages: 'পৃষ্ঠা',
      colSize: 'সাইজ',
      colDuplicateStatus: 'ডুপ্লিকেট অবস্থা',
      colMatchedRequirement: 'সংযুক্ত প্রয়োজনীয়তা',
      colActions: 'অ্যাকশন',
      checklistHeading: 'নথি যাচাইকরণ ও মিলকরণ তালিকা',
      checklistSubheading: 'প্রয়োজনীয় নথির সাথে আপলোডকৃত পিডিএফ সংযুক্ত করুন এবং প্রয়োজনবোধে মেয়াদ নির্ধারণ করুন।',
      btnAutoMatch: 'স্বয়ংক্রিয় মিলকরণ',
      dashTotalDocs: 'মোট নথি',
      dashOk: 'সঠিক',
      dashMissing: 'অনুপস্থিত',
      dashExpired: 'মেয়াদোত্তীর্ণ',
      dashExpiryNeeded: 'মেয়াদ তারিখ প্রয়োজন',
      dashNotProvided: 'ঐচ্ছিক সরবরাহহীন',
      packageReady: 'প্যাকেজ প্রস্তুত',
      packageReadyDesc: 'সব প্রয়োজনীয় নথি যাচাইকৃত এবং সঠিক আছে। প্যাকেজ তৈরি করতে প্রস্তুত।',
      packageNotReady: 'প্যাকেজ প্রস্তুত নয়',
      packageNotReadyDesc: 'প্যাকেজ তৈরির পূর্বে নিচের অপূর্ণ শর্তগুলো পূরণ করুন।',
      packageCannotGenerate: 'প্যাকেজ তৈরি করা সম্ভব নয় কারণ:',
      emptyRequirements: 'নথির তালিকা দেখতে উপরে requirements.json লোড করুন।',
      colOrder: 'ক্রম',
      colDocName: 'নথির নাম',
      colRequirement: 'প্রয়োজনীয়তা',
      colExpiryReq: 'মেয়াদ আবশ্যক',
      colMatchFile: 'সংযুক্ত ফাইল',
      colExpiryDate: 'মেয়াদোত্তীর্ণের তারিখ',
      colStatus: 'অবস্থা',
      mandatoryTag: 'বাধ্যতামূলক',
      optionalTag: 'ঐচ্ছিক',
      yesTag: 'হ্যাঁ',
      noTag: 'না',
      statusOk: 'সঠিক আছে',
      statusMissing: 'অনুপস্থিত',
      statusExpiryNeeded: 'মেয়াদ তারিখ প্রয়োজন',
      statusExpired: 'মেয়াদোত্তীর্ণ',
      statusNotProvided: 'সরবরাহ করা হয়নি',
      duplicateTag: 'ডুপ্লিকেট',
      unassigned: 'অসংযুক্ত',
      selectFilePrompt: '-- আপলোডকৃত পিডিএফ নির্বাচন করুন --',
      generateHeading: 'প্যাকেজ তৈরি ও ডাউনলোড',
      generateSubheading: 'ইংরেজি কভার পেজ, সঠিক ক্রমানুসার এবং পৃষ্ঠা নম্বরযুক্ত ফুটারসহ চূড়ান্ত সম্মিলিত পিডিএফ তৈরি করে।',
      genRule1: 'দরপত্রের মেটাডাটা, শেষ সময় ও সূচিপত্রসহ ইংরেজি কভার পেজ',
      genRule2: 'requirements.order অনুযায়ী কঠোরভাবে সাজানো নথি',
      genRule3: 'প্রতিটি পৃষ্ঠায় গতিশীল ফুটার: <tender_id> | Page X of Y',
      genRule4: 'স্বয়ংক্রিয়ভাবে <tender_id>_Package.pdf নামে ডাউনলোড',
      btnGeneratePackage: 'প্যাকেজ তৈরি করুন',
      msgPackageSuccess: 'প্যাকেজ সফলভাবে তৈরি হয়েছে।',
      labelFilename: 'ফাইল:',
      btnDownloadAgain: 'প্যাকেজ ডাউনলোড করুন',
      btnPreviewPdf: 'ব্রাউজারে প্রিভিউ দেখুন',
      previewHeading: 'নথি প্রিভিউ',
      removeBtnTitle: 'ফাইল মুছুন',
      unmatchBtn: 'বিচ্ছিন্ন করুন',
      previewBtn: 'প্রিভিউ',
      errNonPdf: 'শুধুমাত্র পিডিএফ ফাইল গ্রহণযোগ্য।',
      errCorruptPdf: 'এই পিডিএফটি পড়া যাচ্ছে না। ফাইলটি ক্ষতিগ্রস্ত বা পাসওয়ার্ডযুক্ত কিনা যাচাই করুন।',
      errMaxFiles: 'সর্বোচ্চ ৩০টি ফাইল অনুমোদিত।',
      errMaxSize: 'মোট সর্বোচ্চ ৫০ মেগাবাইটের সীমা অতিক্রম করেছে।',
      errInvalidJson: 'অকার্যকর requirements.json ফাইল। দরপত্র বা প্রয়োজনীয় নথির তথ্য অনুপস্থিত।',
      errDuplicateConflict: 'একই কনটেন্টের ডুপ্লিকেট ফাইল ভিন্ন ভিন্ন প্রয়োজনীয়তায় সংযুক্ত করা যাবে না।',
      deadlinePrefix: 'দাখিলের শেষ সময়:'
    }
  };

  // -------------------------------------------------------------
  // Application State
  // -------------------------------------------------------------
  const state = {
    currentLang: 'en',
    tenderData: null,          // { tender: {...}, requirements: [...] }
    uploadedFiles: [],         // Array of FileObject
    assignments: {},           // { [requirementId]: { fileId: string, expiryDate: string } }
    generatedBlob: null,       // Generated PDF Blob
    generatedFilename: '',     // <tender_id>_Package.pdf
    generatedPagesCount: 0
  };

  /**
   * FileObject structure:
   * {
   *   id: string,
   *   file: File,
   *   name: string,
   *   size: number,
   *   buffer: ArrayBuffer,
   *   hash: string,              // SHA-256 hex
   *   pages: number,
   *   isDuplicate: boolean,
   *   duplicateWith: string[],   // filenames of duplicates
   *   isUnreadable: boolean,
   *   errorMessage?: string
   * }
   */

  // -------------------------------------------------------------
  // DOM Elements Selection
  // -------------------------------------------------------------
  const elements = {
    appTitle: document.getElementById('app-title'),
    appSubtitle: document.getElementById('app-subtitle'),
    btnLoadSample: document.getElementById('btn-load-sample'),
    txtLoadSample: document.getElementById('txt-load-sample'),
    btnLoadSampleDocs: document.getElementById('btn-load-sample-docs'),
    txtLoadSampleDocs: document.getElementById('txt-load-sample-docs'),
    btnQuickSampleFiles: document.getElementById('btn-quick-sample-files'),
    langBtnEn: document.getElementById('lang-btn-en'),
    langBtnBn: document.getElementById('lang-btn-bn'),

    // Steps
    stepNav1: document.getElementById('step-nav-1'),
    stepNav2: document.getElementById('step-nav-2'),
    stepNav3: document.getElementById('step-nav-3'),
    stepNav4: document.getElementById('step-nav-4'),

    // Section 1
    inputRequirementsFile: document.getElementById('input-requirements-file'),
    jsonDropzone: document.getElementById('json-dropzone'),
    tenderInfoCard: document.getElementById('tender-info-card'),
    valTenderId: document.getElementById('val-tender-id'),
    valDeadlinePill: document.getElementById('val-deadline-pill'),
    valDeadlineLabel: document.getElementById('val-deadline-label'),
    valTenderTitle: document.getElementById('val-tender-title'),
    valProcuringEntity: document.getElementById('val-procuring-entity'),
    valBidder: document.getElementById('val-bidder'),
    valSubmissionDeadline: document.getElementById('val-submission-deadline'),

    // Section 2
    inputPdfFiles: document.getElementById('input-pdf-files'),
    pdfDropzone: document.getElementById('pdf-dropzone'),
    btnClearUploads: document.getElementById('btn-clear-uploads'),
    uploadStatsBar: document.getElementById('upload-stats-bar'),
    statUploadedCount: document.getElementById('stat-uploaded-count'),
    statUploadedSize: document.getElementById('stat-uploaded-size'),
    statDuplicatesCount: document.getElementById('stat-duplicates-count'),
    uploadedFilesContainer: document.getElementById('uploaded-files-container'),
    uploadedFilesTbody: document.getElementById('uploaded-files-tbody'),

    // Section 3
    btnAutoMatch: document.getElementById('btn-auto-match'),
    dashValTotal: document.getElementById('dash-val-total'),
    dashValOk: document.getElementById('dash-val-ok'),
    dashValMissing: document.getElementById('dash-val-missing'),
    dashValExpired: document.getElementById('dash-val-expired'),
    dashValExpdate: document.getElementById('dash-val-expdate'),
    dashValOptional: document.getElementById('dash-val-optional'),
    readinessBanner: document.getElementById('readiness-banner'),
    readinessTitle: document.getElementById('readiness-title'),
    readinessDesc: document.getElementById('readiness-desc'),
    readinessIssuesBox: document.getElementById('readiness-issues-box'),
    readinessIssuesList: document.getElementById('readiness-issues-list'),
    requirementsTbody: document.getElementById('requirements-tbody'),

    // Section 4
    btnGeneratePackage: document.getElementById('btn-generate-package'),
    txtGeneratePackage: document.getElementById('txt-generate-package'),
    genProgressContainer: document.getElementById('gen-progress-container'),
    genProgressBar: document.getElementById('gen-progress-bar'),
    genProgressStatus: document.getElementById('gen-progress-status'),
    genSuccessCard: document.getElementById('gen-success-card'),
    successFilenameText: document.getElementById('success-filename-text'),
    successPagesText: document.getElementById('success-pages-text'),
    btnDownloadAgain: document.getElementById('btn-download-again'),
    btnPreviewPackage: document.getElementById('btn-preview-package'),

    // Modal
    previewModal: document.getElementById('preview-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalSubtitle: document.getElementById('modal-subtitle'),
    modalIframe: document.getElementById('modal-iframe'),
    btnCloseModal: document.getElementById('btn-close-modal'),

    // Toasts
    toastContainer: document.getElementById('toast-container')
  };

  // -------------------------------------------------------------
  // Helpers & Utilities
  // -------------------------------------------------------------

  function t(key) {
    const lang = state.currentLang;
    return (i18n[lang] && i18n[lang][key]) || (i18n.en && i18n.en[key]) || key;
  }

  function showToast(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✕';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Format ISO date string "2026-10-20" nicely
   * English: "20 Oct 2026" or "20 October 2026"
   * Bangla: "২০ অক্টোবর ২০২৬"
   */
  function formatDateDisplay(isoDateStr, longFormat = false) {
    if (!isoDateStr) return '--';
    const parts = isoDateStr.split('-');
    if (parts.length !== 3) return isoDateStr;

    const year = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const monthsEnShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsEnLong = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthsBn = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

    if (state.currentLang === 'bn') {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      const toBnNum = num => String(num).replace(/\d/g, d => bnDigits[d]);
      const monthName = monthsBn[monthIndex] || '';
      return `${toBnNum(day)} ${monthName} ${toBnNum(year)}`;
    } else {
      const monthName = longFormat ? monthsEnLong[monthIndex] : monthsEnShort[monthIndex];
      return `${day} ${monthName} ${year}`;
    }
  }

  /**
   * SHA-256 binary hash using Web Crypto API with pure-JS fallback
   */
  async function computeSha256(arrayBuffer) {
    if (window.crypto && window.crypto.subtle && typeof window.crypto.subtle.digest === 'function') {
      try {
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (err) {
        console.warn('crypto.subtle.digest failed, using fallback:', err);
      }
    }
    return sha256Fallback(new Uint8Array(arrayBuffer));
  }

  function sha256Fallback(bytes) {
    function rotr(n, x) { return (x >>> n) | (x << (32 - n)); }
    function ch(x, y, z) { return (x & y) ^ (~x & z); }
    function maj(x, y, z) { return (x & y) ^ (x & z) ^ (y & z); }
    function sigma0(x) { return rotr(2, x) ^ rotr(13, x) ^ rotr(22, x); }
    function sigma1(x) { return rotr(6, x) ^ rotr(11, x) ^ rotr(25, x); }
    function gamma0(x) { return rotr(7, x) ^ rotr(18, x) ^ (x >>> 3); }
    function gamma1(x) { return rotr(17, x) ^ rotr(19, x) ^ (x >>> 10); }

    const K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    let H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];

    const len = bytes.length;
    const bitLen = len * 8;
    const padLen = ((len + 8) % 64 < 56) ? (56 - (len + 8) % 64) : (120 - (len + 8) % 64);
    const totalLen = len + 1 + padLen + 8;
    const padded = new Uint8Array(totalLen);
    padded.set(bytes, 0);
    padded[len] = 0x80;

    const view = new DataView(padded.buffer);
    view.setUint32(totalLen - 4, bitLen, false);

    const W = new Uint32Array(64);
    for (let i = 0; i < totalLen; i += 64) {
      for (let t = 0; t < 16; t++) {
        W[t] = view.getUint32(i + t * 4, false);
      }
      for (let t = 16; t < 64; t++) {
        W[t] = (gamma1(W[t - 2]) + W[t - 7] + gamma0(W[t - 15]) + W[t - 16]) | 0;
      }

      let [a, b, c, d, e, f, g, h] = H;
      for (let t = 0; t < 64; t++) {
        const T1 = (h + sigma1(e) + ch(e, f, g) + K[t] + W[t]) | 0;
        const T2 = (sigma0(a) + maj(a, b, c)) | 0;
        h = g; g = f; f = e; e = (d + T1) | 0;
        d = c; c = b; b = a; a = (T1 + T2) | 0;
      }

      H[0] = (H[0] + a) | 0;
      H[1] = (H[1] + b) | 0;
      H[2] = (H[2] + c) | 0;
      H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0;
      H[5] = (H[5] + f) | 0;
      H[6] = (H[6] + g) | 0;
      H[7] = (H[7] + h) | 0;
    }

    return H.map(val => (val >>> 0).toString(16).padStart(8, '0')).join('');
  }

  // -------------------------------------------------------------
  // Language Switching
  // -------------------------------------------------------------
  function setLanguage(lang) {
    if (state.currentLang === lang) return;
    state.currentLang = lang;

    if (lang === 'bn') {
      elements.langBtnBn.classList.add('active');
      elements.langBtnEn.classList.remove('active');
      document.documentElement.lang = 'bn';
    } else {
      elements.langBtnEn.classList.add('active');
      elements.langBtnBn.classList.remove('active');
      document.documentElement.lang = 'en';
    }

    updateStaticTranslations();
    renderTenderInfo();
    renderUploadedFilesList();
    renderRequirementsTable();
    updateStatusDashboard();
  }

  function updateStaticTranslations() {
    elements.appTitle.textContent = t('appTitle');
    elements.appSubtitle.textContent = t('appSubtitle');
    elements.txtLoadSample.textContent = t('btnLoadSample');

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && i18n[state.currentLang] && i18n[state.currentLang][key]) {
        el.innerHTML = i18n[state.currentLang][key];
      }
    });
  }

  // -------------------------------------------------------------
  // ZIP Archive & Requirements Handling
  // -------------------------------------------------------------

  /**
   * Extract and ingest a .zip archive (such as sample-pack.zip)
   */
  async function handleZipFile(zipFile) {
    showToast(
      state.currentLang === 'bn'
        ? `"${zipFile.name}" আনজিপ করা হচ্ছে...`
        : `Unpacking "${zipFile.name}"...`,
      'info'
    );

    try {
      const buffer = await zipFile.arrayBuffer();
      const extractedEntries = [];

      // Try JSZip first
      if (typeof JSZip !== 'undefined') {
        const zip = await JSZip.loadAsync(buffer);
        const entries = Object.keys(zip.files);
        for (const path of entries) {
          const item = zip.files[path];
          if (item.dir) continue;
          const fileName = path.split('/').pop();
          if (!fileName) continue;
          const fileBuf = await item.async('arraybuffer');
          extractedEntries.push({ name: fileName, path, buffer: fileBuf });
        }
      } else {
        // Pure JS DecompressionStream fallback
        const fallbackList = await parseZipFallback(buffer);
        for (const item of fallbackList) {
          const fileName = item.name.split('/').pop();
          if (!fileName) continue;
          extractedEntries.push({ name: fileName, path: item.name, buffer: item.data });
        }
      }

      if (extractedEntries.length === 0) {
        showToast('Empty or unsupported zip file.', 'error');
        return;
      }

      // 1. Look for requirements.json
      const jsonEntry = extractedEntries.find(e => e.name.toLowerCase() === 'requirements.json');
      if (jsonEntry) {
        try {
          const text = new TextDecoder().decode(new Uint8Array(jsonEntry.buffer));
          const jsonData = JSON.parse(text);
          loadRequirementsData(jsonData);
          showToast(
            state.currentLang === 'bn'
              ? 'দরপত্র সংক্রান্ত রিকোয়ারমেন্টস লোড হয়েছে।'
              : 'requirements.json extracted and loaded.',
            'success'
          );
        } catch (jsonErr) {
          console.error('Failed to parse requirements.json inside zip:', jsonErr);
        }
      }

      // 2. Look for document files (PDFs and non-PDF test files)
      const docEntries = extractedEntries.filter(e => e.name.toLowerCase() !== 'requirements.json' && !e.name.toLowerCase().endsWith('.txt'));
      const fileObjects = [];

      for (const entry of docEntries) {
        const isPdf = entry.name.toLowerCase().endsWith('.pdf');
        const mimeType = isPdf ? 'application/pdf' : (entry.name.toLowerCase().endsWith('.png') ? 'image/png' : 'application/octet-stream');
        const fileObj = new File([entry.buffer], entry.name, { type: mimeType });
        fileObjects.push(fileObj);
      }

      if (fileObjects.length > 0) {
        await handlePdfFiles(fileObjects);
      }

      showToast(
        state.currentLang === 'bn'
          ? `"${zipFile.name}" এর ফাইলগুলো সফলভাবে লোড হয়েছে।`
          : `Extracted and loaded "${zipFile.name}" successfully!`,
        'success'
      );
    } catch (err) {
      console.error('Failed to unzip file:', err);
      showToast(`Failed to open zip file: ${err.message}`, 'error');
    }
  }

  /**
   * Minimal fallback zip reader using native browser DecompressionStream
   */
  async function parseZipFallback(arrayBuffer) {
    const entries = [];
    const u8 = new Uint8Array(arrayBuffer);
    const view = new DataView(arrayBuffer);

    let eocdOffset = -1;
    for (let i = arrayBuffer.byteLength - 22; i >= 0; i--) {
      if (view.getUint32(i, true) === 0x06054b50) {
        eocdOffset = i;
        break;
      }
    }

    if (eocdOffset === -1) return entries;

    const cdOffset = view.getUint32(eocdOffset + 16, true);
    const cdRecords = view.getUint16(eocdOffset + 10, true);

    let offset = cdOffset;
    for (let i = 0; i < cdRecords; i++) {
      if (offset + 46 > arrayBuffer.byteLength) break;
      if (view.getUint32(offset, true) !== 0x02014b50) break;

      const method = view.getUint16(offset + 10, true);
      const compSize = view.getUint32(offset + 20, true);
      const nameLen = view.getUint16(offset + 28, true);
      const extraLen = view.getUint16(offset + 30, true);
      const commentLen = view.getUint16(offset + 32, true);
      const localHeaderOffset = view.getUint32(offset + 42, true);

      const nameBytes = u8.subarray(offset + 46, offset + 46 + nameLen);
      const name = new TextDecoder().decode(nameBytes);

      offset += 46 + nameLen + extraLen + commentLen;

      if (name.endsWith('/')) continue;

      if (localHeaderOffset + 30 <= arrayBuffer.byteLength) {
        const localView = new DataView(arrayBuffer, localHeaderOffset);
        const localNameLen = localView.getUint16(26, true);
        const localExtraLen = localView.getUint16(28, true);
        const dataStart = localHeaderOffset + 30 + localNameLen + localExtraLen;
        const rawData = u8.subarray(dataStart, dataStart + compSize);

        let dataBuf;
        if (method === 0) {
          dataBuf = rawData.slice().buffer;
        } else if (method === 8 && typeof DecompressionStream !== 'undefined') {
          try {
            const ds = new DecompressionStream('deflate-raw');
            const writer = ds.writable.getWriter();
            writer.write(rawData);
            writer.close();
            const res = new Response(ds.readable);
            dataBuf = await res.arrayBuffer();
          } catch (e) {
            continue;
          }
        }
        if (dataBuf) {
          entries.push({ name, data: dataBuf });
        }
      }
    }
    return entries;
  }

  async function handleRequirementsFile(file) {
    if (!file) return;
    if (file.name.toLowerCase().endsWith('.zip')) {
      return handleZipFile(file);
    }
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      loadRequirementsData(data);
      showToast(state.currentLang === 'bn' ? 'দরপত্রের তথ্য সফলভাবে লোড হয়েছে।' : 'requirements.json loaded successfully.', 'success');
    } catch (err) {
      console.error('JSON parse error:', err);
      showToast(t('errInvalidJson'), 'error');
    }
  }

  function loadRequirementsData(data) {
    if (!data || !data.tender || !Array.isArray(data.requirements)) {
      showToast(t('errInvalidJson'), 'error');
      return;
    }

    // Sort requirements by order
    const sortedRequirements = [...data.requirements].sort((a, b) => (a.order || 0) - (b.order || 0));

    state.tenderData = {
      tender: data.tender,
      requirements: sortedRequirements
    };

    // Reset or keep valid assignments
    const newAssignments = {};
    sortedRequirements.forEach(req => {
      if (state.assignments[req.id]) {
        newAssignments[req.id] = state.assignments[req.id];
      } else {
        newAssignments[req.id] = { fileId: null, expiryDate: '' };
      }
    });
    state.assignments = newAssignments;

    renderTenderInfo();
    renderRequirementsTable();
    updateStatusDashboard();
    updateStepNavigation();
  }

  function renderTenderInfo() {
    if (!state.tenderData || !state.tenderData.tender) {
      elements.tenderInfoCard.classList.add('hidden');
      return;
    }

    const { tender } = state.tenderData;
    elements.valTenderId.textContent = tender.tender_id || 'N/A';
    elements.valTenderTitle.textContent = tender.title || 'N/A';
    elements.valProcuringEntity.textContent = tender.procuring_entity || 'N/A';
    elements.valBidder.textContent = tender.bidder || 'N/A';

    const formattedDeadline = formatDateDisplay(tender.submission_deadline);
    elements.valSubmissionDeadline.textContent = formattedDeadline;
    elements.valDeadlineLabel.textContent = `${t('deadlinePrefix')} ${formattedDeadline}`;

    elements.tenderInfoCard.classList.remove('hidden');
  }

  // -------------------------------------------------------------
  // PDF File Upload & Duplicate Detection
  // -------------------------------------------------------------
  async function handlePdfFiles(fileList) {
    if (!fileList || fileList.length === 0) return;

    const filesArray = Array.from(fileList);

    // If any file is a .zip archive, extract it
    const zipFiles = filesArray.filter(f => f.name.toLowerCase().endsWith('.zip'));
    const nonZipFiles = filesArray.filter(f => !f.name.toLowerCase().endsWith('.zip'));

    if (zipFiles.length > 0) {
      for (const zf of zipFiles) {
        await handleZipFile(zf);
      }
      if (nonZipFiles.length === 0) return;
    }

    // If any file is a .json file, handle it as requirements
    const jsonFiles = nonZipFiles.filter(f => f.name.toLowerCase().endsWith('.json'));
    const actualDocFiles = nonZipFiles.filter(f => !f.name.toLowerCase().endsWith('.json'));

    if (jsonFiles.length > 0) {
      for (const jf of jsonFiles) {
        await handleRequirementsFile(jf);
      }
      if (actualDocFiles.length === 0) return;
    }

    let rejectedNonPdf = 0;
    let excessCount = 0;

    // Check count limit
    const currentCount = state.uploadedFiles.length;
    if (currentCount >= MAX_FILES) {
      showToast(t('errMaxFiles'), 'error');
      return;
    }

    const allowedToAdd = MAX_FILES - currentCount;
    const processQueue = [];

    for (let i = 0; i < actualDocFiles.length; i++) {
      const file = actualDocFiles[i];

      // Validate PDF extension/type
      const isPdfName = file.name.toLowerCase().endsWith('.pdf');
      const isPdfMime = file.type === 'application/pdf' || file.type === '';
      if (!isPdfName && !isPdfMime) {
        rejectedNonPdf++;
        showToast(
          state.currentLang === 'bn'
            ? `"${file.name}" কোনো পিডিএফ নয়। দরপত্র নিয়মানুযায়ী শুধুমাত্র পিডিএফ ফাইল গ্রহণযোগ্য।`
            : `File "${file.name}" is not a PDF. Only PDF files are accepted.`,
          'error'
        );
        continue;
      }

      if (processQueue.length >= allowedToAdd) {
        excessCount++;
        continue;
      }

      processQueue.push(file);
    }

    if (excessCount > 0) {
      showToast(`${t('errMaxFiles')} (${excessCount} files skipped)`, 'warning');
    }

    if (processQueue.length === 0) return;

    // Check total size
    let currentTotalSize = state.uploadedFiles.reduce((acc, f) => acc + f.size, 0);
    const addedSize = processQueue.reduce((acc, f) => acc + f.size, 0);
    if (currentTotalSize + addedSize > MAX_TOTAL_SIZE_BYTES) {
      showToast(t('errMaxSize'), 'error');
      return;
    }

    // Process files sequentially
    for (const file of processQueue) {
      try {
        const buffer = await file.arrayBuffer();
        const hash = await computeSha256(buffer);

        // Read page count with pdf.js, with PDFLib fallback for maximum resilience
        let pages = 0;
        let isUnreadable = false;
        let errorMsg = null;

        try {
          if (typeof pdfjsLib !== 'undefined') {
            const loadingTask = pdfjsLib.getDocument({
              data: new Uint8Array(buffer),
              disableFontFace: true,
              useSystemFonts: true
            });
            const pdfDoc = await loadingTask.promise;
            pages = pdfDoc.numPages;
          } else {
            throw new Error('pdfjsLib not available');
          }
        } catch (readErr) {
          console.warn('pdfjsLib failed for', file.name, 'trying PDFLib fallback:', readErr);
          try {
            if (typeof PDFLib !== 'undefined') {
              const fallbackDoc = await PDFLib.PDFDocument.load(buffer, { ignoreEncryption: true });
              pages = fallbackDoc.getPageCount();
            } else {
              throw readErr;
            }
          } catch (pdfLibErr) {
            console.warn('Both pdfjsLib and PDFLib failed for', file.name, pdfLibErr);
            isUnreadable = true;
            errorMsg = t('errCorruptPdf');
            showToast(`"${file.name}": ${t('errCorruptPdf')}`, 'error');
          }
        }

        const fileObj = {
          id: 'file_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now(),
          file: file,
          name: file.name,
          size: file.size,
          buffer: buffer,
          hash: hash,
          pages: pages,
          isDuplicate: false,
          duplicateWith: [],
          isUnreadable: isUnreadable,
          errorMessage: errorMsg
        };

        state.uploadedFiles.push(fileObj);
      } catch (err) {
        console.error('File process failed:', err);
        showToast(`Failed to process "${file.name}": ${err.message}`, 'error');
      }
    }

    // Recompute duplicate detection on entire pool
    recalculateDuplicates();
    renderUploadedFilesList();
    renderRequirementsTable();
    updateStatusDashboard();
    updateStepNavigation();

    showToast(
      state.currentLang === 'bn'
        ? `${processQueue.length}টি ফাইল সফলভাবে আপলোড করা হয়েছে।`
        : `Uploaded ${processQueue.length} file(s) successfully.`,
      'success'
    );
  }

  /**
   * Recalculates exact binary duplicates using SHA-256 hash
   */
  function recalculateDuplicates() {
    const hashMap = new Map();

    // Group valid files by hash
    state.uploadedFiles.forEach(f => {
      f.isDuplicate = false;
      f.duplicateWith = [];
      if (f.isUnreadable) return;

      if (!hashMap.has(f.hash)) {
        hashMap.set(f.hash, []);
      }
      hashMap.get(f.hash).push(f);
    });

    // Mark duplicates
    let dupCount = 0;
    hashMap.forEach((files, hash) => {
      if (files.length > 1) {
        dupCount += files.length;
        files.forEach(file => {
          file.isDuplicate = true;
          file.duplicateWith = files.filter(other => other.id !== file.id).map(o => o.name);
        });
      }
    });

    return dupCount;
  }

  function removeUploadedFile(fileId) {
    // Unassign from any requirement
    Object.keys(state.assignments).forEach(reqId => {
      if (state.assignments[reqId].fileId === fileId) {
        state.assignments[reqId].fileId = null;
      }
    });

    state.uploadedFiles = state.uploadedFiles.filter(f => f.id !== fileId);
    recalculateDuplicates();
    renderUploadedFilesList();
    renderRequirementsTable();
    updateStatusDashboard();
    updateStepNavigation();

    showToast(state.currentLang === 'bn' ? 'ফাইলটি মুছে ফেলা হয়েছে।' : 'File removed.', 'info');
  }

  function clearAllUploads() {
    if (state.uploadedFiles.length === 0) return;
    const confirmMsg = state.currentLang === 'bn'
      ? 'আপনি কি নিশ্চিত যে সমস্ত আপলোড করা ফাইল মুছে ফেলতে চান?'
      : 'Are you sure you want to clear all uploaded files?';
    if (!confirm(confirmMsg)) return;

    state.uploadedFiles = [];
    Object.keys(state.assignments).forEach(reqId => {
      state.assignments[reqId].fileId = null;
    });

    renderUploadedFilesList();
    renderRequirementsTable();
    updateStatusDashboard();
    updateStepNavigation();
  }

  function renderUploadedFilesList() {
    const list = state.uploadedFiles;
    const count = list.length;
    const totalSize = list.reduce((acc, f) => acc + f.size, 0);
    const duplicatesCount = list.filter(f => f.isDuplicate).length;

    // Update stats bar
    elements.statUploadedCount.textContent = `${count} / ${MAX_FILES}`;
    elements.statUploadedSize.textContent = `${(totalSize / (1024 * 1024)).toFixed(2)} MB / 50 MB`;
    elements.statDuplicatesCount.textContent = String(duplicatesCount);

    if (count > 0) {
      elements.uploadStatsBar.classList.remove('hidden');
      elements.uploadedFilesContainer.classList.remove('hidden');
      elements.btnClearUploads.classList.remove('hidden');
    } else {
      elements.uploadStatsBar.classList.add('hidden');
      elements.uploadedFilesContainer.classList.add('hidden');
      elements.btnClearUploads.classList.add('hidden');
      elements.uploadedFilesTbody.innerHTML = '';
      return;
    }

    elements.uploadedFilesTbody.innerHTML = '';

    list.forEach(item => {
      const tr = document.createElement('tr');
      if (item.isDuplicate) tr.classList.add('file-duplicate-row');

      // Matched Requirement lookup
      let matchedReqName = t('unassigned');
      if (state.tenderData && state.tenderData.requirements) {
        for (const req of state.tenderData.requirements) {
          if (state.assignments[req.id] && state.assignments[req.id].fileId === item.id) {
            const reqTitle = state.currentLang === 'bn' ? (req.title_bn || req.title_en) : req.title_en;
            matchedReqName = `[${req.id}] ${reqTitle}`;
            break;
          }
        }
      }

      // Duplicate cell
      let dupHtml = '<span class="text-muted">—</span>';
      if (item.isDuplicate) {
        dupHtml = `
          <span class="duplicate-pill">⚠️ ${t('duplicateTag')}</span>
          <span class="duplicate-warning-text" title="Identical binary content (SHA-256)">
            ${state.currentLang === 'bn' ? 'একই কনটেন্ট:' : 'Matches:'} ${escapeHtml(item.duplicateWith.join(', '))}
          </span>
        `;
      } else if (item.isUnreadable) {
        dupHtml = `<span class="status-pill status-expired">✕ ${escapeHtml(item.errorMessage || t('errCorruptPdf'))}</span>`;
      }

      tr.innerHTML = `
        <td>
          <div class="file-name-cell">
            <svg class="file-icon-pdf" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <span title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</span>
          </div>
        </td>
        <td>${item.isUnreadable ? '—' : item.pages}</td>
        <td>${formatBytes(item.size)}</td>
        <td>${dupHtml}</td>
        <td><span class="${matchedReqName !== t('unassigned') ? 'tag-mandatory' : 'text-muted'}">${escapeHtml(matchedReqName)}</span></td>
        <td class="text-right">
          <button class="btn btn-sm btn-subtle btn-preview-file" data-file-id="${item.id}" title="${t('previewBtn')}">
            ${t('previewBtn')}
          </button>
          <button class="btn btn-sm btn-ghost btn-remove-file" data-file-id="${item.id}" title="${t('removeBtnTitle')}">
            ✕
          </button>
        </td>
      `;

      elements.uploadedFilesTbody.appendChild(tr);
    });

    // Attach row events
    elements.uploadedFilesTbody.querySelectorAll('.btn-remove-file').forEach(btn => {
      btn.addEventListener('click', () => removeUploadedFile(btn.dataset.fileId));
    });

    elements.uploadedFilesTbody.querySelectorAll('.btn-preview-file').forEach(btn => {
      btn.addEventListener('click', () => {
        const fileObj = state.uploadedFiles.find(f => f.id === btn.dataset.fileId);
        if (fileObj) openPdfPreview(fileObj.buffer, fileObj.name);
      });
    });
  }

  // -------------------------------------------------------------
  // Document Matching & Real-Time Status Calculation
  // -------------------------------------------------------------

  /**
   * Status calculation for a single requirement:
   * Returns: { status: 'OK' | 'Missing' | 'Expiry date needed' | 'Expired' | 'Not provided', isBlocking: boolean, message: string }
   */
  function calculateRequirementStatus(req) {
    const assignment = state.assignments[req.id] || { fileId: null, expiryDate: '' };
    const isMandatory = Boolean(req.mandatory);
    const hasExpiry = Boolean(req.has_expiry);
    const matchedFileId = assignment.fileId;
    const expiryDate = assignment.expiryDate ? assignment.expiryDate.trim() : '';
    const submissionDeadline = (state.tenderData && state.tenderData.tender && state.tenderData.tender.submission_deadline) || '';

    const reqTitle = state.currentLang === 'bn' ? (req.title_bn || req.title_en) : req.title_en;

    // Condition 1: No file matched
    if (!matchedFileId) {
      if (isMandatory) {
        return {
          status: 'Missing',
          isBlocking: true,
          message: `${reqTitle} is missing`
        };
      } else {
        return {
          status: 'Not provided',
          isBlocking: false,
          message: ''
        };
      }
    }

    // Condition 2: File is matched, check unreadable file
    const matchedFile = state.uploadedFiles.find(f => f.id === matchedFileId);
    if (!matchedFile || matchedFile.isUnreadable) {
      return {
        status: 'Missing',
        isBlocking: true,
        message: `${reqTitle} matched file is damaged or unreadable`
      };
    }

    // Condition 3: Expiry required
    if (hasExpiry) {
      if (!expiryDate) {
        return {
          status: 'Expiry date needed',
          isBlocking: true,
          message: `${reqTitle} needs an expiry date`
        };
      }

      // Exact date comparison
      // ISO strings YYYY-MM-DD can be compared directly
      // If expiry date < submission deadline => Expired
      // If expiry date >= submission deadline => OK (exact deadline date is OK)
      if (expiryDate < submissionDeadline) {
        return {
          status: 'Expired',
          isBlocking: true,
          message: `${reqTitle} is expired (Expires: ${expiryDate}, Deadline: ${submissionDeadline})`
        };
      } else {
        return {
          status: 'OK',
          isBlocking: false,
          message: ''
        };
      }
    }

    // Condition 4: No expiry required and file matched
    return {
      status: 'OK',
      isBlocking: false,
      message: ''
    };
  }

  /**
   * Check duplicate assignment conflicts across all requirements:
   * "If two files have identical content: do not allow them to be matched to different requirements,
   * prevent package generation if the duplicate situation creates an invalid assignment."
   */
  function checkDuplicateAssignmentConflicts() {
    const conflicts = [];
    if (!state.tenderData || !state.tenderData.requirements) return conflicts;

    // Collect matched files and their SHA-256 hashes
    const hashToAssignments = new Map();

    state.tenderData.requirements.forEach(req => {
      const assignment = state.assignments[req.id];
      if (assignment && assignment.fileId) {
        const fileObj = state.uploadedFiles.find(f => f.id === assignment.fileId);
        if (fileObj && !fileObj.isUnreadable) {
          if (!hashToAssignments.has(fileObj.hash)) {
            hashToAssignments.set(fileObj.hash, []);
          }
          hashToAssignments.get(fileObj.hash).push({ req, file: fileObj });
        }
      }
    });

    // Check if any hash has more than one assignment to DIFFERENT requirements
    hashToAssignments.forEach((assignedList, hash) => {
      if (assignedList.length > 1) {
        const names = assignedList.map(a => `"${a.file.name}" for [${a.req.id}]`).join(', ');
        conflicts.push({
          hash: hash,
          assignments: assignedList,
          message: `Duplicate content conflict: Identical binary content assigned to multiple requirements (${names}). Duplicate files cannot be assigned to different requirements.`
        });
      }
    });

    return conflicts;
  }

  function renderRequirementsTable() {
    if (!state.tenderData || !state.tenderData.requirements || state.tenderData.requirements.length === 0) {
      elements.requirementsTbody.innerHTML = `
        <tr class="empty-row">
          <td colspan="8" class="text-center">${t('emptyRequirements')}</td>
        </tr>
      `;
      return;
    }

    elements.requirementsTbody.innerHTML = '';

    state.tenderData.requirements.forEach((req, idx) => {
      const assignment = state.assignments[req.id] || { fileId: null, expiryDate: '' };
      const statusResult = calculateRequirementStatus(req);

      const tr = document.createElement('tr');
      tr.id = `req-row-${req.id}`;

      const reqTitle = state.currentLang === 'bn' ? (req.title_bn || req.title_en) : req.title_en;
      const isMandatory = Boolean(req.mandatory);
      const hasExpiry = Boolean(req.has_expiry);

      // Status pill badge
      let statusClass = 'status-ok';
      let statusText = t('statusOk');
      let statusIcon = '✓';

      if (statusResult.status === 'Missing') {
        statusClass = 'status-missing';
        statusText = t('statusMissing');
        statusIcon = '✕';
      } else if (statusResult.status === 'Expiry date needed') {
        statusClass = 'status-expdate';
        statusText = t('statusExpiryNeeded');
        statusIcon = '⚠️';
      } else if (statusResult.status === 'Expired') {
        statusClass = 'status-expired';
        statusText = t('statusExpired');
        statusIcon = '✕';
      } else if (statusResult.status === 'Not provided') {
        statusClass = 'status-optional';
        statusText = t('statusNotProvided');
        statusIcon = '—';
      }

      // Build matched file select dropdown options
      let fileSelectOptions = `<option value="">${t('selectFilePrompt')}</option>`;
      state.uploadedFiles.forEach(f => {
        if (f.isUnreadable) return; // skip corrupt files in selector

        // Check if assigned to another requirement
        let assignedToOther = null;
        for (const otherReq of state.tenderData.requirements) {
          if (otherReq.id !== req.id && state.assignments[otherReq.id] && state.assignments[otherReq.id].fileId === f.id) {
            assignedToOther = otherReq.id;
            break;
          }
        }

        const isSelected = assignment.fileId === f.id;
        const dupBadge = f.isDuplicate ? ` [${t('duplicateTag')}]` : '';
        const assignedLabel = assignedToOther ? ` (${state.currentLang === 'bn' ? 'সংযুক্ত:' : 'Assigned to'} ${assignedToOther})` : '';

        fileSelectOptions += `
          <option value="${f.id}" ${isSelected ? 'selected' : ''} class="${assignedToOther ? 'option-assigned' : ''}">
            ${escapeHtml(f.name)}${dupBadge} (${f.pages} p)${assignedLabel}
          </option>
        `;
      });

      // Expiry Date input: only shown if has_expiry = true
      let expiryCellHtml = `<span class="text-muted">—</span>`;
      if (hasExpiry) {
        if (assignment.fileId) {
          const isError = statusResult.status === 'Expiry date needed' || statusResult.status === 'Expired';
          expiryCellHtml = `
            <input type="date"
                   class="expiry-date-input ${isError ? 'input-error' : ''}"
                   data-req-id="${req.id}"
                   value="${escapeHtml(assignment.expiryDate || '')}"
                   title="Expiry must be on or after submission deadline">
          `;
        } else {
          expiryCellHtml = `<span class="text-muted" style="font-size:0.8rem;">${state.currentLang === 'bn' ? 'ফাইল নির্বাচন করুন' : 'Select file first'}</span>`;
        }
      }

      // Actions cell (Unmatch / Preview)
      let actionsHtml = `<span class="text-muted">—</span>`;
      if (assignment.fileId) {
        actionsHtml = `
          <button class="btn btn-sm btn-subtle btn-preview-req" data-req-id="${req.id}" title="${t('previewBtn')}">
            ${t('previewBtn')}
          </button>
          <button class="btn btn-sm btn-ghost btn-unmatch-req" data-req-id="${req.id}" title="${t('unmatchBtn')}">
            ✕
          </button>
        `;
      }

      tr.innerHTML = `
        <td><strong>${req.order || (idx + 1)}</strong></td>
        <td>
          <div style="font-weight:600;">${escapeHtml(reqTitle)}</div>
          <div style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">${escapeHtml(req.id)}</div>
        </td>
        <td>
          <span class="${isMandatory ? 'tag-mandatory' : 'tag-optional'}">
            ${isMandatory ? t('mandatoryTag') : t('optionalTag')}
          </span>
        </td>
        <td>
          <span class="${hasExpiry ? 'tag-exp-yes' : 'tag-exp-no'}">
            ${hasExpiry ? t('yesTag') : t('noTag')}
          </span>
        </td>
        <td>
          <select class="match-select" data-req-id="${req.id}">
            ${fileSelectOptions}
          </select>
        </td>
        <td>${expiryCellHtml}</td>
        <td>
          <span class="status-pill ${statusClass}">
            <span>${statusIcon}</span>
            <span>${statusText}</span>
          </span>
        </td>
        <td class="text-right">${actionsHtml}</td>
      `;

      elements.requirementsTbody.appendChild(tr);
    });

    // Bind event listeners for table controls
    elements.requirementsTbody.querySelectorAll('.match-select').forEach(select => {
      select.addEventListener('change', e => {
        handleMatchChange(select.dataset.reqId, e.target.value);
      });
    });

    elements.requirementsTbody.querySelectorAll('.expiry-date-input').forEach(input => {
      input.addEventListener('change', e => {
        handleExpiryDateChange(input.dataset.reqId, e.target.value);
      });
      input.addEventListener('input', e => {
        handleExpiryDateChange(input.dataset.reqId, e.target.value);
      });
    });

    elements.requirementsTbody.querySelectorAll('.btn-unmatch-req').forEach(btn => {
      btn.addEventListener('click', () => {
        handleMatchChange(btn.dataset.reqId, '');
      });
    });

    elements.requirementsTbody.querySelectorAll('.btn-preview-req').forEach(btn => {
      btn.addEventListener('click', () => {
        const reqId = btn.dataset.reqId;
        const fileId = state.assignments[reqId] && state.assignments[reqId].fileId;
        const fileObj = state.uploadedFiles.find(f => f.id === fileId);
        if (fileObj) {
          openPdfPreview(fileObj.buffer, fileObj.name);
        }
      });
    });
  }

  function handleMatchChange(reqId, newFileId) {
    if (!state.assignments[reqId]) {
      state.assignments[reqId] = { fileId: null, expiryDate: '' };
    }

    if (newFileId) {
      // Rule: Check if newFileId is already assigned to another requirement
      let alreadyAssignedReqId = null;
      for (const rId of Object.keys(state.assignments)) {
        if (rId !== reqId && state.assignments[rId].fileId === newFileId) {
          alreadyAssignedReqId = rId;
          break;
        }
      }

      if (alreadyAssignedReqId) {
        // Unassign from the previous requirement
        state.assignments[alreadyAssignedReqId].fileId = null;
        showToast(
          state.currentLang === 'bn'
            ? `ফাইলটি ${alreadyAssignedReqId} থেকে সরানো হয়েছে এবং ${reqId}-এ সংযুক্ত করা হয়েছে।`
            : `Reassigned file from requirement ${alreadyAssignedReqId} to ${reqId}.`,
          'info'
        );
      }

      // Duplicate content rule verification:
      // "If two files have identical content: do not allow them to be matched to different requirements"
      const selectedFileObj = state.uploadedFiles.find(f => f.id === newFileId);
      if (selectedFileObj && selectedFileObj.isDuplicate) {
        // Check if another requirement already has a file with the EXACT same hash
        for (const rId of Object.keys(state.assignments)) {
          if (rId !== reqId) {
            const otherAssignedFileId = state.assignments[rId].fileId;
            const otherAssignedFile = state.uploadedFiles.find(f => f.id === otherAssignedFileId);
            if (otherAssignedFile && otherAssignedFile.hash === selectedFileObj.hash) {
              showToast(t('errDuplicateConflict'), 'error', 6000);
              // Prevent assignment!
              state.assignments[reqId].fileId = null;
              renderRequirementsTable();
              renderUploadedFilesList();
              updateStatusDashboard();
              return;
            }
          }
        }
      }

      state.assignments[reqId].fileId = newFileId;
    } else {
      state.assignments[reqId].fileId = null;
    }

    renderRequirementsTable();
    renderUploadedFilesList();
    updateStatusDashboard();
    updateStepNavigation();
  }

  function handleExpiryDateChange(reqId, newDate) {
    if (!state.assignments[reqId]) {
      state.assignments[reqId] = { fileId: null, expiryDate: '' };
    }
    state.assignments[reqId].expiryDate = newDate;

    // Immediately recalculate
    renderRequirementsTable();
    updateStatusDashboard();
    updateStepNavigation();
  }

  // -------------------------------------------------------------
  // Status Dashboard & Readiness Calculation
  // -------------------------------------------------------------
  function updateStatusDashboard() {
    if (!state.tenderData || !state.tenderData.requirements) {
      elements.dashValTotal.textContent = '0';
      elements.dashValOk.textContent = '0';
      elements.dashValMissing.textContent = '0';
      elements.dashValExpired.textContent = '0';
      elements.dashValExpdate.textContent = '0';
      elements.dashValOptional.textContent = '0';

      elements.readinessBanner.className = 'readiness-banner readiness-not-ready';
      elements.readinessTitle.textContent = t('packageNotReady');
      elements.readinessDesc.textContent = t('emptyRequirements');
      elements.readinessIssuesBox.classList.add('hidden');
      elements.btnGeneratePackage.disabled = true;
      return;
    }

    let countTotal = state.tenderData.requirements.length;
    let countOk = 0;
    let countMissing = 0;
    let countExpired = 0;
    let countExpDateNeeded = 0;
    let countNotProvided = 0;

    const blockingIssues = [];

    state.tenderData.requirements.forEach(req => {
      const res = calculateRequirementStatus(req);
      if (res.status === 'OK') countOk++;
      else if (res.status === 'Missing') countMissing++;
      else if (res.status === 'Expired') countExpired++;
      else if (res.status === 'Expiry date needed') countExpDateNeeded++;
      else if (res.status === 'Not provided') countNotProvided++;

      if (res.isBlocking && res.message) {
        blockingIssues.push(res.message);
      }
    });

    // Check duplicate assignment conflicts
    const duplicateConflicts = checkDuplicateAssignmentConflicts();
    duplicateConflicts.forEach(conf => {
      blockingIssues.push(conf.message);
    });

    // Update numbers
    elements.dashValTotal.textContent = String(countTotal);
    elements.dashValOk.textContent = String(countOk);
    elements.dashValMissing.textContent = String(countMissing);
    elements.dashValExpired.textContent = String(countExpired);
    elements.dashValExpdate.textContent = String(countExpDateNeeded);
    elements.dashValOptional.textContent = String(countNotProvided);

    // Evaluate Readiness
    const isReady = (blockingIssues.length === 0) && (countTotal > 0);

    if (isReady) {
      elements.readinessBanner.className = 'readiness-banner readiness-ready';
      elements.readinessTitle.textContent = t('packageReady');
      elements.readinessDesc.textContent = t('packageReadyDesc');
      elements.readinessIssuesBox.classList.add('hidden');
      elements.btnGeneratePackage.disabled = false;
    } else {
      elements.readinessBanner.className = 'readiness-banner readiness-not-ready';
      elements.readinessTitle.textContent = t('packageNotReady');
      elements.readinessDesc.textContent = t('packageNotReadyDesc');

      if (blockingIssues.length > 0) {
        elements.readinessIssuesList.innerHTML = '';
        blockingIssues.forEach(issue => {
          const li = document.createElement('li');
          li.textContent = issue;
          elements.readinessIssuesList.appendChild(li);
        });
        elements.readinessIssuesBox.classList.remove('hidden');
      } else {
        elements.readinessIssuesBox.classList.add('hidden');
      }

      elements.btnGeneratePackage.disabled = true;
    }
  }

  function updateStepNavigation() {
    const hasRequirements = Boolean(state.tenderData && state.tenderData.requirements);
    const hasFiles = state.uploadedFiles.length > 0;
    const isReady = !elements.btnGeneratePackage.disabled;

    elements.stepNav1.className = 'step-item ' + (hasRequirements ? 'completed' : 'active');
    elements.stepNav2.className = 'step-item ' + (hasFiles ? 'completed' : (hasRequirements ? 'active' : ''));
    elements.stepNav3.className = 'step-item ' + (isReady ? 'completed' : (hasRequirements && hasFiles ? 'active' : ''));
    elements.stepNav4.className = 'step-item ' + (isReady ? 'active' : '');
  }

  // -------------------------------------------------------------
  // Smart Auto-Match Logic
  // -------------------------------------------------------------
  function autoMatchFiles() {
    if (!state.tenderData || !state.tenderData.requirements || state.tenderData.requirements.length === 0) {
      showToast(state.currentLang === 'bn' ? 'প্রথমে requirements.json লোড করুন।' : 'Please load requirements.json first.', 'warning');
      return;
    }

    if (state.uploadedFiles.length === 0) {
      showToast(state.currentLang === 'bn' ? 'প্রথমে পিডিএফ ফাইল আপলোড করুন।' : 'Please upload PDF files first.', 'warning');
      return;
    }

    let matchCount = 0;
    const assignedFileIds = new Set();
    const assignedHashes = new Set();

    // Check currently assigned files to avoid duplicates
    Object.keys(state.assignments).forEach(reqId => {
      const fId = state.assignments[reqId].fileId;
      if (fId) {
        assignedFileIds.add(fId);
        const fObj = state.uploadedFiles.find(f => f.id === fId);
        if (fObj) assignedHashes.add(fObj.hash);
      }
    });

    // Helper token similarity
    function tokenize(text) {
      if (!text) return [];
      return text.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 2);
    }

    // Try matching for requirements that do not have a file matched yet
    state.tenderData.requirements.forEach(req => {
      if (state.assignments[req.id] && state.assignments[req.id].fileId) {
        return; // already has file
      }

      const reqTokens = [
        ...tokenize(req.title_en),
        ...tokenize(req.id)
      ];

      let bestScore = 0;
      let bestFile = null;

      for (const fileObj of state.uploadedFiles) {
        if (fileObj.isUnreadable) continue;
        if (assignedFileIds.has(fileObj.id)) continue;
        if (assignedHashes.has(fileObj.hash)) continue; // avoid duplicate conflict!

        const fileTokens = tokenize(fileObj.name.replace(/\.pdf$/i, ''));
        let score = 0;

        reqTokens.forEach(rt => {
          fileTokens.forEach(ft => {
            if (rt === ft) score += 3;
            else if (ft.includes(rt) || rt.includes(ft)) score += 1;
          });
        });

        // Deadline year preference (e.g. trade_license_2026 vs trade_license_2025)
        const deadlineYear = ((state.tenderData && state.tenderData.tender && state.tenderData.tender.submission_deadline) || '').split('-')[0];
        if (deadlineYear && fileObj.name.includes(deadlineYear)) {
          score += 2;
        }

        if (score > bestScore && score >= 2) {
          bestScore = score;
          bestFile = fileObj;
        }
      }

      if (bestFile) {
        if (!state.assignments[req.id]) {
          state.assignments[req.id] = { fileId: null, expiryDate: '' };
        }
        state.assignments[req.id].fileId = bestFile.id;
        assignedFileIds.add(bestFile.id);
        assignedHashes.add(bestFile.hash);
        matchCount++;
      }
    });

    renderRequirementsTable();
    renderUploadedFilesList();
    updateStatusDashboard();
    updateStepNavigation();

    if (matchCount > 0) {
      showToast(
        state.currentLang === 'bn'
          ? `ফাইলের নামের মিল অনুসারে ${matchCount}টি নথি সংযুক্ত করা হয়েছে। দয়া করে যাচাই করুন।`
          : `Auto-matched ${matchCount} document(s) based on filename similarity. Please review.`,
        'success'
      );
    } else {
      showToast(
        state.currentLang === 'bn'
          ? 'নতুন কোনো নথি স্বয়ংক্রিয়ভাবে মেলানো যায়নি।'
          : 'No additional matches found. Please match manually.',
        'info'
      );
    }
  }

  // -------------------------------------------------------------
  // Final Package Generation via PDFLib
  // -------------------------------------------------------------
  async function generateFinalPackage() {
    // 1. Validation check
    updateStatusDashboard();
    if (elements.btnGeneratePackage.disabled) {
      showToast('Cannot generate package while blocking issues exist.', 'error');
      return;
    }

    const { tender, requirements } = state.tenderData;
    const tenderId = tender.tender_id || 'Tender';

    // Show progress UI
    elements.btnGeneratePackage.disabled = true;
    elements.genProgressContainer.classList.remove('hidden');
    elements.genSuccessCard.classList.add('hidden');
    updateGenProgress(10, 'Initializing PDF document...');

    try {
      const mergedPdf = await PDFLib.PDFDocument.create();

      // Filter matched requirements in order
      const includedRequirements = requirements.filter(req => {
        const assignment = state.assignments[req.id];
        return assignment && assignment.fileId;
      });

      updateGenProgress(25, 'Generating English Cover Page (Page 1)...');

      // ---------------------------------------------------------
      // Step A: Cover Page (ENGLISH ONLY per specification)
      // ---------------------------------------------------------
      const coverPage = mergedPdf.addPage(PDFLib.PageSizes.A4);
      const { width: covWidth, height: covHeight } = coverPage.getSize();

      const fontRegular = await mergedPdf.embedFont(PDFLib.StandardFonts.Helvetica);
      const fontBold = await mergedPdf.embedFont(PDFLib.StandardFonts.HelveticaBold);

      // Colors
      const navyColor = PDFLib.rgb(0.08, 0.18, 0.36);
      const slateColor = PDFLib.rgb(0.2, 0.25, 0.3);
      const subtleColor = PDFLib.rgb(0.45, 0.5, 0.55);
      const primaryBlue = PDFLib.rgb(0.31, 0.27, 0.9);

      // Decorative top border bar
      coverPage.drawRectangle({
        x: 40,
        y: covHeight - 48,
        width: covWidth - 80,
        height: 6,
        color: primaryBlue
      });

      // Cover Page Title
      coverPage.drawText('Tender Document Package', {
        x: 50,
        y: covHeight - 90,
        size: 24,
        font: fontBold,
        color: navyColor
      });

      // Divider line
      coverPage.drawLine({
        start: { x: 50, y: covHeight - 105 },
        end: { x: covWidth - 50, y: covHeight - 105 },
        thickness: 1,
        color: PDFLib.rgb(0.85, 0.88, 0.92)
      });

      // Today's browser date formatted in English
      const today = new Date();
      const todayStr = formatDateDisplay(
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
        true
      );
      const deadlineStr = formatDateDisplay(tender.submission_deadline, true);

      // Tender Information Block
      const metaRows = [
        ['Tender ID:', tender.tender_id || 'N/A'],
        ['Tender Title:', tender.title || 'N/A'],
        ['Procuring Entity:', tender.procuring_entity || 'N/A'],
        ['Bidder:', tender.bidder || 'N/A'],
        ['Submission Deadline:', deadlineStr],
        ['Package Made Date:', todayStr]
      ];

      let metaY = covHeight - 140;
      const labelX = 50;
      const valX = 200;

      metaRows.forEach(([lbl, val]) => {
        coverPage.drawText(lbl, {
          x: labelX,
          y: metaY,
          size: 11,
          font: fontBold,
          color: slateColor
        });

        coverPage.drawText(String(val), {
          x: valX,
          y: metaY,
          size: 11,
          font: fontRegular,
          color: lbl.includes('Tender ID') ? primaryBlue : navyColor
        });

        metaY -= 24;
      });

      // Section: Included Documents (Numbered list)
      metaY -= 15;
      coverPage.drawText('Included Documents:', {
        x: labelX,
        y: metaY,
        size: 14,
        font: fontBold,
        color: navyColor
      });

      // Section divider
      coverPage.drawLine({
        start: { x: labelX, y: metaY - 8 },
        end: { x: covWidth - 50, y: metaY - 8 },
        thickness: 1,
        color: PDFLib.rgb(0.88, 0.9, 0.94)
      });

      metaY -= 26;

      includedRequirements.forEach((req, idx) => {
        const itemNumber = `${idx + 1}.`;
        const docTitle = req.title_en || req.title_bn || `Document ${idx + 1}`;
        const assignment = state.assignments[req.id];
        const matchedFile = state.uploadedFiles.find(f => f.id === assignment.fileId);
        const fileNameSuffix = matchedFile ? ` (${matchedFile.name})` : '';

        coverPage.drawText(itemNumber, {
          x: labelX + 10,
          y: metaY,
          size: 10.5,
          font: fontBold,
          color: slateColor
        });

        coverPage.drawText(docTitle, {
          x: labelX + 32,
          y: metaY,
          size: 10.5,
          font: fontBold,
          color: navyColor
        });

        if (fileNameSuffix) {
          const titleWidth = fontBold.widthOfTextAtSize(docTitle, 10.5);
          coverPage.drawText(fileNameSuffix, {
            x: labelX + 36 + titleWidth,
            y: metaY,
            size: 9.5,
            font: fontRegular,
            color: subtleColor
          });
        }

        metaY -= 20;
      });

      // ---------------------------------------------------------
      // Step B: Append matched documents in strict requirements.order
      // ---------------------------------------------------------
      let currentDocIdx = 0;
      for (const req of includedRequirements) {
        currentDocIdx++;
        const percent = Math.floor(30 + (currentDocIdx / includedRequirements.length) * 45);
        updateGenProgress(percent, `Merging document ${currentDocIdx} of ${includedRequirements.length}: ${req.title_en}...`);

        const assignment = state.assignments[req.id];
        const fileObj = state.uploadedFiles.find(f => f.id === assignment.fileId);
        if (!fileObj || !fileObj.buffer) continue;

        const srcDoc = await PDFLib.PDFDocument.load(fileObj.buffer);
        const pageIndices = srcDoc.getPageIndices();
        const copiedPages = await mergedPdf.copyPages(srcDoc, pageIndices);

        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      // ---------------------------------------------------------
      // Step C: Footers on EVERY page (<tender_id> | Page X of Y)
      // ---------------------------------------------------------
      updateGenProgress(85, 'Stamping footers on all pages...');
      const totalPages = mergedPdf.getPageCount();
      const footerFontSize = 9;

      for (let i = 0; i < totalPages; i++) {
        const page = mergedPdf.getPage(i);
        const { width: pWidth } = page.getSize();
        const footerText = `${tenderId} | Page ${i + 1} of ${totalPages}`;
        const textWidth = fontRegular.widthOfTextAtSize(footerText, footerFontSize);

        page.drawText(footerText, {
          x: (pWidth - textWidth) / 2, // Centered
          y: 18,                       // Safe bottom margin
          size: footerFontSize,
          font: fontRegular,
          color: PDFLib.rgb(0.3, 0.35, 0.42)
        });
      }

      // ---------------------------------------------------------
      // Step D: Finalize & Download
      // ---------------------------------------------------------
      updateGenProgress(95, 'Saving final PDF package...');
      const mergedPdfBytes = await mergedPdf.save();
      const finalBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const finalFilename = `${tenderId}_Package.pdf`;

      state.generatedBlob = finalBlob;
      state.generatedFilename = finalFilename;
      state.generatedPagesCount = totalPages;

      // Trigger automatic browser download
      downloadBlob(finalBlob, finalFilename);

      // Show success results card
      updateGenProgress(100, 'Done!');
      elements.genProgressContainer.classList.add('hidden');
      elements.successFilenameText.textContent = finalFilename;
      elements.successPagesText.textContent = `(${totalPages} pages)`;
      elements.genSuccessCard.classList.remove('hidden');

      showToast(t('msgPackageSuccess'), 'success', 5000);
    } catch (err) {
      console.error('Generation error:', err);
      elements.genProgressContainer.classList.add('hidden');
      showToast(`Package generation failed: ${err.message}`, 'error', 6000);
    } finally {
      elements.btnGeneratePackage.disabled = false;
    }
  }

  function updateGenProgress(percent, statusText) {
    elements.genProgressBar.style.width = `${percent}%`;
    elements.genProgressStatus.textContent = statusText;
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  }

  // -------------------------------------------------------------
  // Document Preview Modal
  // -------------------------------------------------------------
  function openPdfPreview(bufferOrBlob, title = 'Document Preview') {
    let blobUrl;
    if (bufferOrBlob instanceof Blob) {
      blobUrl = URL.createObjectURL(bufferOrBlob);
    } else {
      const blob = new Blob([bufferOrBlob], { type: 'application/pdf' });
      blobUrl = URL.createObjectURL(blob);
    }

    elements.modalTitle.textContent = title;
    elements.modalSubtitle.textContent = state.currentLang === 'bn' ? 'নথি প্রিভিউ' : 'Document Preview';
    elements.modalIframe.src = blobUrl;
    elements.previewModal.classList.remove('hidden');
  }

  function closePdfPreview() {
    elements.modalIframe.src = 'about:blank';
    elements.previewModal.classList.add('hidden');
  }

  // -------------------------------------------------------------
  // Demo Data Loader (for one-click demonstration & testing)
  // -------------------------------------------------------------
  async function loadSampleDemonstrationData() {
    try {
      let response = await fetch('sample-pack/requirements.json');
      if (!response.ok) {
        response = await fetch('test-data/requirements.json');
      }
      if (response.ok) {
        const data = await response.json();
        loadRequirementsData(data);
        showToast(
          state.currentLang === 'bn'
            ? 'নমুনা requirements.json সফলভাবে লোড হয়েছে!'
            : 'Sample requirements.json loaded successfully!',
          'success'
        );
        return;
      }
      throw new Error('File not accessible via fetch');
    } catch (e) {
      console.warn('Demo fetch fallback', e);
      // Fallback embedded sample matching competition pack
      const fallbackSample = {
        tender: {
          tender_id: 'T-2026-0417',
          title: 'Supply of IT Equipment',
          procuring_entity: 'Directorate of Sample Services',
          bidder: 'Meghna Tech Solutions Ltd.',
          submission_deadline: '2026-10-20'
        },
        requirements: [
          { id: 'R01', order: 1, title_en: 'Trade License', title_bn: 'ট্রেড লাইসেন্স', mandatory: true, has_expiry: true },
          { id: 'R02', order: 2, title_en: 'TIN Certificate', title_bn: 'টিআইএন সনদ', mandatory: true, has_expiry: false },
          { id: 'R03', order: 3, title_en: 'VAT Registration Certificate', title_bn: 'ভ্যাট নিবন্ধন সনদ', mandatory: true, has_expiry: false },
          { id: 'R04', order: 4, title_en: 'Bank Solvency Certificate', title_bn: 'ব্যাংক সচ্ছলতা সনদ', mandatory: true, has_expiry: true },
          { id: 'R05', order: 5, title_en: 'Experience Certificate', title_bn: 'অভিজ্ঞতার সনদ', mandatory: true, has_expiry: false },
          { id: 'R06', order: 6, title_en: 'Audited Financial Statement', title_bn: 'নিরীক্ষিত আর্থিক বিবরণী', mandatory: false, has_expiry: false },
          { id: 'R07', order: 7, title_en: "Manufacturer's Authorization", title_bn: 'প্রস্তুতকারকের অনুমোদনপত্র', mandatory: false, has_expiry: true },
          { id: 'R08', order: 8, title_en: 'Technical Proposal', title_bn: 'কারিগরি প্রস্তাব', mandatory: true, has_expiry: false },
          { id: 'R09', order: 9, title_en: 'Financial Proposal', title_bn: 'আর্থিক প্রস্তাব', mandatory: true, has_expiry: false },
          { id: 'R10', order: 10, title_en: 'Signed Declaration', title_bn: 'স্বাক্ষরিত ঘোষণাপত্র', mandatory: true, has_expiry: false }
        ]
      };
      loadRequirementsData(fallbackSample);
      showToast('Sample tender loaded from embedded template!', 'success');
    }
  }

  /**
   * Load test documents from competition sample-pack.zip
   */
  async function loadSamplePackDocuments() {
    if (!state.tenderData) {
      await loadSampleDemonstrationData();
    }

    showToast(
      state.currentLang === 'bn'
        ? 'নমুনা প্যাকের ফাইলগুলো লোড করা হচ্ছে...'
        : 'Loading documents from competition sample pack...',
      'info'
    );

    const sampleDocNames = [
      'trade_license_2026.pdf',
      'trade_license_2025.pdf',
      '03_tin_certificate.pdf',
      '04_vat_certificate.pdf',
      'bank_solvency.pdf',
      'experience_cert.pdf',
      'experience_cert (1).pdf',
      '02_technical_proposal.pdf',
      '01_financial_proposal.pdf',
      'scan_0042.pdf',
      'company_logo.png'
    ];

    const files = [];
    for (const name of sampleDocNames) {
      try {
        const res = await fetch(`sample-pack/documents/${name}`);
        if (!res.ok) continue;
        const blob = await res.blob();
        const file = new File([blob], name, {
          type: name.endsWith('.pdf') ? 'application/pdf' : (name.endsWith('.png') ? 'image/png' : 'application/octet-stream')
        });
        files.push(file);
      } catch (err) {
        console.warn('Could not load sample file:', name, err);
      }
    }

    if (files.length > 0) {
      await handlePdfFiles(files);
      showToast(
        state.currentLang === 'bn'
          ? 'নমুনা ফাইলগুলো সফলভাবে লোড হয়েছে।'
          : 'Sample documents ingested (with duplicate and type checks).',
        'success'
      );
    } else {
      showToast('Could not fetch sample documents automatically. Please upload manually.', 'error');
    }
  }

  // -------------------------------------------------------------
  // Setup Event Listeners
  // -------------------------------------------------------------
  function setupEventListeners() {
    // Language toggles
    elements.langBtnEn.addEventListener('click', () => setLanguage('en'));
    elements.langBtnBn.addEventListener('click', () => setLanguage('bn'));

    // Sample data loaders
    if (elements.btnLoadSample) {
      elements.btnLoadSample.addEventListener('click', loadSampleDemonstrationData);
    }
    if (elements.btnLoadSampleDocs) {
      elements.btnLoadSampleDocs.addEventListener('click', loadSamplePackDocuments);
    }
    if (elements.btnQuickSampleFiles) {
      elements.btnQuickSampleFiles.addEventListener('click', loadSamplePackDocuments);
    }

    // Requirements file picker
    if (elements.inputRequirementsFile) {
      elements.inputRequirementsFile.addEventListener('change', e => {
        if (e.target.files && e.target.files.length > 0) {
          handleRequirementsFile(e.target.files[0]);
          elements.inputRequirementsFile.value = '';
        }
      });
    }

    // Requirements JSON drag-and-drop
    if (elements.jsonDropzone) {
      setupDragDrop(elements.jsonDropzone, files => {
        if (files && files.length > 0) {
          handleRequirementsFile(files[0]);
        }
      });
      elements.jsonDropzone.addEventListener('click', () => {
        if (elements.inputRequirementsFile) elements.inputRequirementsFile.click();
      });
    }

    // PDF files picker
    if (elements.inputPdfFiles) {
      elements.inputPdfFiles.addEventListener('change', e => {
        if (e.target.files && e.target.files.length > 0) {
          handlePdfFiles(e.target.files);
          elements.inputPdfFiles.value = '';
        }
      });
    }

    // PDF files drag-and-drop
    if (elements.pdfDropzone) {
      setupDragDrop(elements.pdfDropzone, files => {
        handlePdfFiles(files);
      });
      elements.pdfDropzone.addEventListener('click', () => {
        if (elements.inputPdfFiles) elements.inputPdfFiles.click();
      });
    }

    // Clear uploads
    if (elements.btnClearUploads) {
      elements.btnClearUploads.addEventListener('click', clearAllUploads);
    }

    // Auto match button
    if (elements.btnAutoMatch) {
      elements.btnAutoMatch.addEventListener('click', autoMatchFiles);
    }

    // Generate button
    if (elements.btnGeneratePackage) {
      elements.btnGeneratePackage.addEventListener('click', generateFinalPackage);
    }

    // Success actions
    if (elements.btnDownloadAgain) {
      elements.btnDownloadAgain.addEventListener('click', () => {
        if (state.generatedBlob && state.generatedFilename) {
          downloadBlob(state.generatedBlob, state.generatedFilename);
        }
      });
    }

    if (elements.btnPreviewPackage) {
      elements.btnPreviewPackage.addEventListener('click', () => {
        if (state.generatedBlob) {
          openPdfPreview(state.generatedBlob, state.generatedFilename);
        }
      });
    }

    // Modal close
    if (elements.btnCloseModal) {
      elements.btnCloseModal.addEventListener('click', closePdfPreview);
    }
    if (elements.previewModal) {
      elements.previewModal.addEventListener('click', e => {
        if (e.target === elements.previewModal) closePdfPreview();
      });
    }
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && elements.previewModal && !elements.previewModal.classList.contains('hidden')) {
        closePdfPreview();
      }
    });

    // Global window drop handler: catches files dropped ANYWHERE on the window
    window.addEventListener('dragover', e => {
      e.preventDefault();
    });
    window.addEventListener('drop', e => {
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        const zipFile = files.find(f => f.name.toLowerCase().endsWith('.zip'));
        if (zipFile) {
          handleZipFile(zipFile);
          return;
        }
        const jsonFile = files.find(f => f.name.toLowerCase().endsWith('.json'));
        if (jsonFile && !state.tenderData) {
          handleRequirementsFile(jsonFile);
        }
        const docFiles = files.filter(f => !f.name.toLowerCase().endsWith('.json') && !f.name.toLowerCase().endsWith('.zip'));
        if (docFiles.length > 0) {
          handlePdfFiles(docFiles);
        }
      }
    });
  }

  function setupDragDrop(element, onDropCallback) {
    if (!element) return;

    ['dragenter', 'dragover'].forEach(eventName => {
      element.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
        element.classList.add('drag-active');
      });
    });

    element.addEventListener('dragleave', e => {
      e.preventDefault();
      e.stopPropagation();
      element.classList.remove('drag-active');
    });

    element.addEventListener('drop', e => {
      e.preventDefault();
      e.stopPropagation();
      element.classList.remove('drag-active');
      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length > 0) {
        onDropCallback(dt.files);
      }
    });
  }

  // -------------------------------------------------------------
  // Initialization
  // -------------------------------------------------------------
  function init() {
    updateStaticTranslations();
    updateStatusDashboard();
    setupEventListeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose state and helper functions for test automation or debugging
  window.__tenderApp = {
    state,
    loadRequirementsData,
    handlePdfFiles,
    setLanguage,
    generateFinalPackage
  };
})();
