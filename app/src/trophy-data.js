// Loads the trophy catalogue and holds the roadmap's stage definitions.
// The catalogue itself lives in app/data/trophies.json: the 55 official
// PlayStation 5 trophies with a cited guide for each one.

export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Story first — the five chapters',
    hours: '≈ 60–80 hours',
    note: 'Play the campaign and let the story trophies land in order. Two habits start here and pay off all run: keep a manual save at the start and end of every chapter (there is no mission replay), and scan new vehicles and study new animals as you travel. Handle the one flagged missable — the Chapter 1 meditation at Jason\u2019s house — before Chapter 1 ends. Roadmap shape and timings follow PowerPyx\u2019s GTA 6 roadmap.',
  },
  {
    stage: 2,
    title: 'Strangers, freaks & character strands',
    hours: 'alongside the story, or ≈ 10 hours of cleanup',
    note: 'Finish the named characters\u2019 mission strands — Andy (Lucia-only), Kenton, Billy, Randy and Tyrone (Jason-only) — plus Cal\u2019s fishing challenge and Bret\u2019s hunts. Eight completed strands earn the Strangers & Freaks silver. Quest givers tied to trophies return after the story, so anything left over can be finished in free-roam.',
  },
  {
    stage: 3,
    title: 'Ranges, races & challenges',
    hours: 'during cleanup',
    note: 'The skill block: all 42 Shooting Range golds, a Top Fun drone-race win at all 14 locations, 20 different race wins, 250 stunts and the challenge ladder. Aim past the trophies\u2019 own numbers — the 100% checklist wants 70 of 80 challenges and plans for 300 stunts.',
  },
  {
    stage: 4,
    title: 'Collect & explore Leonida',
    hours: 'during cleanup',
    note: 'The map block: 3 full Collectible Card sets, WAiNK at 100 locations, 100 vehicles discovered, 10 Scooter Bros registrations, every meditation spot, and the whole state explored. Region-by-region sweeps with this tracker open beat one giant endgame grind.',
  },
  {
    stage: 5,
    title: 'Crime, cash & one-offs',
    hours: 'during cleanup',
    note: 'The free-roam block: bank vaults, an armored truck, gang operations, the jewelry sneak, the partner crimes, and the cumulative money trophies ($250,000 laundered, $100,000 spent, every garage bought). The hidden one-offs with unconfirmed methods live here too — this guide marks them honestly instead of inventing steps.',
  },
  {
    stage: 6,
    title: '100% completion & the platinum',
    hours: '≈ 100 hours of cleanup',
    note: 'After the credits, the 100% checklist appears under Progress > Stats. It asks for roughly 60% of everything — 200 of 277 vehicles, 100 of 255 animals, 70 of 80 challenges — with robberies, underwater discoveries, shooting ranges, drone races and Bret\u2019s quests in full. Finish it for A Long Road, and Vice Got a Price! follows automatically.',
  },
];

export const KIND_LABELS = {
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  platinum: 'Platinum',
  completion: 'Completion',
};

export async function loadTrophies() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error('Could not load data/trophies.json');
  const data = await response.json();
  return data.trophies;
}

export function trophiesInStage(trophies, stage) {
  return trophies.filter((trophy) => trophy.roadmap_stage === stage);
}

export function missableTrophies(trophies) {
  return trophies.filter((trophy) => trophy.missable);
}
