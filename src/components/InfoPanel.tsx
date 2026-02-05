/**
 * Info Panel Component
 * Displays system information and usage instructions
 */

interface InfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoPanel({ isOpen, onClose }: InfoPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">System Information</h2>
                  <p className="text-sm opacity-80">Academic GPA & CGPA Processing System</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Workflow */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                HOD Workflow
              </h3>
              <ol className="space-y-2">
                {[
                  'Select Department, Level, and Semester',
                  'System fetches curriculum automatically',
                  'Course table populates with Course Code and Units',
                  'Enter ONLY student scores (0-100)',
                  'System auto-calculates: Score → Grade → Point → PXU → GPA',
                  'Click "Save All Results" to persist data',
                  'View individual GPA/CGPA or Department Report',
                ].map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-gray-600">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Grading Scale */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                5-Point Grading Scale
              </h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Score Range</th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase">Grade</th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase">Point</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { range: '70 - 100', grade: 'A', point: 5, color: 'text-emerald-600 bg-emerald-50' },
                      { range: '60 - 69', grade: 'B', point: 4, color: 'text-blue-600 bg-blue-50' },
                      { range: '50 - 59', grade: 'C', point: 3, color: 'text-yellow-600 bg-yellow-50' },
                      { range: '45 - 49', grade: 'D', point: 2, color: 'text-orange-600 bg-orange-50' },
                      { range: '40 - 44', grade: 'E', point: 1, color: 'text-red-500 bg-red-50' },
                      { range: '0 - 39', grade: 'F', point: 0, color: 'text-red-700 bg-red-100' },
                    ].map((row) => (
                      <tr key={row.grade}>
                        <td className="px-4 py-2 text-sm text-gray-700">{row.range}</td>
                        <td className="px-4 py-2 text-center">
                          <span className={`inline-block px-3 py-0.5 rounded-full text-sm font-medium ${row.color}`}>
                            {row.grade}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center text-sm font-semibold text-gray-900">{row.point}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Formulas */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Calculation Formulas
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="font-medium text-indigo-900">PXU (Point × Unit)</div>
                  <code className="text-sm text-indigo-700">PXU = Grade Point × Course Unit</code>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="font-medium text-emerald-900">GPA (Grade Point Average)</div>
                  <code className="text-sm text-emerald-700">GPA = Σ(PXU) / Σ(Units)</code>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="font-medium text-purple-900">CGPA (Cumulative GPA)</div>
                  <code className="text-sm text-purple-700">CGPA = Σ(All Semester PXU) / Σ(All Semester Units)</code>
                </div>
              </div>
            </section>

            {/* Class of Degree */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Class of Degree
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { cgpa: '4.50 - 5.00', class: 'First Class Honours', color: 'bg-emerald-100 text-emerald-700' },
                  { cgpa: '3.50 - 4.49', class: 'Second Class Upper', color: 'bg-blue-100 text-blue-700' },
                  { cgpa: '2.50 - 3.49', class: 'Second Class Lower', color: 'bg-yellow-100 text-yellow-700' },
                  { cgpa: '1.50 - 2.49', class: 'Third Class', color: 'bg-orange-100 text-orange-700' },
                  { cgpa: '1.00 - 1.49', class: 'Pass', color: 'bg-red-100 text-red-600' },
                  { cgpa: 'Below 1.00', class: 'Fail', color: 'bg-red-200 text-red-700' },
                ].map((item) => (
                  <div key={item.class} className={`p-3 rounded-lg ${item.color}`}>
                    <div className="text-sm font-medium">{item.class}</div>
                    <div className="text-xs opacity-75">{item.cgpa}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Tech Stack */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Technology Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'LocalStorage API'].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Production version would use: Next.js, Express.js, PostgreSQL, Prisma ORM
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
