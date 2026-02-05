/**
 * Academic GPA & CGPA Processing System - HOD Edition
 * Main Application Component
 * 
 * This is a complete production-ready frontend that simulates
 * the full Express + PostgreSQL backend using localStorage.
 * 
 * In production, replace the dataService imports with actual API calls.
 */

import { useState, useEffect } from 'react';
import type { FilterState } from './types';
import { seedInitialData } from './services/dataService';
import { Selector } from './components/Selector';
import { ScoreEntry } from './components/ScoreEntry';
import { GPADisplay } from './components/GPADisplay';
import { DepartmentReport } from './components/DepartmentReport';
import { StudentManagement } from './components/StudentManagement';
import { InfoPanel } from './components/InfoPanel';

// Tab types for navigation
type TabType = 'score-entry' | 'gpa-display' | 'department-report' | 'students';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('score-entry');
  const [filter, setFilter] = useState<FilterState | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  // Initialize seed data on first load
  useEffect(() => {
    seedInitialData();
  }, []);

  // Handle filter selection
  const handleFilterSelect = (newFilter: FilterState) => {
    setFilter(newFilter);
  };

  // Trigger refresh when results are saved
  const handleResultsSaved = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Tab configuration
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'score-entry',
      label: 'Score Entry',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      id: 'gpa-display',
      label: 'GPA/CGPA',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 'department-report',
      label: 'Dept Report',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'students',
      label: 'Students',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
      {/* Info Panel Modal */}
      <InfoPanel isOpen={showInfo} onClose={() => setShowInfo(false)} />
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Academic GPA System</h1>
                <p className="text-xs text-gray-500">HOD Edition • 5-Point Scale</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* User Badge & Info Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInfo(true)}
                className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                title="System Information"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <span className="hidden sm:inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full">
                HOD
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 px-4 py-2 flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Academic Context Selector - Always visible for relevant tabs */}
        {(activeTab === 'score-entry' || activeTab === 'gpa-display' || activeTab === 'department-report') && (
          <Selector onSelect={handleFilterSelect} selectedFilter={filter} />
        )}

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Score Entry Tab */}
          {activeTab === 'score-entry' && (
            <>
              {filter ? (
                <ScoreEntry filter={filter} onResultsSaved={handleResultsSaved} />
              ) : (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Started</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Select a department, level, and semester above to load the curriculum and start entering student scores.
                  </p>
                </div>
              )}
            </>
          )}

          {/* GPA/CGPA Display Tab */}
          {activeTab === 'gpa-display' && (
            <>
              {filter ? (
                <GPADisplay filter={filter} refreshTrigger={refreshTrigger} />
              ) : (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">View GPA & CGPA</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Select an academic context above to view individual student GPA and cumulative GPA calculations.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Department Report Tab */}
          {activeTab === 'department-report' && (
            <>
              {filter ? (
                <DepartmentReport filter={filter} refreshTrigger={refreshTrigger} />
              ) : (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Department Report</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Select an academic context above to generate a comprehensive report for all students in the department.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <StudentManagement onStudentAdded={handleResultsSaved} />
          )}
        </div>

        {/* Info Cards - Shown on Score Entry tab */}
        {activeTab === 'score-entry' && filter && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm opacity-80">Workflow</div>
                  <div className="font-semibold">Score → Grade → GPA</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm opacity-80">Auto Calculation</div>
                  <div className="font-semibold">Grade Points & PXU</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm opacity-80">CGPA</div>
                  <div className="font-semibold">All Semesters Combined</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              Academic GPA & CGPA Processing System • HOD Edition
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                System Online
              </span>
              <span>5-Point Grading Scale</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
