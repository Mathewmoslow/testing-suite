# Assessment Creation Guide for CPTNCF Testing Suite

## Overview
This guide provides detailed instructions for creating NCLEX-style questions that work with the two-phase sequential assessment system while preventing gaming and ensuring true comprehension testing.

## Core Principles

### 1. Two-Phase Sequential Design
- **Phase 1:** Answer selection (locked, cannot be changed)
- **Phase 2:** Rationale selection (only appears after answer lock)
- **Purpose:** Distinguish true understanding from test-taking strategies

### 2. Anti-Gaming Requirements
- Rationales must NOT contain obvious keywords from answer choices
- Use generic medical terminology
- Create plausible distractors that could apply to multiple scenarios
- Maintain clinical accuracy while obfuscating direct connections

## Question Stem Construction

### Structure
```
1. Patient Demographics (when relevant)
2. Clinical Presentation
3. Objective Data (labs, vitals)
4. Clear Question
```

### Best Practices
- **Be Specific:** Include relevant clinical data (age, gender, relevant history)
- **Use Active Voice:** "The nurse should..." rather than "What should be done..."
- **Include Context:** Provide enough information for clinical reasoning
- **Avoid Negatives:** Don't use "NOT" or "EXCEPT" in stems

### Example Template
```
A [age]-year-old [gender] client with [relevant history] presents to [setting] with [symptoms]. 
Assessment reveals [objective findings]. Laboratory results show [specific values with units]. 
Which [intervention/assessment/diagnosis] should the nurse [action]?
```

## Answer Choice Development

### Requirements
- 4 options per question
- All must be plausible
- Similar length and structure
- Grammatically consistent with stem
- Avoid absolute terms (always, never, all, none)

### Types of Distractors
1. **Partially Correct:** Right concept, wrong application
2. **Common Misconception:** What students often incorrectly believe
3. **Opposite Action:** Contraindicated but seems logical
4. **Related but Wrong:** From same topic but inappropriate

### Example Structure
```typescript
options: [
  { id: 'q1-a', text: 'Specific intervention with measurable action', order: 1 },
  { id: 'q1-b', text: 'Alternative intervention at similar specificity', order: 2 },
  { id: 'q1-c', text: 'Plausible but incorrect intervention', order: 3 },
  { id: 'q1-d', text: 'Common misconception intervention', order: 4 }
]
```

## Rationale Creation (CRITICAL)

### The 6-Rationale Rule
Each question MUST have exactly 6 rationales:
- 1 correct rationale
- 5 distractors with varying levels of plausibility

### Generic Language Guidelines

#### AVOID These Terms
❌ Specific medication names (insulin, metformin, morphine)
❌ Specific condition names (DKA, HHS, sepsis)
❌ Specific lab values from the stem
❌ Direct procedural names

#### USE These Instead
✅ "Hormone administration" instead of "insulin"
✅ "Metabolic emergency" instead of "DKA"
✅ "Vasopressor support" instead of "norepinephrine"
✅ "Volume resuscitation" instead of "normal saline"
✅ "Immune cell markers" instead of "CD4 count"

### Rationale Template Structure
```typescript
rationales: [
  {
    id: 'q1-r1',
    text: 'Generic explanation focusing on pathophysiological principles without naming specific conditions or treatments',
    isCorrect: true
  },
  {
    id: 'q1-r2',
    text: 'Partially accurate explanation that misses key priority or sequence',
    isCorrect: false,
    distractorType: 'partial'
  },
  {
    id: 'q1-r3',
    text: 'Plausible explanation based on related but different clinical scenario',
    isCorrect: false,
    distractorType: 'plausible'
  },
  {
    id: 'q1-r4',
    text: 'Common misconception that students often have about this topic',
    isCorrect: false,
    distractorType: 'common_misconception'
  },
  {
    id: 'q1-r5',
    text: 'Opposite or contraindicated reasoning that seems logical',
    isCorrect: false,
    distractorType: 'opposite'
  },
  {
    id: 'q1-r6',
    text: 'Alternative approach that would be correct in different circumstances',
    isCorrect: false,
    distractorType: 'plausible'
  }
]
```

## Writing Effective Generic Rationales

### Step-by-Step Process

1. **Identify Core Concept**
   - What pathophysiological principle is being tested?
   - What clinical reasoning skill is required?

2. **Remove Specific Identifiers**
   - Replace disease names with descriptions
   - Replace drug names with drug classes or effects
   - Replace specific values with relative terms

3. **Focus on Principles**
   - Explain WHY not WHAT
   - Describe mechanisms not memorized facts
   - Use physiological reasoning

### Conversion Examples

