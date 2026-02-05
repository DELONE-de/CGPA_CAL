# Backend Architecture Documentation

## Overview
This document describes the full backend architecture for the Academic GPA & CGPA Processing System.
The current frontend simulates this backend using localStorage for demonstration purposes.

---

## Folder Structure (Production)

```
academic-gpa-system/
├── frontend/                    # Next.js Frontend
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Main dashboard
│   │   ├── score-entry/
│   │   │   └── page.tsx
│   │   ├── gpa/
│   │   │   └── page.tsx
│   │   ├── cgpa/
│   │   │   └── page.tsx
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   └── students/
│   │       └── page.tsx
│   ├── components/
│   │   ├── Selector.tsx
│   │   ├── ScoreEntry.tsx
│   │   ├── GPADisplay.tsx
│   │   ├── DepartmentReport.tsx
│   │   └── StudentManagement.tsx
│   ├── lib/
│   │   ├── api.ts              # Axios API client
│   │   └── gradeUtils.ts       # Client-side grade utilities
│   ├── types/
│   │   └── index.ts
│   └── package.json
│
├── backend/                     # Express.js Backend
│   ├── src/
│   │   ├── index.ts            # Entry point
│   │   ├── app.ts              # Express app setup
│   │   ├── routes/
│   │   │   ├── index.ts
│   │   │   ├── departments.ts
│   │   │   ├── courses.ts
│   │   │   ├── curriculum.ts
│   │   │   ├── students.ts
│   │   │   ├── results.ts
│   │   │   └── reports.ts
│   │   ├── controllers/
│   │   │   ├── departmentController.ts
│   │   │   ├── courseController.ts
│   │   │   ├── curriculumController.ts
│   │   │   ├── studentController.ts
│   │   │   ├── resultController.ts
│   │   │   └── reportController.ts
│   │   ├── services/
│   │   │   ├── gpaService.ts   # GPA calculation engine
│   │   │   └── cgpaService.ts  # CGPA calculation engine
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts
│   │   │   ├── validation.ts
│   │   │   └── cors.ts
│   │   └── utils/
│   │       └── gradeConverter.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json
│
└── docker-compose.yml          # PostgreSQL + Backend + Frontend
```

---

## Prisma Schema (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Department Model
model Department {
  id          String       @id @default(uuid())
  code        String       @unique
  name        String
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  
  students    Student[]
  curriculum  Curriculum[]
}

// Course Model
model Course {
  id          String       @id @default(uuid())
  courseCode  String       @unique
  courseTitle String
  courseUnit  Int
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  
  curriculum  Curriculum[]
}

// Curriculum - Links courses to department/level/semester
model Curriculum {
  id           String     @id @default(uuid())
  departmentId String
  level        Int
  semester     Int
  courseId     String
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  
  department   Department @relation(fields: [departmentId], references: [id])
  course       Course     @relation(fields: [courseId], references: [id])
  
  @@unique([departmentId, level, semester, courseId])
  @@index([departmentId, level, semester])
}

// Student Model
model Student {
  id           String     @id @default(uuid())
  matricNo     String     @unique
  fullName     String
  departmentId String
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  
  department   Department @relation(fields: [departmentId], references: [id])
  results      Result[]
}

// Result Model - Individual course results
model Result {
  id          String    @id @default(uuid())
  studentId   String
  level       Int
  semester    Int
  courseCode  String
  courseUnit  Int
  score       Int
  grade       String
  gradePoint  Int
  pxu         Int       // Point × Unit
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  student     Student   @relation(fields: [studentId], references: [id])
  
  @@unique([studentId, level, semester, courseCode])
  @@index([studentId])
  @@index([studentId, level, semester])
}
```

---

## Express Server Setup (backend/src/app.ts)

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

export default app;
```

---

## API Controllers

### Result Controller (backend/src/controllers/resultController.ts)

```typescript
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { scoreToGrade, scoreToPoint, calculatePXU } from '../services/gpaService';

const prisma = new PrismaClient();

export const createResults = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { entries } = req.body;
    
    const results = await Promise.all(
      entries.map(async (entry: any) => {
        // Auto-calculate grade, point, and PXU
        const grade = scoreToGrade(entry.score);
        const gradePoint = scoreToPoint(entry.score);
        const pxu = calculatePXU(gradePoint, entry.courseUnit);
        
        return prisma.result.upsert({
          where: {
            studentId_level_semester_courseCode: {
              studentId: entry.studentId,
              level: entry.level,
              semester: entry.semester,
              courseCode: entry.courseCode,
            },
          },
          update: {
            score: entry.score,
            grade,
            gradePoint,
            pxu,
          },
          create: {
            studentId: entry.studentId,
            level: entry.level,
            semester: entry.semester,
            courseCode: entry.courseCode,
            courseUnit: entry.courseUnit,
            score: entry.score,
            grade,
            gradePoint,
            pxu,
          },
        });
      })
    );
    
    res.status(201).json({
      success: true,
      data: results,
      message: `Saved ${results.length} results with auto-calculated grades`,
    });
  } catch (error) {
    next(error);
  }
};
```

---

## GPA Service (backend/src/services/gpaService.ts)

