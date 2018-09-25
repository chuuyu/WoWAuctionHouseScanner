import { Component, OnInit } from '@angular/core';
import { WowApiService } from '../wow-api.service';
import { ApiResult, File, AuctionsResult, Auction } from '../auctionModel';
import { Item } from '../itemModel';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  items: Item[];
  dateFile: number;

  constructor(private apiService: WowApiService) { }

  ngOnInit() {
    this.apiService.getItems().subscribe((itemsFocus: Item[]) => {
      this.items = itemsFocus;
      this.apiService.getAuctionsFiles('ysondre', 'fr_FR').subscribe((data: any) => {
        console.log(data);
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


      this.items.forEach(element => {
        const auctionsForItem = auctionResult.auctions.filter(function (result) {
          return result.item === element.id && result.buyout !== 0;
        });

        element.minBuyout = auctionsForItem.map(o => o.buyout / o.quantity / 10000).reduce(function (prev, current) {
          return (prev < current) ? prev : current;
        });

        element.maxBuyout = auctionsForItem.map(o => o.buyout / o.quantity / 10000).reduce(function (prev, current) {
          return (prev > current) ? prev : current;
        });

        const totalBuyout = auctionsForItem.map(o => o.buyout).reduce(function (prev, current) {
          return prev + current;
        });
        element.qteItems = auctionsForItem.map(o => o.quantity).reduce(function (prev, current) {
          return prev + current;
        });
        element.avgBuyout = totalBuyout / element.qteItems / 10000;
      });
    });
  }

  getAuctionFromStaticFile(): void {
    this.apiService.getAuctionsFromStatic().subscribe((auctionResult: AuctionsResult) => {
      this.items.forEach(element => {
        const auctionsForItem = auctionResult.auctions.filter(function (result) {
          return result.item === element.id && result.buyout !== 0;
        });

        element.minBuyout = auctionsForItem.map(o => o.buyout / o.quantity / 10000).reduce(function (prev, current) {
          return (prev < current) ? prev : current;
        });

        element.maxBuyout = auctionsForItem.map(o => o.buyout / o.quantity / 10000).reduce(function (prev, current) {
          return (prev > current) ? prev : current;
        });

        const totalBuyout = auctionsForItem.map(o => o.buyout).reduce(function (prev, current) {
          return prev + current;
        });
        element.qteItems = auctionsForItem.map(o => o.quantity).reduce(function (prev, current) {
          return prev + current;
        });
        element.avgBuyout = totalBuyout / element.qteItems / 10000;
      });
    });
  }

}
