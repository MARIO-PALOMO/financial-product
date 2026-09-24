import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core'; // 🟢 Cambiado al método oficial y estable
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. Detección de cambios nativa Zoneless oficial de Angular para alto rendimiento
    provideZonelessChangeDetection(),
    
    // 2. Inyectamos las rutas globales y habilitamos el mapeo automático de parámetros para formularios
    provideRouter(routes, withComponentInputBinding()), 
    
    // 3. Inyectamos el cliente HTTP core para que ProductService pueda consultar el puerto 3002
    provideHttpClient()
  ]
};
