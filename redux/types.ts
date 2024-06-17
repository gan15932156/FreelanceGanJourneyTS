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