```typescript
// Grading Scale (5-Point System)
const GRADING_SCALE = [
  { minScore: 70, maxScore: 100, grade: 'A', point: 5 },
  { minScore: 60, maxScore: 69, grade: 'B', point: 4 },
  { minScore: 50, maxScore: 59, grade: 'C', point: 3 },
  { minScore: 45, maxScore: 49, grade: 'D', point: 2 },
  { minScore: 40, maxScore: 44, grade: 'E', point: 1 },
  { minScore: 0, maxScore: 39, grade: 'F', point: 0 },
];

export function scoreToGrade(score: number): string {
  const entry = GRADING_SCALE.find(
    (g) => score >= g.minScore && score <= g.maxScore
  );
  return entry?.grade || 'F';
}

export function scoreToPoint(score: number): number {
  const entry = GRADING_SCALE.find(
    (g) => score >= g.minScore && score <= g.maxScore
  );
  return entry?.point || 0;
}

export function calculatePXU(gradePoint: number, courseUnit: number): number {
  return gradePoint * courseUnit;
}

export function calculateGPA(
  results: { gradePoint: number; courseUnit: number }[]
): { gpa: number; totalUnits: number; totalPoints: number } {
  const totalUnits = results.reduce((sum, r) => sum + r.courseUnit, 0);
  const totalPoints = results.reduce(
    (sum, r) => sum + r.gradePoint * r.courseUnit,
    0
  );
  
  return {
    gpa: totalUnits > 0 ? Math.round((totalPoints / totalUnits) * 100) / 100 : 0,
    totalUnits,
    totalPoints,
  };
}
```

---

## CGPA Service (backend/src/services/cgpaService.ts)

```typescript
import { PrismaClient } from '@prisma/client';
import { calculateGPA } from './gpaService';

const prisma = new PrismaClient();

export async function calculateStudentCGPA(studentId: string) {
  // Fetch all results for the student
  const results = await prisma.result.findMany({
    where: { studentId },
    orderBy: [{ level: 'asc' }, { semester: 'asc' }],
  });
  
  if (results.length === 0) {
    return null;
  }
  
  // Group by semester
  const semesterGroups = new Map<string, typeof results>();
  results.forEach((result) => {
    const key = `${result.level}-${result.semester}`;
    if (!semesterGroups.has(key)) {
      semesterGroups.set(key, []);
    }
    semesterGroups.get(key)!.push(result);
  });
  
  // Calculate GPA for each semester
  const semesterGPAs = Array.from(semesterGroups.entries()).map(([key, semResults]) => {
    const [level, semester] = key.split('-').map(Number);
    const { gpa, totalUnits, totalPoints } = calculateGPA(semResults);
    return { level, semester, gpa, totalUnits, totalPoints, results: semResults };
  });
  
  // Calculate CGPA
  const totalUnits = semesterGPAs.reduce((sum, s) => sum + s.totalUnits, 0);
  const totalPoints = semesterGPAs.reduce((sum, s) => sum + s.totalPoints, 0);
  const cgpa = totalUnits > 0 ? Math.round((totalPoints / totalUnits) * 100) / 100 : 0;
  
  return {
    studentId,
    semesterGPAs,
    totalUnits,
    totalPoints,
    cgpa,
  };
}
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/departments | List all departments |
| GET | /api/courses | List all courses |
| GET | /api/curriculum | Get curriculum (query: departmentId, level, semester) |
| GET | /api/students | List students (query: departmentId) |
| POST | /api/students | Create new student |
| POST | /api/results | Save results (auto-calculates grades) |
| GET | /api/gpa/:studentId | Get student GPA (query: level, semester) |
| GET | /api/cgpa/:studentId | Get student CGPA |
| GET | /api/reports/department | Get department report (query: departmentId, level, semester) |

---

## Setup Instructions

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb academic_gpa_system

# Set environment variable
export DATABASE_URL="postgresql://user:password@localhost:5432/academic_gpa_system"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install express cors helmet prisma @prisma/client zod
npm install -D typescript @types/express @types/node ts-node-dev

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npx prisma db seed

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install next react react-dom axios react-hook-form tailwindcss

# Start development server
npm run dev
```

---

## API Integration Example

```typescript
// frontend/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
});

export const getDepartments = () => api.get('/departments');
export const getCurriculum = (departmentId: string, level: number, semester: number) =>
  api.get('/curriculum', { params: { departmentId, level, semester } });
export const saveResults = (entries: any[]) => api.post('/results', { entries });
export const getStudentGPA = (studentId: string, level?: number, semester?: number) =>
  api.get(`/gpa/${studentId}`, { params: { level, semester } });
export const getStudentCGPA = (studentId: string) => api.get(`/cgpa/${studentId}`);
export const getDepartmentReport = (departmentId: string, level: number, semester: number) =>
  api.get('/reports/department', { params: { departmentId, level, semester } });
```

---

## Business Logic Flow

```
1. HOD selects Department → Level → Semester
2. System fetches curriculum (courses for that context)
3. Table auto-populates with Course Code and Course Unit
4. HOD inputs ONLY student scores (0-100)
5. Backend automatically:
   - Converts score → grade (A-F)
   - Converts grade → grade point (0-5)
   - Calculates PXU (point × unit)
   - Calculates semester GPA
   - Saves all results
6. System calculates CGPA using all historical data
7. System generates full GPA report for selected department
```

---

## Grading Scale Reference

| Score Range | Grade | Grade Point |
|-------------|-------|-------------|
| 70-100 | A | 5 |
| 60-69 | B | 4 |
| 50-59 | C | 3 |
| 45-49 | D | 2 |
| 40-44 | E | 1 |
| 0-39 | F | 0 |

---

## Formulas

- **PXU** = Grade Point × Course Unit
- **GPA** = Sum(PXU) / Sum(Units)
- **CGPA** = Sum(All PXU) / Sum(All Units)
