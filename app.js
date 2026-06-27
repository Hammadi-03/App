/* ============================================================
   BudgetMate – app.js  (v2 – Sidebar + i18n edition)
   Vanilla JavaScript
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════════════
   1. TRANSLATIONS (i18n)
══════════════════════════════════════════════════════════════ */

const TRANSLATIONS = {
  en: {
    brandSub:                 'Smart Tracker',
    navDashboard:             'Dashboard',
    navTransactions:          'Transactions',
    navCategories:            'Categories',
    navSummary:               'Summary',
    quickBalance:             'Quick Balance',
    income:                   'Income',
    expense:                  'Expense',
    topbarWelcome:            'Welcome back! Track your budget.',

    addTransaction:           'Add Transaction',
    addTransactionTitle:      'Add Transaction',
    totalIncome:              'Total Income',
    totalExpenses:            'Total Expenses',
    netBalance:               'Net Balance',
    savingsRate:              'Savings Rate',
    categoryBreakdown:        'Category Breakdown',
    recentTransactions:       'Recent Transactions',
    seeAll:                   'See all →',
    allTransactions:          'All Transactions',
    manageCategories:         'Manage Categories',
    quickAddCategory:         'Quick Add Category',
    categoryName:             'Category Name',
    appliesTo:                'Applies To',
    bothIncomeExpense:        'Both Income & Expense',
    incomeOnly:               'Income only',
    expenseOnly:              'Expense only',

    totalTransactions:        'Total Transactions',
    avgExpense:               'Avg. Expense',
    avgIncome:                'Avg. Income',
    topCategories:            'Top Spending Categories',

    type:                     'Type',
    description:              'Description',
    amount:                   'Amount',
    currency:                 'Currency',
    category:                 'Category',
    date:                     'Date',
    notes:                    'Notes',
    optional:                 '(optional)',
    newCategory:              '+ New',
    addCategory:              'Add Category',
    both:                     'Both',
    cancel:                   'Cancel',
    saveTransaction:          'Save Transaction',
    clearAll:                 'Clear All',
    allTypes:                 'All Types',
    allCategories:            'All Categories',

    noTransactionsYet:        'No transactions yet!',
    noTransactionsBreakdown:  'No transactions yet. Add one to see breakdown.',
    addFirstTransaction:      'Click "Add Transaction" to start tracking.',

    descriptionPlaceholder:   'e.g. Groceries, Monthly salary…',
    notesPlaceholder:         'Any extra details…',
    categoryNamePlaceholder:  'Category name…',
    searchPlaceholder:        'Search description…',

    // Computed/dynamic
    transactions:             'transactions',
    transaction:              'transaction',
    savingsRateLabel:         'Savings rate',
    conversionRef:            'reference rate: 1 QAR = {rate} IDR',

    // Toasts
    toastSaved:               'Transaction saved! 🎉',
    toastDeleted:             'Transaction deleted.',
    toastCleared:             'All transactions cleared.',
    toastCatAdded:            'Category "{name}" added! ✨',
    toastCatDeleted:          'Category deleted.',
    toastCatDeletedReassign:  'Category deleted. {n} transaction(s) moved to "Other".',
    toastBuiltIn:             'Built-in categories cannot be deleted.',
    confirmClearAll:          'Are you sure you want to delete ALL transactions? This cannot be undone.',

    // Validation
    valDescMin:               'Description must be at least 2 characters.',
    valDescMax:               'Description must be 100 characters or fewer.',
    valAmountRequired:        'Please enter an amount.',
    valAmountInvalid:         'Amount must be a valid number.',
    valAmountZero:            'Amount must be greater than zero.',
    valAmountTooLarge:        'Amount is too large. Please check your input.',
    valCategoryRequired:      'Please select a valid category.',
    valDateRequired:          'Please select a date.',
    valDateInvalid:           'Please enter a valid date.',
    valDateRange:             'Date seems out of range. Please double-check.',
    valCatEmpty:              'Category name cannot be empty.',
    valCatMin:                'Name must be at least 2 characters.',
    valCatDuplicate:          'A category with this name already exists.',
  },

  id: {
    brandSub:                 'Pelacak Cerdas',
    navDashboard:             'Beranda',
    navTransactions:          'Transaksi',
    navCategories:            'Kategori',
    navSummary:               'Ringkasan',
    quickBalance:             'Saldo Cepat',
    income:                   'Pemasukan',
    expense:                  'Pengeluaran',
    topbarWelcome:            'Selamat datang! Lacak anggaranmu.',

    addTransaction:           'Tambah Transaksi',
    addTransactionTitle:      'Tambah Transaksi',
    totalIncome:              'Total Pemasukan',
    totalExpenses:            'Total Pengeluaran',
    netBalance:               'Saldo Bersih',
    savingsRate:              'Tingkat Tabungan',
    categoryBreakdown:        'Rincian Kategori',
    recentTransactions:       'Transaksi Terbaru',
    seeAll:                   'Lihat semua →',
    allTransactions:          'Semua Transaksi',
    manageCategories:         'Kelola Kategori',
    quickAddCategory:         'Tambah Kategori Cepat',
    categoryName:             'Nama Kategori',
    appliesTo:                'Berlaku Untuk',
    bothIncomeExpense:        'Pemasukan & Pengeluaran',
    incomeOnly:               'Hanya Pemasukan',
    expenseOnly:              'Hanya Pengeluaran',

    totalTransactions:        'Total Transaksi',
    avgExpense:               'Rata-rata Pengeluaran',
    avgIncome:                'Rata-rata Pemasukan',
    topCategories:            'Kategori Pengeluaran Teratas',

    type:                     'Jenis',
    description:              'Deskripsi',
    amount:                   'Jumlah',
    currency:                 'Mata Uang',
    category:                 'Kategori',
    date:                     'Tanggal',
    notes:                    'Catatan',
    optional:                 '(opsional)',
    newCategory:              '+ Baru',
    addCategory:              'Tambah Kategori',
    both:                     'Keduanya',
    cancel:                   'Batal',
    saveTransaction:          'Simpan Transaksi',
    clearAll:                 'Hapus Semua',
    allTypes:                 'Semua Jenis',
    allCategories:            'Semua Kategori',

    noTransactionsYet:        'Belum ada transaksi!',
    noTransactionsBreakdown:  'Belum ada transaksi. Tambahkan untuk melihat rincian.',
    addFirstTransaction:      'Klik "Tambah Transaksi" untuk mulai mencatat.',

    descriptionPlaceholder:   'mis. Belanja, Gaji bulanan…',
    notesPlaceholder:         'Detail tambahan…',
    categoryNamePlaceholder:  'Nama kategori…',
    searchPlaceholder:        'Cari deskripsi…',

    transactions:             'transaksi',
    transaction:              'transaksi',
    savingsRateLabel:         'Tingkat tabungan',
    conversionRef:            'kurs referensi: 1 QAR = {rate} IDR',

    toastSaved:               'Transaksi berhasil disimpan! 🎉',
    toastDeleted:             'Transaksi dihapus.',
    toastCleared:             'Semua transaksi dihapus.',
    toastCatAdded:            'Kategori "{name}" ditambahkan! ✨',
    toastCatDeleted:          'Kategori dihapus.',
    toastCatDeletedReassign:  'Kategori dihapus. {n} transaksi dipindahkan ke "Lainnya".',
    toastBuiltIn:             'Kategori bawaan tidak dapat dihapus.',
    confirmClearAll:          'Yakin ingin menghapus SEMUA transaksi? Tindakan ini tidak dapat dibatalkan.',

    valDescMin:               'Deskripsi minimal 2 karakter.',
    valDescMax:               'Deskripsi maksimal 100 karakter.',
    valAmountRequired:        'Masukkan jumlah.',
    valAmountInvalid:         'Jumlah harus berupa angka yang valid.',
    valAmountZero:            'Jumlah harus lebih dari nol.',
    valAmountTooLarge:        'Jumlah terlalu besar. Periksa kembali.',
    valCategoryRequired:      'Pilih kategori yang valid.',
    valDateRequired:          'Pilih tanggal.',
    valDateInvalid:           'Masukkan tanggal yang valid.',
    valDateRange:             'Tanggal tampak di luar rentang. Periksa kembali.',
    valCatEmpty:              'Nama kategori tidak boleh kosong.',
    valCatMin:                'Nama minimal 2 karakter.',
    valCatDuplicate:          'Kategori dengan nama ini sudah ada.',
  },
};

