import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WowApiService } from '../wow-api.service';
import { AuctionService } from '../auction.service';
import { Item } from '../itemModel';
import { ApiResult, File, AuctionsResult, Auction } from '../auctionModel';

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
    labels: ['quantity'],
    xLabelFormat: function (x) {return x.src.y + ' po'; },
    resize: true,
    parseTime: false
  };

  constructor(private route: ActivatedRoute,
    private apiService: WowApiService,
    private auctionService: AuctionService,
    private chRef: ChangeDetectorRef) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.apiService.getItems().subscribe((itemsFocus: Item[]) => {
      this.item = itemsFocus.filter(function (o) {
        return o.id === id;
      })[0];

      this.apiService.getAuctionsFiles('ysondre', 'fr_FR').subscribe((data: any) => {
        if (data !== undefined) {
          this.getAuctionFromFile(data);
        } else {
          this.getAuctionFromStaticFile();
        }
      });
    });
  }


  getAuctionFromFile(apiResult: ApiResult): void {
    this.dateFile = apiResult.files[0].lastModified;
    this.apiService.getAuctions(apiResult.files[0].url).subscribe((auctionResult: AuctionsResult) => {

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
