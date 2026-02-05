/**
 * Score Entry Component
 * HOD inputs student scores, system auto-calculates grades
 */

import { useState, useEffect, useCallback } from 'react';
import type { FilterState, Student, Curriculum, Course } from '../types';
import {
  getCurriculum,
  getStudents,
  saveResults,
  getResults,
} from '../services/dataService';
import { scoreToGrade, scoreToPoint, getGradeColor } from '../services/gradeService';

interface ScoreEntryProps {
  filter: FilterState;
  onResultsSaved: () => void;
}

interface ScoreData {
  [studentId: string]: {
    [courseCode: string]: number | '';
  };
}

export function ScoreEntry({ filter, onResultsSaved }: ScoreEntryProps) {
  const [curriculum, setCurriculum] = useState<(Curriculum & { course: Course })[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [scores, setScores] = useState<ScoreData>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load curriculum and students when filter changes
  useEffect(() => {
    const curriculumData = getCurriculum(
      filter.departmentId,
      filter.level,
      filter.semester
    );
    setCurriculum(curriculumData);

    const studentData = getStudents(filter.departmentId);
    setStudents(studentData);

    // Load existing results
    const initialScores: ScoreData = {};
    studentData.forEach((student) => {
      initialScores[student.id] = {};
      const existingResults = getResults(
        student.id,
        filter.level,
        filter.semester
      );
      curriculumData.forEach((curr) => {
        const existingResult = existingResults.find(
          (r) => r.courseCode === curr.course.courseCode
        );
        initialScores[student.id][curr.course.courseCode] =
          existingResult?.score ?? '';
      });
    });
    setScores(initialScores);
  }, [filter]);

  // Handle score input change
  const handleScoreChange = useCallback(
    (studentId: string, courseCode: string, value: string) => {
      const numValue = value === '' ? '' : Math.min(100, Math.max(0, parseInt(value) || 0));
      setScores((prev) => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [courseCode]: numValue,
        },
      }));
    },
    []
  );

  // Save all results
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const entries: {
        studentId: string;
        level: number;
        semester: number;
        courseCode: string;
        courseUnit: number;
        score: number;
      }[] = [];

      // Build entries from scores
      Object.entries(scores).forEach(([studentId, courseScores]) => {
        Object.entries(courseScores).forEach(([courseCode, score]) => {
          if (score !== '') {
            const course = curriculum.find(
              (c) => c.course.courseCode === courseCode
            )?.course;
            if (course) {
              entries.push({
                studentId,
                level: filter.level,
                semester: filter.semester,
                courseCode,
                courseUnit: course.courseUnit,
                score: score as number,
              });
            }
          }
        });
      });

      if (entries.length === 0) {
        setMessage({ type: 'error', text: 'No scores entered to save' });
        setSaving(false);
        return;
      }

      saveResults(entries);
      setMessage({
        type: 'success',
        text: `Successfully saved ${entries.length} results with auto-calculated grades!`,
      });
      onResultsSaved();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to save results',
      });
    }

    setSaving(false);
  };

  // Get live preview of grade
  const getGradePreview = (score: number | ''): { grade: string; point: number } | null => {
    if (score === '' || score < 0 || score > 100) return null;
    return {
      grade: scoreToGrade(score),
      point: scoreToPoint(score),
    };
  };

  if (curriculum.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Curriculum Found</h3>
          <p className="text-gray-500">
            No courses are registered for this department, level, and semester combination.
          </p>
        </div>
      </div>
    );
  }

  const totalUnits = curriculum.reduce((sum, c) => sum + c.course.courseUnit, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Score Entry</h2>
              <p className="text-sm text-gray-500">
                {curriculum.length} courses • {totalUnits} total units • {students.length} students
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
              saving
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg'
            }`}
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save All Results
              </>
            )}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {message.text}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="sticky left-0 bg-gray-50 px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 z-10">
                Student
              </th>
              {curriculum.map((curr) => (
                <th
                  key={curr.id}
                  className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 min-w-[120px]"
                >
                  <div>{curr.course.courseCode}</div>
                  <div className="font-normal text-gray-400 mt-1">
                    ({curr.course.courseUnit} units)
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((student, idx) => (
              <tr key={student.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="sticky left-0 bg-inherit px-4 py-3 border-r border-gray-100 z-10">
                  <div className="font-medium text-gray-900">{student.fullName}</div>
                  <div className="text-xs text-gray-500">{student.matricNo}</div>
                </td>
                {curriculum.map((curr) => {
                  const score = scores[student.id]?.[curr.course.courseCode] ?? '';
                  const preview = getGradePreview(score);
                  return (
                    <td key={curr.id} className="px-3 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={score}
                          onChange={(e) =>
                            handleScoreChange(
                              student.id,
                              curr.course.courseCode,
                              e.target.value
                            )
                          }
                          className="w-20 px-2 py-1.5 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                          placeholder="Score"
                        />
                        {preview && (
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded ${getGradeColor(
                              preview.grade
                            )}`}
                          >
                            {preview.grade} ({preview.point})
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Grading Scale Reference */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Grading Scale (5-Point System)</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { range: '70-100', grade: 'A', point: 5 },
            { range: '60-69', grade: 'B', point: 4 },
            { range: '50-59', grade: 'C', point: 3 },
            { range: '45-49', grade: 'D', point: 2 },
            { range: '40-44', grade: 'E', point: 1 },
            { range: '0-39', grade: 'F', point: 0 },
          ].map((item) => (
            <span
              key={item.grade}
              className={`text-xs px-3 py-1 rounded-full ${getGradeColor(item.grade)}`}
            >
              {item.range} = {item.grade} = {item.point}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
