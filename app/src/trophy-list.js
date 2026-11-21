// Renders the tracker checklist: one row per trophy with its earned
// checkbox, official name and description, grade badge, kind tag and
// missable flag. The spoiler shield masks unearned story trophies.

export function isSpoilerHidden(trophy, state) {
  return state.spoilerShield && trophy.kind === 'story' && !state.earnedIds.has(trophy.id);
}

export function visibleName(trophy, state) {
  return isSpoilerHidden(trophy, state) ? 'Hidden story trophy' : trophy.name;
}

export function visibleDescription(trophy, state) {
  return isSpoilerHidden(trophy, state)
    ? 'Name and description hidden by the spoiler shield until this story trophy is earned.'
    : trophy.description;
}

export function matchesFilters(trophy, state) {
  if (state.kindFilter === 'missable' && !trophy.missable) return false;
  if (state.kindFilter !== 'all' && state.kindFilter !== 'missable' && trophy.kind !== state.kindFilter) return false;
  if (state.gradeFilter !== 'all' && trophy.grade !== state.gradeFilter) return false;
  if (state.stateFilter === 'earned' && !state.earnedIds.has(trophy.id)) return false;
  if (state.stateFilter === 'unearned' && state.earnedIds.has(trophy.id)) return false;
  if (state.searchText) {
    const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!haystack.includes(state.searchText)) return false;
  }
  return true;
}

export function renderTrophyList(listElement, trophies, state, handlers) {
  listElement.textContent = '';
  const shown = trophies.filter((trophy) => matchesFilters(trophy, state));
  if (shown.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'list-empty';
    empty.textContent = 'No trophies match those filters.';
    listElement.append(empty);
    return;
  }
  for (const trophy of shown) {
    const row = document.createElement('li');
    row.className = 'trophy-row' + (state.earnedIds.has(trophy.id) ? ' earned' : '');
    if (state.selectedId === trophy.id) row.classList.add('selected');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = state.earnedIds.has(trophy.id);
    checkbox.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
    checkbox.addEventListener('change', () => handlers.onToggleEarned(trophy.id));

    const body = document.createElement('button');
    body.type = 'button';
    body.className = 'row-body';
    body.addEventListener('click', () => handlers.onSelect(trophy.id));

    const titleLine = document.createElement('span');
    titleLine.className = 'row-title';
    const name = document.createElement('span');
    name.className = 'row-name';
    name.textContent = visibleName(trophy, state);
    const grade = document.createElement('span');
    grade.className = `grade-badge grade-${trophy.grade}`;
    grade.textContent = trophy.grade;
    titleLine.append(name, grade);
    if (trophy.missable) {
      const flag = document.createElement('span');
      flag.className = 'missable-flag';
      flag.textContent = '⚠ missable';
      titleLine.append(flag);
    }

    const description = document.createElement('span');
    description.className = 'row-description';
    description.textContent = visibleDescription(trophy, state);

    const meta = document.createElement('span');
    meta.className = 'row-meta';
    meta.textContent = `${trophy.kind} · roadmap stage ${trophy.roadmap_stage}`;

    body.append(titleLine, description, meta);
    row.append(checkbox, body);
    listElement.append(row);
  }
}
