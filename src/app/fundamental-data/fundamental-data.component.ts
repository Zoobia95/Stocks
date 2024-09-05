import { Component } from '@angular/core';
import { Stock } from './stock.model';
import {
  NgIf,
  NgFor,
  NgClass,
  NgStyle,
  DatePipe,
  DecimalPipe,
} from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../shared.service';
import { API_KEY } from 'src/environments/environment';

@Component({
  selector: 'app-fundamental-data',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    NgStyle,
    DatePipe,
    MatPaginator,
    MatTableModule,
  ],
  templateUrl: './fundamental-data.component.html',
  styleUrl: './fundamental-data.component.css',
  providers: [DecimalPipe],
})
export class FundamentalDataComponent {
  stock!: Stock;
  param: any;
  apiKey = API_KEY.key;

  currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  constructor(private sharedService: SharedService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private decimalPipe: DecimalPipe) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      this.param = params.params.id;
      this.checkPageType();
    });
  }

  checkPageType() {
    let apiCase: any;
    switch (this.param) {
      case '1':
        apiCase = 'first';
        break;
      default:
        apiCase = 'first';
        break;
    }
    this.callAPI(apiCase);
  }

  callAPI(apiCase: any) {
    switch (apiCase) {
      case 'first':
        this.callFirstAPI();
        break;
      default:
        this.callFirstAPI();
    }
  }
  callFirstAPI() {
    let url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=${this.apiKey}`;
    this.sharedService.getCoreStock(url).subscribe((result) => {
      if (result.Information) {
        this.stock = result;;
        this._snackBar.open(result.Information, '', {
          duration: 2000,
        });
      } else {
        this.stock = result;
      }
    });
  }

  formatCurrency(value: number | string): string {
    return this.currencyFormatter.format(Number(value));
  }

  formatPercent(value: number | string): string {
    if (value === null || value === undefined) return '';
    const numberValue = Number(value);
    if (isNaN(numberValue)) return value.toString();
    return this.decimalPipe.transform(numberValue, '1.0-2', 'en-US') + '%'; // Format as percentage
  }
}
