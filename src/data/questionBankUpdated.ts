import { Question } from '../types';

// Helper function to create generic rationales
const createGenericRationales = (
  questionId: string,
  correctRationale: string,
  distractors: string[]
) => {
  const rationales = [
    {
      id: `${questionId}-r1`,
      questionId,
      text: correctRationale,
      isCorrect: true
    }
  ];

  distractors.forEach((text, index) => {
    rationales.push({
      id: `${questionId}-r${index + 2}`,
      questionId,
      text,
      isCorrect: false,
      distractorType: index === 0 ? 'partial' : index === 1 ? 'plausible' : index === 2 ? 'common_misconception' : 'opposite' as any
    });
  });

  return rationales;
};

export const adultHealth1Questions: Question[] = [
  // Diabetes Questions with obfuscated rationales
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
    rationales: createGenericRationales(
      'dm-001',
      'The priority intervention addresses volume deficit and hemodynamic instability before correcting metabolic disturbances, as rapid correction without adequate hydration can lead to serious complications.',
      [
        'Immediate hormone administration is necessary to halt metabolic deterioration and prevent further complications in this acute endocrine emergency.',
        'Direct pH correction should be initiated when laboratory values indicate severe acidemia to prevent cardiovascular collapse.',
        'Electrolyte supplementation must begin immediately to prevent cardiac dysrhythmias during treatment of this metabolic crisis.',
        'Monitoring and supportive care without aggressive intervention allows the body to self-correct metabolic imbalances.',
        'Simultaneous administration of all necessary medications ensures rapid stabilization of this life-threatening condition.'
      ]
    ),
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
    rationales: createGenericRationales(
      'dm-002',
      'This condition presents with severe elevation of serum glucose and osmolality with minimal ketone production, typically seen in elderly patients with underlying metabolic disorders.',
      [
        'The metabolic emergency indicated by these values requires immediate intervention to prevent neurological complications from severe dehydration.',
        'Medication-induced metabolic acidosis can present with altered mental status and requires discontinuation of the causative agent.',
        'Hormonal imbalance affecting water regulation leads to dilutional effects and neurological symptoms.',
        'Acute kidney injury with uremic encephalopathy explains the elevated BUN and confusion in this elderly patient.',
        'The absence of significant acidosis despite metabolic derangement indicates a hyperosmolar state rather than ketoacidosis.'
      ]
    ),
    ncgsCognitiveFunctions: ['analyze_cues', 'prioritize_hypotheses'],
    bloomsLevel: 'analyze',
    timeEstimate: 75
  },
  
  // Immunity Questions with generic rationales
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
    rationales: createGenericRationales(
      'imm-001',
      'This opportunistic pathogen typically manifests when immune cell counts fall below a critical threshold of 200, indicating severe immunosuppression and progression to advanced disease stage.',
      [
        'Fungal infections of mucous membranes can occur at various stages of immune compromise and are commonly seen at this level of immunosuppression.',
        'Viral reactivation syndromes increase in frequency with declining immune function and represent a significant concern at this laboratory value.',
        'Bacterial infections show increased prevalence due to overall immune system dysfunction at this stage of disease progression.',
        'Prophylactic antimicrobial therapy should be initiated when laboratory values reach this threshold to prevent life-threatening complications.',
        'The relationship between immune cell depletion and opportunistic infection risk follows a predictable pattern based on cellular immunity markers.'
      ]
    ),
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
    rationales: createGenericRationales(
      'imm-002',
      'Environmental trigger avoidance is essential as ultraviolet exposure can precipitate disease flares and worsen cutaneous manifestations, making this a priority nursing intervention.',
      [
        'Immunosuppressive therapy represents the primary medical treatment to control inflammatory responses and prevent organ damage.',
        'Organ involvement assessment is crucial for determining disease severity and guiding treatment decisions in systemic autoimmune conditions.',
        'Infection prevention measures are important due to increased susceptibility from both the disease process and immunosuppressive treatments.',
        'Symptom management with anti-inflammatory agents provides relief while addressing the underlying autoimmune process.',
        'Regular monitoring of disease activity markers helps guide treatment adjustments and identify potential complications early.'
      ]
    ),
    ncgsCognitiveFunctions: ['prioritize_hypotheses', 'generate_solutions'],
    bloomsLevel: 'apply',
    timeEstimate: 75
  },

  // Hematology Questions with generic rationales
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
    rationales: createGenericRationales(
      'hem-001',
      'Laboratory specimen collection must occur immediately to differentiate between reaction types, as detection of hemoglobin in urine indicates intravascular hemolysis requiring urgent intervention.',
      [
        'Antihistamine administration addresses allergic manifestations and these symptoms suggest an immune-mediated response to blood product components.',
        'Rate adjustment may be appropriate for minor reactions that do not require discontinuation of the transfusion product.',
        'Symptomatic treatment for rigors provides patient comfort and is indicated for managing transfusion-related symptoms.',
        'Immediate notification of the blood bank and physician ensures appropriate response team activation for serious transfusion reactions.',
        'Vital sign monitoring every 15 minutes helps detect progression or improvement of the reaction and guides further interventions.'
      ]
    ),
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
    rationales: createGenericRationales(
      'hem-002',
      'This specific analgesic is contraindicated due to toxic metabolite accumulation that can cause seizures, especially with repeated dosing in patients with this hematologic condition.',
      [
        'Opioid analgesics may cause respiratory depression and require careful monitoring in patients with chronic pain conditions.',
        'Potent synthetic opioids require dose adjustment based on previous opioid exposure and individual patient response.',
        'Non-steroidal anti-inflammatory medications can affect platelet function and should be used cautiously in hematologic disorders.',
        'Multimodal pain management combining different drug classes optimizes pain control while minimizing side effects.',
        'Patient-controlled analgesia provides better pain management outcomes in acute vaso-occlusive episodes.'
      ]
    ),
    ncgsCognitiveFunctions: ['analyze_cues', 'generate_solutions'],
    bloomsLevel: 'apply',
    timeEstimate: 60
  },

  // Hemodynamics Questions with generic rationales
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
    rationales: createGenericRationales(
      'hemo-001',
      'Decreased preload indicators with compensatory vasoconstriction demonstrate volume deficit, as the body attempts to maintain perfusion through increased vascular resistance.',
      [
        'Pump failure presents with elevated filling pressures and decreased cardiac output despite adequate intravascular volume.',
        'Distributive shock initially shows vasodilation with decreased vascular resistance and compensatory increased cardiac output.',
        'Loss of sympathetic tone results in vasodilation and bradycardia rather than the tachycardia and vasoconstriction seen here.',
        'Mixed shock patterns can occur when multiple pathophysiologic processes overlap in critically ill patients.',
        'Compensatory mechanisms vary based on shock etiology and stage, affecting hemodynamic parameter interpretation.'
      ]
    ),
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
    rationales: createGenericRationales(
      'hemo-002',
      'Baroreceptor activation triggers sympathetic response with this volume loss, increasing cardiac rate to maintain output before other compensatory mechanisms become apparent.',
      [
        'Renal compensation through reduced urine production helps conserve intravascular volume during hemorrhagic states.',
        'Pressure changes occur when compensatory mechanisms fail to maintain adequate perfusion despite volume loss.',
        'Cerebral hypoperfusion manifests as consciousness changes when blood loss exceeds compensatory capacity.',
        'Peripheral vasoconstriction shunts blood centrally and represents an early compensatory response to volume deficit.',
        'The progression of compensatory failure follows predictable patterns based on percentage of blood volume lost.'
      ]
    ),
    ncgsCognitiveFunctions: ['recognize_cues', 'analyze_cues'],
    bloomsLevel: 'understand',
    timeEstimate: 60
  }
];