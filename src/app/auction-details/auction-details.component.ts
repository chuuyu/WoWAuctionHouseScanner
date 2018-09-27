import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WowApiService } from '../wow-api.service';
import { AuctionService } from '../auction.service';
import { Item } from '../itemModel';
import { ApiResult, File, AuctionsResult, Auction } from '../auctionModel';
import { DbApiService } from '../db-api.service';

import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.css']
})
export class AuctionDetailsComponent implements OnInit {

  item: Item;
  dateFile: number;
  auctionResult: Auction[];
  dataTable: any;

  auctionsChartData: any[];

  chartAreaOptions = {
    xkey: 'y',
    ykeys: ['a'],
    labels: ['auctions'],
    xLabelFormat: function (x) { return x.src.y.toString() + ' po/u'; },
    resize: true,
    parseTime: false
  };

  constructor(private route: ActivatedRoute,
    private apiService: WowApiService,
    private auctionService: AuctionService,
    private chRef: ChangeDetectorRef,
    private dbService: DbApiService) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');

    this.dbService.getItemById(id).subscribe((result: Item) => {
      this.item = result;
      this.apiService.getAuctionsFiles('ysondre', 'fr_FR').subscribe((data: ApiResult) => {
        if (data !== undefined) {
          this.getAuctionFromFile(data);
        } else {
          this.getAuctionFromStaticFile();
        }
      });
    });
  }


  getAuctionFromFile(apiResult: ApiResult): void {
    apiResult.files.forEach(element => {
      this.dbService.getAuctionsFilesByLastModified(element.lastModified).subscribe((files: File[]) => {
        if (files === undefined || files.length === 0) {
          this.dbService.createAuctionsFiles(element).subscribe();
        }
      });
    });
    const auctionFile = apiResult.files[apiResult.files.length - 1];


    this.dateFile = auctionFile.lastModified;
    console.log(this.dateFile);
    this.apiService.getAuctions(auctionFile.url).subscribe((auctionResult: AuctionsResult) => {

      this.auctionService.computeItemData(this.item, auctionResult.auctions);
      const itemId = this.item.id;
      this.auctionResult = auctionResult.auctions.filter(function (result) {
        return result.item === itemId && result.buyout !== 0;
      });

      // You'll have to wait that changeDetection occurs and projects data into
      // the HTML template, you can ask Angular to that for you ;-)
      this.chRef.detectChanges();

      // Now you can use jQuery DataTables :
      const table: any = $('table');
      this.dataTable = table.DataTable();
      this.getDetailsLineChart();

    });
  }

  getAuctionFromStaticFile(): void {
    this.apiService.getAuctionsFromStatic().subscribe((auctionResult: AuctionsResult) => {

      this.auctionService.computeItemData(this.item, auctionResult.auctions);
      const itemId = this.item.id;
      this.auctionResult = auctionResult.auctions.filter(function (result) {
        return result.item === itemId && result.buyout !== 0;
      });

      // You'll have to wait that changeDetection occurs and projects data into
      // the HTML template, you can ask Angular to that for you ;-)
      this.chRef.detectChanges();

      // Now you can use jQuery DataTables :
      const table: any = $('table');
      this.dataTable = table.DataTable();
      this.getDetailsLineChart();
    });
  }

  getDetailsLineChart(): void {

    const dataByGroupRange = this.auctionResult.reduce(function (result, current) {
      const unitP = Math.round(current.buyout / current.quantity / 10000);
      result[unitP] = result[unitP] || [];
      result[unitP].push(current);
      return result;
    }, {});

    const mapped = Object.keys(dataByGroupRange).map(key => ({ y: key, a: dataByGroupRange[key].length }));

    this.auctionsChartData = mapped.sort(function (a, b) { return (+a.y > +b.y) ? 1 : ((+b.y > +a.y) ? -1 : 0); });

  }

}
