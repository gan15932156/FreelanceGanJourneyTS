import { TUserPaymentSchema } from "./../schemas/index";
import { TClientSchema } from "@/schemas";

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
export interface IGetResponse<TData> {
  result: TData;
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
export interface IGetRequest {
  id: string;
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
export interface IClientsResponse {
  message: string;
  result: {
    data: TClientSchema[];
    total: number;
  };
}

export interface IUserPaymentResponse {
  message: string;
  result: {
    data: TUserPaymentSchema;
  };
}
