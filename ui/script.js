const state = {
  type: "core",
  urls: [],
  debounceTimer: null,
  outputFormat: "markdown",
};

const presetKey = "readme-stats-studio-preset";
const apiBaseUrl = "https://github-readme-stats-studio.vercel.app/api";

const defaults = {
  displayName: "Rensith Udara",
  githubUsername: "RensithUdara",
  repo: "github-readme-stats-studio",
};

const cardLabels = {
  core: "Core set",
  stats: "Stats card",
  streak: "Streak card",
  "top-langs": "Language card",
  repo: "Repository pin",
  gist: "Gist pin",
  wakatime: "WakaTime card",
};

const previewTitles = {
  core: "Core profile cards",
  stats: "Profile stats card",
  streak: "Contribution streak card",
  "top-langs": "Top languages card",
  repo: "Repository pin card",
  gist: "Gist pin card",
  wakatime: "WakaTime stats card",
};

const themeNames = {
  "": "Default",
  radical: "Radical",
  dark: "Dark",
  tokyonight: "Tokyo Night",
  onedark: "One Dark",
  dracula: "Dracula",
  github_dark: "GitHub Dark",
  nord: "Nord",
  gruvbox: "Gruvbox",
};

const elements = {
  segments: document.querySelectorAll(".segment"),
  groupedFields: document.querySelectorAll("[data-group]"),
  optionFields: document.querySelectorAll("[data-option-group]"),
  outputTabs: document.querySelectorAll("[data-output]"),
  activeCardLabel: document.getElementById("active-card-label"),
  previewTitle: document.getElementById("preview-title"),
  outputEyebrow: document.getElementById("output-eyebrow"),
  outputTitle: document.getElementById("output-title"),
  preview: document.getElementById("preview"),
  loadingState: document.getElementById("loading-state"),
  markdown: document.getElementById("markdown"),
  cardCount: document.getElementById("card-count"),
  toast: document.getElementById("toast"),
  apiStatus: document.getElementById("api-status"),
  refreshButton: document.getElementById("refresh-button"),
  copyButton: document.getElementById("copy-button"),
  copyUrlButton: document.getElementById("copy-url-button"),
  shareButton: document.getElementById("share-button"),
  openPreviewButton: document.getElementById("open-preview"),
  savePresetButton: document.getElementById("save-preset"),
  loadPresetButton: document.getElementById("load-preset"),
  resetControlsButton: document.getElementById("reset-controls"),
  themeSwatches: document.querySelectorAll("[data-theme]"),
  inputs: document.querySelectorAll("input, select"),
  githubUsername: document.getElementById("github-username"),
  wakatimeUsername: document.getElementById("wakatime-username"),
  repoUsername: document.getElementById("repo-username"),
  repo: document.getElementById("repo"),
  gistId: document.getElementById("gist-id"),
  theme: document.getElementById("theme"),
  showIcons: document.getElementById("show-icons"),
  hideBorder: document.getElementById("hide-border"),
  includeAllCommits: document.getElementById("include-all-commits"),
  privateCount: document.getElementById("private-count"),
  hideTitle: document.getElementById("hide-title"),
  disableAnimations: document.getElementById("disable-animations"),
  titleColor: document.getElementById("title-color"),
  textColor: document.getElementById("text-color"),
  iconColor: document.getElementById("icon-color"),
  bgColor: document.getElementById("bg-color"),
  borderColor: document.getElementById("border-color"),
  borderRadius: document.getElementById("border-radius"),
  rankIcon: document.getElementById("rank-icon"),
  languageLayout: document.getElementById("language-layout"),
  languageCount: document.getElementById("language-count"),
  summaryCardCount: document.getElementById("summary-card-count"),
  summaryTheme: document.getElementById("summary-theme"),
  insightUser: document.getElementById("insight-user"),
  insightOptions: document.getElementById("insight-options"),
  insightTheme: document.getElementById("insight-theme"),
};

