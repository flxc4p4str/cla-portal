import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { Summary } from './features/summary/summary';

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
      { path: '', pathMatch: 'full', redirectTo: 'estate' },
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
        data: { menuText: 'Report Scheduler', icon: 'WiFi' },
      },
      {
        path: 'timesheets',
        canActivate: [authGuard],
        loadComponent: () => import('./features/timesheets/timesheets').then((m) => m.Timesheets),
        data: { menuText: 'Timesheets', icon: 'widgets' },
      },
      {
        path: 'retail-calendar',
        canActivate: [authGuard],
        loadComponent: () => import('./features/retail-calendar/retail-calendar.component').then((m) => m.RetailCalendarComponent),
        data: { menuText: 'Retail Calendar', icon: 'widgets' },
      },
      {
        path: 'summary', 
        canActivate: [authGuard], 
        loadComponent: () => import('./features/summary/summary').then((m) => m.Summary),
        data: { menuText: 'eComm Summary' },
      },
            {
        path: 'todo', 
        canActivate: [authGuard], 
        loadComponent: () => import('./features/todo/todo').then((m) => m.Todo),
        data: { menuText: 'todo App' },
      },
      {
        path: 'lab-monitor', 
        canActivate: [authGuard], 
        loadComponent: () => import('./features/lab-monitor/lab-monitor').then((m) => m.LabMonitor),
        data: { menuText: 'Lab Monitor' },
      },
      {
        path: 'customer-inquiry/:custCode/:shipToNo',
        canActivate: [authGuard],
        loadComponent: () => import('./features/customer-inquiry/customer-inquiry.component')
          .then((m) => m.CustomerInquiryComponent),
      },
      {
        path: 'customer-inquiry',
        canActivate: [authGuard],
        loadComponent: () => import('./features/customer-inquiry/customer-inquiry.component')
          .then((m) => m.CustomerInquiryComponent),
        data: { menuText: 'Customer Inquiry', icon: 'widgets' },
      }
    ],
  },
  { path: '**', redirectTo: '' },
];
