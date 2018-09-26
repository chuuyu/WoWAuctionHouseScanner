export class ApiResult {
    files: File[];
}
export class File {
    id: number;
    url: string;
    lastModified: number;
}

export class AuctionsResult {
    realms: Realm[];
    auctions: Auction[];
}
export class Realm {
    name: string;
    slug: string;
}

export class Auction {
    auc: number;
    item: number;
    owner: string;
    ownerRealm: string;
    bid: number;
    buyout: number;
    quantity: number;
    timeLeft: string;
    rand: number;
    seed: number;
    context: number;
}
