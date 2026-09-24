import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/products/pages/product-dashboard-page/product-dashboard-page.component')
        .then(m => m.ProductDashboardPageComponent)
  },

  {
    path: 'products/add',
    loadComponent: () =>
      import('./features/products/components/product-form/product-form.component')
        .then(m => m.ProductFormComponent)
  },
  {
    path: 'products/edit/:id',
    loadComponent: () =>
      import('./features/products/components/product-form/product-form.component')
        .then(m => m.ProductFormComponent)
  },
];
