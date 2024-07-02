import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  IClientsResponse,
  IGetRequest,
  IGetResponse,
  IQueryRequest,
  IService,
  IServiceResponse,
  IUserInfoResponse,
  IUserInfoUpdate,
  IUserPaymentResponse,
  IUserUpdateResponse,
} from "./types";
import {
  TClientSchema,
  TClientSchemaWithoutExtras,
  TUserPaymentSchemaWithoutExtras,
} from "@/schemas";
const BASEURL = "/api";
export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: fetchBaseQuery({ baseUrl: BASEURL }),
  tagTypes: ["userInfo", "services", "clients", "userPayment"],
  endpoints: (builder) => ({
    getUserInfo: builder.query<IUserInfoResponse, string>({
      query(id) {
        return {
          url: `/user/${id}/userInfo`,
          method: "GET",
        };
      },
      providesTags: ["userInfo"],
    }),
    getUserPaymentInfo: builder.query<IUserPaymentResponse, void>({
      query() {
        return {
          url: `/user/payment`,
          method: "GET",
        };
      },
      providesTags: ["userPayment"],
    }),
    getServices: builder.query<IServiceResponse, IQueryRequest>({
      query(input) {
        const { page, per_page, sort } = input;
        const offset = (page - 1) * per_page;
        return {
          url: `/service?offset=${offset}&limit=${per_page}&sort=${sort}`,
          method: "GET",
        };
      },
      providesTags: (result, error, arg) => {
        return [
          {
            type: "services",
            id: arg.page + "_" + arg.per_page + "_" + arg.sort,
          },
        ];
      },
    }),
    getService: builder.query<IGetResponse<IService>, string>({
      query(input) {
        return {
          url: `/service/${input}`,
          method: "GET",
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.result) {
          return [
            {
              type: "services",
              id: result?.result.id,
            },
          ];
        } else {
          return ["services"];
        }
      },
    }),
    getClients: builder.query<IClientsResponse, IQueryRequest>({
      query(input) {
        const { page, per_page, sort } = input;
        const offset = (page - 1) * per_page;
        return {
          url: `/client?offset=${offset}&limit=${per_page}&sort=${sort}`,
          method: "GET",
        };
      },
      providesTags: (result, error, arg) => {
        return [
          {
            type: "clients",
            id: arg.page + "_" + arg.per_page + "_" + arg.sort,
          },
        ];
      },
    }),
    getClient: builder.query<IGetResponse<TClientSchema>, string>({
      query(input) {
        return {
          url: `/client/${input}`,
          method: "GET",
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.result) {
          return [
            {
              type: "clients",
              id: result?.result.id,
            },
          ];
        } else {
          return ["clients"];
        }
      },
    }),
    updateUserInfo: builder.mutation<IUserUpdateResponse, IUserInfoUpdate>({
      query(body) {
        return {
          url: `/user/${body.id}/userInfo`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["userInfo"],
    }),
    updateUserPaymentInfo: builder.mutation<
      IUserUpdateResponse,
      TUserPaymentSchemaWithoutExtras
    >({
      query(body) {
        return {
          url: `/user/payment`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["userPayment"],
    }),
    createService: builder.mutation<IUserUpdateResponse, IService>({
      query(body) {
        return { url: `/service`, method: "POST", body: body };
      },
      invalidatesTags: ["services"],
    }),
    createClient: builder.mutation<
      IUserUpdateResponse,
      TClientSchemaWithoutExtras
    >({
      query(body) {
        return { url: `/client`, method: "POST", body: body };
      },
      invalidatesTags: ["clients"],
    }),
    updateService: builder.mutation<IUserUpdateResponse, IService>({
      query({ id, ...rest }) {
        return { url: `/service/${id}`, method: "PUT", body: rest };
      },
      invalidatesTags: ["services"],
    }),
    updateClient: builder.mutation<
      IUserUpdateResponse,
      TClientSchemaWithoutExtras
    >({
      query({ id, ...rest }) {
        return { url: `/client/${id}`, method: "PUT", body: rest };
      },
      invalidatesTags: ["clients"],
    }),
  }),
});
export const {
  useGetUserInfoQuery,
  useGetUserPaymentInfoQuery,
  useGetServicesQuery,
  useGetServiceQuery,
  useGetClientsQuery,
  useGetClientQuery,
  useUpdateUserInfoMutation,
  useUpdateUserPaymentInfoMutation,
  useCreateClientMutation,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useUpdateClientMutation,
} = apiSlice;

// best pratice api route
// https://blog.stackademic.com/a-guide-to-build-an-api-server-with-nextjs-14-and-mongoose-e01f0e10a68a