/* ══════════════════════════════════════════════════════════════
   2. CONSTANTS & STATE
══════════════════════════════════════════════════════════════ */

const STORAGE_KEYS = {
  transactions:    'budgetmate_transactions',
  categories:      'budgetmate_categories',
  theme:           'budgetmate_theme',
  displayCurrency: 'budgetmate_displayCurrency',
  language:        'budgetmate_language',
};

/** Approximate exchange rate: 1 QAR ≈ 4,250 IDR */
const EXCHANGE = { IDR_PER_QAR: 4250 };

const CURRENCY_FORMATS = {
  IDR: { symbol: 'Rp',  code: 'IDR', flag: '🇮🇩', name: 'Rupiah' },
  QAR: { symbol: 'QR ', code: 'QAR', flag: '🇶🇦', name: 'Riyal'  },
};

const DEFAULT_CATEGORIES = [
  { id: 'cat_food',      name: '🍔 Makanan & Minuman',      nameEn: '🍔 Food & Drinks',      type: 'both',    isDefault: true },
  { id: 'cat_grocery',   name: '🛒 Belanja & Kebutuhan',    nameEn: '🛒 Grocery & Shopping', type: 'expense', isDefault: true },
  { id: 'cat_transport', name: '🚌 Transportasi',            nameEn: '🚌 Transport',          type: 'expense', isDefault: true },
  { id: 'cat_education', name: '📚 Pendidikan',              nameEn: '📚 Education',          type: 'both',    isDefault: true },
  { id: 'cat_health',    name: '💊 Kesehatan & Medis',      nameEn: '💊 Health & Medical',   type: 'expense', isDefault: true },
  { id: 'cat_utilities', name: '💡 Tagihan & Utilitas',     nameEn: '💡 Utilities & Bills',  type: 'expense', isDefault: true },
  { id: 'cat_rent',      name: '🏠 Sewa & Tempat Tinggal', nameEn: '🏠 Rent & Housing',     type: 'expense', isDefault: true },
  { id: 'cat_clothing',  name: '👗 Pakaian & Fashion',      nameEn: '👗 Clothing & Fashion', type: 'expense', isDefault: true },
  { id: 'cat_salary',    name: '💼 Gaji / Uang Saku',      nameEn: '💼 Salary / Allowance', type: 'income',  isDefault: true },
  { id: 'cat_freelance', name: '🖥️ Freelance / Sampingan', nameEn: '🖥️ Freelance / Side Job',type:'income',  isDefault: true },
  { id: 'cat_gift',      name: '🎁 Hadiah & Bonus',         nameEn: '🎁 Gift & Bonus',       type: 'income',  isDefault: true },
  { id: 'cat_savings',   name: '🏦 Tabungan',               nameEn: '🏦 Savings',            type: 'both',    isDefault: true },
  { id: 'cat_entertain', name: '🎮 Hiburan',                nameEn: '🎮 Entertainment',      type: 'expense', isDefault: true },
  { id: 'cat_other',     name: '📦 Lainnya',                nameEn: '📦 Other',              type: 'both',    isDefault: true },
];

let state = {
  transactions:    [],
  categories:      [],
  displayCurrency: 'IDR',
  lang:            'en',
  currentPage:     'dashboard',
  filter: { type: 'all', category: 'all', search: '' },
};

/* ══════════════════════════════════════════════════════════════
   3. i18n HELPERS
══════════════════════════════════════════════════════════════ */

function t(key, replacements) {
  let str = (TRANSLATIONS[state.lang] || TRANSLATIONS.en)[key] || key;
  if (replacements) {
    for (const [k, v] of Object.entries(replacements)) {
      str = str.replace(`{${k}}`, v);
    }
  }
  return str;
}

/**
 * Apply all data-i18n translations to the DOM
 */
function applyTranslations() {
  document.documentElement.lang = state.lang;

  // Text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key);
    if (translation) el.textContent = translation;
  });

  // Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });

  // Options inside selects
  document.querySelectorAll('option[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === state.lang);
  });

  // Dynamic counts (re-render summaries will handle these)
  renderDynamicText();
}

function renderDynamicText() {
  // Savings rate label
  const sr = document.getElementById('savingsRate');
  if (sr) {
    const { savingsRate } = computeSummary();
    sr.textContent = `${t('savingsRateLabel')}: ${savingsRate.toFixed(1)}%`;
  }
  // Category filter select
  const filterTypeSel = document.getElementById('filterType');
  if (filterTypeSel) {
    filterTypeSel.options[0].textContent = t('allTypes');
    if (filterTypeSel.options[1]) filterTypeSel.options[1].textContent = t('income');
    if (filterTypeSel.options[2]) filterTypeSel.options[2].textContent = t('expense');
  }
}

/**
 * Get category display name based on current language.
 */
function getCatName(cat) {
  if (!cat) return '?';
  if (cat.isDefault) {
    return state.lang === 'id' ? cat.name : (cat.nameEn || cat.name);
  }
  return cat.name; // custom categories: user chose the name themselves
}

/* ══════════════════════════════════════════════════════════════
   4. PERSISTENCE
══════════════════════════════════════════════════════════════ */

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.transactions,    JSON.stringify(state.transactions));
    localStorage.setItem(STORAGE_KEYS.categories,      JSON.stringify(state.categories));
    localStorage.setItem(STORAGE_KEYS.displayCurrency, state.displayCurrency);
    localStorage.setItem(STORAGE_KEYS.language,        state.lang);
  } catch (e) { console.warn('Storage save error:', e); }
}

