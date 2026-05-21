// AsyncFeedback.jsx
// TC3  — single component handles loading and error states consistently
//         across search, authentication, booking, and any future workflow
// TC4  — same component handles success messages and retry actions
// TC5  — retry button re-executes without requiring user to re-enter input
// TC10 — fully prop-driven; no hardcoded messages or feature-specific behavior
//         making it usable for any async operation in the application

import { Loader2, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

/**
 * AsyncFeedback — unified feedback component for all async workflows
 *
 * Props:
 * @param {boolean}  loading        - show loading spinner when true
 * @param {string}   error          - error message to display (null = no error)
 * @param {string}   success        - success message to display (null = no success)
 * @param {function} onRetry        - retry handler; shows Retry button when provided
 * @param {string}   loadingLabel   - custom loading text (default: "Loading...")
 * @param {string}   retryLabel     - custom retry button text (default: "Retry")
 * @param {string}   successLabel   - custom success label prefix (optional)
 * @param {node}     children       - content to render when no feedback state is active
 */
const AsyncFeedback = ({
  loading      = false,
  error        = null,
  success      = null,
  onRetry      = null,
  loadingLabel = 'Loading...',
  retryLabel   = 'Retry',
  successLabel = '',
  children     = null,
}) => {

  // ── TC3 — Loading state ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-500">
        <Loader2
          size={40}
          className="animate-spin text-indigo-500"
        />
        <p className="text-sm font-medium">{loadingLabel}</p>
      </div>
    );
  }

  // ── TC3 — Error state with TC5 Retry button ───────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center w-full max-w-md">
          <AlertCircle
            size={36}
            className="text-red-500 mx-auto mb-2"
          />
          <p className="text-red-700 font-semibold mb-1">Something went wrong</p>
          {/* TC10 — error message is passed via prop; not hardcoded */}
          <p className="text-red-500 text-sm mb-4">{error}</p>

          {/* TC5 — Retry button shown only when onRetry handler is provided */}
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2 rounded-lg transition-colors"
            >
              <RefreshCw size={14} />
              {/* TC10 — retry label configurable via prop */}
              {retryLabel}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── TC4 — Success state ───────────────────────────────────────────────────
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-6 gap-2">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center w-full max-w-md">
          <CheckCircle2
            size={36}
            className="text-green-500 mx-auto mb-2"
          />
          {/* TC10 — success label and message both configurable via props */}
          {successLabel && (
            <p className="text-green-700 font-semibold mb-1">{successLabel}</p>
          )}
          <p className="text-green-600 text-sm">{success}</p>
        </div>
      </div>
    );
  }

  // ── Default — render children when no feedback state is active ────────────
  return children;
};

export default AsyncFeedback;