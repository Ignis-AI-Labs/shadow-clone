export type Handler<T, P = Record<string, string>> = (request: Request, env: T, params: P) => Promise<Response> | Response;

export class Router<T> {
  private routes: Map<string, Map<string, Handler<T, any>>> = new Map();

  private addRoute(method: string, path: string, handler: Handler<T, any>) {
    if (!this.routes.has(method)) {
      this.routes.set(method, new Map());
    }
    this.routes.get(method)!.set(path, handler as Handler<T, Record<string, string>>);
  }

  get(path: string, handler: Handler<T, any>) {
    this.addRoute('GET', path, handler);
  }

  post(path: string, handler: Handler<T, any>) {
    this.addRoute('POST', path, handler);
  }

  put(path: string, handler: Handler<T, any>) {
    this.addRoute('PUT', path, handler);
  }

  delete(path: string, handler: Handler<T, any>) {
    this.addRoute('DELETE', path, handler);
  }

  options(path: string, handler: Handler<T, any>) {
    this.addRoute('OPTIONS', path, handler);
  }

  all(path: string, handler: Handler<T, any>) {
    ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'].forEach(method => {
      this.addRoute(method, path, handler);
    });
  }

  async handle(request: Request, env: T): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;
    const pathname = url.pathname;

    const methodRoutes = this.routes.get(method);
    if (!methodRoutes) {
      return new Response('Method not allowed', { status: 405 });
    }

    // Try exact match first
    if (methodRoutes.has(pathname)) {
      return methodRoutes.get(pathname)!(request, env, {});
    }

    // Try pattern matching
    for (const [pattern, handler] of methodRoutes.entries()) {
      const params = this.matchPath(pattern, pathname);
      if (params) {
        return handler(request, env, params);
      }
    }

    // Try wildcard
    if (methodRoutes.has('*')) {
      return methodRoutes.get('*')!(request, env, {});
    }

    return new Response('Not found', { status: 404 });
  }

  private matchPath(pattern: string, pathname: string): Record<string, string> | null {
    if (pattern === '*') return {};
    
    const patternParts = pattern.split('/');
    const pathParts = pathname.split('/');

    if (patternParts.length !== pathParts.length) {
      return null;
    }

    const params: Record<string, string> = {};

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];

      if (patternPart.startsWith(':')) {
        params[patternPart.slice(1)] = pathPart;
      } else if (patternPart !== pathPart) {
        return null;
      }
    }

    return params;
  }
}