function loadFromStorage() {
  try {
    const txRaw  = localStorage.getItem(STORAGE_KEYS.transactions);
    const catRaw = localStorage.getItem(STORAGE_KEYS.categories);
    const dc     = localStorage.getItem(STORAGE_KEYS.displayCurrency);
    const lang   = localStorage.getItem(STORAGE_KEYS.language);
    const theme  = localStorage.getItem(STORAGE_KEYS.theme);

    state.transactions   = txRaw  ? JSON.parse(txRaw)  : [];
    state.categories     = catRaw ? JSON.parse(catRaw) : JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
    state.displayCurrency = (dc === 'QAR') ? 'QAR' : 'IDR';
    state.lang            = (lang === 'id') ? 'id' : 'en';

    if (theme === 'light') document.body.classList.add('light');
  } catch (e) {
    console.warn('Storage load error:', e);
    state.transactions = [];
    state.categories   = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
  }
}

/* ══════════════════════════════════════════════════════════════
   5. CURRENCY HELPERS
══════════════════════════════════════════════════════════════ */

function convertCurrency(amount, from, to) {
  if (from === to) return amount;
  if (from === 'QAR' && to === 'IDR') return amount * EXCHANGE.IDR_PER_QAR;
  if (from === 'IDR' && to === 'QAR') return amount / EXCHANGE.IDR_PER_QAR;
  return amount;
}

