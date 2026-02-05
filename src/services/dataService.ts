/**
 * Data Service - Simulates Backend API with localStorage persistence
 * In production, this would be replaced with actual API calls to Express backend
 */

import type {
  Department,
  Course,
  Curriculum,
  Student,
  Result,
  GPAResponse,
  CGPAResponse,
  DepartmentReport,
} from '../types';
import {
  scoreToGrade,
  scoreToPoint,
  calculatePXU,
  calculateGPA,
  calculateCGPA,
} from './gradeService';

// Storage Keys
const STORAGE_KEYS = {
  DEPARTMENTS: 'gpa_departments',
  COURSES: 'gpa_courses',
  CURRICULUM: 'gpa_curriculum',
  STUDENTS: 'gpa_students',
  RESULTS: 'gpa_results',
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ============================================
// SEED DATA - Initial data for the system
// ============================================

export function seedInitialData(): void {
  // Check if already seeded
  if (localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) {
    return;
  }

  // Departments
  const departments: Department[] = [
    { id: 'dept1', code: 'ITH', name: 'Information Technology and Health Informatics' },
    { id: 'dept2', code: 'HIM', name: 'Health Information Management' },
  ];

  // Courses
  const courses: Course[] = [
    // Computer Science Courses
    { id: 'crs1', courseCode: 'GST111', courseTitle: 'Introduction to English', courseUnit: 2 },
    { id: 'crs2', courseCode: 'PHY107', courseTitle: 'Physics Practical', courseUnit: 1 },
    { id: 'crs3', courseCode: 'BIO101', courseTitle: 'Biology', courseUnit: 2 },
    { id: 'crs4', courseCode: 'CHM107', courseTitle: 'Chemistry Practical', courseUnit: 1 },
    { id: 'crs5', courseCode: 'COS101', courseTitle: 'Computer in the society', courseUnit: 3 },
    { id: 'crs6', courseCode: 'CHM101', courseTitle: 'Chemistry I', courseUnit: 2 },
    { id: 'crs7', courseCode: 'MTH101', courseTitle: 'Elementary Mathematics ', courseUnit: 2 },
    { id: 'crs8', courseCode: 'BIO107', courseTitle: 'Biology Practical', courseUnit: 1},
    { id: 'crs9', courseCode: 'STA111', courseTitle: 'Descriptive Statistics', courseUnit: 3 },
    { id: 'crs10', courseCode: 'FRN197', courseTitle: 'French I', courseUnit: 2 },
    { id: 'crs11', courseCode: 'PHY101', courseTitle: 'General Physics I', courseUnit: 2 },
    { id: 'crs12', courseCode: 'LIS199', courseTitle: 'Library Skills', courseUnit: 1 },
    { id: 'crs13', courseCode: 'CSC204', courseTitle: 'Discrete Mathematics', courseUnit: 3 },
    { id: 'crs14', courseCode: 'CSC205', courseTitle: 'Computer Organization', courseUnit: 3 },
    { id: 'crs15', courseCode: 'CSC206', courseTitle: 'Operating Systems', courseUnit: 3 },
    { id: 'crs16', courseCode: 'CSC301', courseTitle: 'Database Management Systems', courseUnit: 3 },
    { id: 'crs17', courseCode: 'CSC302', courseTitle: 'Software Engineering', courseUnit: 3 },
    { id: 'crs18', courseCode: 'CSC303', courseTitle: 'Computer Networks', courseUnit: 3 },
    { id: 'crs19', courseCode: 'CSC304', courseTitle: 'Algorithm Analysis', courseUnit: 3 },
    { id: 'crs20', courseCode: 'CSC305', courseTitle: 'Web Development', courseUnit: 3 },
    { id: 'crs21', courseCode: 'CSC306', courseTitle: 'Artificial Intelligence', courseUnit: 3 },
  ];

  // Curriculum - Mapping courses to departments/levels/semesters
  const curriculum: Curriculum[] = [
    // ITH 100 Level First Semester
    { id: 'cur1', departmentId: 'dept1', level: 100, semester: 1, courseId: 'crs1' },
    { id: 'cur2', departmentId: 'dept1', level: 100, semester: 1, courseId: 'crs2' },
    { id: 'cur3', departmentId: 'dept1', level: 100, semester: 1, courseId: 'crs3' },
    { id: 'cur4', departmentId: 'dept1', level: 100, semester: 1, courseId: 'crs4' },
    { id: 'cur5', departmentId: 'dept1', level: 100, semester: 1, courseId: 'crs5' },
    { id: 'cur6', departmentId: 'dept1', level: 100, semester: 1, courseId: 'crs6' },
    { id: 'cur7', departmentId: 'dept1', level: 100, semester: 1, courseId: 'crs7' },
    { id: 'cur8', departmentId: 'dept1', level: 100, semester: 1, courseId: 'crs8' },
    { id: 'cur9', departmentId: 'dept1', level: 100, semester: 1, courseId: 'crs9' },
    { id: 'cur5', departmentId: 'dept1', level: 100, semester: 1, courseId: 'crs10' },
    { id: 'cur6', departmentId: 'dept1', level: 100, semester: 1, courseId: 'crs11' },
    { id: 'cur7', departmentId: 'dept1', level: 100, semester: 1, courseId: 'crs12' },
    // HIM 100 Level Second Semester
    { id: 'cur1', departmentId: 'dept2', level: 100, semester: 1, courseId: 'crs1' },
    { id: 'cur2', departmentId: 'dept2', level: 100, semester: 1, courseId: 'crs2' },
    { id: 'cur3', departmentId: 'dept2', level: 100, semester: 1, courseId: 'crs3' },
    { id: 'cur4', departmentId: 'dept2', level: 100, semester: 1, courseId: 'crs4' },
    { id: 'cur5', departmentId: 'dept2', level: 100, semester: 1, courseId: 'crs5' },
    { id: 'cur6', departmentId: 'dept2', level: 100, semester: 1, courseId: 'crs6' },
    { id: 'cur7', departmentId: 'dept2', level: 100, semester: 1, courseId: 'crs7' },
    { id: 'cur8', departmentId: 'dept2', level: 100, semester: 1, courseId: 'crs8' },
    { id: 'cur9', departmentId: 'dept2', level: 100, semester: 1, courseId: 'crs9' },
    { id: 'cur5', departmentId: 'dept2', level: 100, semester: 1, courseId: 'crs10' },
    { id: 'cur6', departmentId: 'dept2', level: 100, semester: 1, courseId: 'crs11' },
    { id: 'cur7', departmentId: 'dept2', level: 100, semester: 1, courseId: 'crs12' },
    // ITH 200 Level First Semester
    { id: 'cur10', departmentId: 'dept1', level: 200, semester: 1, courseId: 'crs10' },
    { id: 'cur11', departmentId: 'dept1', level: 200, semester: 1, courseId: 'crs12' },
    { id: 'cur12', departmentId: 'dept1', level: 200, semester: 1, courseId: 'crs13' },
    { id: 'cur13', departmentId: 'dept1', level: 200, semester: 1, courseId: 'crs14' },
    // HIM 200 Level Second Semester
    { id: 'cur14', departmentId: 'dept2', level: 200, semester: 2, courseId: 'crs11' },
    { id: 'cur15', departmentId: 'dept2', level: 200, semester: 2, courseId: 'crs15' },
    // ITH 300 Level First Semester
    { id: 'cur16', departmentId: 'dept1', level: 300, semester: 1, courseId: 'crs16' },
    { id: 'cur17', departmentId: 'dept1', level: 300, semester: 1, courseId: 'crs17' },
    { id: 'cur18', departmentId: 'dept1', level: 300, semester: 1, courseId: 'crs18' },
    { id: 'cur19', departmentId: 'dept1', level: 300, semester: 1, courseId: 'crs19' },
    // HIM 300 Level Second Semester
    { id: 'cur20', departmentId: 'dept2', level: 300, semester: 2, courseId: 'crs20' },
    { id: 'cur21', departmentId: 'dept2', level: 300, semester: 2, courseId: 'crs21' },
  ];

  // Students
  const students: Student[] = [
    { id: 'std1', matricNo: '2025/1111', fullName: 'John Adebayo', departmentId: 'dept1' },
    { id: 'std2', matricNo: '2025/2222', fullName: 'Mary Okonkwo', departmentId: 'dept1' },
    { id: 'std3', matricNo: '2025/3333', fullName: 'David Emeka', departmentId: 'dept1' },
    { id: 'std4', matricNo: '2025/4444', fullName: 'Sarah Ibrahim', departmentId: 'dept1' },
    { id: 'std5', matricNo: '2025/5555', fullName: 'Michael Obi', departmentId: 'dept2' },
    { id: 'std6', matricNo: '2025/6666', fullName: 'Grace Adeleke', departmentId: 'dept2' },
    { id: 'std7', matricNo: '2025/7777', fullName: 'Peter Nnamdi', departmentId: 'dept2' },
  ];

  // Save all data
  saveToStorage(STORAGE_KEYS.DEPARTMENTS, departments);
  saveToStorage(STORAGE_KEYS.COURSES, courses);
  saveToStorage(STORAGE_KEYS.CURRICULUM, curriculum);
  saveToStorage(STORAGE_KEYS.STUDENTS, students);
  saveToStorage(STORAGE_KEYS.RESULTS, []);
}

// ============================================
// API ENDPOINTS SIMULATION
// ============================================

// GET /departments
export function getDepartments(): Department[] {
  return getFromStorage<Department[]>(STORAGE_KEYS.DEPARTMENTS, []);
}

// GET /courses
export function getCourses(): Course[] {
  return getFromStorage<Course[]>(STORAGE_KEYS.COURSES, []);
}

// GET /curriculum?department=&level=&semester=
export function getCurriculum(
  departmentId: string,
  level: number,
  semester: number
): 
(Curriculum & { course: Course })[] {
  const curriculum = getFromStorage<Curriculum[]>(STORAGE_KEYS.CURRICULUM, []);
  const courses = getFromStorage<Course[]>(STORAGE_KEYS.COURSES, []);

  return curriculum
    .filter(
      (c) =>
        c.departmentId === departmentId &&
        c.level === level &&
        c.semester === semester
    )
    .map((c) => ({
      ...c,
      course: courses.find((crs) => crs.id === c.courseId)!,
    }))
    .filter((c) => c.course);
}

// GET /students?department=
export function getStudents(departmentId?: string): Student[] {
  const students = getFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, []);
  const departments = getDepartments();

  const filteredStudents = departmentId
    ? students.filter((s) => s.departmentId === departmentId)
    : students;

  return filteredStudents.map((s) => ({
    ...s,
    department: departments.find((d) => d.id === s.departmentId),
  }));
}