const formElements = [
  elements.githubUsername,
  elements.wakatimeUsername,
  elements.repoUsername,
  elements.repo,
  elements.gistId,
  elements.theme,
  elements.showIcons,
  elements.hideBorder,
  elements.includeAllCommits,
  elements.privateCount,
  elements.hideTitle,
  elements.disableAnimations,
  elements.titleColor,
  elements.textColor,
  elements.iconColor,
  elements.bgColor,
  elements.borderColor,
  elements.borderRadius,
  elements.rankIcon,
  elements.languageLayout,
  elements.languageCount,
];

const initialSettings = readSettings();

function cleanBaseUrl(value) {
  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed) {
    return apiBaseUrl;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function addParams(url, params) {
  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== "" &&
      value !== false &&
      value !== null &&
      value !== undefined
    ) {
      url.searchParams.set(key, value);
    }
  });
  return url;
}

function hexValue(input) {
  return input.value.replace("#", "").trim();
}

function numericValue(input) {
  const value = Number(input.value);
  return Number.isFinite(value) ? String(value) : "";
}

function commonParams() {
  return {
    theme: elements.theme.value,
    hide_border: elements.hideBorder.checked ? "true" : false,
    hide_title: elements.hideTitle.checked ? "true" : false,
    disable_animations: elements.disableAnimations.checked ? "true" : false,
    title_color: hexValue(elements.titleColor),
    text_color: hexValue(elements.textColor),
    icon_color: hexValue(elements.iconColor),
    bg_color: hexValue(elements.bgColor),
    border_color: hexValue(elements.borderColor),
    border_radius: numericValue(elements.borderRadius),
  };
}

function buildUrl(path, params = {}) {
  const base = cleanBaseUrl(apiBaseUrl);
  const slash = path.startsWith("/") ? "" : "/";
  const url = new URL(`${base}${slash}${path}`);

  addParams(url, {
    ...commonParams(),
    ...params,
  });

  return url.toString();
}

function currentPrimaryUser() {
  if (state.type === "wakatime") {
    return (
      elements.wakatimeUsername.value.trim() ||
      elements.githubUsername.value.trim() ||
      defaults.githubUsername
    );
  }

  if (state.type === "repo") {
    return (
      elements.repoUsername.value.trim() ||
      elements.githubUsername.value.trim() ||
      defaults.githubUsername
    );
  }

  if (elements.githubUsername.value.trim() === defaults.githubUsername) {
    return defaults.displayName;
  }

  return elements.githubUsername.value.trim() || defaults.displayName;
}

function cardDefinitions() {
  const githubUsername =
    elements.githubUsername.value.trim() || defaults.githubUsername;
  const wakatimeUsername =
    elements.wakatimeUsername.value.trim() || githubUsername;
  const repoUsername = elements.repoUsername.value.trim() || githubUsername;
  const repo = elements.repo.value.trim() || defaults.repo;
  const gistId = elements.gistId.value.trim();

  const statsParams = {
    username: githubUsername,
    show_icons: elements.showIcons.checked ? "true" : false,
    include_all_commits: elements.includeAllCommits.checked ? "true" : false,
    count_private: elements.privateCount.checked ? "true" : false,
    rank_icon: elements.rankIcon.value,
  };

  const languageParams = {
    username: githubUsername,
    layout: elements.languageLayout.value,
    langs_count: numericValue(elements.languageCount),
  };

  return {
    stats: {
      type: "stats",
      label: "Stats",
      url: buildUrl("/", statsParams),
    },
    streak: {
      type: "streak",
      label: "Streak",
      url: buildUrl("/streak", { username: githubUsername }),
    },
    "top-langs": {
      type: "top-langs",
      label: "Languages",
      url: buildUrl("/top-langs", languageParams),
    },
    repo: {
      type: "repo",
      label: "Repository",
      url: buildUrl("/pin", { username: repoUsername, repo }),
    },
    gist: {
      type: "gist",
      label: "Gist",
      url: buildUrl("/gist", { id: gistId }),
    },
    wakatime: {
      type: "wakatime",
      label: "WakaTime",
      url: buildUrl("/wakatime", {
        ...languageParams,
        username: wakatimeUsername,
      }),
    },
  };
}

