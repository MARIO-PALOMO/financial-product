import { Injector, runInInjectionContext, ErrorHandler } from '@angular/core';
import { App } from './app'; // Asegúrate de que el path apunte correctamente a tu archivo app.ts

describe('AppComponent', () => {
  let component: App;

  beforeEach(() => {
    const customInjector = Injector.create({
      providers: [
        { provide: ErrorHandler, useClass: ErrorHandler }
      ]
    });

    runInInjectionContext(customInjector, () => {
      component = new App();
    });
  });

  it('should create the app root logically', () => {
    expect(component).toBeTruthy();
  });
});
