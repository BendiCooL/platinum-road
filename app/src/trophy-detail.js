// Renders the detail panel for the selected trophy: the official
// description, the guide in this page's own words, its steps, and the
// sources the guide rests on — named and linked beside the guide.

import { isSpoilerHidden } from './trophy-list.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderTrophyDetail(panel, trophy, state, handlers) {
  panel.textContent = '';
  if (!trophy) {
    panel.append(el('p', 'detail-empty', 'Select a trophy to read its guide.'));
    return;
  }
  const hidden = isSpoilerHidden(trophy, state);

  const header = el('div', 'detail-header');
  const title = el('h2', 'detail-name', hidden ? 'Hidden story trophy' : trophy.name);
  const grade = el('span', `grade-badge grade-${trophy.grade}`, trophy.grade);
  header.append(title, grade);
  if (trophy.missable) header.append(el('span', 'missable-flag', '⚠ missable'));
  panel.append(header);

  panel.append(el('p', 'detail-description',
    hidden ? 'Hidden by the spoiler shield until earned.' : `\u201C${trophy.description}\u201D`));
  panel.append(el('p', 'detail-meta',
    `${trophy.kind} · roadmap stage ${trophy.roadmap_stage} · trophy #${trophy.id} of 55`));

  const earnedLabel = el('label', 'detail-earned');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = state.earnedIds.has(trophy.id);
  checkbox.addEventListener('change', () => handlers.onToggleEarned(trophy.id));
  earnedLabel.append(checkbox, document.createTextNode(' I have earned this trophy'));
  panel.append(earnedLabel);

  if (hidden) {
    panel.append(el('p', 'detail-spoiler-note',
      'The guide for this trophy is hidden too — turn the spoiler shield off, or earn the trophy, to read it.'));
    return;
  }

  panel.append(el('h3', null, 'Guide'));
  panel.append(el('p', 'detail-guide', trophy.guide));

  panel.append(el('h3', null, 'Steps'));
  const steps = el('ol', 'detail-steps');
  for (const step of trophy.steps) steps.append(el('li', null, step));
  panel.append(steps);

  panel.append(el('h3', null, 'Sources'));
  const sources = el('ul', 'detail-sources');
  for (const source of trophy.sources) {
    const item = el('li');
    const link = el('a', null, source.name);
    link.href = source.url;
    link.target = '_blank';
    link.rel = 'noopener';
    item.append(link);
    sources.append(item);
  }
  panel.append(sources);
  panel.append(el('p', 'detail-source-note',
    'Guides are written for this page; the sources above are where their facts come from. Links open only when you follow them — this app loads nothing from the network.'));
}
