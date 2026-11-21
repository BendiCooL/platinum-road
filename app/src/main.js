// Platinum Road — entry point. Wires the catalogue, the progress store,
// the tracker (list + detail), the filters and the roadmap together.

import { loadTrophies, KIND_LABELS } from './trophy-data.js';
import {
  loadEarnedIds, saveEarnedIds, loadSpoilerShield, saveSpoilerShield,
  exportProgress, importProgress,
} from './progress-store.js';
import { renderTrophyList } from './trophy-list.js';
import { renderTrophyDetail } from './trophy-detail.js';
import { renderMissableAlert, renderRoadmapStages, renderRoadmapRules } from './roadmap.js';

const GRADES = ['platinum', 'gold', 'silver', 'bronze'];
const KIND_FILTERS = ['all', 'story', 'missable', 'collectibles', 'activities'];

const state = {
  trophies: [],
  earnedIds: loadEarnedIds(),
  spoilerShield: loadSpoilerShield(),
  selectedId: 28,
  kindFilter: 'all',
  gradeFilter: 'all',
  stateFilter: 'all',
  searchText: '',
};

const elements = {
  list: document.getElementById('trophy-list'),
  detail: document.getElementById('trophy-detail'),
  earnedCount: document.getElementById('earned-count'),
  earnedPercent: document.getElementById('earned-percent'),
  progressFill: document.getElementById('progress-fill'),
  gradeCounts: document.getElementById('grade-counts'),
  kindFilters: document.getElementById('kind-filters'),
  searchBox: document.getElementById('search-box'),
  gradeFilter: document.getElementById('grade-filter'),
  stateFilter: document.getElementById('state-filter'),
  spoilerToggle: document.getElementById('spoiler-toggle'),
  exportButton: document.getElementById('export-button'),
  importInput: document.getElementById('import-input'),
  trackerView: document.getElementById('tracker-view'),
  roadmapView: document.getElementById('roadmap-view'),
  tabTracker: document.getElementById('tab-tracker'),
  tabRoadmap: document.getElementById('tab-roadmap'),
  missableAlert: document.getElementById('missable-alert'),
  roadmapStages: document.getElementById('roadmap-stages'),
  roadmapRules: document.getElementById('roadmap-rules'),
};

const handlers = {
  onToggleEarned(id) {
    if (state.earnedIds.has(id)) state.earnedIds.delete(id);
    else state.earnedIds.add(id);
    saveEarnedIds(state.earnedIds);
    render();
  },
  onSelect(id) {
    state.selectedId = id;
    showView('tracker');
    render();
    elements.detail.scrollIntoView({ block: 'nearest' });
  },
};

function renderProgress() {
  const total = state.trophies.length;
  const earned = state.earnedIds.size;
  elements.earnedCount.textContent = String(earned);
  const percent = total ? Math.round((earned / total) * 100) : 0;
  elements.earnedPercent.textContent = `${percent}%`;
  elements.progressFill.style.width = `${percent}%`;
  elements.gradeCounts.textContent = '';
  for (const grade of GRADES) {
    const inGrade = state.trophies.filter((t) => t.grade === grade);
    const got = inGrade.filter((t) => state.earnedIds.has(t.id)).length;
    const item = document.createElement('li');
    item.className = `grade-count grade-text-${grade}`;
    item.textContent = `${grade} ${got}/${inGrade.length}`;
    elements.gradeCounts.append(item);
  }
}

function renderKindFilters() {
  elements.kindFilters.textContent = '';
  for (const kind of KIND_FILTERS) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'kind-chip' + (state.kindFilter === kind ? ' active' : '');
    chip.textContent = kind === 'all' ? 'All kinds' : KIND_LABELS[kind];
    chip.addEventListener('click', () => {
      state.kindFilter = kind;
      render();
    });
    elements.kindFilters.append(chip);
  }
}

function render() {
  renderProgress();
  renderKindFilters();
  renderTrophyList(elements.list, state.trophies, state, handlers);
  const selected = state.trophies.find((t) => t.id === state.selectedId) || state.trophies[0];
  renderTrophyDetail(elements.detail, selected, state, handlers);
  renderMissableAlert(elements.missableAlert, state.trophies, handlers);
  renderRoadmapStages(elements.roadmapStages, state.trophies, state, handlers);
  renderRoadmapRules(elements.roadmapRules);
}

function showView(view) {
  const tracker = view === 'tracker';
  elements.trackerView.hidden = !tracker;
  elements.roadmapView.hidden = tracker;
  elements.tabTracker.classList.toggle('active', tracker);
  elements.tabRoadmap.classList.toggle('active', !tracker);
}

function wireControls() {
  elements.searchBox.addEventListener('input', () => {
    state.searchText = elements.searchBox.value.trim().toLowerCase();
    render();
  });
  elements.gradeFilter.addEventListener('change', () => {
    state.gradeFilter = elements.gradeFilter.value;
    render();
  });
  elements.stateFilter.addEventListener('change', () => {
    state.stateFilter = elements.stateFilter.value;
    render();
  });
  elements.spoilerToggle.checked = state.spoilerShield;
  elements.spoilerToggle.addEventListener('change', () => {
    state.spoilerShield = elements.spoilerToggle.checked;
    saveSpoilerShield(state.spoilerShield);
    render();
  });
  elements.exportButton.addEventListener('click', () => exportProgress(state.earnedIds));
  elements.importInput.addEventListener('change', async () => {
    const file = elements.importInput.files[0];
    if (!file) return;
    try {
      state.earnedIds = await importProgress(file);
      saveEarnedIds(state.earnedIds);
      render();
    } catch {
      alert('That file could not be read as Platinum Road progress.');
    }
    elements.importInput.value = '';
  });
  elements.tabTracker.addEventListener('click', () => showView('tracker'));
  elements.tabRoadmap.addEventListener('click', () => showView('roadmap'));
}

async function init() {
  state.trophies = await loadTrophies();
  wireControls();
  render();
}

init();
