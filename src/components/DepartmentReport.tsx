/**
 * Department Report Component
 * Comprehensive report of all students in a department for a specific semester
 */

import { useState, useEffect } from 'react';
import type { FilterState, DepartmentReport as DeptReportType } from '../types';
import { getDepartmentReport } from '../services/dataService';
import { getGradeColor, getClassOfDegree } from '../services/gradeService';

interface DepartmentReportProps {
  filter: FilterState;
  refreshTrigger: number;
}

export function DepartmentReport({ filter, refreshTrigger }: DepartmentReportProps) {
  const [report, setReport] = useState<DeptReportType | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'gpa' | 'cgpa'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Load report data
  useEffect(() => {
    const reportData = getDepartmentReport(
      filter.departmentId,
      filter.level,
      filter.semester
    );
    setReport(reportData);
  }, [filter, refreshTrigger]);

  if (!report) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          No report data available
        </div>
      </div>
    );
  }

  // Sort students
  const sortedStudents = [...report.students].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.student.fullName.localeCompare(b.student.fullName);
        break;
      case 'gpa':
        comparison = a.gpa - b.gpa;
        break;
      case 'cgpa':
        comparison = a.cgpa - b.cgpa;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Calculate stats
  const avgGPA = report.students.length > 0
    ? report.students.reduce((sum, s) => sum + s.gpa, 0) / report.students.length
    : 0;
  const avgCGPA = report.students.length > 0
    ? report.students.reduce((sum, s) => sum + s.cgpa, 0) / report.students.length
    : 0;
  const highestGPA = Math.max(...report.students.map((s) => s.gpa), 0);
  const lowestGPA = report.students.length > 0 ? Math.min(...report.students.map((s) => s.gpa)) : 0;

  // Handle sort
  const handleSort = (column: 'name' | 'gpa' | 'cgpa') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ column }: { column: 'name' | 'gpa' | 'cgpa' }) => (
    <span className="ml-1 inline-flex">
      {sortBy === column ? (
        sortOrder === 'asc' ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )
      ) : (
        <svg className="w-4 h-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )}
    </span>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Department Report</h2>
            <p className="text-sm opacity-80">
              {report.department.name} - {report.level} Level - {report.semester === 1 ? 'First' : 'Second'} Semester
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-sm opacity-80">Students</div>
            <div className="text-2xl font-bold">{report.students.length}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-sm opacity-80">Avg GPA</div>
            <div className="text-2xl font-bold">{avgGPA.toFixed(2)}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-sm opacity-80">Highest GPA</div>
            <div className="text-2xl font-bold">{highestGPA.toFixed(2)}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-sm opacity-80">Lowest GPA</div>
            <div className="text-2xl font-bold">{lowestGPA.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Table */}
      {report.students.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  #
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <span className="flex items-center">
                    Student
                    <SortIcon column="name" />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Matric No
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Courses
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('gpa')}
                >
                  <span className="flex items-center justify-center">
                    Semester GPA
                    <SortIcon column="gpa" />
                  </span>
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('cgpa')}
                >
                  <span className="flex items-center justify-center">
                    CGPA
                    <SortIcon column="cgpa" />
                  </span>
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Class
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedStudents.map((entry, idx) => (
                <tr key={entry.student.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{entry.student.fullName}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{entry.student.matricNo}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {entry.results.slice(0, 4).map((r) => (
                        <span
                          key={r.id}
                          className={`text-xs px-2 py-0.5 rounded ${getGradeColor(r.grade)}`}
                        >
                          {r.courseCode}: {r.grade}
                        </span>
                      ))}
                      {entry.results.length > 4 && (
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                          +{entry.results.length - 4} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold ${
                      entry.gpa >= 4.5 ? 'bg-emerald-100 text-emerald-700' :
                      entry.gpa >= 3.5 ? 'bg-blue-100 text-blue-700' :
                      entry.gpa >= 2.5 ? 'bg-yellow-100 text-yellow-700' :
                      entry.gpa >= 1.5 ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {entry.gpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold ${
                      entry.cgpa >= 4.5 ? 'bg-emerald-100 text-emerald-700' :
                      entry.cgpa >= 3.5 ? 'bg-blue-100 text-blue-700' :
                      entry.cgpa >= 2.5 ? 'bg-yellow-100 text-yellow-700' :
                      entry.cgpa >= 1.5 ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {entry.cgpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-gray-600">{getClassOfDegree(entry.cgpa)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          No students have results for this semester yet
        </div>
      )}

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Report generated on {new Date().toLocaleDateString()}</span>
          <span>Average CGPA: {avgCGPA.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
