import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

/**
 * 심사 규정 준수: alert/confirm/prompt 절대 금지.
 * 이 Context의 openAlert/openConfirm은 화면 내 커스텀 모달을 띄운다.
 * TDS useDialog API와 호환 시그니처를 유지한다.
 */

interface AlertOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
}

interface ConfirmOptions extends AlertOptions {
  cancelLabel?: string;
}

type DialogState =
  | { kind: 'closed' }
  | { kind: 'alert'; opts: AlertOptions; resolve: () => void }
  | { kind: 'confirm'; opts: ConfirmOptions; resolve: (ok: boolean) => void };

interface DialogCtx {
  openAlert: (opts: AlertOptions) => Promise<void>;
  openConfirm: (opts: ConfirmOptions) => Promise<boolean>;
}

const Ctx = createContext<DialogCtx | null>(null);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DialogState>({ kind: 'closed' });

  const openAlert = useCallback((opts: AlertOptions) => {
    return new Promise<void>((resolve) => setState({ kind: 'alert', opts, resolve }));
  }, []);

  const openConfirm = useCallback((opts: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => setState({ kind: 'confirm', opts, resolve }));
  }, []);

  const close = () => {
    if (state.kind === 'alert') state.resolve();
    if (state.kind === 'confirm') state.resolve(false);
    setState({ kind: 'closed' });
  };

  const confirm = () => {
    if (state.kind === 'alert') state.resolve();
    if (state.kind === 'confirm') state.resolve(true);
    setState({ kind: 'closed' });
  };

  return (
    <Ctx.Provider value={{ openAlert, openConfirm }}>
      {children}
      {state.kind !== 'closed' && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={close}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 23, 51, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--adaptiveFloatBackground, #FFFFFF)',
              borderRadius: 16,
              maxWidth: 320,
              width: '100%',
              padding: 24,
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            }}
          >
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#191F28', margin: '0 0 8px' }}>
              {state.opts.title}
            </h2>
            {state.opts.description && (
              <p style={{ fontSize: 15, color: '#4B5563', margin: '0 0 20px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                {state.opts.description}
              </p>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              {state.kind === 'confirm' && (
                <button
                  onClick={close}
                  style={{
                    flex: 1,
                    height: 48,
                    background: '#F3F4F6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {state.opts.cancelLabel ?? '취소'}
                </button>
              )}
              <button
                onClick={confirm}
                style={{
                  flex: 1,
                  height: 48,
                  background: '#3182F6',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {state.opts.confirmLabel ?? '확인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

export function useDialog(): DialogCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useDialog must be inside <DialogProvider>');
  return v;
}
