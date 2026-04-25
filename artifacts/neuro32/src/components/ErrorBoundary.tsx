import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : String(error);
    return { hasError: true, message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          background: 'var(--dark)',
          padding: 32,
        }}>
          <div style={{ fontSize: '2.4rem', color: 'var(--scarlet)' }}>✕</div>
          <p style={{ fontFamily: 'var(--fb)', fontSize: '1.2rem', color: '#fff' }}>
            Что-то пошло не так
          </p>
          <p style={{ fontFamily: 'var(--fm)', fontSize: '.85rem', color: 'var(--t3)', maxWidth: 400, textAlign: 'center' }}>
            {this.state.message}
          </p>
          <button
            className="btn btn-amber"
            onClick={() => window.location.reload()}
          >
            Перезагрузить страницу
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
