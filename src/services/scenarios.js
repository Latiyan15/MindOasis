// Scenario data — kept separate for clean imports
const SCENARIOS = [
  {
    id: 'exam_failure',
    title: 'Academic Setback',
    description: 'You failed an important exam that you studied hard for. You feel ashamed and disappointed in yourself. Your classmates seem to have done well.',
    choices: [
      { id: 'isolate', text: 'Isolate yourself and avoid everyone' },
      { id: 'friend', text: 'Talk to a trusted friend about your feelings' },
      { id: 'teacher', text: 'Approach the teacher for guidance on improvement' },
    ],
  },
  {
    id: 'social_rejection',
    title: 'Social Exclusion',
    description: 'You discover your friend group went out without inviting you. You feel left out and start questioning your friendships. Self-doubt creeps in.',
    choices: [
      { id: 'confront', text: 'Confront your friends aggressively about it' },
      { id: 'communicate', text: 'Calmly express how you feel to one close friend' },
      { id: 'withdraw', text: "Withdraw and decide you don't need friends" },
    ],
  },
  {
    id: 'work_overload',
    title: 'Overwhelming Workload',
    description: "You have multiple deadlines approaching simultaneously. You're sleeping less, eating poorly, and feeling constant anxiety. The pressure feels unbearable.",
    choices: [
      { id: 'push_through', text: 'Push through without breaks — just keep going' },
      { id: 'prioritize', text: 'Pause, prioritize tasks, and ask for deadline extensions' },
      { id: 'give_up', text: 'Feel overwhelmed and give up on some tasks entirely' },
    ],
  },
  {
    id: 'family_conflict',
    title: 'Family Disagreement',
    description: "Your parents are pressuring you about your career choices. They want you to pursue a different path than what you're passionate about. The arguments are becoming daily.",
    choices: [
      { id: 'rebel', text: 'Rebel and refuse to discuss it further' },
      { id: 'listen', text: 'Listen to their concerns and share your perspective calmly' },
      { id: 'comply', text: 'Give in completely to avoid conflict' },
    ],
  },
  {
    id: 'imposter_syndrome',
    title: 'Imposter Syndrome',
    description: "You received praise for a project at work/school, but you feel like a fraud. You believe you don't deserve the recognition and that people will eventually discover you're not that talented.",
    choices: [
      { id: 'dismiss', text: 'Dismiss the praise and downplay your achievements' },
      { id: 'accept', text: 'Accept the praise and reflect on your genuine effort' },
      { id: 'overcompensate', text: 'Overwork yourself to "prove" you deserve it' },
    ],
  },
];

export default SCENARIOS;
