// Home Projects — task data
// Flat list of tasks is the single source of truth. Both the Schedule view
// and All Tasks view render from this array, so a task's completion state
// is always shared between both views.

const CATEGORIES = [
  { id: 'time-gated', label: '⏰ Time-Gated', note: 'Fence install: Sat 9/26' },
  { id: 'quick-wins', label: 'Quick Wins', note: 'Under 1 hr' },
  { id: 'small', label: 'Small Projects', note: 'A few hours / one session' },
  { id: 'medium', label: 'Medium Projects', note: 'Multiple sessions or steps' },
  { id: 'large', label: 'Large Projects', note: 'Needs scoping/breakdown' },
];

const TASKS = [
  // ---- Time-Gated ----
  { id: 'tg-hedge-trim', category: 'time-gated', project: 'Trim hedge before fence install',
    step: null, materials: ['Hedge trimmers/loppers', 'Tarp or bags for clippings', 'Gloves'] },
  { id: 'tg-fence-coat1', category: 'time-gated', project: 'Stain fence', step: 'Coat 1',
    materials: ['Fence stain', 'Stain brush/sprayer', 'Drop cloth', 'Stir stick', 'Rags'] },
  { id: 'tg-fence-coat2', category: 'time-gated', project: 'Stain fence', step: 'Coat 2',
    materials: ['Fence stain', 'Stain brush/sprayer', 'Drop cloth', 'Stir stick', 'Rags'] },

  // ---- Quick Wins ----
  { id: 'qw-organize-packing', category: 'quick-wins', project: 'Organize packing materials',
    step: null, materials: ['Bins/boxes for sorting', 'Labels', 'Marker'] },

  // ---- Small ----
  { id: 'sm-mulch-bed', category: 'small', project: 'Mulch front garden bed', step: null,
    materials: ['Mulch (bagged or bulk)', 'Wheelbarrow', 'Garden rake', 'Edging shovel'] },
  { id: 'sm-patio-fill', category: 'small', project: 'Fill in gaps in back patio concrete', step: null,
    materials: ['Concrete crack filler/patch compound', 'Caulk gun', 'Wire brush', 'Trowel', 'Water'] },
  { id: 'sm-trim-prep', category: 'small', project: 'Paint trim on windows', step: 'Prep (sand, tape, prime)',
    materials: ['Sandpaper', "Painter's tape", 'Drop cloth', 'Primer'] },
  { id: 'sm-trim-paint', category: 'small', project: 'Paint trim on windows', step: 'Paint/finish',
    materials: ['Exterior trim paint', 'Angled sash brush', 'Drop cloth'] },

  // ---- Medium ----
  { id: 'md-grass-clear', category: 'medium', project: 'Till/aerate back grass and reseed', step: 'Clear debris, till/aerate',
    materials: ['Rake', 'Yard waste bags', 'Tiller or core aerator'] },
  { id: 'md-grass-reseed', category: 'medium', project: 'Till/aerate back grass and reseed', step: 'Reseed + watering setup',
    materials: ['Grass seed', 'Seed spreader', 'Starter fertilizer', 'Sprinkler', 'Hose'] },
  { id: 'md-back-soil-test', category: 'medium', project: 'Prep soil for back planting', step: 'Test soil, clear weeds',
    materials: ['Soil test kit', 'Hand weeder', 'Gloves', 'Tarp'] },
  { id: 'md-back-soil-amend', category: 'medium', project: 'Prep soil for back planting', step: 'Amend soil',
    materials: ['Compost/amendments', 'Garden fork or tiller'] },
  { id: 'md-north-assess', category: 'medium', project: 'Prep soil on north side + determine plantings', step: 'Assess conditions, research plants',
    materials: [] },
  { id: 'md-north-soil', category: 'medium', project: 'Prep soil on north side + determine plantings', step: 'Test and amend soil',
    materials: ['Soil test kit', 'Compost/amendments', 'Garden fork'] },
  { id: 'md-north-plan', category: 'medium', project: 'Prep soil on north side + determine plantings', step: 'Finalize planting plan',
    materials: ['Graph paper/planning app (optional)', 'Plant tags/stakes'] },
  { id: 'md-deck-cleanup', category: 'medium', project: 'Clean up plants on back deck and replant veggie bed', step: 'Clean up back deck plants',
    materials: ['Pruners/shears', 'Yard waste bags', 'Gloves', 'Broom'] },
  { id: 'md-veggie-replant', category: 'medium', project: 'Clean up plants on back deck and replant veggie bed', step: 'Replant veggie bed',
    materials: ['Compost/soil amendments', 'Garden trowel', 'Vegetable seeds or starts', 'Watering can or hose', 'Gloves'] },

  // ---- Large: Drip Irrigation ----
  { id: 'lg-drip-map', category: 'large', project: 'Install drip irrigation', step: 'Map zones, sketch layout',
    materials: ['Measuring tape', 'Paper/sketch'] },
  { id: 'lg-drip-buy', category: 'large', project: 'Install drip irrigation', step: 'Buy materials',
    materials: ['Drip tubing', 'Emitters', 'Connectors/fittings', 'Pressure regulator', 'Filter', 'Timer', 'Hole punch tool', 'Stakes'] },
  { id: 'lg-drip-mainlines', category: 'large', project: 'Install drip irrigation', step: 'Lay main lines',
    materials: ['Tubing', 'Connectors', 'Stakes'] },
  { id: 'lg-drip-emitters', category: 'large', project: 'Install drip irrigation', step: 'Install emitters',
    materials: ['Emitters', 'Hole punch tool'] },
  { id: 'lg-drip-timer', category: 'large', project: 'Install drip irrigation', step: 'Connect/program timer, test system',
    materials: ['Timer', 'Batteries if needed'] },

  // ---- Large: Deck Wall Solution ----
  { id: 'lg-deck-define', category: 'large', project: 'Deck wall solution', step: 'Define the actual problem',
    materials: [] },
  { id: 'lg-deck-research', category: 'large', project: 'Deck wall solution', step: 'Research options',
    materials: [] },
  { id: 'lg-deck-cost', category: 'large', project: 'Deck wall solution', step: 'Get cost estimates',
    materials: [] },
  { id: 'lg-deck-decide', category: 'large', project: 'Deck wall solution', step: 'Decide on approach',
    materials: [] },
  { id: 'lg-deck-build', category: 'large', project: 'Deck wall solution', step: 'Build/execute',
    materials: ['TBD once approach chosen (likely lumber/panels)', 'Fasteners', 'Level', 'Drill', 'Saw'] },

  // ---- Large: Entry Bench ----
  { id: 'lg-bench-cut', category: 'large', project: 'Build small entry bench', step: 'Decide dimensions/style, cut lumber',
    materials: ['Lumber (seat, legs, supports)', 'Tape measure', 'Circular saw or miter saw'] },
  { id: 'lg-bench-assemble', category: 'large', project: 'Build small entry bench', step: 'Assemble frame',
    materials: ['Wood screws or pocket-hole screws', 'Wood glue', 'Clamps', 'Drill/driver', 'Level'] },
  { id: 'lg-bench-sand', category: 'large', project: 'Build small entry bench', step: 'Sand',
    materials: ['Sandpaper (various grits) or sander'] },
  { id: 'lg-bench-finish', category: 'large', project: 'Build small entry bench', step: 'Finish (stain/paint/seal)',
    materials: ['Stain, paint, or sealant', 'Brush', 'Rags', 'Drop cloth'] },
  { id: 'lg-bench-attach', category: 'large', project: 'Build small entry bench', step: 'Attach/secure if needed',
    materials: ['Wall anchors', 'Screws', 'Stud finder'] },

  // ---- Large: Cat Painting Frames ----
  { id: 'lg-frames-measure', category: 'large', project: 'Make frames for cat paintings', step: 'Measure paintings, choose style',
    materials: ['Tape measure'] },
  { id: 'lg-frames-cut', category: 'large', project: 'Make frames for cat paintings', step: 'Cut and assemble frames',
    materials: ['Frame molding/wood', 'Miter saw or miter box', 'Wood glue', 'Clamps', 'Nails/brads'] },
  { id: 'lg-frames-finish', category: 'large', project: 'Make frames for cat paintings', step: 'Finish (stain/paint)',
    materials: ['Stain or paint', 'Brush', 'Rags', 'Sandpaper'] },
  { id: 'lg-frames-mount', category: 'large', project: 'Make frames for cat paintings', step: 'Mount and hang',
    materials: ['Mounting hardware/backing', 'Picture hangers', 'Hammer/level'] },
];

