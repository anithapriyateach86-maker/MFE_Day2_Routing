// ErrorBoundary.jsx — isolates section failures so rest of page stays functional
// TC7  — filter panel crash does not break entire page
// TC13 — each section (filters, summary, results) is independently wrapped

import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error(`[ErrorBoundary: ${this.props.name}]`, error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center my-4">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="text-red-700 font-semibold mb-1">
            {this.props.name || 'This section'} failed to load
          </p>
          <p className="text-red-400 text-sm mb-4">
            {this.state.error?.message}
          </p>
          <button
            onClick={this.handleRetry}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}