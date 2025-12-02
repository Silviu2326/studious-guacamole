import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { errorReporter } from './error-reporter';

/**
 * Helper para renderizar componentes con todos los providers necesarios
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    route?: string;
    initialEntries?: string[];
    user?: { id: string; email: string; role: 'entrenador' | 'gimnasio'; name: string };
  }
) {
  const { route, initialEntries, user, ...renderOptions } = options || {};

  // Mock de usuario si se proporciona
  const mockUser = user || {
    id: 'test-user-id',
    email: 'test@example.com',
    role: 'entrenador' as const,
    name: 'Test User',
  };

  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    );
  };

  // Si hay una ruta inicial, establecerla
  if (route || initialEntries) {
    window.history.pushState({}, '', route || initialEntries?.[0] || '/');
  }

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
}

/**
 * Helper para esperar que un componente se renderice sin errores
 */
export async function waitForComponent(
  componentName: string,
  renderFn: () => Promise<void> | void
): Promise<void> {
  try {
    await renderFn();
  } catch (error) {
    errorReporter.reportError(
      'Component Rendering',
      componentName,
      error instanceof Error ? error : new Error(String(error)),
      {
        severity: 'high',
        component: componentName,
        suggestions: [
          'Verificar que todas las dependencias están importadas correctamente',
          'Verificar que los props requeridos están siendo pasados',
          'Revisar la consola del navegador para más detalles',
        ],
      }
    );
    throw error;
  }
}

/**
 * Helper para probar APIs mock
 */
export function createMockApiResponse<T>(data: T, delay: number = 0): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

/**
 * Helper para probar errores de API
 */
export function createMockApiError(
  message: string,
  status: number = 500
): Promise<never> {
  return Promise.reject({
    message,
    status,
    response: {
      status,
      data: { error: message },
    },
  });
}

/**
 * Mock de localStorage
 */
export class LocalStorageMock {
  private store: Record<string, string> = {};

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  get length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] || null;
  }
}

/**
 * Setup de localStorage mock
 */
export function setupLocalStorageMock(): LocalStorageMock {
  const mock = new LocalStorageMock();
  (global as any).localStorage = mock;
  return mock;
}