// POST /students
export function createStudent(student: Omit<Student, 'id'>): Student {
  const students = getFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, []);
  
  // Check for duplicate matric number
  if (students.some((s) => s.matricNo === student.matricNo)) {
    throw new Error('Student with this matric number already exists');
  }

  const newStudent: Student = {
    ...student,
    id: generateId(),
  };

  students.push(newStudent);
  saveToStorage(STORAGE_KEYS.STUDENTS, students);

  return newStudent;
}

// POST /results - Save results with automatic grade calculation
export function saveResults(
  entries: {
    studentId: string;
    level: number;
    semester: number;
    courseCode: string;
    courseUnit: number;
    score: number;
  }[]
)
: Result[] {
  const results = getFromStorage<Result[]>(STORAGE_KEYS.RESULTS, []);
  const savedResults: Result[] = [];

  for (const entry of entries) {
    // Validate score
    if (entry.score < 0 || entry.score > 100) {
      throw new Error(`Invalid score ${entry.score} for course ${entry.courseCode}`);
    }

    // Calculate grade, grade point, and PXU
    const grade = scoreToGrade(entry.score);
    const gradePoint = scoreToPoint(entry.score);
    const pxu = calculatePXU(gradePoint, entry.courseUnit);

    // Check if result already exists (update) or create new
    const existingIndex = results.findIndex(
      (r) =>
        r.studentId === entry.studentId &&
        r.level === entry.level &&
        r.semester === entry.semester &&
        r.courseCode === entry.courseCode
    );

    const result: Result = {
      id: existingIndex >= 0 ? results[existingIndex].id : generateId(),
      studentId: entry.studentId,
      level: entry.level,
      semester: entry.semester,
      courseCode: entry.courseCode,
      courseUnit: entry.courseUnit,
      score: entry.score,
      grade,
      gradePoint,
      pxu,
    };

    if (existingIndex >= 0) {
      results[existingIndex] = result;
    } else {
      results.push(result);
    }

    savedResults.push(result);
  }

  saveToStorage(STORAGE_KEYS.RESULTS, results);
  return savedResults;
}

