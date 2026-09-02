export type ProgrammeStatus = 'Draft' | 'In review' | 'Published' | 'Archived';
export type QuestionStatus = 'Draft' | 'Needs review' | 'Approved' | 'Retired';
export type AssessmentType = 'Quiz' | 'Final assessment' | 'Written response';
export type ContentBlockType = 'Rich text' | 'Video' | 'Document' | 'Link' | 'Download';

export type ContentBlock = {
  id: string;
  type: ContentBlockType;
  title: string;
  body: string;
  required: boolean;
  fileName?: string;
};

export type Lesson = {
  id: string;
  title: string;
  summary: string;
  position: number;
  blocks: ContentBlock[];
};

export type Module = {
  id: string;
  title: string;
  description: string;
  position: number;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  title: string;
  summary: string;
  position: number;
  modules: Module[];
};

export type Question = {
  id: string;
  prompt: string;
  type: 'Multiple choice' | 'True / false' | 'Written response';
  points: number;
  status: QuestionStatus;
  choices: string[];
  correctChoice: number;
  explanation: string;
  tags: string[];
};

export type Assessment = {
  id: string;
  title: string;
  description: string;
  type: AssessmentType;
  required: boolean;
  passingScore: number;
  attemptLimit: number;
  questionIds: string[];
};

export type CertificateTemplate = {
  id: string;
  key: string;
  title: string;
  description: string;
  status: 'Draft' | 'Active';
};

export type Programme = {
  id: string;
  code: string;
  title: string;
  shortDescription: string;
  description: string;
  status: ProgrammeStatus;
  updatedAt: string;
  durationWeeks: number;
  accessMode: 'Open enrolment' | 'Invite only';
  price: number;
  currency: 'USD' | 'LRD';
  outcomes: string[];
  courses: Course[];
  assessments: Assessment[];
  certificateTemplateId: string;
  certificateKey: string;
  publicationNotes: string;
};

export type CertificateIssue = {
  id: string;
  verificationCode: string;
  learnerName: string;
  programmeId: string;
  programmeTitle: string;
  issuedAt: string;
  status: 'Valid' | 'Revoked';
};

export type LearnerProgress = {
  programmeId: string;
  completedLessonIds: string[];
  passedAssessmentIds: string[];
  enrolledAt: string;
};

export type PlatformState = {
  programmes: Programme[];
  questions: Question[];
  certificateTemplates: CertificateTemplate[];
  certificateIssues: CertificateIssue[];
  learnerProgress: LearnerProgress[];
  activeProgrammeId: string;
  activeStep: number;
  savedAt: string | null;
};

const STORAGE_KEY = 'niu-academic-platform-v1';

