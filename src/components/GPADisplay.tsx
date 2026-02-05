/**
 * GPA/CGPA Display Component
 * Shows individual student's GPA and CGPA
 */

import { useState, useEffect } from 'react';
import type { Student, FilterState, GPAResponse, CGPAResponse } from '../types';
import { getStudents, getStudentGPA, getStudentCGPA } from '../services/dataService';
import { getGradeColor, getClassOfDegree } from '../services/gradeService';

interface GPADisplayProps {
  filter: FilterState;
  refreshTrigger: number;
}

export function GPADisplay({ filter, refreshTrigger }: GPADisplayProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [gpaData, setGpaData] = useState<GPAResponse | null>(null);
  const [cgpaData, setCgpaData] = useState<CGPAResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'gpa' | 'cgpa'>('gpa');

  // Load students
  useEffect(() => {
    const studentData = getStudents(filter.departmentId);
    setStudents(studentData);
    if (studentData.length > 0 && !selectedStudent) {
      setSelectedStudent(studentData[0].id);
    }
  }, [filter.departmentId]);

  // Load GPA/CGPA data when student or refresh changes
  useEffect(() => {
    if (selectedStudent) {
      const gpa = getStudentGPA(selectedStudent, filter.level, filter.semester);
      setGpaData(gpa);

      const cgpa = getStudentCGPA(selectedStudent);
      setCgpaData(cgpa);
    }
  }, [selectedStudent, filter.level, filter.semester, refreshTrigger]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">GPA & CGPA Display</h2>
            <p className="text-sm text-gray-500">View student academic performance</p>
          </div>
        </div>

        {/* Student Selector */}
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
        >
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.fullName} ({student.matricNo})
            </option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('gpa')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'gpa'
              ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Semester GPA
        </button>
        <button
          onClick={() => setActiveTab('cgpa')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'cgpa'
              ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Cumulative GPA
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {!selectedStudent && (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Select a student to view their academic performance
          </div>
        )}

        {/* GPA Tab */}
        {activeTab === 'gpa' && selectedStudent && (
          <div>
            {gpaData ? (
              <div className="space-y-4">
                {/* GPA Card */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
                  <div className="text-sm opacity-80 mb-1">Semester GPA</div>
                  <div className="text-4xl font-bold">{gpaData.gpa.toFixed(2)}</div>
                  <div className="text-sm opacity-80 mt-2">
                    {filter.level} Level - {filter.semester === 1 ? 'First' : 'Second'} Semester
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">Total Units</div>
                    <div className="text-2xl font-bold text-gray-900">{gpaData.totalUnits}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">Total Points</div>
                    <div className="text-2xl font-bold text-gray-900">{gpaData.totalPoints}</div>
                  </div>
                </div>

                {/* Results Table */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Course Breakdown</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Course</th>
                          <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">Unit</th>
                          <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">Score</th>
                          <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">Grade</th>
                          <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">Point</th>
                          <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">PXU</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {gpaData.results.map((result) => (
                          <tr key={result.id}>
                            <td className="px-3 py-2 font-medium">{result.courseCode}</td>
                            <td className="px-3 py-2 text-center">{result.courseUnit}</td>
                            <td className="px-3 py-2 text-center">{result.score}</td>
                            <td className="px-3 py-2 text-center">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getGradeColor(result.grade)}`}>
                                {result.grade}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-center">{result.gradePoint}</td>
                            <td className="px-3 py-2 text-center font-medium">{result.pxu}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                No results found for this semester
              </div>
            )}
          </div>
        )}

        {/* CGPA Tab */}
        {activeTab === 'cgpa' && selectedStudent && (
          <div>
            {cgpaData ? (
              <div className="space-y-4">
                {/* Student Info */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-lg">
                    {cgpaData.student.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{cgpaData.student.fullName}</div>
                    <div className="text-sm text-gray-500">{cgpaData.student.matricNo}</div>
                  </div>
                </div>

                {/* CGPA Card */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
                  <div className="text-sm opacity-80 mb-1">Cumulative GPA</div>
                  <div className="text-4xl font-bold">{cgpaData.cgpa.toFixed(2)}</div>
                  <div className="text-sm opacity-80 mt-2">{getClassOfDegree(cgpaData.cgpa)}</div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">Semesters</div>
                    <div className="text-2xl font-bold text-gray-900">{cgpaData.semesterGPAs.length}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">Total Units</div>
                    <div className="text-2xl font-bold text-gray-900">{cgpaData.totalUnits}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">Total Points</div>
                    <div className="text-2xl font-bold text-gray-900">{cgpaData.totalPoints}</div>
                  </div>
                </div>

                {/* Semester Breakdown */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Semester Breakdown</h4>
                  <div className="space-y-2">
                    {cgpaData.semesterGPAs.map((sem) => (
                      <div
                        key={`${sem.level}-${sem.semester}`}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <span className="font-medium text-gray-900">
                            {sem.level} Level - {sem.semester === 1 ? 'First' : 'Second'} Semester
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({sem.results.length} courses, {sem.totalUnits} units)
                          </span>
                        </div>
                        <div className="text-lg font-bold text-purple-600">{sem.gpa.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                No academic history found for this student
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
