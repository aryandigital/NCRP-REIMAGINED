import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getIncident, makeAckNumber, updateIncident } from "@/lib/store";
import { redact } from "@/lib/redact";

async function getAuthorizedIncident(id: string) {
  const session = await getSession();
  if (!session) {
    return { response: NextResponse.json({ error: "Not authenticated" }, { status: 401 }) };
  }

  const incident = await getIncident(id);
  if (!incident) {
    return { response: NextResponse.json({ error: "Incident not found" }, { status: 404 }) };
  }

  if (!incident.syntheticOnly && incident.userId !== session.userId) {
    return { response: NextResponse.json({ error: "Not authorized" }, { status: 403 }) };
  }

  return { incident };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authorized = await getAuthorizedIncident(id);
  if (authorized.response) return authorized.response;
  const { incident } = authorized;
  if (req.nextUrl.searchParams.get("format") === "bundle") {
    const redactedText = incident.rawText ? redact(incident.rawText).redacted : null;
    return new NextResponse(JSON.stringify({
      caseReference: incident.ackNumber ?? incident.id,
      syntheticOnly: incident.syntheticOnly,
      incident: {
        id: incident.id,
        createdAt: incident.createdAt,
        language: incident.language,
        narrative: redactedText,
        dna: incident.dna,
        extractedFacts: incident.extractedFacts,
        missingFacts: incident.missingFacts,
        packets: incident.packets,
        routingEvents: incident.routingEvents,
      },
    }, null, 2), { headers: { "Content-Type": "application/json", "Content-Disposition": `attachment; filename="raksha-${id.toLowerCase()}-redacted.json"` } });
  }
  return NextResponse.json({ incident });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authorized = await getAuthorizedIncident(id);
  if (authorized.response) return authorized.response;
  const { incident } = authorized;

  const body = await req.json() as {
    answers?: Record<string, boolean>;
    extractedFacts?: typeof incident.extractedFacts;
    missingFacts?: string[];
    completedActions?: string[];
    submitMock?: boolean;
    rawText?: string;
  };

  const now = new Date().toISOString();
  const updated = await updateIncident(id, {
    answers: body.answers ? { ...incident.answers, ...body.answers } : incident.answers,
    rawText: body.rawText ?? incident.rawText,
    extractedFacts: body.extractedFacts ?? incident.extractedFacts,
    missingFacts: body.submitMock ? [] : (body.missingFacts ?? incident.missingFacts),
    completedActions: body.completedActions ?? incident.completedActions,
    ackNumber: body.submitMock ? (incident.ackNumber ?? makeAckNumber()) : incident.ackNumber,
    packets: body.submitMock
      ? [
          { recipient: "ncrp", status: "acknowledged", payload: { incidentId: id, submittedAt: now } },
          { recipient: "bank", status: "acknowledged", payload: { incidentId: id, requestedAction: "freeze and review" } },
          { recipient: "police", status: "submitted", payload: { incidentId: id, queue: "state cyber cell" } },
        ]
      : incident.packets,
    routingEvents: body.submitMock
      ? [
          ...incident.routingEvents,
          { type: "incident_compiled", message: "Incident record compiled from confirmed facts.", occurredAt: now, status: "complete" },
          { type: "ncrp_acknowledged", message: "NCRP channel returned an acknowledgement.", occurredAt: now, status: "recorded" },
          { type: "bank_queued", message: "Bank nodal queue accepted the packet.", occurredAt: now, status: "recorded" },
        ]
      : incident.routingEvents,
  });

  return NextResponse.json({ incident: updated });
}
