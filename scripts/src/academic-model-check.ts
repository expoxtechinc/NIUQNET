import assert from "node:assert/strict";
import { createInitialState, validatePlatformState } from "../../artifacts/niu-platform/src/lib/platform";

const state = createInitialState();
const errors = validatePlatformState(state);
assert.deepEqual(errors, [], errors.join("\n"));

const programme = state.programmes.find((item) => item.id === state.activeProgrammeId);
assert.ok(programme, "The active programme must resolve by UUID.");
assert.ok(programme.courses.every((course) => course.modules.every((module) => module.lessons.every((lesson) => lesson.blocks.every((block) => Boolean(block.id))))), "Nested learning records must retain generated IDs.");
assert.ok(programme.assessments.every((assessment) => assessment.questionIds.every((questionId) => state.questions.some((question) => question.id === questionId))), "Assessment mappings must point at question bank records.");
console.log(`Academic model check passed: ${state.programmes.length} programmes, ${state.questions.length} questions, ${state.certificateTemplates.length} certificate templates.`);