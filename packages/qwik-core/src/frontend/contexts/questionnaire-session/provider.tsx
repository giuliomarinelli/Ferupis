import {
  $,
  Slot,
  component$,
  useContextProvider,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import {
  addQuestionnaireDraftElapsedSeconds,
  createQuestionnaireDraft,
  registerQuestionnaireDraftLocale,
} from "../../../backend/common-server/questionnaire/services/draft.ts";
import type {
  QuestionnaireDraft,
  QuestionnaireDraftLocale,
} from "../../../backend/common-server/questionnaire/models/draft.ts";
import { isQuestionnaireInvitationToken } from "../../../backend/common-server/questionnaire/services/crypto.ts";
import {
  QuestionnaireSessionContext,
  type QuestionnaireAccessStatus,
} from "./context.ts";
import {
  clearQuestionnaireBrowserState,
  getOrCreateQuestionnaireExchangeRequestId,
  persistQuestionnaireBrowserDraft,
  persistQuestionnaireBrowserSession,
  readQuestionnaireBrowserState,
  rotateQuestionnaireExchangeRequestId,
} from "./storage.ts";

type QuestionnaireSessionProviderProps = Readonly<{
  initialLocale: "it" | "en";
}>;

const toDraftLocale = (locale: "it" | "en"): QuestionnaireDraftLocale =>
  locale === "it" ? "IT" : "EN";

const canAcceptQuestionnaireInvitation = (
  currentStatus: QuestionnaireAccessStatus,
) =>
  currentStatus === "INITIALIZING" ||
  currentStatus === "MISSING_INVITATION" ||
  currentStatus === "INVITATION_INVALID" ||
  currentStatus === "INVITATION_IN_USE" ||
  currentStatus === "CHALLENGE_FAILED" ||
  currentStatus === "SESSION_EXPIRED";

export const QuestionnaireSessionProvider =
  component$<QuestionnaireSessionProviderProps>((props) => {
    const status = useSignal<QuestionnaireAccessStatus>("INITIALIZING");
    const invitationToken = useSignal<string | null>(null);
    const exchangeRequestId = useSignal<string | null>(null);
    const sessionToken = useSignal<string | null>(null);
    const expiresAtEpochSeconds = useSignal<number | null>(null);
    const draft = useSignal<QuestionnaireDraft | null>(null);
    // The raw reward remains memory-only and is therefore shown exactly once.
    const rewardToken = useSignal<string | null>(null);
    const rewardExpiresAtEpochMs = useSignal<number | null>(null);

    const initializeBrowserSession = $(() => {
      if (status.value !== "INITIALIZING") return;

      try {
        const stored = readQuestionnaireBrowserState(sessionStorage);
        if (stored?.sessionToken) {
          const resumedDraft = registerQuestionnaireDraftLocale(
            stored.draft ??
              createQuestionnaireDraft(
                stored.exchangeRequestId,
                toDraftLocale(props.initialLocale),
              ),
            toDraftLocale(props.initialLocale),
          );
          exchangeRequestId.value = stored.exchangeRequestId;
          sessionToken.value = stored.sessionToken;
          expiresAtEpochSeconds.value = stored.expiresAtEpochSeconds;
          draft.value = resumedDraft;
          persistQuestionnaireBrowserDraft(sessionStorage, resumedDraft);
          status.value = "READY";
          return;
        }

        exchangeRequestId.value = stored?.exchangeRequestId ?? null;
        status.value = "MISSING_INVITATION";
      } catch {
        status.value = "TEMPORARY_FAILURE";
      }
    });

    // The questionnaire route owns invitation fragments. This fallback restores
    // an existing browser session when the provider is used outside that route.
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      void initializeBrowserSession();
    }, { strategy: "document-ready" });

    // The lease is not silently renewed. Expiry clears both bearer and draft.
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ cleanup, track }) => {
      const expiresAt = track(() => expiresAtEpochSeconds.value);
      if (!expiresAt) return;

      const delay = Math.max(0, expiresAt * 1_000 - Date.now());
      const timeoutId = window.setTimeout(() => {
        clearQuestionnaireBrowserState(sessionStorage);
        invitationToken.value = null;
        exchangeRequestId.value = null;
        sessionToken.value = null;
        expiresAtEpochSeconds.value = null;
        draft.value = null;
        status.value = "SESSION_EXPIRED";
      }, delay);
      cleanup(() => window.clearTimeout(timeoutId));
    });

    const setStatus = $((nextStatus: QuestionnaireAccessStatus) => {
      status.value = nextStatus;
    });

    const beginInvitation = $((nextInvitationToken: string) => {
      if (!isQuestionnaireInvitationToken(nextInvitationToken)) {
        status.value = "INVITATION_INVALID";
        return;
      }
      if (!canAcceptQuestionnaireInvitation(status.value)) return;

      try {
        invitationToken.value = nextInvitationToken;
        exchangeRequestId.value =
          getOrCreateQuestionnaireExchangeRequestId(sessionStorage);
        status.value = "NEEDS_CHALLENGE";
      } catch {
        invitationToken.value = null;
        status.value = "TEMPORARY_FAILURE";
      }
    });

    const acceptSession = $(
      (nextSessionToken: string, nextExpiresAtEpochSeconds: number) => {
        if (!exchangeRequestId.value) {
          status.value = "TEMPORARY_FAILURE";
          return;
        }

        persistQuestionnaireBrowserSession(sessionStorage, {
          exchangeRequestId: exchangeRequestId.value,
          sessionToken: nextSessionToken,
          expiresAtEpochSeconds: nextExpiresAtEpochSeconds,
        });
        const nextDraft = createQuestionnaireDraft(
          exchangeRequestId.value,
          toDraftLocale(props.initialLocale),
        );
        persistQuestionnaireBrowserDraft(sessionStorage, nextDraft);
        invitationToken.value = null;
        sessionToken.value = nextSessionToken;
        expiresAtEpochSeconds.value = nextExpiresAtEpochSeconds;
        draft.value = nextDraft;
        status.value = "READY";
      },
    );

    const discardInvitation = $(() => {
      invitationToken.value = null;
    });

    const restartChallenge = $(() => {
      if (!invitationToken.value) {
        status.value = "INVITATION_INVALID";
        return;
      }

      exchangeRequestId.value =
        rotateQuestionnaireExchangeRequestId(sessionStorage);
      sessionToken.value = null;
      expiresAtEpochSeconds.value = null;
      draft.value = null;
      status.value = "NEEDS_CHALLENGE";
    });

    const updateDraft = $((nextDraft: QuestionnaireDraft) => {
      persistQuestionnaireBrowserDraft(sessionStorage, nextDraft);
      draft.value = nextDraft;
    });

    const addElapsedSeconds = $((elapsedSeconds: number) => {
      if (!draft.value) return;
      const nextDraft = addQuestionnaireDraftElapsedSeconds(
        draft.value,
        elapsedSeconds,
      );
      persistQuestionnaireBrowserDraft(sessionStorage, nextDraft);
      draft.value = nextDraft;
    });

    const clearSession = $(() => {
      clearQuestionnaireBrowserState(sessionStorage);
      invitationToken.value = null;
      exchangeRequestId.value = null;
      sessionToken.value = null;
      expiresAtEpochSeconds.value = null;
      draft.value = null;
      status.value = "MISSING_INVITATION";
    });

    const clearSubmittedBrowserState = $(() => {
      clearQuestionnaireBrowserState(sessionStorage);
      invitationToken.value = null;
      exchangeRequestId.value = null;
      sessionToken.value = null;
      expiresAtEpochSeconds.value = null;
      draft.value = null;
    });

    const completeSession = $(
      async (nextRewardToken: string, nextRewardExpiresAtEpochMs: number) => {
        await clearSubmittedBrowserState();
        rewardToken.value = nextRewardToken;
        rewardExpiresAtEpochMs.value = nextRewardExpiresAtEpochMs;
        status.value = "COMPLETED";
      },
    );

    const terminateSubmission = $(
      async (
        nextStatus:
          | "SUBMISSION_UNCERTAIN"
          | "SUBMISSION_CONFLICT"
          | "ALREADY_USED",
      ) => {
        await clearSubmittedBrowserState();
        rewardToken.value = null;
        rewardExpiresAtEpochMs.value = null;
        status.value = nextStatus;
      },
    );

    useContextProvider(QuestionnaireSessionContext, {
      status,
      invitationToken,
      exchangeRequestId,
      sessionToken,
      expiresAtEpochSeconds,
      draft,
      rewardToken,
      rewardExpiresAtEpochMs,
      initializeBrowserSession,
      setStatus,
      beginInvitation,
      acceptSession,
      restartChallenge,
      updateDraft,
      addElapsedSeconds,
      discardInvitation,
      clearSession,
      completeSession,
      terminateSubmission,
    });

    return <Slot />;
  });
