import { createContextId, type QRL, type Signal } from "@builder.io/qwik";
import type { QuestionnaireDraft } from "../../../backend/common-server/questionnaire/models/draft.ts";

export type QuestionnaireAccessStatus =
  | "INITIALIZING"
  | "MISSING_INVITATION"
  | "NEEDS_CHALLENGE"
  | "EXCHANGING"
  | "READY"
  | "INVITATION_INVALID"
  | "INVITATION_IN_USE"
  | "CHALLENGE_FAILED"
  | "SESSION_EXPIRED"
  | "TEMPORARY_FAILURE"
  | "COMPLETED"
  | "SUBMISSION_UNCERTAIN"
  | "SUBMISSION_CONFLICT"
  | "ALREADY_USED";

export type QuestionnaireSessionContextValue = Readonly<{
  status: Signal<QuestionnaireAccessStatus>;
  invitationToken: Signal<string | null>;
  exchangeRequestId: Signal<string | null>;
  sessionToken: Signal<string | null>;
  expiresAtEpochSeconds: Signal<number | null>;
  draft: Signal<QuestionnaireDraft | null>;
  rewardToken: Signal<string | null>;
  rewardExpiresAtEpochMs: Signal<number | null>;
  initializeBrowserSession: QRL<() => void>;
  setStatus: QRL<(status: QuestionnaireAccessStatus) => void>;
  beginInvitation: QRL<(invitationToken: string) => void>;
  acceptSession: QRL<
    (sessionToken: string, expiresAtEpochSeconds: number) => void
  >;
  restartChallenge: QRL<() => void>;
  updateDraft: QRL<(draft: QuestionnaireDraft) => void>;
  addElapsedSeconds: QRL<(elapsedSeconds: number) => void>;
  discardInvitation: QRL<() => void>;
  clearSession: QRL<() => void>;
  completeSession: QRL<
    (rewardToken: string, rewardExpiresAtEpochMs: number) => void
  >;
  terminateSubmission: QRL<
    (
      status: "SUBMISSION_UNCERTAIN" | "SUBMISSION_CONFLICT" | "ALREADY_USED",
    ) => void
  >;
}>;

export const QuestionnaireSessionContext =
  createContextId<QuestionnaireSessionContextValue>(
    "gm.qwik-core.questionnaire-session.v1",
  );
