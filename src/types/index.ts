/**
 * Academic GPA & CGPA Processing System
 * Type Definitions - Mirrors Prisma Schema
 */

// Department Model
export interface Department {
  id: string;
  code: string;
  name: string;
}

// Course Model
export interface Course {
  id: string;
  courseCode: string;
  courseTitle: string;
  courseUnit: number;
}

// Curriculum Model - Links courses to department/level/semester
export interface Curriculum {
  id: string;
  departmentId: string;
  level: number;
  semester: number;
  courseId: string;
  course?: Course;
}

// Student Model
export interface Student {
  id: string;
  matricNo: string;
  fullName: string;
  departmentId: string;
  department?: Department;
}

// Result Model - Stores individual course results
export interface Result {
  id: string;
  studentId: string;
  level: number;
  semester: number;
  courseCode: string;
  courseUnit: number;
  score: number;
  grade: string;
  gradePoint: number;
  pxu: number; // Point × Unit
  student?: Student;
}

// GPA Response
export interface GPAResponse {
  studentId: string;
  level: number;
  semester: number;
  results: Result[];
  totalUnits: number;
  totalPoints: number;
  gpa: number;
}

// CGPA Response
export interface CGPAResponse {
  studentId: string;
  student: Student;
  semesterGPAs: GPAResponse[];
  totalUnits: number;
  totalPoints: number;
  cgpa: number;
}

// Department Report
export interface DepartmentReport {
  department: Department;
  level: number;
  semester: number;
  students: {
    student: Student;
    gpa: number;
    cgpa: number;
    results: Result[];
  }[];
}

// Score Entry for form
export interface ScoreEntry {
  studentId: string;
  courseCode: string;
  courseUnit: number;
  score: number;
}

// Form State
export interface FilterState {
  departmentId: string;
  level: number;
  semester: number;
}