function formatCurrency(amount, currency) {
  if (currency === 'IDR') {
    return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
  }
  return 'QR ' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getDisplayAmount(tx) {
  return convertCurrency(tx.amount, tx.currency, state.displayCurrency);
}

/* ══════════════════════════════════════════════════════════════
   6. CATEGORY HELPERS
══════════════════════════════════════════════════════════════ */

function getCategoriesForType(type) {
  return state.categories.filter(c => c.type === 'both' || c.type === type);
}

function getCategoryById(id) {
  return state.categories.find(c => c.id === id);
}

function generateCatId() {
  return 'cat_custom_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

/* ══════════════════════════════════════════════════════════════
   7. COMPUTED SUMMARIES
══════════════════════════════════════════════════════════════ */

function computeSummary() {
  let totalIncome = 0, totalExpense = 0;
  const catTotals = {};

  for (const tx of state.transactions) {
    const amount = getDisplayAmount(tx);
    if (tx.type === 'income')  totalIncome  += amount;
    else                       totalExpense += amount;

    if (!catTotals[tx.category]) catTotals[tx.category] = { income: 0, expense: 0, count: 0 };
    catTotals[tx.category][tx.type] += amount;
    catTotals[tx.category].count++;
  }

  const balance     = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, (balance / totalIncome) * 100) : 0;
  return { totalIncome, totalExpense, balance, savingsRate, catTotals };
}

/* ══════════════════════════════════════════════════════════════
   8. VALIDATION
══════════════════════════════════════════════════════════════ */

function validateTransactionForm(data) {
  const errors = {};

  if (!data.description || data.description.trim().length < 2)
    errors.description = t('valDescMin');
  else if (data.description.trim().length > 100)
    errors.description = t('valDescMax');

  const amt = parseFloat(data.amount);
  if (data.amount === '' || data.amount == null)
    errors.amount = t('valAmountRequired');
  else if (isNaN(amt) || !isFinite(amt))
    errors.amount = t('valAmountInvalid');
  else if (amt <= 0)
    errors.amount = t('valAmountZero');
  else if (amt > 999_999_999_999)
    errors.amount = t('valAmountTooLarge');

  if (!data.category || !getCategoryById(data.category))
    errors.category = t('valCategoryRequired');

  if (!data.date)
    errors.date = t('valDateRequired');
  else {
    const d = new Date(data.date);
    if (isNaN(d.getTime())) {
      errors.date = t('valDateInvalid');
    } else {
      const now = new Date();
      const tenAgo  = new Date(now.getFullYear()-10, now.getMonth(), now.getDate());
      const oneAhead = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());
      if (d < tenAgo || d > oneAhead) errors.date = t('valDateRange');
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/* ══════════════════════════════════════════════════════════════
   9. RENDER
══════════════════════════════════════════════════════════════ */

// ── 9a. Summary cards ──
function renderSummary() {
  const { totalIncome, totalExpense, balance, savingsRate } = computeSummary();
  const dc = state.displayCurrency;

  const incCount = state.transactions.filter(t => t.type === 'income').length;
  const expCount = state.transactions.filter(t => t.type === 'expense').length;
  const txWord   = (n) => `${n} ${n === 1 ? t('transaction') : t('transactions')}`;

  document.getElementById('totalIncomeDisplay').textContent  = formatCurrency(totalIncome, dc);
  document.getElementById('totalExpenseDisplay').textContent = formatCurrency(totalExpense, dc);
  document.getElementById('balanceDisplay').textContent      = formatCurrency(Math.abs(balance), dc);
  document.getElementById('incomeCount').textContent         = txWord(incCount);
  document.getElementById('expenseCount').textContent        = txWord(expCount);
  document.getElementById('savingsRate').textContent         = `${t('savingsRateLabel')}: ${savingsRate.toFixed(1)}%`;

  const balCard = document.getElementById('balanceCard');
  balCard.classList.toggle('negative', balance < 0);
  document.getElementById('balanceDisplay').style.color =
    balance < 0 ? 'var(--clr-expense)' : balance > 0 ? 'var(--clr-income)' : 'var(--clr-balance)';
}

// ── 9b. Sidebar quick balance ──
function renderSidebarStats() {
  const sidebarBal = document.getElementById('sidebarBalance');
  const barInc = document.getElementById('sidebarBarIncome');
  const barExp = document.getElementById('sidebarBarExpense');
  if (!sidebarBal || !barInc || !barExp) return;

  const { totalIncome, totalExpense, balance } = computeSummary();
  const dc = state.displayCurrency;

  sidebarBal.textContent = formatCurrency(Math.abs(balance), dc);
  sidebarBal.style.color =
    balance < 0 ? 'var(--clr-expense)' : balance > 0 ? 'var(--clr-income)' : '#fff';

  const total = totalIncome + totalExpense || 1;
  const incPct = Math.min(100, (totalIncome / total * 100)).toFixed(1);
  const expPct = Math.min(100, (totalExpense / total * 100)).toFixed(1);

  barInc.style.width  = incPct + '%';
  barExp.style.width = expPct + '%';
}

// ── 9c. Category breakdown (dashboard) ──
function renderBreakdown() {
  const { catTotals, totalIncome, totalExpense } = computeSummary();
  const grid = document.getElementById('categoryBreakdownGrid');
  grid.innerHTML = '';

  const entries = Object.entries(catTotals);
  if (entries.length === 0) {
    grid.innerHTML = `<p class="empty-state-sm">${t('noTransactionsBreakdown')}</p>`;
    return;
  }

  for (const [catId, totals] of entries) {
    const cat = getCategoryById(catId);
    const catName = getCatName(cat);

    if (totals.income > 0) {
      const pct = totalIncome > 0 ? (totals.income / totalIncome * 100).toFixed(0) : 0;
      grid.appendChild(createBreakdownChip(catId, catName, totals.income, 'income', pct));
    }
    if (totals.expense > 0) {
      const pct = totalExpense > 0 ? (totals.expense / totalExpense * 100).toFixed(0) : 0;
      grid.appendChild(createBreakdownChip(catId, catName, totals.expense, 'expense', pct));
    }
  }
}

function createBreakdownChip(catId, catName, amount, typeClass, pct) {
  const div = document.createElement('div');
  div.className = 'breakdown-chip';
  div.style.cursor = 'pointer';
  div.title = 'Click to filter transactions';
  div.innerHTML = `
    <p class="breakdown-cat">${escapeHtml(catName)} <span style="font-size:0.65rem;opacity:0.5">${typeClass === 'income' ? '▲' : '▼'}</span></p>
    <p class="breakdown-amount ${typeClass}">${formatCurrency(amount, state.displayCurrency)}</p>
    <div class="breakdown-bar-wrap">
      <div class="breakdown-bar ${typeClass}" style="width:${pct}%"></div>
    </div>`;

  div.addEventListener('click', () => {
    state.filter.category = catId;
    state.filter.type = typeClass;

    const filterCatSel = document.getElementById('filterCategory');
    const filterTypeSel = document.getElementById('filterType');
    if (filterCatSel) filterCatSel.value = catId;
    if (filterTypeSel) filterTypeSel.value = typeClass;

    state.filter.search = '';
    const filterSearchInp = document.getElementById('filterSearch');
    if (filterSearchInp) filterSearchInp.value = '';

    navigateTo('transactions');
  });
  return div;
}

// ── 9d. Recent transactions (dashboard, 5 max) ──
function renderRecentTransactions() {
  const list = document.getElementById('recentTransactionList');
  list.innerHTML = '';

  const sorted = [...state.transactions].sort((a,b) => new Date(b.date) - new Date(a.date) || b.id - a.id);
  const recent = sorted.slice(0, 5);

  if (recent.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><span class="material-icons-round" style="font-size: 3rem; opacity: 0.3;">shopping_cart</span></div>
        <p class="empty-title">${t('noTransactionsYet')}</p>
        <p class="empty-desc">${t('addFirstTransaction')}</p>
      </div>`;
    return;
  }

  for (const tx of recent) list.appendChild(createTxItem(tx, true));
}

// ── 9e. Full transaction list (Transactions page) ──
function renderTransactions() {
  const list = document.getElementById('transactionList');
  list.innerHTML = '';

  const filtered = state.transactions.filter(tx => {
    const typeOk = state.filter.type === 'all' || tx.type === state.filter.type;
    const catOk  = state.filter.category === 'all' || tx.category === state.filter.category;
    const term   = (state.filter.search || '').trim().toLowerCase();
    const searchOk = !term ||
      tx.description.toLowerCase().includes(term) ||
      (tx.notes && tx.notes.toLowerCase().includes(term));
    return typeOk && catOk && searchOk;
  });

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><span class="material-icons-round" style="font-size: 3rem; opacity: 0.3;">shopping_cart</span></div>
        <p class="empty-title">${t('noTransactionsYet')}</p>
        <p class="empty-desc">${t('addFirstTransaction')}</p>
      </div>`;
    return;
  }

  const sorted = [...filtered].sort((a,b) => new Date(b.date) - new Date(a.date) || b.id - a.id);
  for (const tx of sorted) list.appendChild(createTxItem(tx, false));
}

function createTxItem(tx, compact) {
  const cat = getCategoryById(tx.category);
  const catName = getCatName(cat);
  const dc = state.displayCurrency;
  const dispAmount = getDisplayAmount(tx);
  const prefix = tx.type === 'income' ? '+' : '-';

  const formattedDate = new Date(tx.date + 'T00:00:00').toLocaleDateString(
    state.lang === 'id' ? 'id-ID' : 'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  );

  const showConv = tx.currency !== dc
    ? `<span title="${t('currency')}: ${formatCurrency(tx.amount, tx.currency)}">(${CURRENCY_FORMATS[tx.currency].flag} → ${dc})</span>`
    : '';

  const div = document.createElement('div');
  div.className = 'tx-item';
  div.innerHTML = `
    <div class="tx-dot ${tx.type}"></div>
    <div class="tx-main">
      <p class="tx-desc" title="${escapeHtml(tx.description)}">${escapeHtml(tx.description)}</p>
      <div class="tx-meta">
        <span class="tx-cat-badge">${escapeHtml(catName)}</span>
        <span>${formattedDate}</span>
        ${showConv}
        ${(!compact && tx.notes) ? `<span><span class="material-icons-round" style="font-size: 0.9rem; vertical-align: text-bottom; margin-right: 2px;">notes</span>${escapeHtml(tx.notes.slice(0,28))}${tx.notes.length>28?'…':''}</span>` : ''}
      </div>
    </div>
    <div class="tx-right">
      <p class="tx-amount ${tx.type}">${prefix}${formatCurrency(dispAmount, dc)}</p>
      <p class="tx-currency-badge">${CURRENCY_FORMATS[tx.currency].flag} ${tx.currency}</p>
    </div>
    <button class="tx-delete" data-id="${tx.id}" title="Delete" aria-label="Delete transaction"><span class="material-icons-round" style="font-size: 1.1rem;">delete</span></button>
  `;
  div.querySelector('.tx-delete').addEventListener('click', () => deleteTransaction(tx.id));
  return div;
}

// ── 9f. Category options (form) ──
function renderCategoryOptions(selectedType) {
  const sel = document.getElementById('txCategory');
  const currentVal = sel.value;
  sel.innerHTML = '';

  const applicable = getCategoriesForType(selectedType || getCurrentFormType());
  for (const cat of applicable) {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = getCatName(cat);
    if (cat.id === currentVal) opt.selected = true;
    sel.appendChild(opt);
  }
  if (!sel.value && applicable.length > 0) sel.value = applicable[0].id;
}

function getCurrentFormType() {
  return document.querySelector('input[name="txType"]:checked')?.value || 'expense';
}

// ── 9g. Filter category dropdown ──
function renderFilterCategoryOptions() {
  const sel = document.getElementById('filterCategory');
  const cur = sel.value;
  sel.innerHTML = `<option value="all">${t('allCategories')}</option>`;

  for (const cat of state.categories) {
    if (!state.transactions.some(tx => tx.category === cat.id)) continue;
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = getCatName(cat);
    if (cat.id === cur) opt.selected = true;
    sel.appendChild(opt);
  }
}

// ── 9h. Categories page list ──
function renderPageCatList() {
  const list = document.getElementById('pageCatList');
  list.innerHTML = '';

  for (const cat of state.categories) {
    const li = document.createElement('li');
    li.className = 'cat-item';
    const typeLabel = cat.type === 'both'
      ? t('both') : cat.type === 'income' ? t('income') : t('expense');

    const delBtn = cat.isDefault
      ? `<span class="cat-default-badge">built-in</span>`
      : `<button class="cat-delete" data-catid="${cat.id}" aria-label="Delete ${escapeHtml(getCatName(cat))}"><span class="material-icons-round" style="font-size: 1rem;">close</span></button>`;

    li.innerHTML = `
      <span class="cat-item-name">${escapeHtml(getCatName(cat))}</span>
      <span class="cat-item-type">${typeLabel}</span>
      ${delBtn}`;
    if (!cat.isDefault) {
      li.querySelector('.cat-delete').addEventListener('click', () => deleteCategory(cat.id));
    }
    list.appendChild(li);
  }
}

// ── 9i. Summary page ──
function renderSummaryPage() {
  const { totalIncome, totalExpense, catTotals, savingsRate } = computeSummary();
  const dc = state.displayCurrency;

  document.getElementById('statTotalTx').textContent   = state.transactions.length;
  document.getElementById('statSavingsRate').textContent = savingsRate.toFixed(1) + '%';

  const incArr = state.transactions.filter(t => t.type === 'income');
  const expArr = state.transactions.filter(t => t.type === 'expense');
  const avgInc = incArr.length > 0 ? totalIncome  / incArr.length : 0;
  const avgExp = expArr.length > 0 ? totalExpense / expArr.length : 0;

  document.getElementById('statAvgInc').textContent = formatCurrency(avgInc, dc);
  document.getElementById('statAvgExp').textContent = formatCurrency(avgExp, dc);

  // Top spending categories
  const topList = document.getElementById('topCategoriesList');
  topList.innerHTML = '';

  const sorted = Object.entries(catTotals)
    .filter(([,v]) => v.expense > 0)
    .sort(([,a],[,b]) => b.expense - a.expense)
    .slice(0, 6);

  if (sorted.length === 0) {
    topList.innerHTML = `<p class="empty-state-sm">${t('noTransactionsBreakdown')}</p>`;
    return;
  }
  const maxVal = sorted[0][1].expense;
  sorted.forEach(([catId, totals], i) => {
    const cat = getCategoryById(catId);
    const row = document.createElement('div');
    row.className = 'top-cat-row';
    const pct = maxVal > 0 ? (totals.expense / maxVal * 100).toFixed(0) : 0;
    row.innerHTML = `
      <span class="top-cat-rank">#${i+1}</span>
      <span class="top-cat-name">${escapeHtml(getCatName(cat))}</span>
      <div class="top-cat-bar-wrap"><div class="top-cat-bar" style="width:${pct}%"></div></div>
      <span class="top-cat-amount">${formatCurrency(totals.expense, dc)}</span>`;
    topList.appendChild(row);
  });
}

// ── 9j. Currency tabs ──
function renderCurrencyTabs() {
  document.querySelectorAll('.currency-tab').forEach(btn => {
    const active = btn.dataset.currency === state.displayCurrency;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', String(active));
  });
}

// ── 9k. Theme icon ──
function renderThemeIcon() {
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    themeIcon.textContent = document.body.classList.contains('light') ? 'dark_mode' : 'light_mode';
  }
}

/* ── 9l. Charts ── */
let overviewChartInstance = null;
let donutChartInstance = null;

function renderCharts() {
  renderOverviewChart();
  renderDonutChart();
}

function getChartColors() {
  const isLight = document.body.classList.contains('light');
  return {
    grid:   isLight ? 'rgba(0,0,0,0.07)'  : 'rgba(255,255,255,0.06)',
    text:   isLight ? '#6b7280'           : 'rgba(255,255,255,0.45)',
    tooltipBg: isLight ? '#fff'           : '#202940',
    tooltipText: isLight ? '#111'         : '#e2e8f0',
  };
}

function buildMonthlyData() {
  // Build last 6 months of income/expense data
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key:   `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`,
      label: d.toLocaleString(state.lang === 'id' ? 'id-ID' : 'en-US', { month: 'short', year: '2-digit' }),
      income: 0,
      expense: 0,
    });
  }

  for (const tx of state.transactions) {
    const key = tx.date.slice(0, 7); // YYYY-MM
    const m = months.find(x => x.key === key);
    if (!m) continue;
    const amt = getDisplayAmount(tx);
    if (tx.type === 'income')  m.income  += amt;
    else                       m.expense += amt;
  }
  return months;
}

