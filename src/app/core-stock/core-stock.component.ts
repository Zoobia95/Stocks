import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { API_KEY } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

// @ts-ignore
@Component({
  selector: 'app-core-stock',
  templateUrl: './core-stock.component.html',
  styleUrls: ['./core-stock.component.css'],
})
export class CoreStockComponent implements OnInit {
  constructor(
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  stockData: any[] = [];
  displayedColumns!: string[];
  dataSource = new MatTableDataSource<any>([]);
  param: any;
  apiKey = API_KEY.key;
  secondApiData: any;
  displayedColumns2!: string[];
  dataSource2 = new MatTableDataSource<any>([]);
  searchTerms: any;
  displayedColumns3!: string[];
  dataSource3 = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator2!: MatPaginator;
  @ViewChild(MatSort) sort2!: MatSort;

  @ViewChild(MatPaginator) paginator3!: MatPaginator;
  @ViewChild(MatSort) sort3!: MatSort;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      this.param = params.params.id;
      this.checkPageType();
    });
  }

  checkPageType() {
    let functionName;
    let resultObject: any;
    let apiCase: any;
    switch (this.param) {
      case '1':
        this.displayedColumns = ['open', 'high', 'low', 'close'];
        functionName = 'TIME_SERIES_INTRADAY';
        resultObject = 'Time Series (5min)';
        this.displayedColumns.push('volume1');
        apiCase = 'first';
        break;
      case '2':
        this.displayedColumns = ['open', 'high', 'low', 'close'];
        functionName = 'TIME_SERIES_DAILY';
        resultObject = 'Time Series (Daily)';
        this.displayedColumns.push('volume2');
        apiCase = 'first';
        break;
      case '3':
        this.displayedColumns = ['open', 'high', 'low', 'close'];
        functionName = 'TIME_SERIES_DAILY_ADJUSTED';
        resultObject = 'Time Series (Daily)';
        this.displayedColumns.push('adjusted_close1');
        this.displayedColumns.push('volume3');
        this.displayedColumns.push('dividend_amount1');
        this.displayedColumns.push('split_coefficient');
        apiCase = 'first';
        break;
      case '4':
        this.displayedColumns = ['open', 'high', 'low', 'close'];
        functionName = 'TIME_SERIES_WEEKLY';
        resultObject = 'Weekly Time Series';
        this.displayedColumns.push('volume4');
        apiCase = 'first';
        break;
      case '5':
        this.displayedColumns = ['open', 'high', 'low', 'close'];
        functionName = 'TIME_SERIES_WEEKLY_ADJUSTED';
        resultObject = 'Weekly Adjusted Time Series';
        this.displayedColumns.push('adjusted_close2');
        this.displayedColumns.push('volume5');
        this.displayedColumns.push('dividend_amount2');
        apiCase = 'first';
        break;
      case '6':
        this.displayedColumns = ['open', 'high', 'low', 'close'];
        functionName = 'TIME_SERIES_MONTHLY';
        resultObject = 'Monthly Time Series';
        this.displayedColumns.push('volume6');
        apiCase = 'first';
        break;
      case '7':
        this.displayedColumns = ['open', 'high', 'low', 'close'];
        functionName = 'TIME_SERIES_MONTHLY_ADJUSTED';
        resultObject = 'Monthly Adjusted Time Series';
        this.displayedColumns.push('adjusted_close3');
        this.displayedColumns.push('volume7');
        this.displayedColumns.push('dividend_amount3');
        apiCase = 'first';
        break;
      case '8':
        this.displayedColumns = ['open', 'high', 'low', 'close'];
        functionName = '';
        resultObject = '';
        apiCase = 'second';
        break;
      case '9':
        this.displayedColumns2 = [
          'symbol',
          'name',
          'type',
          'region',
          'marketOpen',
          'marketClose',
          'timezone',
          'currency',
          'matchScore',
        ];
        functionName = '';
        resultObject = '';
        apiCase = 'third';
        break;
      case '10':
        this.displayedColumns3 = [
          'market_type',
          'region',
          'primary_exchanges',
          'local_open',
          'local_close',
          'current_status',
          'notes',
        ];
        functionName = '';
        resultObject = '';
        apiCase = 'fourth';
        break;
      default:
        this.displayedColumns = ['open', 'high', 'low', 'close'];
        functionName = 'TIME_SERIES_INTRADAY';
        resultObject = 'Time Series (5min)';
        this.displayedColumns.push('volume1');
        apiCase = 'first';
    }
    this.callAPI(functionName, resultObject, apiCase);
  }

  callAPI(functionName: any, resultObject: any, apiCase: any) {
    switch (apiCase) {
      case 'first':
        this.callFirstAPI(functionName, resultObject);
        break;
      case 'second':
        this.callSecondAPI();
        break;
      case 'third':
        this.callThirdAPI();
        break;
      case 'fourth':
        this.callFourthAPI();
        break;
      default:
        this.callFirstAPI(functionName, resultObject);
    }
  }

  callFirstAPI(functionName: any, resultObject: any) {
    let url = `https://www.alphavantage.co/query?function=${functionName}&symbol=IBM&interval=5min&apikey=${this.apiKey}`;
    this.sharedService.getCoreStock(url).subscribe((result) => {
      if (result.Information) {
        this.dataSource.data = [];
        this._snackBar.open(result.Information, '', {
          duration: 2000,
        });
      } else {
        const data = result[resultObject];
        const stockData = Object.entries(data).map((key: any) => ({
          ...key[1],
        }));

        this.dataSource.data = stockData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  callSecondAPI() {
    let url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=${this.apiKey}`;
    this.sharedService.getCoreStock(url).subscribe((result) => {
      if (result.Information) {
        this.dataSource.data = [];
        this._snackBar.open(result.Information, '', {
          duration: 2000,
        });
      } else {
        this.secondApiData = result['Global Quote'];
      }
    });
  }

  callThirdAPI() {
    let url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${this.searchTerms}&apikey=${this.apiKey}`;
    this.sharedService.getCoreStock(url).subscribe((result) => {
      if (result.Information) {
        this.dataSource2.data = [];
        this._snackBar.open(result.Information, '', {
          duration: 2000,
        });
      } else {
        const data = result['bestMatches'];
        const stockData = Object.entries(data).map((key: any) => ({
          ...key[1],
        }));

        this.dataSource2.data = stockData;
        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.sort2;
      }
    });
  }

  callFourthAPI() {
    let url = `https://www.alphavantage.co/query?function=MARKET_STATUS&apikey=${this.apiKey}`;
    this.sharedService.getCoreStock(url).subscribe((result) => {
      if (result.Information) {
        this.dataSource3.data = [];
        this._snackBar.open(result.Information, '', {
          duration: 2000,
        });
      } else {
        const data = result['markets'];
        const stockData = Object.entries(data).map((key: any) => ({
          ...key[1],
        }));

        this.dataSource3.data = stockData;
        this.dataSource3.paginator = this.paginator3;
        this.dataSource3.sort = this.sort3;
      }
    });
  }

  search(key: any, term: any) {
    if (key.keyCode !== '8') {
      this.searchTerms = term;
      this.callThirdAPI();
    }
  }

  async refreshSearch(key: any) {
    if (key.keyCode === '8') {
      this.callThirdAPI();
    }
  }
}