function selectedCards() {
  const definitions = cardDefinitions();

  if (state.type === "core") {
    return [definitions.stats, definitions.streak, definitions["top-langs"]];
  }

  return [definitions[state.type]];
}

function setLoading(isLoading) {
  elements.loadingState.hidden = !isLoading;
}

function renderFields() {
  elements.groupedFields.forEach((field) => {
    const group = field.dataset.group;
    const shouldShow =
      (group === "github" &&
        ["core", "stats", "streak", "top-langs"].includes(state.type)) ||
      group === state.type;

    field.hidden = !shouldShow;
  });
}

function renderOptionFields() {
  elements.optionFields.forEach((field) => {
    const groups = field.dataset.optionGroup.split(" ");
    const shouldShow =
      groups.includes(state.type) ||
      (state.type === "core" && groups.some((group) => group !== "wakatime"));

    field.hidden = !shouldShow;
  });
}

function renderSummary(cards = selectedCards()) {
  const themeLabel =
    themeNames[elements.theme.value] || elements.theme.value || "Default";
  const options = [
    elements.showIcons.checked ? "Icons on" : "Icons off",
    elements.hideBorder.checked ? "No border" : "Border",
    elements.hideTitle.checked ? "Title hidden" : "Title shown",
  ];

  elements.summaryCardCount.textContent = String(cards.length);
  elements.summaryTheme.textContent = themeLabel;
  elements.insightUser.textContent = currentPrimaryUser();
  elements.insightOptions.textContent = options.join(" / ");
  elements.insightTheme.textContent = themeLabel;

  elements.themeSwatches.forEach((swatch) => {
    swatch.classList.toggle(
      "active",
      swatch.dataset.theme === elements.theme.value,
    );
  });
}

function renderControls() {
  elements.segments.forEach((segment) => {
    const isActive = segment.dataset.type === state.type;
    segment.classList.toggle("active", isActive);
    segment.setAttribute("aria-selected", String(isActive));
  });

  elements.activeCardLabel.textContent = cardLabels[state.type];
  elements.previewTitle.textContent = previewTitles[state.type];
  renderFields();
  renderOptionFields();
  renderSummary();
}

function makeMarkdown(cards) {
  return cards.map((card) => `![${card.label}](${card.url})`).join("\n");
}

function makeHtml(cards) {
  return cards
    .map((card) => `<img src="${card.url}" alt="${card.label}" />`)
    .join("\n");
}

function makeUrls(cards) {
  return cards.map((card) => card.url).join("\n");
}

function makeOutput(cards) {
  if (state.outputFormat === "html") {
    return makeHtml(cards);
  }

  if (state.outputFormat === "urls") {
    return makeUrls(cards);
  }

  return makeMarkdown(cards);
}

function renderOutputTabs() {
  const labels = {
    markdown: ["Markdown", "Ready for your profile README"],
    html: ["HTML", "Ready for a web page or docs"],
    urls: ["URLs", "Direct SVG URLs"],
  };

  elements.outputTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.output === state.outputFormat);
  });

  elements.outputEyebrow.textContent = labels[state.outputFormat][0];
  elements.outputTitle.textContent = labels[state.outputFormat][1];
}

function clearPreviewCards() {
  elements.preview
    .querySelectorAll(".preview-card, .error-card")
    .forEach((node) => node.remove());
}