export function makeId(prefix: string): string {
  const uuid = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}_${uuid}`;
}

function now(): string {
  return new Date().toISOString();
}

const certificateTemplates: CertificateTemplate[] = [
  {
    id: 'template_niu_standard_01',
    key: 'NIU-CERT-STANDARD-01',
    title: 'NIU Standard Certificate',
    description: 'The institutional certificate for approved Nova International University programmes.',
    status: 'Active',
  },
  {
    id: 'template_niu_civic_01',
    key: 'NIU-CERT-CIVIC-01',
    title: 'Civic Practice Certificate',
    description: 'A quieter, editorial template for civic and public-interest learning.',
    status: 'Active',
  },
];

const questions: Question[] = [
  {
    id: 'question_policy_intent',
    prompt: 'Which source best establishes the intent of a proposed policy?',
    type: 'Multiple choice',
    points: 2,
    status: 'Approved',
    choices: ['A social media comment', 'The policy rationale or explanatory note', 'An unrelated news article', 'A personal opinion'],
    correctChoice: 1,
    explanation: 'The rationale explains the problem, intent, and intended effect of the proposal.',
    tags: ['policy', 'evidence'],
  },
  {
    id: 'question_evidence_gap',
    prompt: 'Describe one way an evidence gap can affect a public decision.',
    type: 'Written response',
    points: 4,
    status: 'Needs review',
    choices: [],
    correctChoice: 0,
    explanation: 'Review should look for a clear connection between missing evidence and decision quality.',
    tags: ['evidence', 'reflection'],
  },
  {
    id: 'question_service_person',
    prompt: 'A responsible digital service starts by understanding the person who relies on it.',
    type: 'True / false',
    points: 1,
    status: 'Approved',
    choices: ['True', 'False'],
    correctChoice: 0,
    explanation: 'User context is the first responsibility in service design.',
    tags: ['services', 'ethics'],
  },
];

const programmes: Programme[] = [
  {
    id: 'programme_public_policy_foundations',
    code: 'NIU-PPF-101',
    title: 'Public Policy Foundations',
    shortDescription: 'A practical introduction to policy, evidence, and public systems.',
    description: 'Build a shared language for reading policy, evidence, and the public systems that shape our communities.',
    status: 'Published',
    updatedAt: '2025-05-14T00:00:00.000Z',
    durationWeeks: 6,
    accessMode: 'Open enrolment',
    price: 0,
    currency: 'USD',
    outcomes: [
      'Explain the role of evidence in public decision-making',
      'Apply a simple framework to a real-world issue',
      'Reflect on the people and contexts affected by a policy',
    ],
    certificateTemplateId: 'template_niu_standard_01',
    certificateKey: 'NIU-CERT-STANDARD-01',
    publicationNotes: 'Published institutional preview programme.',
    assessments: [
      {
        id: 'assessment_policy_checkpoint',
        title: 'Policy landscape checkpoint',
        description: 'Check understanding of policy intent, actors, and evidence.',
        type: 'Quiz',
        required: true,
        passingScore: 70,
        attemptLimit: 3,
        questionIds: ['question_policy_intent'],
      },
      {
        id: 'assessment_policy_final',
        title: 'Evidence in practice final',
        description: 'A short applied assessment on evidence and public decisions.',
        type: 'Final assessment',
        required: true,
        passingScore: 75,
        attemptLimit: 2,
        questionIds: ['question_evidence_gap'],
      },
    ],
    courses: [
      {
        id: 'course_policy_landscape',
        title: 'The Policy Landscape',
        summary: 'Learn how policy moves through institutions, people, and public records.',
        position: 1,
        modules: [
          {
            id: 'module_how_policy_moves',
            title: 'How policy moves',
            description: 'The actors, institutions, and decisions behind public action.',
            position: 1,
            lessons: [
              {
                id: 'lesson_welcome_policy',
                title: 'Welcome to policy thinking',
                summary: 'A starting point for observing public decisions with care.',
                position: 1,
                blocks: [
                  { id: 'block_welcome_text', type: 'Rich text', title: 'Orientation', body: 'Public policy is a set of choices about shared life. In this lesson, we will slow down and notice who makes choices, who is affected, and what evidence is used.', required: true },
                  { id: 'block_welcome_link', type: 'Link', title: 'Recommended reading', body: 'https://www.un.org/en/about-us/universal-declaration-of-human-rights', required: false },
                ],
              },
              {
                id: 'lesson_institutions_influence',
                title: 'Institutions and influence',
                summary: 'Map the people and institutions that shape a public issue.',
                position: 2,
                blocks: [
                  { id: 'block_institutions_text', type: 'Rich text', title: 'Lesson notes', body: 'Influence is distributed. A useful map names formal authority, lived expertise, implementation power, and the people most affected.', required: true },
                ],
              },
            ],
          },
          {
            id: 'module_reading_public_record',
            title: 'Reading the public record',
            description: 'Practice finding intent and evidence in public documents.',
            position: 2,
            lessons: [
              {
                id: 'lesson_source_guide',
                title: 'A practical source guide',
                summary: 'Distinguish rationale, evidence, commentary, and implementation detail.',
                position: 1,
                blocks: [
                  { id: 'block_source_text', type: 'Rich text', title: 'Source guide', body: 'Start by asking what a source was made to do. A rationale explains intent; a budget shows commitment; an evaluation shows what happened.', required: true },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'course_evidence_practice',
        title: 'Evidence in Practice',
        summary: 'Turn an issue into a useful, answerable inquiry.',
        position: 2,
        modules: [
          {
            id: 'module_better_questions',
            title: 'Asking better questions',
            description: 'Move from a broad issue to a grounded inquiry.',
            position: 1,
            lessons: [
              {
                id: 'lesson_issue_inquiry',
                title: 'From issue to inquiry',
                summary: 'Frame a question that can guide a real public decision.',
                position: 1,
                blocks: [
                  { id: 'block_inquiry_text', type: 'Rich text', title: 'Practice prompt', body: 'Write one question that names an affected group, a decision, and the evidence you would need to proceed.', required: true },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'programme_responsible_digital_services',
    code: 'NIU-RDS-204',
    title: 'Responsible Digital Services',
    shortDescription: 'Design public-facing digital services with care and clarity.',
    description: 'Design public-facing digital services with care, clarity, and an eye for the people who rely on them.',
    status: 'In review',
    updatedAt: '2025-05-11T00:00:00.000Z',
    durationWeeks: 4,
    accessMode: 'Open enrolment',
    price: 49,
    currency: 'USD',
    outcomes: ['Identify the people and moments that define a service', 'Use feedback to improve a service promise'],
    certificateTemplateId: 'template_niu_civic_01',
    certificateKey: 'NIU-CERT-CIVIC-01',
    publicationNotes: 'Final assessment and reviewer sign-off required before publication.',
    assessments: [],
    courses: [
      {
        id: 'course_service_foundations',
        title: 'Service foundations',
        summary: 'Start with the person and the promise.',
        position: 1,
        modules: [
          {
            id: 'module_service_promise',
            title: 'The service as a promise',
            description: 'Understand what a service owes to the person using it.',
            position: 1,
            lessons: [
              { id: 'lesson_start_person', title: 'Start with the person', summary: 'Name the person behind the request.', position: 1, blocks: [{ id: 'block_person_text', type: 'Rich text', title: 'Lesson notes', body: 'A service is experienced by a person, not by an organisation chart.', required: true }] },
              { id: 'lesson_moments_matter', title: 'Moments that matter', summary: 'Find the points where trust is made or lost.', position: 2, blocks: [] },
            ],
          },
        ],
      },
    ],
  },
];

export function createInitialState(): PlatformState {
  return {
    programmes,
    questions,
    certificateTemplates,
    certificateIssues: [
      {
        id: 'certificate_demo_00482',
        verificationCode: 'NIU-PPF-101-00482',
        learnerName: 'Amara Okafor',
        programmeId: 'programme_public_policy_foundations',
        programmeTitle: 'Public Policy Foundations',
        issuedAt: '2025-05-14T00:00:00.000Z',
        status: 'Valid',
      },
    ],
    learnerProgress: [],
    activeProgrammeId: 'programme_responsible_digital_services',
    activeStep: 0,
    savedAt: null,
  };
}

export function loadPlatformState(): PlatformState {
  if (typeof window === 'undefined') return createInitialState();
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return createInitialState();
    const parsed = JSON.parse(saved) as PlatformState;
    return {
      ...createInitialState(),
      ...parsed,
      programmes: Array.isArray(parsed.programmes) ? parsed.programmes : programmes,
      questions: Array.isArray(parsed.questions) ? parsed.questions : questions,
      certificateTemplates: Array.isArray(parsed.certificateTemplates) ? parsed.certificateTemplates : certificateTemplates,
    };
  } catch {
    return createInitialState();
  }
}

export function savePlatformState(state: PlatformState): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, savedAt: now() }));
}

export function resetPlatformState(): PlatformState {
  const fresh = createInitialState();
  if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY);
  return fresh;
}

export function countLessons(programme: Programme): number {
  return programme.courses.reduce((total, course) => total + course.modules.reduce((sum, module) => sum + module.lessons.length, 0), 0);
}

export function countContent(programme: Programme): number {
  return programme.courses.reduce((total, course) => total + course.modules.reduce((sum, module) => sum + module.lessons.reduce((lessonTotal, lesson) => lessonTotal + lesson.blocks.length, 0), 0), 0);
}

export function getSupabaseReadiness(): { configured: boolean; message: string } {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};
  const configured = Boolean(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY);
  return configured
    ? { configured: true, message: 'Supabase environment detected; use the server adapter for live persistence.' }
    : { configured: false, message: 'Local preview mode. Authorize Supabase before enabling live records, auth, storage, or publication.' };
}

export function validatePlatformState(state: PlatformState): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const remember = (id: string, label: string) => {
    if (ids.has(id)) errors.push(`Duplicate ${label} id: ${id}`);
    ids.add(id);
  };
  for (const programme of state.programmes) {
    remember(programme.id, 'programme');
    for (const course of programme.courses) {
      remember(course.id, 'course');
      for (const module of course.modules) {
        remember(module.id, 'module');
        for (const lesson of module.lessons) {
          remember(lesson.id, 'lesson');
          for (const block of lesson.blocks) remember(block.id, 'content block');
        }
      }
    }
    for (const assessment of programme.assessments) {
      remember(assessment.id, 'assessment');
      for (const questionId of assessment.questionIds) {
        if (!state.questions.some((question) => question.id === questionId)) errors.push(`Assessment ${assessment.id} references missing question ${questionId}`);
      }
    }
    if (programme.certificateTemplateId && !state.certificateTemplates.some((template) => template.id === programme.certificateTemplateId)) errors.push(`Programme ${programme.id} references missing certificate template ${programme.certificateTemplateId}`);
  }
  for (const question of state.questions) remember(question.id, 'question');
  for (const template of state.certificateTemplates) remember(template.id, 'certificate template');
  for (const issue of state.certificateIssues) {
    remember(issue.id, 'certificate issue');
    if (!state.programmes.some((programme) => programme.id === issue.programmeId)) errors.push(`Certificate ${issue.id} references missing programme ${issue.programmeId}`);
  }
  return errors;
}