// GET /gpa/:studentId
export function getStudentGPA(
  studentId: string,
  level?: number,
  semester?: number
): GPAResponse | null {
  const results = getFromStorage<Result[]>(STORAGE_KEYS.RESULTS, []);

  let filteredResults = results.filter((r) => r.studentId === studentId);

  if (level !== undefined) {
    filteredResults = filteredResults.filter((r) => r.level === level);
  }

  if (semester !== undefined) {
    filteredResults = filteredResults.filter((r) => r.semester === semester);
  }

  if (filteredResults.length === 0) {
    return null;
  }

  const { gpa, totalUnits, totalPoints } = calculateGPA(
    filteredResults.map((r) => ({
      gradePoint: r.gradePoint,
      courseUnit: r.courseUnit,
    }))
  );

  return {
    studentId,
    level: level || 0,
    semester: semester || 0,
    results: filteredResults,
    totalUnits,
    totalPoints,
    gpa,
  };
}

// GET /cgpa/:studentId
export function getStudentCGPA(studentId: string): CGPAResponse | null {
  const students = getFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, []);
  const results = getFromStorage<Result[]>(STORAGE_KEYS.RESULTS, []);
  const departments = getDepartments();

  const student = students.find((s) => s.id === studentId);
  if (!student) {
    return null;
  }

  const studentResults = results.filter((r) => r.studentId === studentId);

  if (studentResults.length === 0) {
    return null;
  }

  // Group results by level and semester
  const semesterGroups = new Map<string, Result[]>();
  for (const result of studentResults) {
    const key = `${result.level}-${result.semester}`;
    if (!semesterGroups.has(key)) {
      semesterGroups.set(key, []);
    }
    semesterGroups.get(key)!.push(result);
  }

  // Calculate GPA for each semester
  const semesterGPAs: GPAResponse[] = [];
  for (const [key, semResults] of semesterGroups) {
    const [level, semester] = key.split('-').map(Number);
    const { gpa, totalUnits, totalPoints } = calculateGPA(
      semResults.map((r) => ({
        gradePoint: r.gradePoint,
        courseUnit: r.courseUnit,
      }))
    );
    semesterGPAs.push({
      studentId,
      level,
      semester,
      results: semResults,
      totalUnits,
      totalPoints,
      gpa,
    });
  }

  // Calculate CGPA
  const { cgpa, totalUnits, totalPoints } = calculateCGPA(
    semesterGPAs.map((s) => ({
      totalUnits: s.totalUnits,
      totalPoints: s.totalPoints,
    }))
  );

  return {
    studentId,
    student: {
      ...student,
      department: departments.find((d) => d.id === student.departmentId),
    },
    semesterGPAs: semesterGPAs.sort(
      (a, b) => a.level - b.level || a.semester - b.semester
    ),
    totalUnits,
    totalPoints,
    cgpa,
  };
}

