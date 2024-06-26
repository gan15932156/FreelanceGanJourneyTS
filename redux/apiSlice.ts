import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  IGetServiceResponse,
  IService,
  IServiceInput,
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
    getServices: builder.query<IGetServiceResponse, IServiceInput>({
      query(input) {
        const page = input.pagination.pageIndex + 1,
          per_page = 8,
          lastCursor = input.lastCursor,
          oldPageIndex = input.oldPageIndex;

        if (lastCursor != "") {
          if (oldPageIndex != null) {
            if (page > oldPageIndex + 1) {
              // next page
              const skipPage: number =
                (page - (oldPageIndex + 1)) * per_page - 1;
              return {
                url: `/service?lastCursor=${lastCursor}&page=${page}&skip=${skipPage}&direction=${"f"}`,
                method: "GET",
              };
            } else {
              // previous page
              const skipPage: number = page * per_page - per_page;
              console.log(skipPage);
              return {
                url: `/service?lastCursor=${lastCursor}&page=${page}&skip=${skipPage}&direction=${"b"}`,
                method: "GET",
              };
            }
          } else {
            return {
              url: `/service?lastCursor=${lastCursor}&page=${page}&skip=${1}&direction=${"f"}`,
              method: "GET",
            };
          }
        } else {
          return {
            url: `/service?lastCursor=${lastCursor}&page=${page}&skip=${1}&direction=${"f"}`,
            method: "GET",
          };
        }
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
  }),
});
export const {
  useGetUserInfoQuery,
  useGetServicesQuery,
  useUpdateUserInfoMutation,
  useCreateServiceMutation,
} = apiSlice;

// best pratice api route
// https://blog.stackademic.com/a-guide-to-build-an-api-server-with-nextjs-14-and-mongoose-e01f0e10a68a
