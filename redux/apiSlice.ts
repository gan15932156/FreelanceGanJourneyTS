import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  IClientsResponse,
  IGetResponse,
  IQueryRequest,
  IQuotationResponse,
  IQuotationTokenResponse,
  IService,
  IServiceResponse,
  IUserInfoResponse,
  IUserInfoUpdate,
  IUserPaymentResponse,
  IUserUpdateResponse,
  IVerifyQuotationTokenResponse,
  TQuotationFullRelated,
  TQuotationTokenWithDataSchema,
  TQuotationUpdateStatusSchema,
} from "./types";
import {
  TClientSchema,
  TClientSchemaWithoutExtras,
  TQuotationRequestSchema,
  TQuotationSchema,
  TUserPaymentSchemaWithoutExtras,
} from "@/schemas";
const BASEURL = "/api";
export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: fetchBaseQuery({ baseUrl: BASEURL }),
  tagTypes: [
    "userInfo",
    "services",
    "clients",
    "userPayment",
    "quotations",
    "quotationToken",
    "quotationTokenWithData",
  ],
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
    getUserInfoWithoutId: builder.query<IGetResponse<IUserInfoResponse>, void>({
      query() {
        return {
          url: `/user/userInfo`,
          method: "GET",
        };
      },
      providesTags: ["userInfo"],
    }),
    getGeneratedQid: builder.query<IGetResponse<string>, void>({
      query() {
        return {
          url: `/quotation/getId`,
          method: "GET",
        };
      },
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
      providesTags: (result) =>
        result?.result
          ? [
              ...result.result.data.map(({ id }) => ({
                type: "services" as const,
                id,
              })),
              { type: "services", id: "PARTIAL-LIST" },
            ]
          : [{ type: "services", id: "PARTIAL-LIST" }],
    }),
    getAllServiceById: builder.query<IGetResponse<IService[]>, void>({
      query() {
        return {
          url: `/service/getAllById`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.result
          ? [
              ...result.result.map(({ id }) => ({
                type: "services" as const,
                id,
              })),
              { type: "services", id: "LIST" },
            ]
          : [{ type: "services", id: "LIST" }],
    }),
    getService: builder.query<IGetResponse<IService>, string>({
      query(input) {
        return {
          url: `/service/${input}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.result
          ? [
              {
                type: "services" as const,
                id: result.result.id,
              },
            ]
          : [{ type: "services", id: "PARTIAL-LIST" }],
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
      providesTags: (result) =>
        result?.result
          ? [
              ...result.result.data.map(({ id }) => ({
                type: "clients" as const,
                id,
              })),
              { type: "clients", id: "PARTIAL-LIST" },
            ]
          : [{ type: "clients", id: "PARTIAL-LIST" }],
    }),
    getAllClientById: builder.query<IGetResponse<TClientSchema[]>, void>({
      query() {
        return {
          url: `/client/getAllById`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.result
          ? [
              ...result.result.map(({ id }) => ({
                type: "clients" as const,
                id,
              })),
              { type: "clients", id: "LIST" },
            ]
          : [{ type: "clients", id: "LIST" }],
    }),
    getClient: builder.query<IGetResponse<TClientSchema>, string>({
      query(input) {
        return {
          url: `/client/${input}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.result
          ? [
              {
                type: "clients" as const,
                id: result.result.id,
              },
            ]
          : [{ type: "clients", id: "PARTIAL-LIST" }],
    }),
    getQuotation: builder.query<IGetResponse<TQuotationFullRelated>, string>({
      query(input) {
        return {
          url: `/quotation/${input}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "quotations", id: "PARTIAL-LIST" }],
    }),
    getQuotations: builder.query<IQuotationResponse, IQueryRequest>({
      query(input) {
        const { page, per_page, sort } = input;
        const offset = (page - 1) * per_page;
        return {
          url: `/quotation?offset=${offset}&limit=${per_page}&sort=${sort}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.result
          ? [
              ...result.result.data.map(({ id }) => ({
                type: "quotations" as const,
                id,
              })),
              { type: "quotations", id: "PARTIAL-LIST" },
            ]
          : [{ type: "quotations", id: "PARTIAL-LIST" }],
    }),
    getQuotationToken: builder.query<IQuotationTokenResponse, string>({
      query(id) {
        return {
          url: `/quotation/${id}/getToken`,
          method: "GET",
        };
      },
      providesTags: ["quotationToken"],
    }),
    getQuotationTokenWithData: builder.query<
      IGetResponse<TQuotationTokenWithDataSchema>,
      string
    >({
      query(id) {
        return {
          url: `/linkToken/${id}/quotation`,
          method: "GET",
        };
      },
      // providesTags: ["quotationTokenWithData"],
    }),
    verifyQuotationToken: builder.query<IVerifyQuotationTokenResponse, string>({
      query(token) {
        return {
          url: `/quotation/verifyToken`,
          method: "POST",
          body: { token },
        };
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
    createQuotation: builder.mutation<IUserUpdateResponse, TQuotationSchema>({
      query(body) {
        return { url: `/quotation`, method: "POST", body: body };
      },
      invalidatesTags: ["quotations"],
    }),
    createQuotationToken: builder.mutation<IQuotationTokenResponse, string>({
      query(id) {
        return {
          url: `/quotation/${id}/generateLinkToken`,
          method: "POST",
        };
      },
      invalidatesTags: ["quotations", "quotationToken"],
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
    updateQuotation: builder.mutation<
      IUserUpdateResponse,
      TQuotationRequestSchema
    >({
      query({ id, ...rest }) {
        return { url: `/quotation/${id}`, method: "PUT", body: rest };
      },
      invalidatesTags: ["quotations"],
    }),
    updateQuotationStatus: builder.mutation<
      IUserUpdateResponse,
      TQuotationUpdateStatusSchema
    >({
      query({ id, ...rest }) {
        return {
          url: `/quotation/${id}/updateStatus`,
          method: "PUT",
          body: rest,
        };
      },
      invalidatesTags: ["quotations"],
    }),
  }),
});
export const {
  useGetUserInfoQuery,
  useGetUserInfoWithoutIdQuery,
  useGetGeneratedQidQuery,
  useGetUserPaymentInfoQuery,
  useGetServicesQuery,
  useGetAllServiceByIdQuery,
  useGetServiceQuery,
  useGetClientsQuery,
  useGetAllClientByIdQuery,
  useGetClientQuery,
  useGetQuotationQuery,
  useGetQuotationsQuery,
  useGetQuotationTokenQuery,
  useGetQuotationTokenWithDataQuery,
  useVerifyQuotationTokenQuery,
  useUpdateUserInfoMutation,
  useUpdateUserPaymentInfoMutation,
  useCreateClientMutation,
  useCreateServiceMutation,
  useCreateQuotationMutation,
  useCreateQuotationTokenMutation,
  useUpdateServiceMutation,
  useUpdateClientMutation,
  useUpdateQuotationMutation,
  useUpdateQuotationStatusMutation,
} = apiSlice;

// best pratice api route
// https://blog.stackademic.com/a-guide-to-build-an-api-server-with-nextjs-14-and-mongoose-e01f0e10a68a
