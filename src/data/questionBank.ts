import { Question } from '../types';

export const adultHealth1Questions: Question[] = [
  // Diabetes Mellitus Questions
  {
    id: 'dm-001',
    assessmentId: 'assessment-1',
    category: 'diabetes',
    subCategory: 'DKA',
    difficulty: 'hard',
    content: 'A 22-year-old client with type 1 diabetes mellitus is admitted to the emergency department. Assessment reveals deep, rapid respirations; fruity breath odor; and lethargy. Laboratory results show: blood glucose 425 mg/dL, pH 7.28, HCO3 15 mEq/L, and positive serum ketones. Which intervention should the nurse implement first?',
    clinicalScenario: 'Young adult presenting with classic signs of diabetic ketoacidosis requiring immediate intervention.',
    labValues: [
      { name: 'Blood Glucose', value: 425, unit: 'mg/dL', normalRange: '70-110', critical: true },
      { name: 'pH', value: 7.28, unit: '', normalRange: '7.35-7.45', critical: true },
      { name: 'HCO3', value: 15, unit: 'mEq/L', normalRange: '22-28', critical: true },
      { name: 'Serum Ketones', value: 'Positive', unit: '', normalRange: 'Negative', critical: true }
    ],
    vitalSigns: {
      bloodPressure: '92/58',
      heartRate: 118,
      respiratoryRate: 32,
      temperature: 98.2,
      oxygenSaturation: 98
    },
    options: [
      { id: 'dm-001-a', text: 'Administer regular insulin 10 units intravenously', order: 1 },
      { id: 'dm-001-b', text: 'Initiate 0.9% normal saline infusion at 1 L/hour', order: 2 },
      { id: 'dm-001-c', text: 'Administer sodium bicarbonate 50 mEq IV push', order: 3 },
      { id: 'dm-001-d', text: 'Begin potassium chloride 20 mEq/L in IV fluids', order: 4 }
    ],
    correctAnswerId: 'dm-001-b',
    rationales: [
      {
        id: 'dm-001-r1',
        questionId: 'dm-001',
        text: 'The priority intervention addresses volume deficit and hemodynamic instability before correcting metabolic disturbances, as rapid correction without adequate hydration can lead to serious complications.',
        isCorrect: true
      },
      {
        id: 'dm-001-r2',
        questionId: 'dm-001',
        text: 'Immediate hormone administration is necessary to halt metabolic deterioration and prevent further complications in this acute endocrine emergency.',
        isCorrect: false,
        distractorType: 'partial'
      },
      {
        id: 'dm-001-r3',
        questionId: 'dm-001',
        text: 'Direct pH correction should be initiated when laboratory values indicate severe acidemia to prevent cardiovascular collapse.',
        isCorrect: false,
        distractorType: 'common_misconception'
      },
      {
        id: 'dm-001-r4',
        questionId: 'dm-001',
        text: 'Electrolyte supplementation must begin immediately to prevent cardiac dysrhythmias during treatment of this metabolic crisis.',
        isCorrect: false,
        distractorType: 'plausible'
      },
      {
        id: 'dm-001-r5',
        questionId: 'dm-001',
        text: 'Monitoring and supportive care without aggressive intervention allows the body to self-correct metabolic imbalances.',
        isCorrect: false,
        distractorType: 'opposite'
      },
      {
        id: 'dm-001-r6',
        questionId: 'dm-001',
        text: 'Simultaneous administration of all necessary medications ensures rapid stabilization of this life-threatening condition.',
        isCorrect: false,
        distractorType: 'plausible'
      }
    ],
    ncgsCognitiveFunctions: ['recognize_cues', 'prioritize_hypotheses', 'take_action'],
    bloomsLevel: 'analyze',
    timeEstimate: 90
  },
  {
    id: 'dm-002',
    assessmentId: 'assessment-1',
    category: 'diabetes',
    subCategory: 'HHS',
    difficulty: 'hard',
    content: 'An 82-year-old client with type 2 diabetes is brought to the emergency department after being found confused at home. Laboratory values reveal: blood glucose 680 mg/dL, serum osmolality 360 mOsm/kg, minimal ketones, and BUN 48 mg/dL. The nurse recognizes these findings are most consistent with which condition?',
    labValues: [
      { name: 'Blood Glucose', value: 680, unit: 'mg/dL', normalRange: '70-110', critical: true },
      { name: 'Serum Osmolality', value: 360, unit: 'mOsm/kg', normalRange: '275-295', critical: true },
      { name: 'Ketones', value: 'Trace', unit: '', normalRange: 'Negative', critical: false },
      { name: 'BUN', value: 48, unit: 'mg/dL', normalRange: '10-20', critical: false }
    ],
    options: [
      { id: 'dm-002-a', text: 'Diabetic ketoacidosis (DKA)', order: 1 },
      { id: 'dm-002-b', text: 'Hyperosmolar hyperglycemic state (HHS)', order: 2 },
      { id: 'dm-002-c', text: 'Lactic acidosis', order: 3 },
      { id: 'dm-002-d', text: 'Syndrome of inappropriate antidiuretic hormone (SIADH)', order: 4 }
    ],
    correctAnswerId: 'dm-002-b',
    rationales: [
      {
        id: 'dm-002-r1',
        questionId: 'dm-002',
        text: 'HHS is characterized by extreme hyperglycemia (>600 mg/dL), hyperosmolality (>350 mOsm/kg), and minimal or absent ketones, typically occurring in older adults with type 2 diabetes.',
        isCorrect: true
      },
      {
        id: 'dm-002-r2',
        questionId: 'dm-002',
        text: 'DKA presents with high glucose and is a diabetic emergency, matching most of these laboratory findings.',
        isCorrect: false,
        distractorType: 'partial'
      },
      {
        id: 'dm-002-r3',
        questionId: 'dm-002',
        text: 'Lactic acidosis can occur with metformin use and presents with confusion and metabolic changes.',
        isCorrect: false,
        distractorType: 'plausible'
      },
      {
        id: 'dm-002-r4',
        questionId: 'dm-002',
        text: 'SIADH causes hyponatremia and altered mental status, which explains the confusion.',
        isCorrect: false,
        distractorType: 'opposite'
      }
    ],
    ncgsCognitiveFunctions: ['analyze_cues', 'prioritize_hypotheses'],
    bloomsLevel: 'analyze',
    timeEstimate: 75
  },

  // Immunity and Immunological Disorders Questions
  {
    id: 'imm-001',
    assessmentId: 'assessment-1',
    category: 'immunity',
    subCategory: 'HIV/AIDS',
    difficulty: 'medium',
    content: 'A client with HIV infection has a CD4+ T-cell count of 180 cells/mm³. The nurse should monitor for which opportunistic infection that commonly occurs at this immune level?',
    labValues: [
      { name: 'CD4+ Count', value: 180, unit: 'cells/mm³', normalRange: '500-1500', critical: true }
    ],
    options: [
      { id: 'imm-001-a', text: 'Pneumocystis jirovecii pneumonia', order: 1 },
      { id: 'imm-001-b', text: 'Oral candidiasis', order: 2 },
      { id: 'imm-001-c', text: 'Herpes zoster', order: 3 },
      { id: 'imm-001-d', text: 'Bacterial pneumonia', order: 4 }
    ],
    correctAnswerId: 'imm-001-a',
    rationales: [
      {
        id: 'imm-001-r1',
        questionId: 'imm-001',
        text: 'Pneumocystis jirovecii pneumonia typically occurs when CD4+ counts fall below 200 cells/mm³, indicating severe immunosuppression and AIDS diagnosis.',
        isCorrect: true
      },
      {
        id: 'imm-001-r2',
        questionId: 'imm-001',
        text: 'Oral candidiasis is common in HIV but can occur at higher CD4+ counts, making it likely at this level.',
        isCorrect: false,
        distractorType: 'partial'
      },
      {
        id: 'imm-001-r3',
        questionId: 'imm-001',
        text: 'Herpes zoster reactivation increases with immunosuppression and is a significant concern at this CD4+ level.',
        isCorrect: false,
        distractorType: 'plausible'
      },
      {
        id: 'imm-001-r4',
        questionId: 'imm-001',
        text: 'Bacterial infections are more common in HIV patients due to overall immune dysfunction.',
        isCorrect: false,
        distractorType: 'common_misconception'
      }
    ],
    ncgsCognitiveFunctions: ['recognize_cues', 'analyze_cues'],
    bloomsLevel: 'apply',
    timeEstimate: 60
  },
  {
    id: 'imm-002',
    assessmentId: 'assessment-1',
    category: 'immunity',
    subCategory: 'Autoimmune',
    difficulty: 'medium',
    content: 'A 28-year-old female client presents with a butterfly-shaped rash across her cheeks and nose, joint pain, and fatigue. Laboratory results show positive ANA and anti-dsDNA antibodies. Which intervention should the nurse prioritize in the care plan?',
    clinicalScenario: 'Young woman presenting with classic signs of systemic lupus erythematosus.',
    labValues: [
      { name: 'ANA', value: 'Positive 1:640', unit: '', normalRange: 'Negative', critical: false },
      { name: 'Anti-dsDNA', value: 'Positive', unit: '', normalRange: 'Negative', critical: false }
    ],
    options: [
      { id: 'imm-002-a', text: 'Educate about sun protection and UV avoidance', order: 1 },
      { id: 'imm-002-b', text: 'Initiate high-dose corticosteroid therapy', order: 2 },
      { id: 'imm-002-c', text: 'Schedule immediate kidney biopsy', order: 3 },
      { id: 'imm-002-d', text: 'Begin prophylactic antibiotic therapy', order: 4 }
    ],
    correctAnswerId: 'imm-002-a',
    rationales: [
      {
        id: 'imm-002-r1',
        questionId: 'imm-002',
        text: 'Sun protection is essential as UV exposure can trigger lupus flares and worsen the characteristic malar rash. This is a priority nursing intervention for disease management.',
        isCorrect: true
      },
      {
        id: 'imm-002-r2',
        questionId: 'imm-002',
        text: 'Corticosteroids are the primary treatment for lupus to suppress the immune response and reduce inflammation.',
        isCorrect: false,
        distractorType: 'partial'
      },
      {
        id: 'imm-002-r3',
        questionId: 'imm-002',
        text: 'Kidney involvement is common in lupus and requires immediate assessment to prevent permanent damage.',
        isCorrect: false,
        distractorType: 'plausible'
      },
      {
        id: 'imm-002-r4',
        questionId: 'imm-002',
        text: 'Immunosuppression from lupus and its treatment increases infection risk, requiring prophylaxis.',
        isCorrect: false,
        distractorType: 'common_misconception'
      }
    ],
    ncgsCognitiveFunctions: ['prioritize_hypotheses', 'generate_solutions'],
    bloomsLevel: 'apply',
    timeEstimate: 75
  },

  // Hematology Questions
  {
    id: 'hem-001',
    assessmentId: 'assessment-1',
    category: 'hematology',
    subCategory: 'Transfusion Reactions',
    difficulty: 'hard',
    content: 'During a blood transfusion, a client develops chills, fever of 101.5°F (38.6°C), and back pain within 15 minutes. The nurse stops the transfusion and maintains IV access with normal saline. Which action should the nurse take next?',
    vitalSigns: {
      bloodPressure: '118/72',
      heartRate: 92,
      respiratoryRate: 20,
      temperature: 101.5,
      oxygenSaturation: 97
    },
    options: [
      { id: 'hem-001-a', text: 'Obtain blood and urine specimens for laboratory analysis', order: 1 },
      { id: 'hem-001-b', text: 'Administer diphenhydramine 25 mg IV push', order: 2 },
      { id: 'hem-001-c', text: 'Resume transfusion at a slower rate', order: 3 },
      { id: 'hem-001-d', text: 'Administer meperidine for rigors', order: 4 }
    ],
    correctAnswerId: 'hem-001-a',
    rationales: [
      {
        id: 'hem-001-r1',
        questionId: 'hem-001',
        text: 'Blood and urine specimens must be obtained immediately to differentiate between hemolytic and febrile reactions. Hemoglobinuria indicates hemolysis requiring urgent intervention.',
        isCorrect: true
      },
      {
        id: 'hem-001-r2',
        questionId: 'hem-001',
        text: 'Diphenhydramine treats allergic reactions, and these symptoms suggest an allergic response to the blood product.',
        isCorrect: false,
        distractorType: 'partial'
      },
      {
        id: 'hem-001-r3',
        questionId: 'hem-001',
        text: 'Slowing the rate may help if this is a minor febrile reaction that doesn\'t require stopping the transfusion.',
        isCorrect: false,
        distractorType: 'opposite'
      },
      {
        id: 'hem-001-r4',
        questionId: 'hem-001',
        text: 'Meperidine effectively treats transfusion-related rigors and should be given for patient comfort.',
        isCorrect: false,
        distractorType: 'plausible'
      }
    ],
    ncgsCognitiveFunctions: ['recognize_cues', 'take_action', 'evaluate_outcomes'],
    bloomsLevel: 'analyze',
    timeEstimate: 90
  },
  {
    id: 'hem-002',
    assessmentId: 'assessment-1',
    category: 'hematology',
    subCategory: 'Sickle Cell Disease',
    difficulty: 'medium',
    content: 'A client with sickle cell disease is admitted with severe joint pain rated 9/10. The nurse notes the client has received meperidine for previous crises. Which medication should the nurse question?',
    vitalSigns: {
      painLevel: 9
    },
    options: [
      { id: 'hem-002-a', text: 'Morphine sulfate 4 mg IV every 2 hours PRN', order: 1 },
      { id: 'hem-002-b', text: 'Hydromorphone 1 mg IV every 3 hours PRN', order: 2 },
      { id: 'hem-002-c', text: 'Meperidine 50 mg IM every 4 hours PRN', order: 3 },
      { id: 'hem-002-d', text: 'Ketorolac 30 mg IV every 6 hours', order: 4 }
    ],
    correctAnswerId: 'hem-002-c',
    rationales: [
      {
        id: 'hem-002-r1',
        questionId: 'hem-002',
        text: 'Meperidine is contraindicated in sickle cell disease due to its metabolite normeperidine, which can accumulate and cause seizures, especially with repeated dosing.',
        isCorrect: true
      },
      {
        id: 'hem-002-r2',
        questionId: 'hem-002',
        text: 'Morphine may cause respiratory depression and should be used cautiously in sickle cell patients.',
        isCorrect: false,
        distractorType: 'plausible'
      },
      {
        id: 'hem-002-r3',
        questionId: 'hem-002',
        text: 'Hydromorphone is very potent and the dose may be too high for safe administration.',
        isCorrect: false,
        distractorType: 'partial'
      },
      {
        id: 'hem-002-r4',
        questionId: 'hem-002',
        text: 'NSAIDs like ketorolac can affect platelet function and should be avoided in hematologic disorders.',
        isCorrect: false,
        distractorType: 'common_misconception'
      }
    ],
    ncgsCognitiveFunctions: ['analyze_cues', 'generate_solutions'],
    bloomsLevel: 'apply',
    timeEstimate: 60
  },

  // Hemodynamics Questions
  {
    id: 'hemo-001',
    assessmentId: 'assessment-1',
    category: 'hemodynamics',
    subCategory: 'Shock States',
    difficulty: 'hard',
    content: 'A client in the ICU has the following hemodynamic parameters: BP 88/56 mmHg, HR 128 bpm, CVP 2 mmHg, PCWP 6 mmHg, CO 3.2 L/min, SVR 1800 dynes/sec/cm⁵. These findings are most consistent with which type of shock?',
    labValues: [
      { name: 'CVP', value: 2, unit: 'mmHg', normalRange: '2-8', critical: true },
      { name: 'PCWP', value: 6, unit: 'mmHg', normalRange: '8-12', critical: true },
      { name: 'CO', value: 3.2, unit: 'L/min', normalRange: '4-8', critical: true },
      { name: 'SVR', value: 1800, unit: 'dynes/sec/cm⁵', normalRange: '800-1200', critical: true }
    ],
    vitalSigns: {
      bloodPressure: '88/56',
      heartRate: 128
    },
    options: [
      { id: 'hemo-001-a', text: 'Hypovolemic shock', order: 1 },
      { id: 'hemo-001-b', text: 'Cardiogenic shock', order: 2 },
      { id: 'hemo-001-c', text: 'Septic shock', order: 3 },
      { id: 'hemo-001-d', text: 'Neurogenic shock', order: 4 }
    ],
    correctAnswerId: 'hemo-001-a',
    rationales: [
      {
        id: 'hemo-001-r1',
        questionId: 'hemo-001',
        text: 'Hypovolemic shock presents with decreased preload indicators (low CVP and PCWP), decreased cardiac output, and compensatory increased SVR as the body attempts to maintain perfusion.',
        isCorrect: true
      },
      {
        id: 'hemo-001-r2',
        questionId: 'hemo-001',
        text: 'Cardiogenic shock shows pump failure with elevated filling pressures and decreased cardiac output.',
        isCorrect: false,
        distractorType: 'partial'
      },
      {
        id: 'hemo-001-r3',
        questionId: 'hemo-001',
        text: 'Septic shock initially presents with decreased SVR due to vasodilation and increased cardiac output.',
        isCorrect: false,
        distractorType: 'opposite'
      },
      {
        id: 'hemo-001-r4',
        questionId: 'hemo-001',
        text: 'Neurogenic shock causes loss of sympathetic tone resulting in decreased SVR and bradycardia.',
        isCorrect: false,
        distractorType: 'plausible'
      }
    ],
    ncgsCognitiveFunctions: ['analyze_cues', 'prioritize_hypotheses'],
    bloomsLevel: 'analyze',
    timeEstimate: 90
  },
  {
    id: 'hemo-002',
    assessmentId: 'assessment-1',
    category: 'hemodynamics',
    subCategory: 'Compensation Mechanisms',
    difficulty: 'medium',
    content: 'A trauma patient has lost approximately 750 mL of blood. Which compensatory mechanism would the nurse expect to observe first?',
    options: [
      { id: 'hemo-002-a', text: 'Increased heart rate', order: 1 },
      { id: 'hemo-002-b', text: 'Decreased urine output', order: 2 },
      { id: 'hemo-002-c', text: 'Decreased blood pressure', order: 3 },
      { id: 'hemo-002-d', text: 'Altered mental status', order: 4 }
    ],
    correctAnswerId: 'hemo-002-a',
    rationales: [
      {
        id: 'hemo-002-r1',
        questionId: 'hemo-002',
        text: 'Tachycardia is the earliest compensatory mechanism for blood loss, occurring with 15% volume loss as baroreceptors trigger sympathetic response to maintain cardiac output.',
        isCorrect: true
      },
      {
        id: 'hemo-002-r2',
        questionId: 'hemo-002',
        text: 'Renal compensation through decreased urine output conserves volume and is an early response to hemorrhage.',
        isCorrect: false,
        distractorType: 'plausible'
      },
      {
        id: 'hemo-002-r3',
        questionId: 'hemo-002',
        text: 'Blood pressure drops early as volume is lost and cardiac output decreases.',
        isCorrect: false,
        distractorType: 'common_misconception'
      },
      {
        id: 'hemo-002-r4',
        questionId: 'hemo-002',
        text: 'Mental status changes indicate cerebral hypoperfusion from significant blood loss.',
        isCorrect: false,
        distractorType: 'partial'
      }
    ],
    ncgsCognitiveFunctions: ['recognize_cues', 'analyze_cues'],
    bloomsLevel: 'understand',
    timeEstimate: 60
  }
];