function renderPreview() {
  let cards;

  try {
    cards = selectedCards();
  } catch (error) {
    clearPreviewCards();
    setLoading(false);
    renderError(
      "The API base URL is not valid. Use a full http or https address.",
    );
    return;
  }

  state.urls = cards.map((card) => card.url);

  clearPreviewCards();
  elements.preview.classList.toggle("core-layout", state.type === "core");
  setLoading(true);
  elements.markdown.value = makeOutput(cards);
  elements.cardCount.textContent = `${cards.length} ${cards.length === 1 ? "card" : "cards"}`;
  renderSummary(cards);
  renderOutputTabs();

  let completed = 0;
  let failed = false;

  cards.forEach((card) => {
    const wrapper = document.createElement("article");
    wrapper.className = "preview-card";
    wrapper.dataset.cardType = card.type;

    const label = document.createElement("span");
    label.className = "preview-card-label";
    label.textContent = card.label;

    const image = document.createElement("img");
    image.alt = `${card.label} preview`;
    image.loading = "eager";
    image.src = `${card.url}${card.url.includes("?") ? "&" : "?"}cache_bust=${Date.now()}`;

    image.addEventListener("load", () => {
      completed += 1;
      if (completed === cards.length && !failed) {
        setLoading(false);
      }
    });

    image.addEventListener("error", () => {
      failed = true;
      setLoading(false);
      wrapper.remove();
      renderError(
        `Could not load ${card.label}. Check the username, repository, API URL, and token.`,
      );
    });

    wrapper.append(label, image);
    elements.preview.appendChild(wrapper);
  });
}

function renderError(message) {
  const error = document.createElement("div");
  error.className = "error-card";
  error.textContent = message;
  elements.preview.appendChild(error);
}

function schedulePreview() {
  window.clearTimeout(state.debounceTimer);
  state.debounceTimer = window.setTimeout(() => {
    renderPreview();
    checkApiStatus();
  }, 350);
}

function setStatus(label, className) {
  elements.apiStatus.classList.remove("online", "offline");
  elements.apiStatus.classList.add(className);
  elements.apiStatus.lastChild.textContent = label;
}

function checkApiStatus() {
  let url;

  try {
    url = buildUrl("/", {
      username: elements.githubUsername.value.trim() || defaults.githubUsername,
    });
  } catch (error) {
    setStatus("Invalid API URL", "offline");
    return;
  }

  const image = new Image();
  image.onload = () => setStatus("API online", "online");
  image.onerror = () => setStatus("API offline", "offline");
  image.src = `${url}${url.includes("?") ? "&" : "?"}status_check=${Date.now()}`;
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.setTimeout(() => elements.toast.classList.remove("show"), 2400);
}

async function copyMarkdown() {
  try {
    await navigator.clipboard.writeText(elements.markdown.value);
    showToast("Output copied");
  } catch (error) {
    elements.markdown.select();
    document.execCommand("copy");
    showToast("Output copied");
  }
}

async function copyFirstUrl() {
  if (!state.urls.length) {
    return;
  }

  try {
    await navigator.clipboard.writeText(state.urls[0]);
    showToast("Preview URL copied");
  } catch (error) {
    elements.markdown.value = state.urls[0];
    elements.markdown.select();
    document.execCommand("copy");
    renderPreview();
    showToast("Preview URL copied");
  }
}

function openFirstPreview() {
  if (!state.urls.length) {
    return;
  }

  window.open(state.urls[0], "_blank", "noopener");
}

function readSettings() {
  return {
    type: state.type,
    outputFormat: state.outputFormat,
    githubUsername: elements.githubUsername.value,
    wakatimeUsername: elements.wakatimeUsername.value,
    repoUsername: elements.repoUsername.value,
    repo: elements.repo.value,
    gistId: elements.gistId.value,
    theme: elements.theme.value,
    showIcons: elements.showIcons.checked,
    hideBorder: elements.hideBorder.checked,
    includeAllCommits: elements.includeAllCommits.checked,
    privateCount: elements.privateCount.checked,
    hideTitle: elements.hideTitle.checked,
    disableAnimations: elements.disableAnimations.checked,
    titleColor: elements.titleColor.value,
    textColor: elements.textColor.value,
    iconColor: elements.iconColor.value,
    bgColor: elements.bgColor.value,
    borderColor: elements.borderColor.value,
    borderRadius: elements.borderRadius.value,
    rankIcon: elements.rankIcon.value,
    languageLayout: elements.languageLayout.value,
    languageCount: elements.languageCount.value,
  };
}

