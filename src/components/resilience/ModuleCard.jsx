// ModuleCard.jsx
// TC3  — individual failure boundary per module
// TC7  — error message shows exact module name
// TC4  — timeout protection via useModuleLoader

import { useModuleLoader } from '../../hooks/useModuleLoader';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';

/**
 * ModuleCard — inline panel inside an expanded flight card
 * @param {string}   moduleName  - shown in header and error message (TC7)
 * @param {function} fetchFn     - distinct API endpoint (TC5)
 * @param {boolean}  isEnabled   - true only when flight card is expanded (TC1)
 * @param {number}   timeout     - configurable timeout in ms (TC4)
 * @param {function} renderData  - render function receiving fetched data
 */
const ModuleCard = ({
  moduleName,
  fetchFn,
  isEnabled,
  timeout = 3000,
  renderData,
}) => {
  const { data, loading, error, retry } = useModuleLoader(
    fetchFn,
    isEnabled,
    timeout
  );

  return (
    // TC3 — each ModuleCard is its own isolated unit
    // a failure here never affects sibling ModuleCards
    <div className="border border-gray-200 rounded-lg p-4 bg-white flex flex-col gap-3 min-h-[120px]">

      {/* Module label — always visible */}
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {moduleName}
      </p>

      {/* ── TC3 — Loading state ── */}
      {loading && (
        <div className="flex items-center gap-2 text-gray-400 text-xs py-2">
          <Loader2 size={14} className="animate-spin" />
          Loading {moduleName}...
        </div>
      )}

      {/* ── TC3/TC7 — Error state: shows exact module name in message ── */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="text-red-500" />
            {/* TC7 — error message clearly identifies which module failed */}
            <p className="text-red-600 text-xs font-semibold">
              {moduleName} failed to load
            </p>
          </div>
          <p className="text-red-400 text-xs">{error}</p>
          {/* TC5 retry — re-executes same endpoint without re-input */}
          <button
            onClick={retry}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-lg w-fit transition-colors"
          >
            <RefreshCw size={11} />
            Retry
          </button>
        </div>
      )}

      {/* ── Data state ── */}
      {data && !loading && !error && (
        <div>{renderData(data)}</div>
      )}

    </div>
  );
};

export default ModuleCard;