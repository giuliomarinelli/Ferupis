import {
  generateQuestionnaireExchangeRequestId,
  isQuestionnaireUuidV4,
  type QuestionnaireUuidProvider,
} from "../../../backend/common-server/questionnaire/services/crypto.ts";
import {
  parseQuestionnaireDraft,
} from "../../../backend/common-server/questionnaire/services/draft.ts";
import type { QuestionnaireDraft } from "../../../backend/common-server/questionnaire/models/draft.ts";

export const QUESTIONNAIRE_BROWSER_STATE_STORAGE_KEY =
  "gm.questionnaire.browser-state.v1" as const;

const STORAGE_VERSION = 1 as const;
const SESSION_TOKEN_MAX_LENGTH = 4_096;

export type QuestionnaireStorage = Pick<
  Storage,
  "getItem" | "setItem" | "removeItem"
>;

export type QuestionnaireBrowserState = Readonly<{
  exchangeRequestId: string;
  sessionToken: string | null;
  expiresAtEpochSeconds: number | null;
  draft: QuestionnaireDraft | null;
}>;

type StoredQuestionnaireBrowserState = Readonly<{
  version: typeof STORAGE_VERSION;
  exchange_request_id: string;
  session_token?: string;
  expires_at_epoch_seconds?: number;
  draft?: QuestionnaireDraft;
}>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isExchangeRequestId = (value: unknown): value is string =>
  typeof value === "string" &&
  value.startsWith("e1_") &&
  isQuestionnaireUuidV4(value.slice(3));

const parseStoredState = (
  value: string | null,
): StoredQuestionnaireBrowserState | null => {
  if (!value) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return null;
  }
  if (!isRecord(parsed)) return null;

  const keys = Object.keys(parsed).sort();
  const hasSession = "session_token" in parsed;
  const hasDraft = "draft" in parsed;
  const expectedKeys = [
    "exchange_request_id",
    ...(hasSession ? ["expires_at_epoch_seconds", "session_token"] : []),
    ...(hasDraft ? ["draft"] : []),
    "version",
  ].sort();

  if (
    keys.length !== expectedKeys.length ||
    !keys.every((key, index) => key === expectedKeys[index]) ||
    parsed.version !== STORAGE_VERSION ||
    !isExchangeRequestId(parsed.exchange_request_id) ||
    (hasDraft && !hasSession)
  ) {
    return null;
  }

  if (!hasSession) {
    return parsed as StoredQuestionnaireBrowserState;
  }
  if (
    typeof parsed.session_token !== "string" ||
    parsed.session_token.length === 0 ||
    parsed.session_token.length > SESSION_TOKEN_MAX_LENGTH ||
    !Number.isSafeInteger(parsed.expires_at_epoch_seconds) ||
    (parsed.expires_at_epoch_seconds as number) < 0
  ) {
    return null;
  }

  if (hasDraft) {
    const draft = parseQuestionnaireDraft(parsed.draft);
    if (!draft) return null;
    return { ...parsed, draft } as StoredQuestionnaireBrowserState;
  }

  return parsed as StoredQuestionnaireBrowserState;
};

const writeExchangeRequestOnly = (
  storage: QuestionnaireStorage,
  exchangeRequestId: string,
) => {
  storage.setItem(
    QUESTIONNAIRE_BROWSER_STATE_STORAGE_KEY,
    JSON.stringify({
      version: STORAGE_VERSION,
      exchange_request_id: exchangeRequestId,
    } satisfies StoredQuestionnaireBrowserState),
  );
};

