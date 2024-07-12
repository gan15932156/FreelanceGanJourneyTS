"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function ManageQuotation() {
  const router = useRouter();
  return (
    <div className="flex  w-full mx-auto flex-col mt-4">
      <div className="flex flex-col">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="flex items-center justify-center md:flex-row flex-col gap-4 flex-wrap">
            <div className="ml-auto flex items-center gap-2">
              <Button
                size="sm"
                className="h-8 gap-1"
                onClick={() => router.push("/quotation/add")}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  ออกใบเสนอราคา
                </span>
              </Button>
            </div>
          </div>
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>ข้อมูลใบเสนอราคา</CardTitle>
            </CardHeader>
            <CardContent>
              {/* table here!!! */}
              {/* <ManageTable table={table} /> */}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
