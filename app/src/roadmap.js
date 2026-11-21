// Renders the Roadmap view: the missable warning first, then the six
// stages to the platinum with the trophies that belong to each, then the
// ground rules the published roadmaps agree on (with their sources).

import { ROADMAP_STAGES, trophiesInStage, missableTrophies } from './trophy-data.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderMissableAlert(container, trophies, handlers) {
  container.textContent = '';
  const flagged = missableTrophies(trophies);
  if (flagged.length === 0) return;
  const box = el('section', 'missable-box');
  box.append(el('h2', null, '⚠ Missable watch — read before Chapter 1 ends'));
  for (const trophy of flagged) {
    const line = el('p', 'missable-line');
    const button = el('button', 'missable-jump', trophy.name);
    button.type = 'button';
    button.addEventListener('click', () => handlers.onSelect(trophy.id));
    line.append(button, document.createTextNode(
      ' — the only trophy the published guides flag as potentially missable. Its first meditation spot is at Jason\u2019s house in Chapter 1: after the mission Down to Earth, Lucia can be found there in the morning. Once Chapter 1 ends, that chance is gone — and whether the trophy strictly needs it is still unconfirmed (PowerPyx). Do it anyway, and keep a Chapter 1 save.'));
    box.append(line);
  }
  box.append(el('p', 'missable-note',
    'Everything else on the list can still be earned after the story: free-roam continues and trophy quest givers return. There is no mission replay, which is why the chapter saves matter.'));
  container.append(box);
}

export function renderRoadmapStages(container, trophies, state, handlers) {
  container.textContent = '';
  for (const stage of ROADMAP_STAGES) {
    const section = el('section', 'roadmap-stage');
    const heading = el('h2', null, `Stage ${stage.stage} — ${stage.title}`);
    const hours = el('p', 'stage-hours', stage.hours);
    const note = el('p', 'stage-note', stage.note);
    const list = el('ul', 'stage-trophies');
    for (const trophy of trophiesInStage(trophies, stage.stage)) {
      const item = el('li', state.earnedIds.has(trophy.id) ? 'stage-trophy earned' : 'stage-trophy');
      const button = el('button', 'stage-jump', trophy.name);
      button.type = 'button';
      button.addEventListener('click', () => handlers.onSelect(trophy.id));
      const grade = el('span', `grade-badge grade-${trophy.grade}`, trophy.grade);
      item.append(button, grade);
      if (trophy.missable) item.append(el('span', 'missable-flag', '⚠ missable'));
      list.append(item);
    }
    section.append(heading, hours, note, list);
    container.append(section);
  }
}

export function renderRoadmapRules(container) {
  container.textContent = '';
  container.append(el('h2', null, 'Ground rules for the run'));
  const rules = el('ul', 'roadmap-rules-list');
  const lines = [
    'One playthrough is enough: all 55 trophies are offline and single-player — the base list has no online trophies (PowerPyx).',
    'PowerPyx rates the platinum 4/10 difficulty and about 200 hours: the cost is time, not reflexes.',
    'Cheats disable trophies and saving — keep a trophy run completely cheat-free (GTABase and TechWiser, via EGamers).',
    'There is no mission replay and no New Game+; the game offers 15 manual save slots plus an autosave, so save at every chapter start and end (PowerPyx).',
    'The 100% checklist stays hidden until the story is done, but progress made during the story already counts toward it.',
  ];
  for (const line of lines) rules.append(el('li', null, line));
  container.append(rules);
}
