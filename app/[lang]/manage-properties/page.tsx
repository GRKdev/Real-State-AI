import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { PropertyManager } from "@/components/manage-properties/property-manager";
import { listUserProperties } from "@/lib/property-repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ManagePropertiesPageProps {
  params: { lang: string };
}

export default async function ManagePropertiesPage({ params }: ManagePropertiesPageProps) {
  noStore();
  const { userId } = auth();

  if (!userId) {
    redirect(`/sign-in?redirect_url=/${params.lang}/manage-properties`);
  }

  let properties = [];
  try {
    properties = await listUserProperties(userId as string);
  } catch (error) {
    console.error("Failed to load user properties", error);
  }

  return <PropertyManager lang={params.lang} initialProperties={properties} />;
}
