import React from 'react';

// Last-resort safety net: keeps a render/reconciliation crash from freezing the
// whole SPA (e.g. the DNS zone editor going unresponsive). Shows a recoverable
// screen instead of a blank, stuck page.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('App crashed:', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center px-6" translate="no">
        <div className="panel w-full max-w-md rounded-xl p-6 text-center">
          <h1 className="text-lg font-semibold text-foreground">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The page hit an unexpected error and stopped responding. Reloading usually fixes
            it. If your browser is translating this page, try turning translation off for
            this site.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
