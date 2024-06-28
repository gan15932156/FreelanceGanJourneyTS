import { auth } from "@/auth";
import ServiceForm from "@/components/service-page/service-form";
import { getServiceById } from "@/data/service";
import { IService } from "@/redux/types";
export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  const serviceData = await getServiceById(params.id);
  if (!session?.user.id) return null;
  const data: IService = {
    name: serviceData?.name ?? "",
    desc: serviceData?.desc ?? "",
    price: serviceData?.price ?? 0,
    note: serviceData?.note ?? "",
  };

  return (
    <ServiceForm mode="edit" id={params.id} isModalForm={false} data={data} />
  );
}
