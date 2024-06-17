"use client";

import { UserInfoSchema } from "@/schemas";
import { Control } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";
import { resolveResultByField } from "@/lib/th-address-utls";
import { useReducer, useState } from "react";
import ThAutoCompleteBox from "./th-auto-complete-selection";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
export interface AddressObject {
  subDistrict: string;
  district: string;
  province: string;
  zipCode: string;
}

interface Action {
  type: string;
  payload: any;
}
const initialState = {
  entities: [],
  searchKey: "",
  search: "",
  form: {
    subDistrict: "",
    district: "",
    province: "",
    zipCode: "",
  },
};
function reducer(state: any, action: Action) {
  const { payload } = action;
  switch (action.type) {
    case SEARCH_ACTION:
      return {
        ...state,
        entities: resolveResultByField(payload.type, payload.search),
        searchKey: payload.type,
        search: payload.search,
      };
    case FORM_CHANGE_ACTION:
      return {
        ...state,
        form: {
          ...state.form,
          [payload.name]: payload.value,
        },
      };
    case SELECT_ADDRESS:
      return {
        ...state,
        form: {
          ...state.form,
          ...payload,
        },
      };
    default:
      throw new Error();
  }
}
const SEARCH_ACTION = "SEARCH_ACTION";
const FORM_CHANGE_ACTION = "FORM_CHANGE_ACTION";
const SELECT_ADDRESS = "SELECT_ADDRESS";
interface Props {
  control: Control<z.infer<typeof UserInfoSchema>>;
  isPending: boolean;
  isLoading: boolean;
  onSetFormValue(name: string, value: unknown, config?: Object): void;
}
export default function ThAddressAutoComplete({
  control,
  isPending,
  isLoading,
  onSetFormValue,
}: Props) {
  const [anchorEl, setAnchorEl] = useState<string>("");
  const [state, dispatch] = useReducer(reducer, initialState);
  const handlerClick = (obj: AddressObject) => {
    setAnchorEl("");
    dispatch({
      type: SELECT_ADDRESS,
      payload: { ...obj },
    });

    onSetFormValue("subDistrict", obj.subDistrict);
    onSetFormValue("district", obj.district);
    onSetFormValue("province", obj.province);
    onSetFormValue("zipCode", obj.zipCode.toString());
  };
  const handlerFormChange = (event: any) => {
    dispatch({
      type: FORM_CHANGE_ACTION,
      payload: {
        name: event.target,
        search: event.target.value,
      },
    });
    dispatch({
      type: SEARCH_ACTION,
      payload: {
        type: event.target.name,
        search: event.target.value,
      },
    });
    setAnchorEl(event.target.name);
  };
  return (
    <div className="flex flex-col justify-center gap-4">
      <div className="grid">
        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>ที่อยู่</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading || isPending}
                  {...field}
                  placeholder="ที่อยู่"
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-row gap-2">
        <FormField
          control={control}
          name="subDistrict"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>ตำบล</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading || isPending}
                  autoComplete="none"
                  placeholder="ตำบล"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handlerFormChange(e);
                  }}
                  type="text"
                />
              </FormControl>
              <ThAutoCompleteBox
                onSelect={handlerClick}
                address={state.entities}
                isActive={anchorEl == "subDistrict"}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="district"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>อำเภอ</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading || isPending}
                  autoComplete="none"
                  placeholder="อำเภอ"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handlerFormChange(e);
                  }}
                  type="text"
                />
              </FormControl>
              <ThAutoCompleteBox
                onSelect={handlerClick}
                address={state.entities}
                isActive={anchorEl == "district"}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-row gap-2">
        <FormField
          control={control}
          name="province"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>จังหวัด</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading || isPending}
                  autoComplete="none"
                  placeholder="จังหวัด"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handlerFormChange(e);
                  }}
                  type="text"
                />
              </FormControl>
              <ThAutoCompleteBox
                onSelect={handlerClick}
                address={state.entities}
                isActive={anchorEl == "province"}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="zipCode"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>รหัสไปรษณีย์</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading || isPending}
                  autoComplete="none"
                  placeholder="รหัสไปรษณีย์"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handlerFormChange(e);
                  }}
                  type="text"
                />
              </FormControl>
              <ThAutoCompleteBox
                onSelect={handlerClick}
                address={state.entities}
                isActive={anchorEl == "zipCode"}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
