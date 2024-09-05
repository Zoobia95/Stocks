import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../shared.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { API_KEY } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// @ts-ignore
@Component({
  selector: 'app-options-data',
  templateUrl: './options-data.component.html',
  styleUrls: ['./options-data.component.css'],
})
export class OptionsDataComponent implements OnInit {
  param: any;
  apiKey = API_KEY.key;
  displayedColumns!: string[];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns2!: string[];
  dataSource2 = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator2!: MatPaginator;
  @ViewChild(MatSort) sort2!: MatSort;

  constructor(
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
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
        this.displayedColumns = [
          'contractID',
          'symbol',
          'expiration',
          'strike',
          'type',
          'last',
          'mark',
          'bid',
          'bid_size',
          'ask',
          'ask_size',
          'volume',
          'open_interest',
          'date',
        ];
        apiCase = 'first';
        break;
      case '2':
        this.displayedColumns2 =  [
          'contractID',
          'symbol',
          'expiration',
          'strike',
          'type',
          'last',
          'mark',
          'bid',
          'bid_size',
          'ask',
          'ask_size',
          'volume',
          'open_interest',
          'date',
          'implied_volatility',
          'delta',
          'gamma',
          'theta',
          'vega',
          'rho',
        ];
        apiCase = 'second';
        break;
      default:
        this.displayedColumns = [
          'contractID',
          'symbol',
          'expiration',
          'strike',
          'type',
          'last',
          'mark',
          'bid',
          'bid_size',
          'ask',
          'ask_size',
          'volume',
          'open_interest',
          'date',
        ];
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
      default:
        this.callFirstAPI();
    }
  }

  callFirstAPI() {
    let url = `https://www.alphavantage.co/query?function=REALTIME_OPTIONS&symbol=IBM&apikey=${this.apiKey}`;
    this.sharedService.getCoreStock(url).subscribe((result) => {
      if (result.Information) {
        this.dataSource.data = [];
        this._snackBar.open(result.Information, '', {
          duration: 2000,
        });
      } else {
        const optionsData = result.data;
        this.dataSource.data = optionsData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  callSecondAPI() {
    let url = `https://www.alphavantage.co/query?function=HISTORICAL_OPTIONS&symbol=IBM&apikey=${this.apiKey}`;
    this.sharedService.getCoreStock(url).subscribe((result) => {
      if (result.Information) {
        this.dataSource.data = [];
        this._snackBar.open(result.Information, '', {
          duration: 2000,
        });
      } else {
        const optionsData = result.data;
        this.dataSource2.data = optionsData;
        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.sort2;
      }
    });
  }
}
