import { Component, OnInit } from '@angular/core';

import { WowApiService } from '../wow-api.service';
import { Item } from '../itemModel';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  items: Item[];
  name: string;
  selectedItem: Item;
  constructor(private apiService: WowApiService) { }

  ngOnInit() {
    this.apiService.getItems().subscribe((data: any) => {
      // this.items = data.filter(function (item) {
      //   return item.name.toLowerCase().indexOf(name.toLowerCase()) > -1;
      // });
      this.items = data;
    });
  }

  onSearch(name: string): void {
    // if name can be parse to int then use WoW api, else use local item file
    if (Number(name)) {
      this.apiService.getItem(name, 'fr_FR').subscribe((data: any) => {
        this.selectedItem = data;
      });
    } else {
      this.apiService.getItems().subscribe((data: any) => {
        // this.items = data.filter(function (item) {
        //   return item.name.toLowerCase().indexOf(name.toLowerCase()) > -1;
        // });
        this.items = data;
      });
    }
  }

  onSelect(item: Item): void {
    this.selectedItem = item;
  }


}
