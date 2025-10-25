import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

export interface BackendStatus {
  isConnected: boolean;
  lastChecked: Date;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  private backendStatusSubject = new BehaviorSubject<BackendStatus>({
    isConnected: true,
    lastChecked: new Date()
  });

  public backendStatus$ = this.backendStatusSubject.asObservable();

  constructor(private router: Router) {}

  /**
   * Handle HTTP errors and determine if backend is connected
   */
  handleHttpError(error: HttpErrorResponse): Observable<never> {
    console.error('HTTP Error:', error);

    if (this.isBackendConnectionError(error)) {
      this.updateBackendStatus(false, 'Backend server is not responding');
      this.showBackendError();
      return throwError(() => new Error('Backend connection failed'));
    }

    if (this.isTokenExpiredError(error)) {
      this.handleTokenExpiration();
      return throwError(() => new Error('Token expired'));
    }

    if (this.isUnauthorizedError(error)) {
      this.handleUnauthorized();
      return throwError(() => new Error('Unauthorized access'));
    }

    // For other errors, just pass them through
    return throwError(() => error);
  }

  /**
   * Check if error indicates backend connection issue
   */
  private isBackendConnectionError(error: HttpErrorResponse): boolean {
    return (
      error.status === 0 || // Network error
      error.status === 500 || // Internal server error
      error.status === 502 || // Bad Gateway
      error.status === 503 || // Service Unavailable
      error.status === 504 || // Gateway Timeout
      error.name === 'HttpErrorResponse' && !error.status // Network failure
    );
  }

  /**
   * Check if error indicates token expiration
   */
  private isTokenExpiredError(error: HttpErrorResponse): boolean {
    return error.status === 401 && 
           (error.error?.message?.includes('token') || 
            error.error?.message?.includes('expired') ||
            error.error?.message?.includes('Not authorized'));
  }

  /**
   * Check if error indicates unauthorized access
   */
  private isUnauthorizedError(error: HttpErrorResponse): boolean {
    return error.status === 401;
  }

  /**
   * Update backend connection status
   */
  private updateBackendStatus(isConnected: boolean, error?: string): void {
    this.backendStatusSubject.next({
      isConnected,
      lastChecked: new Date(),
      error
    });
  }

  /**
   * Show backend connection error
   */
  private showBackendError(): void {
    // Create a modal or notification to inform user
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      color: white;
      font-family: Arial, sans-serif;
    `;
    
    modal.innerHTML = `
      <div style="
        background: #dc3545;
        padding: 2rem;
        border-radius: 0.5rem;
        text-align: center;
        max-width: 400px;
        margin: 1rem;
      ">
        <h2 style="margin: 0 0 1rem 0; color: white;">⚠️ Backend Connection Error</h2>
        <p style="margin: 0 0 1rem 0;">The backend server is not responding. Please check:</p>
        <ul style="text-align: left; margin: 0 0 1rem 0;">
          <li>Backend server is running</li>
          <li>Network connection is stable</li>
          <li>Server is accessible on port 5000</li>
        </ul>
        <button onclick="this.parentElement.parentElement.remove(); window.location.reload();" 
                style="
                  background: white;
                  color: #dc3545;
                  border: none;
                  padding: 0.5rem 1rem;
                  border-radius: 0.25rem;
                  cursor: pointer;
                  font-weight: bold;
                ">
          Retry Connection
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  /**
   * Handle token expiration
   */
  private handleTokenExpiration(): void {
    // Clear any stored tokens
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Show notification
    this.showTokenExpiredNotification();
    
    // Redirect to login after a short delay
    setTimeout(() => {
      this.router.navigate(['/login'], { 
        queryParams: { reason: 'token-expired' },
        replaceUrl: true 
      });
    }, 2000);
  }

  /**
   * Handle unauthorized access
   */
  private handleUnauthorized(): void {
    // Clear any stored tokens
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect immediately
    this.router.navigate(['/login'], { 
      queryParams: { reason: 'unauthorized' },
      replaceUrl: true 
    });
  }

  /**
   * Show token expired notification
   */
  private showTokenExpiredNotification(): void {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ffc107;
      color: #000;
      padding: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      font-family: Arial, sans-serif;
      max-width: 300px;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span style="font-size: 1.2rem;">⏰</span>
        <div>
          <strong>Session Expired</strong><br>
          <small>Redirecting to login...</small>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 3000);
  }

  /**
   * Check backend connectivity
   */
  checkBackendConnection(): Observable<boolean> {
    return new Observable(observer => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      fetch('http://localhost:5000/api/auth/check', {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        clearTimeout(timeoutId);
        if (response.ok) {
          this.updateBackendStatus(true);
          observer.next(true);
          observer.complete();
        } else {
          this.updateBackendStatus(false, `Server responded with status ${response.status}`);
          observer.next(false);
          observer.complete();
        }
      })
      .catch(error => {
        clearTimeout(timeoutId);
        this.updateBackendStatus(false, 'Network error: ' + error.message);
        observer.next(false);
        observer.complete();
      });
    });
  }

  /**
   * Get current backend status
   */
  getCurrentBackendStatus(): BackendStatus {
    return this.backendStatusSubject.value;
  }
}


