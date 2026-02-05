/**
 * GPA Engine Service
 * Handles all grade conversion and GPA/CGPA calculations
 * Based on 5-Point Grading Scale
 */

// Grading Scale Configuration (5-Point System)
export const GRADING_SCALE = [
  { minScore: 70, maxScore: 100, grade: 'A', point: 5 },
  { minScore: 60, maxScore: 69, grade: 'B', point: 4 },
  { minScore: 50, maxScore: 59, grade: 'C', point: 3 },
  { minScore: 45, maxScore: 49, grade: 'D', point: 2 },
  { minScore: 40, maxScore: 44, grade: 'E', point: 1 },
  { minScore: 0, maxScore: 39, grade: 'F', point: 0 },
];

/**
 * Convert score to grade letter
 * @param score - Student's score (0-100)
 * @returns Grade letter (A, B, C, D, E, F)
 */
export function scoreToGrade(score: number): string {
  // Validate score range
  if (score < 0 || score > 100) {
    throw new Error('Score must be between 0 and 100');
  }

  const gradeEntry = GRADING_SCALE.find(
    (g) => score >= g.minScore && score <= g.maxScore
  );

  return gradeEntry?.grade || 'F';
}

/**
 * Convert grade letter to grade point
 * @param grade - Grade letter (A, B, C, D, E, F)
 * @returns Grade point (0-5)
 */
export function gradeToPoint(grade: string): number {
  const gradeEntry = GRADING_SCALE.find((g) => g.grade === grade.toUpperCase());
  return gradeEntry?.point || 0;
}

/**
 * Convert score directly to grade point
 * @param score - Student's score (0-100)
 * @returns Grade point (0-5)
 */
export function scoreToPoint(score: number): number {
  const grade = scoreToGrade(score);
  return gradeToPoint(grade);
}

/**
 * Calculate Point × Unit (PXU)
 * @param gradePoint - Grade point (0-5)
 * @param courseUnit - Course credit unit
 * @returns PXU value
 */
export function calculatePXU(gradePoint: number, courseUnit: number): number {
  return gradePoint * courseUnit;
}

/**
 * Calculate GPA for a set of results
 * GPA = Sum(PXU) / Sum(Units)
 * @param results - Array of { gradePoint, courseUnit } objects
 * @returns GPA (0.00 - 5.00)
 */
export function calculateGPA(
  results: { gradePoint: number; courseUnit: number }[]
): { gpa: number; totalUnits: number; totalPoints: number } {
  if (results.length === 0) {
    return { gpa: 0, totalUnits: 0, totalPoints: 0 };
  }

  const totalUnits = results.reduce((sum, r) => sum + r.courseUnit, 0);
  const totalPoints = results.reduce(
    (sum, r) => sum + r.gradePoint * r.courseUnit,
    0
  );

  if (totalUnits === 0) {
    return { gpa: 0, totalUnits: 0, totalPoints: 0 };
  }

  const gpa = totalPoints / totalUnits;

  return {
    gpa: Math.round(gpa * 100) / 100, // Round to 2 decimal places
    totalUnits,
    totalPoints,
  };
}

/**
 * Calculate CGPA from multiple semesters
 * CGPA = Sum(All PXU) / Sum(All Units)
 * @param semesterResults - Array of semester results
 * @returns CGPA calculation result
 */
export function calculateCGPA(
  semesterResults: { totalUnits: number; totalPoints: number }[]
): { cgpa: number; totalUnits: number; totalPoints: number } {
  if (semesterResults.length === 0) {
    return { cgpa: 0, totalUnits: 0, totalPoints: 0 };
  }

  const totalUnits = semesterResults.reduce((sum, s) => sum + s.totalUnits, 0);
  const totalPoints = semesterResults.reduce(
    (sum, s) => sum + s.totalPoints,
    0
  );

  if (totalUnits === 0) {
    return { cgpa: 0, totalUnits: 0, totalPoints: 0 };
  }

  const cgpa = totalPoints / totalUnits;

  return {
    cgpa: Math.round(cgpa * 100) / 100,
    totalUnits,
    totalPoints,
  };
}

/**
 * Get class of degree based on CGPA
 * @param cgpa - Cumulative GPA
 * @returns Class of degree string
 */
export function getClassOfDegree(cgpa: number): string {
  if (cgpa >= 4.5) return 'First Class Honours';
  if (cgpa >= 3.5) return 'Second Class Upper';
  if (cgpa >= 2.5) return 'Second Class Lower';
  if (cgpa >= 1.5) return 'Third Class';
  if (cgpa >= 1.0) return 'Pass';
  return 'Fail';
}

/**
 * Get grade color class for UI
 * @param grade - Grade letter
 * @returns Tailwind color class
 */
export function getGradeColor(grade: string): string {
  const colors: Record<string, string> = {
    A: 'text-emerald-600 bg-emerald-50',
    B: 'text-blue-600 bg-blue-50',
    C: 'text-yellow-600 bg-yellow-50',
    D: 'text-orange-600 bg-orange-50',
    E: 'text-red-500 bg-red-50',
    F: 'text-red-700 bg-red-100',
  };
  return colors[grade.toUpperCase()] || 'text-gray-600 bg-gray-50';
}
