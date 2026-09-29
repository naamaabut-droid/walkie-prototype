// The nine "About your dog" frames in Figma are one screen with nine sets of content.
// In code they are data. Adding a question means adding an object here, not a screen.

export type StepKind = 'text' | 'single' | 'multi' | 'photo' | 'notes'

export type Option = { value: string; label: string; sub?: string }

export type Step = {
  id: string
  /** what the answer is called on the summary screen */
  summaryLabel: string
  kind: StepKind
  required: boolean
  title: string
  subtitle?: string
  options?: Option[]
  placeholder?: string
  /** an extra link row under the options, as on step 8 */
  aside?: { label: string; action: string }
  skippable: boolean
}

export const STEPS: Step[] = [
  {
    id: 'name',
    summaryLabel: 'Name',
    kind: 'photo',
    required: true,
    title: 'Add your dog',
    subtitle:
      'So walkers know who they are picking up. You only do this once, saved to your dog’s profile.',
    placeholder: 'What is your dogs name?',
    skippable: false,
  },
  {
    id: 'size',
    summaryLabel: 'Size',
    kind: 'single',
    required: true,
    title: 'How big is your dog?',
    subtitle: 'Most walkers set a weight limit.',
    options: [
      { value: 'small', label: 'Small', sub: '0–7 kg' },
      { value: 'medium', label: 'Medium', sub: '8–18 kg' },
      { value: 'large', label: 'Large', sub: '18–45 kg' },
      { value: 'giant', label: 'Giant', sub: '45 kg and over' },
    ],
    skippable: false,
  },
  {
    id: 'lead',
    summaryLabel: 'On the lead',
    kind: 'single',
    required: true,
    title: 'How is your dog on the lead?',
    subtitle: 'A walker needs to know before the walk.',
    options: [
      { value: 'easy', label: 'Easy', sub: 'Doesn’t pull' },
      { value: 'pulls', label: 'Pulls sometimes', sub: 'Manageable, but you feel it' },
      { value: 'hard', label: 'Hard to hold', sub: 'Needs someone strong and experienced' },
    ],
    skippable: false,
  },
  {
    id: 'energy',
    summaryLabel: 'Energy',
    kind: 'single',
    required: false,
    title: 'How much energy does your dog need to burn?',
    subtitle: 'This decides the route, not only the length.',
    options: [
      { value: 'slow', label: 'Slow', sub: 'A gentle amble, lots of sniffing' },
      { value: 'normal', label: 'Normal pace', sub: 'A steady walk' },
      {
        value: 'energizer',
        label: 'Energizer',
        sub: 'Needs a real walk, or the rest of the day is worse',
      },
    ],
    skippable: true,
  },
  {
    id: 'dogs',
    summaryLabel: 'With other dogs',
    kind: 'single',
    required: true,
    title: 'How is your dog with other dogs?',
    subtitle: 'Anything but “fine with all” rules out pack walks.',
    options: [
      { value: 'all', label: 'Fine with all', sub: 'Happy in a group' },
      { value: 'small-groups', label: 'Only small, calm groups', sub: 'No boisterous dogs' },
      { value: 'alone', label: 'Needs to walk alone', sub: 'One dog at a time' },
    ],
    skippable: false,
  },
  {
    id: 'strangers',
    summaryLabel: 'With strangers',
    kind: 'single',
    required: false,
    title: 'How is your dog with people they don’t know?',
    subtitle: 'So the first meeting goes your way.',
    options: [
      { value: 'shy', label: 'Shy — keep distance', sub: 'Let him come to you' },
      { value: 'slow', label: 'Warms up slowly', sub: 'Give him a few minutes' },
      { value: 'friendly', label: 'Friendly straight away', sub: 'No introduction needed' },
    ],
    skippable: true,
  },
  {
    id: 'fears',
    summaryLabel: 'Scared of',
    kind: 'multi',
    required: false,
    title: 'Anything that scares your dog?',
    subtitle: 'Pick any. Walkers see these before the walk.',
    options: [
      { value: 'bikes', label: 'Bikes' },
      { value: 'fireworks', label: 'Fireworks' },
      { value: 'traffic', label: 'Traffic' },
      { value: 'strangers', label: 'Strangers' },
      { value: 'thunder', label: 'Thunder' },
      { value: 'nothing', label: 'Nothing' },
    ],
    skippable: true,
  },
  {
    id: 'never',
    summaryLabel: 'Never',
    kind: 'multi',
    required: false,
    title: 'Anything your dog must never do?',
    subtitle: 'Walkers see these as instructions.',
    options: [
      { value: 'no-dog-parks', label: 'No dog parks', sub: 'He gets overwhelmed' },
      { value: 'no-street-food', label: 'No street food', sub: 'He will take it off the ground' },
      { value: 'never-off-lead', label: 'Never off the lead' },
      { value: 'nothing', label: 'Nothing' },
    ],
    aside: { label: 'Additional optional information', action: 'Allergies, medication, vet  ›' },
    skippable: true,
  },
  {
    id: 'notes',
    summaryLabel: 'Notes',
    kind: 'notes',
    required: false,
    title: 'Anything else a walker should know?',
    subtitle: 'Anything the questions did not cover.',
    placeholder: 'He needs water halfway. The gate sticks — lift it as you close it.',
    // the frame ends in Save alone — the label already says the note is optional
    skippable: false,
  },
]

/** The state the wireframes are drawn in, so the prototype opens where the Figma flow opens. */
export const PREFILLED: Record<string, string | string[]> = {
  name: 'Louie',
  size: 'large',
  lead: 'pulls',
  energy: 'energizer',
  dogs: 'small-groups',
  strangers: 'slow',
  fears: ['bikes'],
  never: ['no-dog-parks', 'no-street-food'],
  notes: 'He needs water halfway. The gate sticks — lift it as you close it.',
}
