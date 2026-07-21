import { inject } from '@angular/core';
import { CanMatchFn, Router, Routes } from '@angular/router';
import { LangService } from './core/i18n/lang.service';
import { ApplicationStateService } from './core/application/application-state.service';

const languageChosenGuard: CanMatchFn = () => {
  const lang = inject(LangService);
  const router = inject(Router);
  return lang.hasChosen() ? true : router.parseUrl('/');
};

const requiresContactGuard: CanMatchFn = () => {
  const state = inject(ApplicationStateService);
  const router = inject(Router);
  return state.contact() ? true : router.parseUrl('/apply/contact');
};

const requiresPhoneVerifiedGuard: CanMatchFn = () => {
  const state = inject(ApplicationStateService);
  const router = inject(Router);
  return state.phoneVerified() ? true : router.parseUrl('/apply/verify');
};

const requiresEmploymentGuard: CanMatchFn = () => {
  const state = inject(ApplicationStateService);
  const router = inject(Router);
  return state.employment() ? true : router.parseUrl('/apply/employment');
};

const requiresSalaryGuard: CanMatchFn = () => {
  const state = inject(ApplicationStateService);
  const router = inject(Router);
  return state.salary() ? true : router.parseUrl('/apply/salary');
};

const requiresOfferGuard: CanMatchFn = () => {
  const state = inject(ApplicationStateService);
  const router = inject(Router);
  return state.offer() ? true : router.parseUrl('/apply/offers');
};

const requiresProfileGuard: CanMatchFn = () => {
  const state = inject(ApplicationStateService);
  const router = inject(Router);
  return state.profile() ? true : router.parseUrl('/apply/profile');
};

const requiresBvnGuard: CanMatchFn = () => {
  const state = inject(ApplicationStateService);
  const router = inject(Router);
  return state.bvn()?.verified ? true : router.parseUrl('/apply/bvn');
};

const requiresNinGuard: CanMatchFn = () => {
  const state = inject(ApplicationStateService);
  const router = inject(Router);
  return state.nin()?.verified ? true : router.parseUrl('/apply/nin');
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/language-select/language-select.component').then(
        (m) => m.LanguageSelectComponent,
      ),
  },
  {
    path: 'apply',
    canMatch: [languageChosenGuard],
    loadComponent: () =>
      import('./features/apply/apply-shell.component').then((m) => m.ApplyShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'contact' },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/apply/contact/contact.component').then((m) => m.ContactComponent),
      },
      {
        path: 'verify',
        canMatch: [requiresContactGuard],
        loadComponent: () =>
          import('./features/apply/verify-phone/verify-phone.component').then(
            (m) => m.VerifyPhoneComponent,
          ),
      },
      {
        path: 'employment',
        canMatch: [requiresContactGuard, requiresPhoneVerifiedGuard],
        loadComponent: () =>
          import('./features/apply/employment/employment.component').then(
            (m) => m.EmploymentComponent,
          ),
      },
      {
        path: 'waitlist',
        canMatch: [requiresContactGuard],
        loadComponent: () =>
          import('./features/apply/waitlist/waitlist.component').then((m) => m.WaitlistComponent),
      },
      {
        path: 'salary',
        canMatch: [requiresEmploymentGuard],
        loadComponent: () =>
          import('./features/apply/salary/salary.component').then((m) => m.SalaryComponent),
      },
      {
        path: 'profile',
        canMatch: [requiresSalaryGuard],
        loadComponent: () =>
          import('./features/apply/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'bvn',
        canMatch: [requiresProfileGuard],
        loadComponent: () =>
          import('./features/apply/bvn/bvn.component').then((m) => m.BvnComponent),
      },
      {
        path: 'nin',
        canMatch: [requiresBvnGuard],
        loadComponent: () =>
          import('./features/apply/nin/nin.component').then((m) => m.NinComponent),
      },
      {
        path: 'eligibility',
        canMatch: [requiresNinGuard],
        loadComponent: () =>
          import('./features/apply/eligibility/eligibility.component').then(
            (m) => m.EligibilityComponent,
          ),
      },
      {
        path: 'offers',
        canMatch: [requiresNinGuard],
        loadComponent: () =>
          import('./features/apply/offers/offers.component').then((m) => m.OffersComponent),
      },
      {
        path: 'terms',
        canMatch: [requiresOfferGuard],
        loadComponent: () =>
          import('./features/apply/terms/terms.component').then((m) => m.TermsComponent),
      },
      {
        path: 'documents',
        canMatch: [requiresOfferGuard],
        loadComponent: () =>
          import('./features/apply/documents/documents.component').then(
            (m) => m.DocumentsComponent,
          ),
      },
      {
        path: 'submit',
        canMatch: [requiresOfferGuard],
        loadComponent: () =>
          import('./features/apply/submit/submit.component').then((m) => m.SubmitComponent),
      },
      {
        path: 'status',
        loadComponent: () =>
          import('./features/apply/status/status.component').then((m) => m.StatusComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
