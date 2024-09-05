import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreStockComponent } from './core-stock/core-stock.component';
import { OptionsDataComponent } from './options-data/options-data.component';
import { AlphaIntelligenceComponent } from './alpha-intelligence/alpha-intelligence.component';
import { FundamentalDataComponent } from './fundamental-data/fundamental-data.component';

const routes: Routes = [
  { path: 'core-stock/:id', component: CoreStockComponent },
  { path: 'options-data/:id', component: OptionsDataComponent },
  { path: 'alpha-intelligence/:id', component: AlphaIntelligenceComponent },
  { path: 'fundamental-data/:id', component: FundamentalDataComponent },
  // { path: 'customers', component: CustomersComponent },
  { path: '', redirectTo: '/core-stock/1', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
