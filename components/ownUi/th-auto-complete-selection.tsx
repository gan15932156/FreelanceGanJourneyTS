"use client";

import { AddressObject } from "./th-address-auto-complete";

interface IProps {
  address: Array<AddressObject>;
  isActive: boolean;
  onSelect(address: AddressObject): void;
}

const ThAutoCompleteBox: React.FC<IProps> = ({
  address,
  isActive,
  onSelect,
}: IProps) => {
  if (!isActive) return null;
  return (
    <div className="z-50 mt-2 flex flex-col gap-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 absolute">
      {address.length > 0 ? (
        address.map((item: AddressObject, index: number) => (
          <div
            className="text-muted-foreground hover:text-primary cursor-pointer"
            key={index}
            onClick={() => onSelect(item)}
          >
            {item.subDistrict}
            {">"}
            {item.district}
            {">"}
            {item.province}
            {">"}
            {item.zipCode}
          </div>
        ))
      ) : (
        <div>ไม่พบข้อมูล</div>
      )}
    </div>
  );
};

export default ThAutoCompleteBox;