// GET /department-report
export function getDepartmentReport(
  departmentId: string,
  level: number,
  semester: number
): DepartmentReport | null {
  const departments = getDepartments();
  const department = departments.find((d) => d.id === departmentId);

  if (!department) {
    return null;
  }

  const students = getStudents(departmentId);
  const results = getFromStorage<Result[]>(STORAGE_KEYS.RESULTS, []);

  const studentReports = students.map((student) => {
    // Get results for this specific semester
    const semesterResults = results.filter(
      (r) =>
        r.studentId === student.id &&
        r.level === level &&
        r.semester === semester
    );

    // Calculate semester GPA
    const { gpa } = calculateGPA(
      semesterResults.map((r) => ({
        gradePoint: r.gradePoint,
        courseUnit: r.courseUnit,
      }))
    );

    // Calculate CGPA (all semesters)
    const allResults = results.filter((r) => r.studentId === student.id);
    const { cgpa } = calculateCGPA([
      {
        totalUnits: allResults.reduce((sum, r) => sum + r.courseUnit, 0),
        totalPoints: allResults.reduce((sum, r) => sum + r.pxu, 0),
      },
    ]);

    return {
      student,
      gpa,
      cgpa,
      results: semesterResults,
    };
  });

  return {
    department,
    level,
    semester,
    students: studentReports.filter((s) => s.results.length > 0),
  };
}

// Get results for a specific student/level/semester
export function getResults(
  studentId: string,
  level: number,
  semester: number
): Result[] {
  const results = getFromStorage<Result[]>(STORAGE_KEYS.RESULTS, []);
  return results.filter(
    (r) =>
      r.studentId === studentId &&
      r.level === level &&
      r.semester === semester
  );
}

// Clear all data (for testing)
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}
