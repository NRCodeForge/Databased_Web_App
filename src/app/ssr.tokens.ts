import { InjectionToken } from '@angular/core';
import { Request } from 'express';

// This creates a typed token that Angular can use for dependency injection.
export const REQUEST = new InjectionToken<Request>('REQUEST');
