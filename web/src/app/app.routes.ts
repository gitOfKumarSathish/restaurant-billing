import { Routes } from '@angular/router';
import { BillingComponent } from './components/billing/billing.component';
import { MenuManagementComponent } from './components/menu-management/menu-management.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { OverviewComponent } from './components/overview/overview.component';

export const routes: Routes = [
    { path: '', component: BillingComponent },
    { path: 'inventory', component: MenuManagementComponent },
    { path: 'orders', component: OrderHistoryComponent },
    { path: 'overview', component: OverviewComponent },
    { path: '**', redirectTo: '' }
];
