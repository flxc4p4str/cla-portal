import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';

export const appRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
    data: { public: true },
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent), data: { menuText: 'Home', icon: 'home' } },
      { path: 'example', loadComponent: () => import('./features/example/example.component').then((m) => m.ExampleComponent), data: { menuText: 'Example', icon: 'widgets' } },
      { path: 'api-test', loadComponent: () => import('./features/api-test/api-test.component').then((m) => m.ApiTestComponent), data: { menuText: 'API Test', icon: 'cloud' } },
      {
        path: 'api-logs',
        canActivate: [authGuard],
        loadComponent: () => import('./features/api-logs/api-logs').then((m) => m.ApiLogs),
        data: { menuText: 'Api Logs', icon: 'widgets' },
      },
      {
        path: 'report-scheduler',
        canActivate: [authGuard],
        loadComponent: () => import('./features/report-scheduler/report-scheduler').then((m) => m.ReportScheduler),
        data: { menuText: 'Report Scheduler', icon: 'widgets' },
      },
      {
        path: 'timesheets',
        canActivate: [authGuard],
        loadComponent: () => import('./features/timesheets/timesheets').then((m) => m.Timesheets),
        data: { menuText: 'Timesheets', icon: 'widgets' },
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
