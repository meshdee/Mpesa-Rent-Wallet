const STORAGE_KEYS = {
  user: "mpesa_rent_wallet_user_v7",
  session: "mpesa_rent_wallet_session_v7"
};

const defaultSession = {
  isLoggedIn: false,
  userId: null
};

let session = loadSession();
let user = loadUser();
let wallet = {
  rentGoal: 25000,
  dueDate: "",
  walletBalance: 0,
  transactions: []
};

const elements = {
  authView: document.getElementById("authView"),
  appView: document.getElementById("appView"),
  welcomeLine: document.getElementById("welcomeLine"),

  showLoginBtn: document.getElementById("showLoginBtn"),
  showRegisterBtn: document.getElementById("showRegisterBtn"),
  loginForm: document.getElementById("loginForm"),
  registerForm: document.getElementById("registerForm"),

  loginId: document.getElementById("loginId"),
  loginPassword: document.getElementById("loginPassword"),

  fullName: document.getElementById("fullName"),
  phoneNumber: document.getElementById("phoneNumber"),
  emailAddress: document.getElementById("emailAddress"),
  registerPassword: document.getElementById("registerPassword"),
  confirmPassword: document.getElementById("confirmPassword"),

  logoutBtn: document.getElementById("logoutBtn"),
  greeting: document.getElementById("greeting"),
  userNameLine: document.getElementById("userNameLine"),
  userMetaLine: document.getElementById("userMetaLine"),
  sessionStatus: document.getElementById("sessionStatus"),

  profileName: document.getElementById("profileName"),
  profilePhone: document.getElementById("profilePhone"),
  profileEmail: document.getElementById("profileEmail"),

  rentGoalInput: document.getElementById("rentGoalInput"),
  dueDateInput: document.getElementById("dueDateInput"),
  saveSettingsBtn: document.getElementById("saveSettingsBtn"),

  savedAmount: document.getElementById("savedAmount"),
  remainingAmount: document.getElementById("remainingAmount"),
  progressPercent: document.getElementById("progressPercent"),
  progressFill: document.getElementById("progressFill"),
  saveAmountInput: document.getElementById("saveAmountInput"),
  saveRentBtn: document.getElementById("saveRentBtn"),
  resetWalletBtn: document.getElementById("resetWalletBtn"),

  historyList: document.getElementById("historyList"),
  historyCount: document.getElementById("historyCount")
};

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.session);
    if (!raw) return { ...defaultSession };
    const parsed = JSON.parse(raw);
    return {
      ...defaultSession,
      ...parsed,
      isLoggedIn: Boolean(parsed.isLoggedIn),
      userId: parsed.userId || null
    };
  } catch {
    return { ...defaultSession };
  }
}

function saveSession() {
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
}

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.user);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveUser() {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  }
}

function clearAuthStorage() {
  localStorage.removeItem(STORAGE_KEYS.user);
  localStorage.removeItem(STORAGE_KEYS.session);
}

function money(value) {
  return `KES ${Number(value).toLocaleString("en-US")}`;
}

function formatDateTime(isoString) {
  return new Date(isoString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });
}

function getGreeting() {
  const currentHour = new Date().getHours();
  if (currentHour < 12) return "Good morning";
  if (currentHour < 17) return "Good afternoon";
  return "Good evening";
}

function setVisibleApp(isLoggedIn) {
  elements.authView.classList.toggle("hidden", isLoggedIn);
  elements.appView.classList.toggle("hidden", !isLoggedIn);
}

function showLoginTab() {
  elements.loginForm.classList.remove("hidden");
  elements.registerForm.classList.add("hidden");
  elements.showLoginBtn.classList.add("active");
  elements.showRegisterBtn.classList.remove("active");
}

function showRegisterTab() {
  elements.registerForm.classList.remove("hidden");
  elements.loginForm.classList.add("hidden");
  elements.showRegisterBtn.classList.add("active");
  elements.showLoginBtn.classList.remove("active");
}