#### Poor Rationale (Too Specific):
"Administer insulin to treat DKA by lowering blood glucose and stopping ketone production"

#### Good Rationale (Generic):
"Hormone replacement therapy addresses the metabolic derangement by facilitating cellular glucose uptake and halting ketone body formation"

#### Poor Rationale (Obvious Match):
"Give normal saline for hypovolemic shock to increase blood pressure"

#### Good Rationale (Obfuscated):
"Volume expansion addresses preload deficiency and improves cardiac output through Frank-Starling mechanisms"

## Clinical Category Guidelines

### Diabetes Management
- Focus on: metabolic imbalances, fluid-electrolyte shifts, acid-base disturbances
- Avoid: naming DKA/HHS, specific insulin types, exact glucose values

### Immunity/HIV
- Focus on: immune cell function, opportunistic infection risk, disease progression markers
- Avoid: CD4 counts, specific drug names, AIDS-defining conditions

### Hematology
- Focus on: oxygen carrying capacity, hemostasis, cellular abnormalities
- Avoid: specific blood product names, exact hemoglobin values

### Hemodynamics
- Focus on: preload/afterload concepts, compensatory mechanisms, perfusion
- Avoid: naming shock types, specific medications, exact hemodynamic values

## Quality Checklist

Before finalizing a question, verify:

### Stem Quality
- [ ] Contains sufficient clinical data
- [ ] Asks clear, specific question
- [ ] Includes relevant patient context
- [ ] Free of grammatical clues

### Answer Choices
- [ ] All options are plausible
- [ ] Similar length and structure
- [ ] No absolute terms
- [ ] Correct answer isn't obviously longer/more detailed

### Rationales
- [ ] Exactly 6 rationales provided
- [ ] No obvious keyword matches with answers
- [ ] Uses generic medical terminology
- [ ] Each explains reasoning, not just facts
- [ ] Varying levels of plausibility
- [ ] Would make sense even if shuffled

### Anti-Gaming Check
- [ ] Student cannot match rationale to answer by keywords
- [ ] Rationales could theoretically apply to multiple questions
- [ ] Understanding of pathophysiology required to identify correct rationale
- [ ] No patterns in correct rationale placement or length

## Implementation in Code

### Using the Helper Function
```typescript
import { createGenericRationales } from './utils/questionHelpers';

const rationales = createGenericRationales(
  'question-id',
  'Correct rationale using generic terminology',
  [
    'Distractor 1 with partial accuracy',
    'Distractor 2 with plausible alternative',
    'Distractor 3 with common misconception',
    'Distractor 4 with opposite reasoning',
    'Distractor 5 with related but wrong concept'
  ]
);
```

### Question Object Structure
```typescript
const question: Question = {
  id: 'unique-id',
  assessmentId: 'assessment-1',
  category: 'diabetes|immunity|hematology|hemodynamics',
  subCategory: 'specific-topic',
  difficulty: 'easy|medium|hard',
  content: 'Full question stem',
  clinicalScenario: 'Optional additional context',
  labValues: [...],
  vitalSigns: {...},
  options: [...],
  correctAnswerId: 'option-id',
  rationales: [...],
  ncgsCognitiveFunctions: [...],
  bloomsLevel: 'remember|understand|apply|analyze|evaluate|create',
  timeEstimate: 60-90
};
```

## Testing Your Questions

### Manual Review
1. Have colleague attempt to match rationales to answers without domain knowledge
2. If they can match >50%, rationales are too obvious
3. Verify clinical accuracy with subject matter expert
4. Test with students and analyze response patterns

### Statistical Validation
- Track answer-rationale mismatch rates (target: 20-30%)
- Monitor time spent on rationale selection (should be longer than answer)
- Analyze pattern detection flags
- Review discrimination indices

## Common Pitfalls to Avoid

1. **Keyword Contamination:** Using same terms in answer and rationale
2. **Length Clues:** Correct rationale being notably longer
3. **Overgeneralization:** Rationales so vague they're meaningless
4. **Under-shuffling:** Not randomizing rationale order
5. **Pattern Creation:** Correct rationale always being "most medical sounding"
6. **Complexity Mismatch:** Rationales requiring higher cognitive load than answers

## Maintenance and Updates

- Review flagged questions monthly
- Update rationales if gaming patterns detected
- Rotate question pools quarterly
- Maintain version control for all changes
- Document rationale for any modifications

## Conclusion

Creating effective two-phase assessments requires careful attention to language, clinical accuracy, and gaming prevention. The goal is to test true understanding of pathophysiology and clinical reasoning, not pattern recognition or test-taking skills. When in doubt, make rationales more generic rather than more specific, and always verify that keyword matching is impossible.