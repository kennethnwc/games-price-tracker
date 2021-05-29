export interface WishListResponse {
  wishList: WishList[];
  userID: number;
}

export interface WishList {
  id: number;
  title: string;
  store_id: string;
  image_url: string;
  prices: Price[];
}

export interface Price {
  id: number;
  code: string;
  amount: number;
  start_date: string;
}
