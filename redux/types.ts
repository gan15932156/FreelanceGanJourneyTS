import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";

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

export interface ITableService {
  name: string;
  price: number;
}
export interface IServiceResponse {
  limit: number;
  page: number;
  total: number;
  total_filtered: number;
  data: IService[];
}
export interface IServiceInput {
  // sorting: SortingState;
  // columnFilters: ColumnFiltersState;
  pagination: PaginationState;
  oldPageIndex: number | null;
  lastCursor: string;
}
export interface IGetServiceResponse {
  result: IServiceResponse;
  message: string;
}
export interface UseGetTableResponseType<TData> {
  limit: number;
  page: number;
  total: number;
  total_filtered: number;
  data: TData[];
}
export interface PaginationInput<TData> {
  pagination: PaginationState;
  cursor: TData;
  oldPageIndex: number | null;
}
export interface TableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  paginatedTableData?: UseGetTableResponseType<TData>;
  // sorting?: SortingState;
  // setSorting?: Dispatch<SetStateAction<SortingState>>;
  setPaginationInput: Dispatch<SetStateAction<PaginationInput<TData>>>;
  pagination?: PaginationState;
}
