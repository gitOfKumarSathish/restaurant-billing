import { Routes } from '@angular/router';
import { BillingComponent } from './components/billing/billing.component';
import { MenuManagementComponent } from './components/menu-management/menu-management.component';

export const routes: Routes = [
    { path: '', component: BillingComponent },
    { path: 'inventory', component: MenuManagementComponent },
    { path: '**', redirectTo: '' }
];