export const readQuestionnaireBrowserState = (
  storage: QuestionnaireStorage,
  nowEpochSeconds = Math.floor(Date.now() / 1_000),
): QuestionnaireBrowserState | null => {
  const stored = parseStoredState(
    storage.getItem(QUESTIONNAIRE_BROWSER_STATE_STORAGE_KEY),
  );
  if (!stored) {
    storage.removeItem(QUESTIONNAIRE_BROWSER_STATE_STORAGE_KEY);
    return null;
  }

  if (
    stored.session_token === undefined ||
    stored.expires_at_epoch_seconds === undefined ||
    nowEpochSeconds >= stored.expires_at_epoch_seconds
  ) {
    writeExchangeRequestOnly(storage, stored.exchange_request_id);
    return {
      exchangeRequestId: stored.exchange_request_id,
      sessionToken: null,
      expiresAtEpochSeconds: null,
      draft: null,
    };
  }

  return {
    exchangeRequestId: stored.exchange_request_id,
    sessionToken: stored.session_token,
    expiresAtEpochSeconds: stored.expires_at_epoch_seconds,
    draft: stored.draft ?? null,
  };
};

export const getOrCreateQuestionnaireExchangeRequestId = (
  storage: QuestionnaireStorage,
  cryptoProvider: QuestionnaireUuidProvider = crypto,
): string => {
  const stored = readQuestionnaireBrowserState(storage);
  if (stored) return stored.exchangeRequestId;

  const exchangeRequestId =
    generateQuestionnaireExchangeRequestId(cryptoProvider);
  writeExchangeRequestOnly(storage, exchangeRequestId);
  return exchangeRequestId;
};

export const rotateQuestionnaireExchangeRequestId = (
  storage: QuestionnaireStorage,
  cryptoProvider: QuestionnaireUuidProvider = crypto,
): string => {
  const exchangeRequestId =
    generateQuestionnaireExchangeRequestId(cryptoProvider);
  writeExchangeRequestOnly(storage, exchangeRequestId);
  return exchangeRequestId;
};

export const persistQuestionnaireBrowserSession = (
  storage: QuestionnaireStorage,
  input: Readonly<{
    exchangeRequestId: string;
    sessionToken: string;
    expiresAtEpochSeconds: number;
  }>,
) => {
  if (
    !isExchangeRequestId(input.exchangeRequestId) ||
    input.sessionToken.length === 0 ||
    input.sessionToken.length > SESSION_TOKEN_MAX_LENGTH ||
    !Number.isSafeInteger(input.expiresAtEpochSeconds) ||
    input.expiresAtEpochSeconds < 0
  ) {
    throw new TypeError("Invalid questionnaire browser session");
  }

  const current = readQuestionnaireBrowserState(storage);
  const draft =
    current?.exchangeRequestId === input.exchangeRequestId
      ? current.draft
      : null;

  storage.setItem(
    QUESTIONNAIRE_BROWSER_STATE_STORAGE_KEY,
    JSON.stringify({
      version: STORAGE_VERSION,
      exchange_request_id: input.exchangeRequestId,
      session_token: input.sessionToken,
      expires_at_epoch_seconds: input.expiresAtEpochSeconds,
      ...(draft ? { draft } : {}),
    } satisfies StoredQuestionnaireBrowserState),
  );
};

export const persistQuestionnaireBrowserDraft = (
  storage: QuestionnaireStorage,
  draft: QuestionnaireDraft,
  nowEpochSeconds = Math.floor(Date.now() / 1_000),
) => {
  const parsedDraft = parseQuestionnaireDraft(draft);
  const current = readQuestionnaireBrowserState(storage, nowEpochSeconds);
  if (
    !parsedDraft ||
    !current?.sessionToken ||
    current.expiresAtEpochSeconds === null
  ) {
    throw new TypeError("Cannot persist questionnaire draft without a session");
  }

  storage.setItem(
    QUESTIONNAIRE_BROWSER_STATE_STORAGE_KEY,
    JSON.stringify({
      version: STORAGE_VERSION,
      exchange_request_id: current.exchangeRequestId,
      session_token: current.sessionToken,
      expires_at_epoch_seconds: current.expiresAtEpochSeconds,
      draft: parsedDraft,
    } satisfies StoredQuestionnaireBrowserState),
  );
};

export const clearQuestionnaireBrowserState = (storage: QuestionnaireStorage) =>
  storage.removeItem(QUESTIONNAIRE_BROWSER_STATE_STORAGE_KEY);
