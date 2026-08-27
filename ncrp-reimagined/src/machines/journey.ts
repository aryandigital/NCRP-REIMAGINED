/**
 * The citizen journey: Check -> Act -> Report -> Recover.
 *
 * Modelled as an explicit state machine so the flow can branch on what the
 * citizen has ALREADY done without the UI ever reaching an impossible state.
 * Two properties matter and are enforced here:
 *
 *  1. Nothing is asked twice. Everything gathered during Check is carried
 *     forward into Report.
 *  2. A "no match found" result can never resolve to "safe".
 */

import { setup, assign } from "xstate";
import type { HarmTrack } from "@/data/patterns";

export type RiskLevel = "high" | "medium" | "unclear";

export interface ExtractedEvidence {
  amounts: number[];
  upiIds: string[];
  phones: string[];
  urls: string[];
  accounts: string[];
  handles: string[];
  platforms: string[];
  occurredAt?: string;
}

/** What the citizen has already done. Drives containment ordering. */
export interface TriageAnswers {
  paid?: boolean;
  sharedOtpOrPin?: boolean;
  installedApp?: boolean;
  sharedScreen?: boolean;
  sharedIdDocument?: boolean;
  attackerStillHasAccess?: boolean;
  /** Content-harm branch. */
  intimateContentInvolved?: boolean;
  contentAlreadyPublished?: boolean;
  beingThreatened?: boolean;
  impersonation?: boolean;
  minorInvolved?: boolean;
}

export interface DnaResult {
  risk: RiskLevel;
  patternSlug: string | null;
  patternConfidence: number;
  currentStageId: string | null;
  /** Quoted from the citizen's own material, never generic. */
  signals: string[];
  likelyNextMove: string | null;
  doNot: string[];
  exactMatches: { type: string; value: string; reportCount: number }[];
  /** True when nothing matched. Renders as "we cannot confirm", never "safe". */
  noDatabaseMatch: boolean;
}

export interface JourneyContext {
  incidentId: string | null;
  language: "en" | "hi" | "hinglish";
  anonymous: boolean;
  rawSubmitted: boolean;
  redactedNarrative: string | null;
  evidence: ExtractedEvidence;
  dna: DnaResult | null;
  answers: TriageAnswers;
  tracks: HarmTrack[];
  completedActionIds: string[];
  ackNumber: string | null;
}

export type JourneyEvent =
  | { type: "START_CHECK" }
  | { type: "SUBMIT_MATERIAL"; redactedNarrative: string; evidence: ExtractedEvidence }
  | { type: "DNA_READY"; dna: DnaResult }
  | { type: "DNA_FAILED" }
  | { type: "ANSWER"; answers: TriageAnswers }
  | { type: "TRIAGE_DONE" }
  | { type: "COMPLETE_ACTION"; actionId: string }
  | { type: "PROCEED_TO_REPORT" }
  | { type: "SUBMIT_COMPLAINT"; ackNumber: string }
  | { type: "OPEN_RECOVERY" }
  | { type: "RESTART" };

const emptyEvidence: ExtractedEvidence = {
  amounts: [],
  upiIds: [],
  phones: [],
  urls: [],
  accounts: [],
  handles: [],
  platforms: [],
};

/** Harm tracks implied by the triage answers, unioned with the pattern's own. */
export function deriveTracks(answers: TriageAnswers, patternTracks: HarmTrack[]): HarmTrack[] {
  const t = new Set<HarmTrack>(patternTracks);
  if (answers.paid) t.add("money");
  if (answers.sharedOtpOrPin || answers.installedApp || answers.sharedScreen) t.add("access");
  if (answers.attackerStillHasAccess) t.add("access");
  if (answers.sharedIdDocument || answers.impersonation) t.add("identity");
  if (answers.intimateContentInvolved || answers.contentAlreadyPublished) t.add("content");
  if (answers.beingThreatened || answers.minorInvolved) t.add("safety");
  return [...t];
}

/** True when containment cannot wait for the citizen to finish reading. */
export function needsImmediateAction(a: TriageAnswers): boolean {
  return Boolean(
    a.paid ||
      a.sharedOtpOrPin ||
      a.installedApp ||
      a.sharedScreen ||
      a.attackerStillHasAccess ||
      a.contentAlreadyPublished ||
      a.beingThreatened,
  );
}

export const journeyMachine = setup({
  types: {
    context: {} as JourneyContext,
    events: {} as JourneyEvent,
  },
  guards: {
    isEmergency: ({ context }) => needsImmediateAction(context.answers),
  },
  actions: {
    storeMaterial: assign(({ event }) => {
      if (event.type !== "SUBMIT_MATERIAL") return {};
      return { redactedNarrative: event.redactedNarrative, evidence: event.evidence, rawSubmitted: true };
    }),
    storeDna: assign(({ event }) => {
      if (event.type !== "DNA_READY") return {};
      return { dna: event.dna };
    }),
    storeAnswers: assign(({ context, event }) => {
      if (event.type !== "ANSWER") return {};
      const answers = { ...context.answers, ...event.answers };
      return { answers };
    }),
    computeTracks: assign(({ context }) => ({
      tracks: deriveTracks(context.answers, []),
    })),
    markActionDone: assign(({ context, event }) => {
      if (event.type !== "COMPLETE_ACTION") return {};
      return { completedActionIds: [...context.completedActionIds, event.actionId] };
    }),
    storeAck: assign(({ event }) => {
      if (event.type !== "SUBMIT_COMPLAINT") return {};
      return { ackNumber: event.ackNumber };
    }),
  },
}).createMachine({
  id: "journey",
  initial: "landing",
  context: {
    incidentId: null,
    language: "en",
    anonymous: false,
    rawSubmitted: false,
    redactedNarrative: null,
    evidence: emptyEvidence,
    dna: null,
    answers: {},
    tracks: [],
    completedActionIds: [],
    ackNumber: null,
  },
  states: {
    landing: {
      on: { START_CHECK: "check" },
    },

    /** Stage 1, Check. Upload, paste, or describe. */
    check: {
      initial: "collecting",
      states: {
        collecting: {
          on: { SUBMIT_MATERIAL: { target: "analysing", actions: "storeMaterial" } },
        },
        analysing: {
          on: {
            DNA_READY: { target: "#journey.result", actions: "storeDna" },
            DNA_FAILED: "collecting",
          },
        },
      },
    },

    /** Scam DNA verdict. Always reachable, never terminal. */
    result: {
      on: {
        ANSWER: { target: "triage", actions: "storeAnswers" },
        RESTART: "landing",
      },
    },

    /** Stage 2 gate, what has already happened determines the ordering. */
    triage: {
      on: {
        ANSWER: { actions: "storeAnswers" },
        TRIAGE_DONE: [
          { target: "act", guard: "isEmergency", actions: "computeTracks" },
          { target: "report", actions: "computeTracks" },
        ],
      },
    },

    /** Stage 2, Act. Full-screen containment mode. */
    act: {
      on: {
        COMPLETE_ACTION: { actions: "markActionDone" },
        PROCEED_TO_REPORT: "report",
      },
    },

    /** Stage 3, Report. Prefilled from everything above. */
    report: {
      on: {
        SUBMIT_COMPLAINT: { target: "recover", actions: "storeAck" },
      },
    },

    /** Stage 4, Recover. Clocks, documents, status. */
    recover: {
      on: {
        COMPLETE_ACTION: { actions: "markActionDone" },
        RESTART: "landing",
      },
    },
  },
});