// Weekly Mon–Fri schedule. Each entry references a task id from TASKS above,
// so checking a task off here also checks it off in the All Tasks view.
const SCHEDULE = [
  {
    label: 'Week 1', dates: 'Sep 14 – 18',
    days: [
      { day: 'Mon', taskId: 'qw-organize-packing' },
      { day: 'Tue', taskId: 'tg-hedge-trim', flag: 'Must finish before 9/26' },
      { day: 'Wed', taskId: 'sm-mulch-bed' },
      { day: 'Thu', taskId: 'sm-patio-fill' },
      { day: 'Fri', taskId: 'sm-trim-prep' },
    ],
  },
  {
    label: 'Week 2', dates: 'Sep 21 – 25',
    days: [
      { day: 'Mon', taskId: 'sm-trim-paint' },
      { day: 'Tue', taskId: 'md-back-soil-test' },
      { day: 'Wed', taskId: 'md-back-soil-amend' },
      { day: 'Thu', taskId: 'md-north-assess' },
      { day: 'Fri', taskId: 'md-north-soil' },
    ],
    milestone: 'Fence install: Sat 9/26',
  },
  {
    label: 'Week 3', dates: 'Sep 28 – Oct 2',
    days: [
      { day: 'Mon', taskId: 'tg-fence-coat1' },
      { day: 'Tue', taskId: 'tg-fence-coat2' },
      { day: 'Wed', taskId: 'md-grass-clear' },
      { day: 'Thu', taskId: 'md-grass-reseed' },
      { day: 'Fri', taskId: 'md-north-plan' },
    ],
  },
  {
    label: 'Week 4', dates: 'Oct 5 – 9', title: 'Drip Irrigation',
    days: [
      { day: 'Mon', taskId: 'lg-drip-map' },
      { day: 'Tue', taskId: 'lg-drip-buy' },
      { day: 'Wed', taskId: 'lg-drip-mainlines' },
      { day: 'Thu', taskId: 'lg-drip-emitters' },
      { day: 'Fri', taskId: 'lg-drip-timer' },
    ],
  },
  {
    label: 'Week 5', dates: 'Oct 12 – 16', title: 'Deck Wall Solution',
    days: [
      { day: 'Mon', taskId: 'lg-deck-define' },
      { day: 'Tue', taskId: 'lg-deck-research' },
      { day: 'Wed', taskId: 'lg-deck-cost' },
      { day: 'Thu', taskId: 'lg-deck-decide' },
      { day: 'Fri', taskId: 'lg-deck-build', label: 'Begin build — day 1' },
    ],
  },
  {
    label: 'Week 6', dates: 'Oct 19 – 23',
    days: [
      { day: 'Mon', taskId: 'lg-deck-build', label: 'Deck wall build — finish' },
      { day: 'Tue', taskId: 'lg-bench-cut' },
      { day: 'Wed', taskId: 'lg-bench-assemble' },
      { day: 'Thu', taskId: 'lg-bench-sand' },
      { day: 'Fri', taskId: 'lg-bench-finish' },
    ],
  },
  {
    label: 'Week 7', dates: 'Oct 26 – 30',
    days: [
      { day: 'Mon', taskId: 'lg-bench-attach' },
      { day: 'Tue', taskId: 'lg-frames-measure' },
      { day: 'Wed', taskId: 'lg-frames-cut' },
      { day: 'Thu', taskId: 'lg-frames-finish' },
      { day: 'Fri', taskId: 'lg-frames-mount' },
    ],
  },
  {
    label: 'Week 8', dates: 'Nov 2 – 6',
    days: [
      { day: 'Mon', taskId: 'md-deck-cleanup' },
      { day: 'Tue', taskId: 'md-veggie-replant' },
    ],
  },
];
