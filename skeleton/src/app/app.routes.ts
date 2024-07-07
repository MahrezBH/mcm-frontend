import { LayoutComponent } from './layouts/layout/layout.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { AuthentificationGuard } from './pages/auth/guards/authentification.guard';
import scrumboardRoutes from './pages/dashboards/scrumboard/scrumboard.routes';

export const appRoutes: VexRoutes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/auth/login/login.component').then((m) => m.LoginComponent)
      },

    ],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboards',
        pathMatch: 'full'
      },
      {
        path: 'dashboards',
        loadComponent: () =>
          import(
            './pages/dashboards/dashboard-analytics/dashboard-analytics.component'
          ).then((m) => m.DashboardAnalyticsComponent)
      },
      {
        path: 'storages',
        loadComponent: () =>
          import(
            './pages/storages/storages.component'
          ).then((m) => m.StoragesComponent)
      },
      {
        path: 'instances',
        loadComponent: () =>
          import(
            './pages/instances/instances.component'
          ).then((m) => m.InstancesComponent)
      },
      {
        path: 'clusters',
        loadComponent: () =>
          import(
            './pages/clusters/clusters.component'
          ).then((m) => m.ClustersComponent)
      },
      {
        path: 'docker-images',
        loadComponent: () =>
          import(
            './pages/images/images.component'
          ).then((m) => m.ImagesComponent)
      },
      {
        path: 'vault',
        loadComponent: () =>
          import(
            './pages/vault/vault.component'
          ).then((m) => m.VaultComponent)
      },
      {
        path: 'ilef-services',
        loadComponent: () =>
          import(
            './pages/ilef-services/ilef-services.component'
          ).then((m) => m.IlefServicesComponent)
      },
      {
        path: 'ilef-services',
        loadComponent: () =>
          import(
            './pages/ilef-services/ilef-services.component'
          ).then((m) => m.IlefServicesComponent)
      },
      {
        path: 'scrumboard',
        children: scrumboardRoutes
      },
    ],
    canActivate: [AuthentificationGuard]
  }
];
