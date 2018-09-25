import { Injectable } from '@angular/core';
import { Auction } from './auctionModel';
import { Item } from './itemModel';
@Injectable({
  providedIn: 'root'
})
export class AuctionService {

  constructor() { }

  computeItemData(item: Item, auctions: Auction[]): void {
    const auctionsForItem = auctions.filter(function (result) {
      return result.item === item.id && result.buyout !== 0;
    });

    item.qteAuctions = auctionsForItem.length;
    item.minBuyout = auctionsForItem.map(o => o.buyout / o.quantity / 10000).reduce(function (prev, current) {
      return (prev < current) ? prev : current;
    });

    item.maxBuyout = auctionsForItem.map(o => o.buyout / o.quantity / 10000).reduce(function (prev, current) {
      return (prev > current) ? prev : current;
    });

    const totalBuyout = auctionsForItem.map(o => o.buyout).reduce(function (prev, current) {
      return prev + current;
    });
    item.qteItems = auctionsForItem.map(o => o.quantity).reduce(function (prev, current) {
      return prev + current;
    });
    item.avgBuyout = totalBuyout / item.qteItems / 10000;

    item.marketPrice = this.calculateMarketPrice(auctionsForItem);

    const auctionsUnderMarket = auctionsForItem.filter(function (o) {
      return o.buyout / o.quantity / 10000 <= item.marketPrice;
    });
    item.qteAuctionsUnderMarket = auctionsUnderMarket.length;

    item.qteItemsUnderkMarket = auctionsUnderMarket.map(o => o.quantity).reduce(function (prev, current) {
      return prev + current;
    });
  }

  calculateMarketPrice(auctions: Auction[]): number {
    // étape 1 : prendre 30% des plus petites enchères
    const uniquePUs = auctions.map(o => o.buyout / o.quantity / 10000)
      .filter(function (value, index, self) {
        return self.indexOf(value) === index;
      }).sort(function (a, b) {
        return (a > b) ? 1 : ((b > a) ? -1 : 0);
      });

    const puAt30 = uniquePUs[Math.round(uniquePUs.length * 0.3)];

    const auctionsAfterStep1 = auctions.filter(function (item) {
      return item.buyout / item.quantity / 10000 <= puAt30;
    });

    // étape 2 : Écart-type
    // Calculez la moyenne.

    const avgUnitPrice = this.getAvgUnitPrice(auctionsAfterStep1);
    // Soustrayez de chaque observation la moyenne
    // et calculez le carré de chacune des autres observations (x-avg)²f.

    const dataByGroupRange = auctionsAfterStep1.reduce(function (result, current) {
      const unitP = Math.round(current.buyout / current.quantity);

      result[unitP] = result[unitP] + current.quantity || current.quantity;
      return result;
    }, {});

    const variances = Object.keys(dataByGroupRange).map(function (key) {
      return Math.pow(+key - avgUnitPrice, 2) * dataByGroupRange[key];
    });

    // Additionnez ces résultats au carré.
    const ttVariance = variances.reduce(function (prev, current) {
      return prev + current;
    });
    // Divisez ce total par le nombre d'observations (la variance, S2).
    // Utilisez la racine carrée positive (écart-type, S).
    const qteItems = auctionsAfterStep1.map(o => o.quantity).reduce(function (prev, current) {
      return prev + current;
    });
    const ecart = Math.sqrt(ttVariance / qteItems);

    const maxUnit = avgUnitPrice + ecart * 1.5;
    const minUnit = avgUnitPrice - ecart * 1.5;

    const auctionsAfterStep2 = auctionsAfterStep1.filter(function (item) {
      const up = item.buyout / item.quantity;
      return up <= maxUnit && up >= minUnit;
    });

    return this.getAvgUnitPrice(auctionsAfterStep2) / 10000;
  }

  getAvgUnitPrice(auctions: Auction[]): number {
    const totalBuyout = auctions.map(o => o.buyout).reduce(function (prev, current) {
      return prev + current;
    });
    const qteItems = auctions.map(o => o.quantity).reduce(function (prev, current) {
      return prev + current;
    });
    return totalBuyout / qteItems;
  }


}