async function apiFetch(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json();
  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

async function loadWalletFromServer() {
  if (!user?.id) return;
  const data = await apiFetch(`/api/wallet/${user.id}`);
  wallet = data.wallet;
  renderWallet();
}

function renderAuthView() {
  const currentHour = new Date().getHours();
  let greeting = "Welcome";
  if (currentHour < 12) greeting = "Good morning";
  else if (currentHour < 17) greeting = "Good afternoon";
  else greeting = "Good evening";

  elements.welcomeLine.textContent = greeting;
}

function renderWallet() {
  const percentage = wallet.rentGoal > 0
    ? Math.min((wallet.walletBalance / wallet.rentGoal) * 100, 100)
    : 0;

  const remaining = Math.max(wallet.rentGoal - wallet.walletBalance, 0);

  elements.greeting.textContent = `${getGreeting()}!`;
  elements.userNameLine.textContent = `Welcome back, ${user?.fullName || "Tenant"}`;
  elements.userMetaLine.textContent = `Logged in as ${user?.phone || "Unknown"} • ${user?.email || "No email"}`;
  elements.sessionStatus.textContent = "Connected to backend";

  elements.profileName.textContent = user?.fullName || "-";
  elements.profilePhone.textContent = user?.phone || "-";
  elements.profileEmail.textContent = user?.email || "-";

  elements.rentGoalInput.value = wallet.rentGoal;
  elements.dueDateInput.value = wallet.dueDate;

  elements.savedAmount.textContent = money(wallet.walletBalance);
  elements.remainingAmount.textContent = money(remaining);
  elements.progressPercent.textContent = `${percentage.toFixed(1)}%`;
  elements.progressFill.style.width = `${percentage}%`;

  elements.historyList.innerHTML = "";
  elements.historyCount.textContent = `${wallet.transactions.length} transaction${wallet.transactions.length === 1 ? "" : "s"}`;

  if (wallet.transactions.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.innerHTML = `
      <span class="history-amount">No transactions yet</span>
      <span class="history-time">Start saving to see history here</span>
    `;
    elements.historyList.appendChild(emptyItem);
  } else {
    wallet.transactions.forEach((tx) => {
      const item = document.createElement("li");
      item.innerHTML = `
        <span class="history-amount">Saved ${money(tx.amount)}</span>
        <span class="history-time">${formatDateTime(tx.timestamp)}</span>
      `;
      elements.historyList.appendChild(item);
    });
  }
}

function renderAll() {
  const loggedIn = session.isLoggedIn && user;
  setVisibleApp(loggedIn);

  if (!loggedIn) {
    renderAuthView();
    showLoginTab();
    return;
  }

  renderWallet();
}

async function registerUser(event) {
  event.preventDefault();

  const payload = {
    fullName: elements.fullName.value.trim(),
    phone: elements.phoneNumber.value.trim(),
    email: elements.emailAddress.value.trim(),
    password: elements.registerPassword.value,
    confirmPassword: elements.confirmPassword.value
  };

  if (!payload.fullName || !payload.phone || !payload.email || !payload.password || !payload.confirmPassword) {
    alert("Please fill in all registration fields.");
    return;
  }

  if (payload.password !== payload.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const data = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        fullName: payload.fullName,
        phone: payload.phone,
        email: payload.email,
        password: payload.password
      })
    });

    user = data.user;
    wallet = data.wallet;

    session = {
      isLoggedIn: true,
      userId: user.id
    };

    saveUser();
    saveSession();

    elements.registerForm.reset();
    renderAll();
  } catch (error) {
    alert(error.message);
  }
}

async function loginUser(event) {
  event.preventDefault();

  const loginId = elements.loginId.value.trim();
  const password = elements.loginPassword.value;

  if (!loginId || !password) {
    alert("Enter your phone number/email and password.");
    return;
  }

  try {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ loginId, password })
    });

    user = data.user;
    wallet = data.wallet;

    session = {
      isLoggedIn: true,
      userId: user.id
    };

    saveUser();
    saveSession();

    elements.loginForm.reset();
    renderAll();
  } catch (error) {
    alert(error.message);
  }
}

async function logoutUser() {
  try {
    await apiFetch("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({ userId: user?.id || null })
    });
  } catch {}

  user = null;
  wallet = {
    rentGoal: 25000,
    dueDate: "",
    walletBalance: 0,
    transactions: []
  };

  session = { ...defaultSession };
  clearAuthStorage();
  renderAll();
}

async function updateSettings() {
  const newGoal = Number(elements.rentGoalInput.value);
  const newDueDate = elements.dueDateInput.value;

  if (!Number.isFinite(newGoal) || newGoal <= 0) {
    alert("Please enter a valid rent goal.");
    return;
  }

  try {
    const data = await apiFetch(`/api/wallet/${user.id}/settings`, {
      method: "PUT",
      body: JSON.stringify({
        rentGoal: Math.round(newGoal),
        dueDate: newDueDate
      })
    });

    wallet = data.wallet;
    renderWallet();
  } catch (error) {
    alert(error.message);
  }
}

async function saveRent() {
  const amount = Number(elements.saveAmountInput.value);

  if (!Number.isFinite(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  try {
    const data = await apiFetch(`/api/wallet/${user.id}/deposit`, {
      method: "POST",
      body: JSON.stringify({ amount })
    });

    wallet = data.wallet;
    elements.saveAmountInput.value = "";
    renderWallet();

    if (wallet.walletBalance >= wallet.rentGoal) {
      alert("Congratulations! Your rent goal has been reached.");
    }
  } catch (error) {
    alert(error.message);
  }
}

async function resetWallet() {
  const confirmReset = confirm("Reset wallet balance and transaction history?");
  if (!confirmReset) return;

  try {
    const data = await apiFetch(`/api/wallet/${user.id}`, {
      method: "DELETE"
    });

    wallet = data.wallet;
    elements.saveAmountInput.value = "";
    renderWallet();
  } catch (error) {
    alert(error.message);
  }
}

function bindEvents() {
  elements.showLoginBtn.addEventListener("click", showLoginTab);
  elements.showRegisterBtn.addEventListener("click", showRegisterTab);

  elements.loginForm.addEventListener("submit", loginUser);
  elements.registerForm.addEventListener("submit", registerUser);

  elements.logoutBtn.addEventListener("click", logoutUser);

  elements.saveSettingsBtn.addEventListener("click", updateSettings);
  elements.saveRentBtn.addEventListener("click", saveRent);
  elements.resetWalletBtn.addEventListener("click", resetWallet);

  elements.saveAmountInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") saveRent();
  });

  elements.rentGoalInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") updateSettings();
  });
}

async function initialize() {
  bindEvents();
  renderAuthView();

  if (session.isLoggedIn && user) {
    try {
      await loadWalletFromServer();
      renderAll();
    } catch {
      user = null;
      session = { ...defaultSession };
      clearAuthStorage();
      renderAll();
    }
  } else {
    renderAll();
  }
}

initialize();