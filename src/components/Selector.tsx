/**
 * Department/Level/Semester Selector Component
 * HOD selects the academic context for score entry
 */

import { useState, useEffect } from 'react';
import type { Department, FilterState } from '../types';
import { getDepartments } from '../services/dataService';

interface SelectorProps {
  onSelect: (filter: FilterState) => void;
  selectedFilter: FilterState | null;
}

// Available levels and semesters
const LEVELS = [100, 200, 300, 400, 500];
const SEMESTERS = [
  { value: 1, label: 'First Semester' },
  { value: 2, label: 'Second Semester' },
];

export function Selector({ onSelect, selectedFilter }: SelectorProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentId, setDepartmentId] = useState('');
  const [level, setLevel] = useState<number>(0);
  const [semester, setSemester] = useState<number>(0);

  // Load departments on mount
  useEffect(() => {
    const depts = getDepartments();
    setDepartments(depts);
  }, []);

  // Update local state when selectedFilter changes
  useEffect(() => {
    if (selectedFilter) {
      setDepartmentId(selectedFilter.departmentId);
      setLevel(selectedFilter.level);
      setSemester(selectedFilter.semester);
    }
  }, [selectedFilter]);

  // Handle selection
  const handleApply = () => {
    if (departmentId && level && semester) {
      onSelect({ departmentId, level, semester });
    }
  };

  const isComplete = departmentId && level && semester;
  const selectedDept = departments.find((d) => d.id === departmentId);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Academic Context</h2>
          <p className="text-sm text-gray-500">Select department, level, and semester</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Department Select */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition-all"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.code} - {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Level Select */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Level
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition-all"
          >
            <option value={0}>Select Level</option>
            {LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl} Level
              </option>
            ))}
          </select>
        </div>

        {/* Semester Select */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Semester
          </label>
          <select
            value={semester}
            onChange={(e) => setSemester(Number(e.target.value))}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition-all"
          >
            <option value={0}>Select Semester</option>
            {SEMESTERS.map((sem) => (
              <option key={sem.value} value={sem.value}>
                {sem.label}
              </option>
            ))}
          </select>
        </div>

        {/* Apply Button */}
        <div className="flex items-end">
          <button
            onClick={handleApply}
            disabled={!isComplete}
            className={`w-full px-6 py-2.5 rounded-lg font-medium transition-all ${
              isComplete
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Load Curriculum
          </button>
        </div>
      </div>

      {/* Current Selection Display */}
      {selectedFilter && selectedDept && (
        <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <div className="flex items-center gap-2 text-indigo-800">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">
              Currently viewing: {selectedDept.name} - {selectedFilter.level} Level - 
              {selectedFilter.semester === 1 ? ' First' : ' Second'} Semester
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
