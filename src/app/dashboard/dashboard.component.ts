import { Component, OnInit } from '@angular/core';
import { WowApiService } from '../wow-api.service';
import { AuctionService } from '../auction.service';
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

  constructor(private apiService: WowApiService, private auctionService: AuctionService) { }

  ngOnInit() {
    this.apiService.getItems().subscribe((itemsFocus: Item[]) => {
      this.items = itemsFocus;
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
      this.items.forEach(element => {
        this.auctionService.computeItemData(element, auctionResult.auctions);
      });
    });
  }

  getAuctionFromStaticFile(): void {
    this.apiService.getAuctionsFromStatic().subscribe((auctionResult: AuctionsResult) => {
      this.items.forEach(element => {
        this.auctionService.computeItemData(element, auctionResult.auctions);
      });
    });
  }

}