function renderOverviewChart() {
  const canvas = document.getElementById('overviewChart');
  const emptyEl = document.getElementById('overviewChartEmpty');
  if (!canvas) return;

  const months = buildMonthlyData();
  const hasData = months.some(m => m.income > 0 || m.expense > 0);

  if (emptyEl) emptyEl.style.display = hasData ? 'none' : 'flex';
  canvas.style.display = hasData ? 'block' : 'none';

  if (!hasData) {
    if (overviewChartInstance) { overviewChartInstance.destroy(); overviewChartInstance = null; }
    return;
  }

  const colors = getChartColors();
  const ctx = canvas.getContext('2d');

  // Build gradients
  const h = canvas.parentElement.clientHeight || 240;
  const gradInc = ctx.createLinearGradient(0, 0, 0, h);
  gradInc.addColorStop(0,   'rgba(76,175,80,0.35)');
  gradInc.addColorStop(1,   'rgba(76,175,80,0.0)');
  const gradExp = ctx.createLinearGradient(0, 0, 0, h);
  gradExp.addColorStop(0,   'rgba(244,67,54,0.35)');
  gradExp.addColorStop(1,   'rgba(244,67,54,0.0)');

  const data = {
    labels: months.map(m => m.label),
    datasets: [
      {
        label: 'Income',
        data: months.map(m => Math.round(m.income)),
        borderColor: '#4caf50',
        backgroundColor: gradInc,
        borderWidth: 2.5,
        pointBackgroundColor: '#4caf50',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Expense',
        data: months.map(m => Math.round(m.expense)),
        borderColor: '#f44336',
        backgroundColor: gradExp,
        borderWidth: 2.5,
        pointBackgroundColor: '#f44336',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      },
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: colors.tooltipBg,
        titleColor: colors.tooltipText,
        bodyColor: colors.tooltipText,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: ctx2 => ` ${ctx2.dataset.label}: ${formatCurrency(ctx2.raw, state.displayCurrency)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: colors.grid, drawBorder: false },
        ticks: { color: colors.text, font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" } },
      },
      y: {
        grid: { color: colors.grid, drawBorder: false },
        ticks: {
          color: colors.text,
          font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" },
          callback: v => {
            if (state.displayCurrency === 'IDR') return 'Rp ' + (v >= 1_000_000 ? (v/1_000_000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v);
            return 'QR ' + (v >= 1000 ? (v/1000).toFixed(1)+'K' : v);
          },
        },
        beginAtZero: true,
      },
    },
  };

  if (overviewChartInstance) {
    overviewChartInstance.data = data;
    overviewChartInstance.options = options;
    overviewChartInstance.update('none');
  } else {
    overviewChartInstance = new Chart(ctx, { type: 'line', data, options });
  }
}

const DONUT_PALETTE = [
  '#ec407a','#ab47bc','#42a5f5','#26c6da','#66bb6a',
  '#ffa726','#ef5350','#7e57c2','#26a69a','#d4e157',
];

function renderDonutChart() {
  const canvas = document.getElementById('categoryDonutChart');
  const emptyEl = document.getElementById('donutChartEmpty');
  const legendEl = document.getElementById('donutLegend');
  if (!canvas) return;

  const { catTotals, totalExpense } = computeSummary();

  const entries = Object.entries(catTotals)
    .filter(([, v]) => v.expense > 0)
    .sort(([, a], [, b]) => b.expense - a.expense)
    .slice(0, 8);

  const hasData = entries.length > 0;
  if (emptyEl) emptyEl.style.display = hasData ? 'none' : 'flex';
  if (legendEl) legendEl.style.display = hasData ? 'flex' : 'none';
  canvas.style.display = hasData ? 'block' : 'none';

  if (!hasData) {
    if (donutChartInstance) { donutChartInstance.destroy(); donutChartInstance = null; }
    return;
  }

  const labels = entries.map(([id]) => getCatName(getCategoryById(id)));
  const values = entries.map(([, v]) => Math.round(v.expense));
  const palette = entries.map((_, i) => DONUT_PALETTE[i % DONUT_PALETTE.length]);

  // Render custom legend
  if (legendEl) {
    legendEl.innerHTML = entries.map(([, v], i) => {
      const pct = totalExpense > 0 ? (v.expense / totalExpense * 100).toFixed(1) : 0;
      return `
        <div class="donut-legend-item">
          <span class="donut-legend-dot" style="background:${palette[i]}"></span>
          <span class="donut-legend-name">${escapeHtml(labels[i])}</span>
          <span class="donut-legend-pct">${pct}%</span>
        </div>`;
    }).join('');
  }

  const colors = getChartColors();
  const ctx = canvas.getContext('2d');

  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: palette,
      hoverBackgroundColor: palette.map(c => c + 'cc'),
      borderWidth: 0,
      hoverOffset: 8,
    }]
  };

  const options = {
    responsive: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: colors.tooltipBg,
        titleColor: colors.tooltipText,
        bodyColor: colors.tooltipText,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: ctx2 => ` ${formatCurrency(ctx2.raw, state.displayCurrency)}`,
        },
      },
    },
  };

  if (donutChartInstance) {
    donutChartInstance.data = data;
    donutChartInstance.options = options;
    donutChartInstance.update('none');
  } else {
    donutChartInstance = new Chart(ctx, { type: 'doughnut', data, options });
  }
}

// ── Master render ──
function renderAll() {
  renderSummary();
  renderSidebarStats();
  renderBreakdown();
  renderRecentTransactions();
  renderFilterCategoryOptions();
  renderTransactions();
  renderSummaryPage();
  renderPageCatList();
  renderCurrencyTabs();
  renderCharts();
  applyTranslations();
  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }
}

/* ══════════════════════════════════════════════════════════════
   10. NAVIGATION (pages)
══════════════════════════════════════════════════════════════ */

function navigateTo(page) {
  state.currentPage = page;

  // Show/hide pages
  document.querySelectorAll('.page').forEach(el => {
    el.classList.toggle('hidden', el.dataset.page !== page);
  });

  // Update nav items
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
    el.setAttribute('aria-current', el.dataset.page === page ? 'page' : 'false');
  });

  // Update topbar title
  const pageKeys = {
    dashboard:    'navDashboard',
    transactions: 'navTransactions',
    categories:   'navCategories',
    summary:      'navSummary',
  };
  document.getElementById('topbarPageTitle').textContent = t(pageKeys[page] || 'navDashboard');

  // Re-render page-specific content
  if (page === 'categories') renderPageCatList();
  if (page === 'summary')    renderSummaryPage();
  if (page === 'transactions') { renderFilterCategoryOptions(); renderTransactions(); }

  // Close mobile sidebar
  closeSidebar();

  // Refresh AOS to animate newly visible page elements
  if (typeof AOS !== 'undefined') {
    setTimeout(() => {
      AOS.refresh();
    }, 50);
  }
}

/* ══════════════════════════════════════════════════════════════
   11. SIDEBAR (mobile)
══════════════════════════════════════════════════════════════ */

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('visible');
  document.getElementById('hamburgerBtn').setAttribute('aria-expanded', 'true');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('visible');
  document.getElementById('hamburgerBtn').setAttribute('aria-expanded', 'false');
}

/* ══════════════════════════════════════════════════════════════
   12. CONVERSION PREVIEW
══════════════════════════════════════════════════════════════ */

function updateConversionPreview() {
  const preview = document.getElementById('conversionPreview');
  const amount  = parseFloat(document.getElementById('txAmount').value);
  const fromCur = document.getElementById('txCurrency').value;

  if (!amount || isNaN(amount) || amount <= 0) { preview.innerHTML = ''; return; }

  const otherCur  = fromCur === 'IDR' ? 'QAR' : 'IDR';
  const converted = convertCurrency(amount, fromCur, otherCur);
  const refText   = t('conversionRef', { rate: EXCHANGE.IDR_PER_QAR.toLocaleString() });

  preview.innerHTML =
    `<strong>${formatCurrency(amount, fromCur)}</strong> ≈ ` +
    `<span class="conv-amount">${formatCurrency(converted, otherCur)}</span>` +
    ` <span style="font-size:0.72rem;opacity:0.55">(${refText})</span>`;
}

/* ══════════════════════════════════════════════════════════════
   13. TRANSACTION CRUD
══════════════════════════════════════════════════════════════ */

function addTransaction(data) {
  state.transactions.push({
    id:          Date.now(),
    type:        data.type,
    description: data.description.trim(),
    amount:      parseFloat(parseFloat(data.amount).toFixed(4)),
    currency:    data.currency,
    category:    data.category,
    date:        data.date,
    notes:       (data.notes || '').trim(),
    createdAt:   new Date().toISOString(),
  });
  saveToStorage();
  renderAll();
  showToast(t('toastSaved'), 'success');
}

function deleteTransaction(id) {
  const idx = state.transactions.findIndex(tx => tx.id === id);
  if (idx === -1) return;
  state.transactions.splice(idx, 1);
  saveToStorage();
  renderAll();
  showToast(t('toastDeleted'), 'info');
}

function clearAllTransactions() {
  if (!confirm(t('confirmClearAll'))) return;
  state.transactions = [];
  saveToStorage();
  renderAll();
  showToast(t('toastCleared'), 'info');
}

/* ══════════════════════════════════════════════════════════════
   14. CATEGORY CRUD
══════════════════════════════════════════════════════════════ */

function addCategory(name, type) {
  const trimmed = name.trim();
  if (!trimmed) return false;
  const exists = state.categories.some(c => {
    const n = getCatName(c);
    return n.toLowerCase() === trimmed.toLowerCase();
  });
  if (exists) return 'duplicate';

  const cat = { id: generateCatId(), name: trimmed, nameEn: trimmed, type: type || 'both', isDefault: false };
  state.categories.push(cat);
  saveToStorage();
  return cat;
}

function deleteCategory(id) {
  const cat = getCategoryById(id);
  if (!cat) return;
  if (cat.isDefault) { showToast(t('toastBuiltIn'), 'info'); return; }

  let reassigned = 0;
  for (const tx of state.transactions) {
    if (tx.category === id) { tx.category = 'cat_other'; reassigned++; }
  }
  state.categories = state.categories.filter(c => c.id !== id);
  saveToStorage();
  renderAll();

  const msg = reassigned > 0
    ? t('toastCatDeletedReassign', { n: reassigned })
    : t('toastCatDeleted');
  showToast(msg, 'info');
}

/* ══════════════════════════════════════════════════════════════
   15. FORM HANDLING
══════════════════════════════════════════════════════════════ */

function clearFormErrors() {
  ['errDescription','errAmount','errCategory','errDate'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
  ['txDescription','txAmount','txCategory','txDate'].forEach(id => {
    document.getElementById(id)?.classList.remove('error');
  });
}

function showFormErrors(errors) {
  const map = {
    description: { err: 'errDescription', inp: 'txDescription' },
    amount:      { err: 'errAmount',      inp: 'txAmount' },
    category:    { err: 'errCategory',    inp: 'txCategory' },
    date:        { err: 'errDate',        inp: 'txDate' },
  };
  for (const [field, msg] of Object.entries(errors)) {
    const m = map[field];
    if (!m) continue;
    const errEl = document.getElementById(m.err);
    const inpEl = document.getElementById(m.inp);
    if (errEl) errEl.textContent = msg;
    if (inpEl) inpEl.classList.add('error');
  }
  const first = Object.keys(errors)[0];
  if (first && map[first]) document.getElementById(map[first].inp)?.focus();
}

function resetForm() {
  document.getElementById('transactionForm').reset();
  document.getElementById('txIncome').checked = true;
  setTodayDate();
  clearFormErrors();
  updateConversionPreview();
  renderCategoryOptions('income');
}

function setTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm   = String(today.getMonth()+1).padStart(2,'0');
  const dd   = String(today.getDate()).padStart(2,'0');
  document.getElementById('txDate').value = `${yyyy}-${mm}-${dd}`;
}

function handleFormSubmit(e) {
  e.preventDefault();
  clearFormErrors();

  const data = {
    type:        getCurrentFormType(),
    description: document.getElementById('txDescription').value,
    amount:      document.getElementById('txAmount').value,
    currency:    document.getElementById('txCurrency').value,
    category:    document.getElementById('txCategory').value,
    date:        document.getElementById('txDate').value,
    notes:       document.getElementById('txNotes').value,
  };

  const { valid, errors } = validateTransactionForm(data);
  if (!valid) { showFormErrors(errors); return; }

  addTransaction(data);
  closeModal('transactionModal');
  resetForm();
}

/* ══════════════════════════════════════════════════════════════
   16. MODAL HELPERS
══════════════════════════════════════════════════════════════ */

function openModal(id) {
  const modal = document.getElementById(id);
  modal.hidden = false;
  setTimeout(() => modal.querySelector('input, select, textarea, button')?.focus(), 50);
}
function closeModal(id) {
  document.getElementById(id).hidden = true;
}
function handleOverlayClick(e, modalId) {
  if (e.target.id === modalId) closeModal(modalId);
}

/* ══════════════════════════════════════════════════════════════
   17. TOAST
══════════════════════════════════════════════════════════════ */

function showToast(message, type = 'info') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]||''}</span><span>${escapeHtml(message)}</span>`;
  document.getElementById('toastContainer').appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.28s ease forwards';
    setTimeout(() => toast.remove(), 280);
  }, 3200);
}

