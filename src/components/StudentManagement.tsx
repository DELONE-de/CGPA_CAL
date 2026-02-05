/**
 * Student Management Component
 * Add and manage students
 */

import { useState, useEffect } from 'react';
import type { Department, Student } from '../types';
import { getDepartments, getStudents, createStudent } from '../services/dataService';

interface StudentManagementProps {
  onStudentAdded: () => void;
}

export function StudentManagement({ onStudentAdded }: StudentManagementProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDept, setSelectedDept] = useState('');
  
  // Form state
  const [matricNo, setMatricNo] = useState('');
  const [fullName, setFullName] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load data
  useEffect(() => {
    setDepartments(getDepartments());
    loadStudents();
  }, []);

  const loadStudents = () => {
    setStudents(getStudents(selectedDept || undefined));
  };

  useEffect(() => {
    loadStudents();
  }, [selectedDept]);

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!matricNo.trim() || !fullName.trim() || !departmentId) {
      setError('All fields are required');
      return;
    }

    try {
      createStudent({
        matricNo: matricNo.trim(),
        fullName: fullName.trim(),
        departmentId,
      });

      setSuccess('Student added successfully!');
      setMatricNo('');
      setFullName('');
      setDepartmentId('');
      loadStudents();
      onStudentAdded();

      setTimeout(() => {
        setSuccess('');
        setShowForm(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add student');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Student Management</h2>
              <p className="text-sm text-gray-500">{students.length} students registered</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              showForm
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {showForm ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Student
              </>
            )}
          </button>
        </div>

        {/* Add Student Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-4">New Student</h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Matric Number</label>
                <input
                  type="text"
                  value={matricNo}
                  onChange={(e) => setMatricNo(e.target.value)}
                  placeholder="e.g., CSC/2023/001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.code} - {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Add Student
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Filter by Department */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.code} - {dept.name}
            </option>
          ))}
        </select>
      </div>

      {/* Student List */}
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">#</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Matric No</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Full Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((student, idx) => (
              <tr key={student.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                <td className="px-4 py-3 text-sm font-mono text-gray-900">{student.matricNo}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.fullName}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {student.department?.code || departments.find(d => d.id === student.departmentId)?.code}
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
