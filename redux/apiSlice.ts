import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  IQueryRequest,
  IService,
  IServiceResponse,
  IUserInfoResponse,
  IUserInfoUpdate,
  IUserUpdateResponse,
} from "./types";
const BASEURL = "/api";
export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: fetchBaseQuery({ baseUrl: BASEURL }),
  tagTypes: ["userInfo", "services"],
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
    getServices: builder.query<IServiceResponse, IQueryRequest>({
      query(input) {
        const { page, per_page, sort } = input;
        const offset = (page - 1) * per_page;
        return {
          url: `/service?page=${page}&offset=${offset}&limit=${per_page}&sort=${sort}`,
          method: "GET",
        };
      },
      providesTags: ["services"],
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
    createService: builder.mutation<IUserUpdateResponse, IService>({
      query(body) {
        return { url: `/service`, method: "POST", body: body };
      },
      invalidatesTags: ["services"],
    }),
    updateService: builder.mutation<IUserUpdateResponse, IService>({
      query({ id, ...rest }) {
        return { url: `/service/${id}`, method: "PUT", body: rest };
      },
      invalidatesTags: ["services"],
    }),
  }),
});
export const {
  useGetUserInfoQuery,
  useGetServicesQuery,
  useUpdateUserInfoMutation,
  useCreateServiceMutation,
  useUpdateServiceMutation,
} = apiSlice;

// best pratice api route
// https://blog.stackademic.com/a-guide-to-build-an-api-server-with-nextjs-14-and-mongoose-e01f0e10a68a