/* ══════════════════════════════════════════════════════════════
   18. UTILITY
══════════════════════════════════════════════════════════════ */

function escapeHtml(str) {
  if (typeof str !== 'string') return String(str || '');
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ══════════════════════════════════════════════════════════════
   19. AI RECEIPT SCANNER
══════════════════════════════════════════════════════════════ */

async function processReceipt(file) {
  let apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) {
    apiKey = prompt("Please enter your Gemini API Key to use the receipt scanner:");
    if (!apiKey) return;
    localStorage.setItem('gemini_api_key', apiKey);
  }

  const scanBtn = document.getElementById('scanReceiptBtn');
  const scanLoading = document.getElementById('scanLoading');
  scanBtn.style.display = 'none';
  scanLoading.style.display = 'block';

  try {
    const base64Str = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        resolve(result.substring(result.indexOf(',') + 1));
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const categoryList = DEFAULT_CATEGORIES.map(c => c.id).join(', ');
    const promptText = `You are a receipt scanner. Extract all items from this receipt. Return a strict JSON array of objects without any markdown formatting. Each object MUST have these exact keys:
- description: (string) name of the product
- amount: (number) price of the product
- category: (string) select the most appropriate category ID from this list: ${categoryList}. If unsure, use cat_other.
- type: (string) always 'expense'`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: promptText },
            { inlineData: { mimeType: file.type, data: base64Str } }
          ]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to call Gemini API");
    }

    const data = await response.json();
    let textResponse = data.candidates[0].content.parts[0].text;
    
    // Clean up markdown block if present
    textResponse = textResponse.replace(/^```json/m, '').replace(/^```/m, '').trim();

    const items = JSON.parse(textResponse);
    if (!Array.isArray(items)) throw new Error("API did not return an array.");

    let addedCount = 0;
    const today = new Date().toISOString().split('T')[0];

    for (const item of items) {
      if (item.description && item.amount) {
        addTransaction({
          type: 'expense',
          description: String(item.description).substring(0, 100),
          amount: Number(item.amount),
          currency: state.displayCurrency,
          category: item.category || 'cat_other',
          date: today,
          notes: 'Added via AI Scan'
        });
        addedCount++;
      }
    }

    if (addedCount > 0) {
      closeModal('transactionModal');
      resetForm();
      showToast(`Added ${addedCount} transactions from receipt! 🎉`, 'success');
    } else {
      showToast("No items could be extracted.", 'error');
    }

  } catch (err) {
    console.error(err);
    showToast("Error processing receipt: " + err.message, 'error');
    if (err.message.includes('API key not valid')) {
      localStorage.removeItem('gemini_api_key'); // clear invalid key
    }
  } finally {
    scanBtn.style.display = 'flex';
    scanLoading.style.display = 'none';
    document.getElementById('receiptScanner').value = '';
  }
}

