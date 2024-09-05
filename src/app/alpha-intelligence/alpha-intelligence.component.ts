import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../shared.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { API_KEY } from 'src/environments/environment';
import {
  DatePipe,
  DecimalPipe,
  NgClass,
  NgFor,
  NgIf,
  NgStyle,
} from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

interface DataPoint {
  date: string;
  ibmMean: number;
  aaplMean: number;
  ibmStdDev: number;
  aaplStdDev: number;
  windowStart: string;
}

@Component({
  selector: 'app-alpha-intelligence',
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
  templateUrl: './alpha-intelligence.component.html',
  styleUrl: './alpha-intelligence.component.css',
  providers: [DecimalPipe],
})
export class AlphaIntelligenceComponent implements OnInit {
  param: any;
  apiKey = API_KEY.key;
  displayedColumns2!: string[];
  dataSource2 = new MatTableDataSource<any>([]);

  displayedColumns4!: string[];
  dataSource4 = new MatTableDataSource<DataPoint>();

  @ViewChild(MatPaginator) paginator2!: MatPaginator;
  @ViewChild(MatSort) sort2!: MatSort;

  @ViewChild(MatSort) sort4!: MatSort;
  @ViewChild(MatPaginator) paginator4!: MatPaginator;

  articles: any;

  meanReturns: { name: string; value: number }[] = [];
  stdDev: { name: string; value: number }[] = [];

  correlationIndexes: any;

  correlationMatrix: any;

  data: any;

  dataPoints: DataPoint[] = [];

  constructor(
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private decimalPipe: DecimalPipe
  ) {}

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
      case '2':
        this.displayedColumns2 = [
          'ticker',
          'price',
          'change_amount',
          'change_percentage',
          'volume',
        ];
        apiCase = 'second';
        break;
      case '3':
        apiCase = 'third';
        break;
      case '4':
        this.displayedColumns4! = [
          'date',
          'ibmMean',
          'aaplMean',
          'ibmStdDev',
          'aaplStdDev',
          'windowStart',
        ];
        apiCase = 'fourth';
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
        this.callFirstAPI();
    }
  }

  callFirstAPI() {
    let url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=${this.apiKey}`;
    this.sharedService.getCoreStock(url).subscribe((result) => {
      if (result.Information) {
        this.articles = [];
        this._snackBar.open(result.Information, '', {
          duration: 2000,
        });
      } else {
        this.articles = result.feed;
      }
    });
  }

  callSecondAPI() {
    let url = `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${this.apiKey}`;
    this.sharedService.getCoreStock(url).subscribe((result) => {
      if (result.Information) {
        this.dataSource2.data = [];
        this._snackBar.open(result.Information, '', {
          duration: 2000,
        });
      } else {
        const optionsData = result['top_gainers'];
        this.dataSource2.data = optionsData;
        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.sort2;
      }
    });
  }

  formatNumber(value: number): string {
    return this.decimalPipe.transform(value, '1.6-6') || '';
  }

  callThirdAPI() {
    let url = `https://www.alphavantage.co/query?function=ANALYTICS_FIXED_WINDOW&SYMBOLS=AAPL,MSFT,IBM&RANGE=2023-07-01&RANGE=2023-08-31&INTERVAL=DAILY&OHLC=close&CALCULATIONS=MEAN,STDDEV,CORRELATION&apikey=${this.apiKey}`;
    this.sharedService.getCoreStock(url).subscribe((result) => {
      if (result.Information) {
        this.meanReturns = [];
        this.stdDev = [];
        this.correlationIndexes = [];
        this.correlationMatrix = [];
        this._snackBar.open(result.Information, '', {
          duration: 2000,
        });
      } else {
        const meanData = result.payload['RETURNS_CALCULATIONS'].MEAN;
        const stdData = result.payload['RETURNS_CALCULATIONS'].STDDEV;
        this.meanReturns = this.transformMeanData(meanData);
        this.stdDev = this.transformMeanData(stdData);
        this.correlationIndexes =
          result.payload['RETURNS_CALCULATIONS'].CORRELATION.index;
        this.correlationMatrix =
          result.payload['RETURNS_CALCULATIONS'].CORRELATION.correlation;
      }
    });
  }

  transformMeanData(data: {
    [key: string]: number;
  }): { name: string; value: number }[] {
    return Object.keys(data).map((key) => ({ name: key, value: data[key] }));
  }

  callFourthAPI() {
    let url = `https://www.alphavantage.co/query?function=ANALYTICS_SLIDING_WINDOW&SYMBOLS=AAPL,IBM&RANGE=2month&INTERVAL=DAILY&OHLC=close&WINDOW_SIZE=20&CALCULATIONS=MEAN,STDDEV(annualized=True)&apikey=${this.apiKey}`;
    this.sharedService.getCoreStock(url).subscribe((result) => {
      if (result.Information) {
        this.dataSource4.data = [];
        this._snackBar.open(result.Information, '', {
          duration: 2000,
        });
      } else {
        this.data = result;
        this.dataSource4.sort = this.sort4;
        this.dataSource4.paginator = this.paginator4;
        this.processData();
      }
    });
  }

  processData() {
    const dates = Object.keys(this.data.payload.RETURNS_CALCULATIONS.MEAN.RUNNING_MEAN.IBM);
    const stdDevIBM = this.data.payload.RETURNS_CALCULATIONS["STDDEV(ANNUALIZED=TRUE)"].RUNNING_STDDEV.IBM;
    const stdDevAAPL = this.data.payload.RETURNS_CALCULATIONS["STDDEV(ANNUALIZED=TRUE)"].RUNNING_STDDEV.AAPL;
    const windowStart = this.data.payload.RETURNS_CALCULATIONS.MEAN.window_start;

    const dataPoints: DataPoint[] = dates.map(date => ({
      date: date,
      ibmMean: this.data.payload.RETURNS_CALCULATIONS.MEAN.RUNNING_MEAN.IBM[date],
      aaplMean: this.data.payload.RETURNS_CALCULATIONS.MEAN.RUNNING_MEAN.AAPL[date],
      ibmStdDev: stdDevIBM[date],
      aaplStdDev: stdDevAAPL[date],
      windowStart: windowStart[date]
    }));

    this.dataSource4.data = dataPoints;
  }
}
