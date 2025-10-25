import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface EmailValidationResult {
  email: string;
  isValid: boolean;
  reason?: string;
  details?: {
    syntaxValid: boolean;
    domainExists: boolean;
    mxRecordExists: boolean;
    smtpReachable: boolean;
    emailExists: boolean;
  };
}

export interface EmailValidationStats {
  total: number;
  valid: number;
  invalid: number;
  syntaxInvalid?: number;
  domainNotFound?: number;
  noMxRecords?: number;
  smtpUnreachable?: number;
  emailNotExists?: number;
}

export interface EmailValidationResponse {
  success: boolean;
  results: EmailValidationResult[];
  stats: EmailValidationStats;
}

@Injectable({
  providedIn: 'root'
})
export class EmailValidatorService {

  constructor(private api: ApiService) {}

  // Validate a single email address using backend API
  validateEmail(email: string): Observable<EmailValidationResult> {
    return this.validateEmails([email]).pipe(
      map(results => results[0])
    );
  }

  // Validate multiple email addresses using backend API
  validateEmails(emails: string[]): Observable<EmailValidationResult[]> {
    return this.api.post<EmailValidationResponse>(
      '/campaigns/validate-emails',
      { emails }
    ).pipe(
      map(response => response.results),
      catchError(error => {
        // Return all emails as invalid if API fails
        return of(emails.map(email => ({
          email,
          isValid: false,
          reason: 'Email validation service unavailable',
          details: {
            syntaxValid: false,
            domainExists: false,
            mxRecordExists: false,
            smtpReachable: false,
            emailExists: false
          }
        })));
      })
    );
  }
}
