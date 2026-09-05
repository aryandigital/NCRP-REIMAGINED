import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import { getIncident } from "@/lib/store";
import { getSession } from "@/lib/auth";
import { ComplaintDocument } from "@/lib/pdf/complaint-template";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const incident = await getIncident(id);
  if (!incident) {
    return NextResponse.json({ error: "Incident not found" }, { status: 404 });
  }

  // Owned incidents require matching session; anonymous and synthetic are open
  if (!incident.syntheticOnly && incident.userId) {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    if (incident.userId !== session.userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
  }

  try {
    const el = createElement(ComplaintDocument, { incident }) as unknown as ReactElement<DocumentProps>;
    const buffer = await renderToBuffer(el);

    const filename = `complaint-draft-${id.toLowerCase()}.pdf`;
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[document/route] PDF render error:", err);
    return NextResponse.json({ error: "Failed to generate document" }, { status: 500 });
  }
}
