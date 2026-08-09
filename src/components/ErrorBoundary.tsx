'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  fallback?: ReactNode
  label?: string
}

type State = { error: Error | null }

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.label ? `:${this.props.label}` : ''}]`, error, info)
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="error-boundary" role="alert">
          <h2>Something went wrong</h2>
          <p>{this.state.error.message}</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => this.setState({ error: null })}
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export function ChartErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <AppErrorBoundary
      label="chart"
      fallback={
        <div className="error-boundary error-boundary--soft" role="alert">
          <p>Graph failed to render. Try refreshing this section.</p>
        </div>
      }
    >
      {children}
    </AppErrorBoundary>
  )
}

export function KatexErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <AppErrorBoundary
      label="katex"
      fallback={
        <span className="katex-fallback" role="text">
          [equation]
        </span>
      }
    >
      {children}
    </AppErrorBoundary>
  )
}
