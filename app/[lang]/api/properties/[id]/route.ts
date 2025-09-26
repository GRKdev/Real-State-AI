import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { deleteUserProperty } from "@/lib/property-repository";

interface RouteParams {
  params: { id: string };
}

export async function DELETE(_request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const idParam = params.id;
  const propertyId = Number(idParam);
  if (!idParam || Number.isNaN(propertyId)) {
    return NextResponse.json({ error: "Property id is required." }, { status: 400 });
  }

  try {
    const deleted = await deleteUserProperty(userId, propertyId);
    if (!deleted) {
      return NextResponse.json({ error: "Property not found." }, { status: 404 });
    }
    return NextResponse.json(deleted);
  } catch (error) {
    console.error("Failed to delete property", error);
    return NextResponse.json({ error: "Failed to delete property." }, { status: 500 });
  }
}