function applySettings(settings) {
  if (!settings || typeof settings !== "object") {
    return;
  }

  state.type = settings.type || state.type;
  state.outputFormat = settings.outputFormat || state.outputFormat;

  formElements.forEach((input) => {
    const key = input.id.replace(/-([a-z])/g, (_, letter) =>
      letter.toUpperCase(),
    );

    if (!(key in settings)) {
      return;
    }

    if (input.type === "checkbox") {
      input.checked = Boolean(settings[key]);
    } else {
      input.value = settings[key];
    }
  });

  renderControls();
  renderPreview();
  checkApiStatus();
}

function encodeSettings(settings) {
  return btoa(encodeURIComponent(JSON.stringify(settings)));
}

function decodeSettings(value) {
  return JSON.parse(decodeURIComponent(atob(value)));
}

function shareSetup() {
  const url = new URL(window.location.href);
  url.hash = `setup=${encodeSettings(readSettings())}`;

  navigator.clipboard
    .writeText(url.toString())
    .then(() => showToast("Share link copied"))
    .catch(() => {
      window.location.hash = url.hash;
      showToast("Share setup added to URL");
    });
}

function loadSetupFromHash() {
  const hash = window.location.hash.replace(/^#setup=/, "");

  if (!hash || hash === window.location.hash) {
    return false;
  }

  try {
    applySettings(decodeSettings(hash));
    showToast("Shared setup loaded");
    return true;
  } catch (error) {
    showToast("Could not load shared setup");
    return false;
  }
}

function savePreset() {
  localStorage.setItem(presetKey, JSON.stringify(readSettings()));
  showToast("Preset saved");
}

function loadPreset() {
  const preset = localStorage.getItem(presetKey);

  if (!preset) {
    showToast("No saved preset yet");
    return;
  }

  applySettings(JSON.parse(preset));
  showToast("Preset loaded");
}

function resetControls() {
  applySettings(initialSettings);
  showToast("Controls reset");
}

elements.segments.forEach((segment) => {
  segment.addEventListener("click", () => {
    state.type = segment.dataset.type;
    renderControls();
    renderPreview();
  });
});

elements.inputs.forEach((input) => {
  input.addEventListener("input", schedulePreview);
  input.addEventListener("change", schedulePreview);
});

elements.themeSwatches.forEach((swatch) => {
  swatch.addEventListener("click", () => {
    elements.theme.value = swatch.dataset.theme;
    renderPreview();
  });
});

elements.outputTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    state.outputFormat = tab.dataset.output;
    renderPreview();
  });
});

elements.refreshButton.addEventListener("click", () => {
  renderPreview();
  checkApiStatus();
  showToast("Preview refreshed");
});

elements.copyButton.addEventListener("click", copyMarkdown);
elements.copyUrlButton.addEventListener("click", copyFirstUrl);
elements.shareButton.addEventListener("click", shareSetup);
elements.openPreviewButton.addEventListener("click", openFirstPreview);
elements.savePresetButton.addEventListener("click", savePreset);
elements.loadPresetButton.addEventListener("click", loadPreset);
elements.resetControlsButton.addEventListener("click", resetControls);

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "r") {
    event.preventDefault();
    renderPreview();
    checkApiStatus();
  }
});

if (!loadSetupFromHash()) {
  renderControls();
  renderPreview();
  checkApiStatus();
}
