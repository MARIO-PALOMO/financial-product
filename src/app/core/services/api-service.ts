import { inject, Injectable, InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

export const API_URL = new InjectionToken<string>('API_URL',
    {
        providedIn: 'root',
        factory: () => environment.apiUrl
    }
)

@Injectable({
    providedIn: 'root'
})
export class ApiService { 
    protected readonly http = inject(HttpClient);
    protected readonly baseUrl = inject(API_URL);

    protected buildUrl(endpoint: string): string{
        return `${this.baseUrl}${endpoint}`;
    }

}
