import { Component, OnInit, Input, ChangeDetectorRef, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

import { WowApiService } from '../wow-api.service';
import { ApiResult, File, AuctionsResult, Auction } from '../auctionModel';

import { Item } from '../itemModel';

import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';

@Component({
  selector: 'app-auction-house',
  templateUrl: './auction-house.component.html',
  styleUrls: ['./auction-house.component.css']
})
export class AuctionHouseComponent implements OnChanges, OnInit {

  @Input() item: Item;
  auctionResult: Auction[];
  dataTable: any;
  lineChartDatas: any[];
  lineChartDatasDetails: any[];
  dateFile: number;

  chartAreaOptions = {
    xkey: 'y',
    ykeys: ['a'],
    labels: ['quantity'],
    resize: true,
    parseTime: false
  };

  constructor(private apiService: WowApiService, private chRef: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const item: SimpleChange = changes.item;
    if (item.currentValue) {
      this.getAuctionFiles(item.currentValue);
    }
  }

  getAuctionFiles(item: Item): void {
    this.apiService.getAuctionsFiles('hyjal', 'fr_FR').subscribe((data: any) => {
      if (data !== undefined) {
        this.getAuctionFromFile(data, item);
      } else {
        this.getAuctionFromStaticFile(item);
      }
    });
  }

  getAuctionFromFile(apiResult: ApiResult, item: Item): void {
    this.dateFile = apiResult.files[0].lastModified;
    this.apiService.getAuctions(apiResult.files[0].url).subscribe((data: AuctionsResult) => {
      this.auctionResult = data.auctions.filter(function (result) {
        return result.item === this.item.id && result.buyout !== 0;
      });

      // You'll have to wait that changeDetection occurs and projects data into
      // the HTML template, you can ask Angular to that for you ;-)
      this.chRef.detectChanges();

      // Now you can use jQuery DataTables :
      const table: any = $('table');
      this.dataTable = table.DataTable();
      this.getLineChart();
      this.getDetailsLineChart();
    });
  }

  getAuctionFromStaticFile(item: Item): void {
    this.apiService.getAuctionsFromStatic().subscribe((data: AuctionsResult) => {
      this.auctionResult = data.auctions.filter(function (result) {
        return result.item === item.id && result.buyout !== 0;
      });

      // You'll have to wait that changeDetection occurs and projects data into
      // the HTML template, you can ask Angular to that for you ;-)
      this.chRef.detectChanges();

      // Now you can use jQuery DataTables :
      const table: any = $('table');
      this.dataTable = table.DataTable();
      this.getLineChart();
      this.getDetailsLineChart();
    });
  }

  getUnitePrice(auction: Auction): number {
    return auction.buyout / auction.quantity;
  }

  getLineChart(): void {

    const dataByGroupRange = this.auctionResult.reduce(function (result, current) {
      const unitP = current.buyout / current.quantity / 10000;
      const rangeIndex = Math.floor(unitP / 25);

      const stringRange = rangeIndex * 25 + '-' + ((rangeIndex + 1) * 25 - 1);

      result[stringRange] = result[stringRange] || [];
      result[stringRange].push(current);
      return result;
    }, {});

    // const mapped = Object.keys(dataByGroupRange).map(key => ({ y: key, a: dataByGroupRange[key].length }));
    const mapped = Object.keys(dataByGroupRange).map(key => ({
      y: key,
      a: dataByGroupRange[key].map(auc => auc.quantity).reduce((a, b) => a + b)
    }));
    this.lineChartDatas = mapped.sort(function (a, b) { return (a.y > b.y) ? 1 : ((b.y > a.y) ? -1 : 0); });

  }

  getDetailsLineChart(): void {

    const dataByGroupRange = this.auctionResult.reduce(function (result, current) {
      const unitP = Math.round(current.buyout / current.quantity / 10000);
      // const rangeIndex = Math.round(unitP / 25);

      // const stringRange = rangeIndex * 25 + '-' + ((rangeIndex + 1) * 25 - 1);

      result[unitP] = result[unitP] || [];
      result[unitP].push(current);
      return result;
    }, {});

    const mapped = Object.keys(dataByGroupRange).map(key => ({ y: key, a: dataByGroupRange[key].length }));
    this.lineChartDatasDetails = mapped.sort(function (a, b) { return (a.y > b.y) ? 1 : ((b.y > a.y) ? -1 : 0); });


  }
}

