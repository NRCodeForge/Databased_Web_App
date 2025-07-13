import { InjectionToken } from '@angular/core';
import { Request } from 'express';

/**
 * InjectionToken für das Express `Request`-Objekt.
 *
 * @description
 * Erstellt ein typisiertes Token, das Angular für die Dependency Injection
 * des aktuellen HTTP-Requests verwenden kann.
 *
 * @example
 * ```typescript
 * constructor(@Inject(REQUEST) private request: Request) { }
 * ```
 */
export const REQUEST = new InjectionToken<Request>('REQUEST');
