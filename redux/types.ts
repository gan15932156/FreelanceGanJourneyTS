export type IUserInfo = {
  name: string;
  email: string;
};
export type IAccountInfo = {
  province: string;
  address: string;
  district: string;
  subDistrict: string;
  taxId: string;
  tel: string;
  zipCode: string;
};
export interface IUserInfoResponse extends IUserInfo {
  accountInfo: IAccountInfo;
}
export interface IUserInfoUpdate extends IAccountInfo {
  name: string;
  id: string;
}
export interface IUserUpdateResponse {
  result: Object;
  message: string;
}
export interface IService {
  id?: string;
  name: string;
  price: number;
  desc: string;
  note?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}
export interface IServiceResponse {
  message: string;
  result: {
    data: IService[];
    total: number;
  };
}
export interface IQueryRequest {
  page: number;
  per_page: number;
  sort?: string;
}