/* ══════════════════════════════════════════════════════════════
   20. EVENT LISTENERS
══════════════════════════════════════════════════════════════ */

function initEventListeners() {
  // ── Sidebar navigation ──
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(item.dataset.page);
    });
  });

  // ── Hamburger (mobile) ──
  document.getElementById('hamburgerBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.contains('open') ? closeSidebar() : openSidebar();
  });
  document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);

  // ── "See All" on dashboard ──
  document.getElementById('seeAllBtn').addEventListener('click', () => navigateTo('transactions'));

  // ── Open/Close transaction modal ──
  document.getElementById('openFormBtn').addEventListener('click', () => {
    resetForm();
    renderCategoryOptions(getCurrentFormType());
    applyTranslations();
    openModal('transactionModal');
  });
  document.getElementById('closeModalBtn').addEventListener('click', () => closeModal('transactionModal'));
  document.getElementById('cancelFormBtn').addEventListener('click', () => closeModal('transactionModal'));
  document.getElementById('transactionModal').addEventListener('click', e => handleOverlayClick(e, 'transactionModal'));

  // ── AI Receipt Scanner ──
  document.getElementById('scanReceiptBtn').addEventListener('click', () => {
    document.getElementById('receiptScanner').click();
  });
  document.getElementById('receiptScanner').addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processReceipt(e.target.files[0]);
    }
  });

  // ── Form submit ──
  document.getElementById('transactionForm').addEventListener('submit', handleFormSubmit);

  // ── Type radio → refresh category options ──
  document.querySelectorAll('input[name="txType"]').forEach(radio => {
    radio.addEventListener('change', () => renderCategoryOptions(radio.value));
  });

  // ── Amount/Currency → conversion preview ──
  document.getElementById('txAmount').addEventListener('input', updateConversionPreview);
  document.getElementById('txCurrency').addEventListener('change', updateConversionPreview);

  // ── Clear errors on re-type ──
  [
    { inp: 'txDescription', err: 'errDescription' },
    { inp: 'txAmount',      err: 'errAmount' },
    { inp: 'txDate',        err: 'errDate' },
    { inp: 'txCategory',    err: 'errCategory' },
  ].forEach(({ inp, err }) => {
    const inpEl = document.getElementById(inp);
    const errEl = document.getElementById(err);
    if (!inpEl || !errEl) return;
    inpEl.addEventListener(inpEl.tagName === 'SELECT' ? 'change' : 'input', () => {
      inpEl.classList.remove('error');
      errEl.textContent = '';
    });
  });

  // ── Inline Add Category from form ──
  document.getElementById('addCategoryInlineBtn').addEventListener('click', () => {
    document.getElementById('inlineCatName').value = '';
    document.getElementById('errInlineCat').textContent = '';
    applyTranslations();
    openModal('inlineCatModal');
  });
  document.getElementById('closeInlineCatBtn').addEventListener('click',   () => closeModal('inlineCatModal'));
  document.getElementById('cancelInlineCatBtn').addEventListener('click',  () => closeModal('inlineCatModal'));
  document.getElementById('inlineCatModal').addEventListener('click', e => handleOverlayClick(e, 'inlineCatModal'));

  document.getElementById('saveInlineCatBtn').addEventListener('click', () => {
    const name   = document.getElementById('inlineCatName').value.trim();
    const type   = document.getElementById('inlineCatType').value;
    const errEl  = document.getElementById('errInlineCat');
    errEl.textContent = '';

    if (!name)         { errEl.textContent = t('valCatEmpty'); return; }
    if (name.length<2) { errEl.textContent = t('valCatMin');   return; }

    const result = addCategory(name, type);
    if (result === 'duplicate') { errEl.textContent = t('valCatDuplicate'); return; }

    renderCategoryOptions(getCurrentFormType());
    document.getElementById('txCategory').value = result.id;
    closeModal('inlineCatModal');
    showToast(t('toastCatAdded', { name }), 'success');
  });
  document.getElementById('inlineCatName').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('saveInlineCatBtn').click(); }
  });

  // ── Categories page: Add button ──
  document.getElementById('pageAddCategoryBtn').addEventListener('click', () => {
    const nameInput = document.getElementById('pageCatInput');
    const typeInput = document.getElementById('pageCatType');
    const errEl     = document.getElementById('errPageCat');
    errEl.textContent = '';

    const name = nameInput.value.trim();
    if (!name)         { errEl.textContent = t('valCatEmpty'); return; }
    if (name.length<2) { errEl.textContent = t('valCatMin');   return; }

    const result = addCategory(name, typeInput.value);
    if (result === 'duplicate') { errEl.textContent = t('valCatDuplicate'); return; }

    nameInput.value = '';
    renderPageCatList();
    renderCategoryOptions(getCurrentFormType());
    showToast(t('toastCatAdded', { name }), 'success');
  });
  document.getElementById('pageCatInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('pageAddCategoryBtn').click(); }
  });

  // ── Currency Tabs ──
  document.querySelectorAll('.currency-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      state.displayCurrency = btn.dataset.currency;
      saveToStorage();
      renderAll();
    });
  });

  // ── Filters (Transactions page) ──
  document.getElementById('filterSearch').addEventListener('input', e => {
    state.filter.search = e.target.value;
    renderTransactions();
  });
  document.getElementById('filterType').addEventListener('change', e => {
    state.filter.type = e.target.value;
    renderTransactions();
  });
  document.getElementById('filterCategory').addEventListener('change', e => {
    state.filter.category = e.target.value;
    renderTransactions();
  });

  // ── Clear all ──
  document.getElementById('clearAllBtn').addEventListener('click', clearAllTransactions);

  // ── Theme toggle ──
  document.getElementById('themeToggleBtn').addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem(STORAGE_KEYS.theme, document.body.classList.contains('light') ? 'light' : 'dark');
    renderThemeIcon();
    // Redraw charts with updated theme colors
    if (overviewChartInstance) { overviewChartInstance.destroy(); overviewChartInstance = null; }
    if (donutChartInstance)    { donutChartInstance.destroy();    donutChartInstance    = null; }
    renderCharts();
  });

  // ── Language toggle ──
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.lang = btn.dataset.lang;
      saveToStorage();
      renderAll();
      // Re-render category options in form with new language
      renderCategoryOptions(getCurrentFormType());
    });
  });

  // ── Escape key closes modals ──
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      ['transactionModal','inlineCatModal'].forEach(id => {
        if (!document.getElementById(id).hidden) closeModal(id);
      });
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   21. INIT
══════════════════════════════════════════════════════════════ */

function init() {
  loadFromStorage();
  renderThemeIcon();
  renderCurrencyTabs();
  setTodayDate();
  renderCategoryOptions('income');
  renderAll();
  initEventListeners();
  navigateTo('dashboard');

  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-quad',
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
