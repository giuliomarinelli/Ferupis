import { isQuestionnaireInvitationToken } from "../../../backend/common-server/questionnaire/services/crypto.ts";

/**
 * Claims an invitation from the current route fragment without ever persisting
 * it. This runs from the Qwik questionnaire route, not from an inline script.
 */
export const takeQuestionnaireInvitationTokenFromLocation = (
  browserWindow: Pick<Window, "history" | "location">,
): string | null => {
  const hash = String(browserWindow.location.hash || "");
  if (!hash || hash.charAt(0) !== "#") return null;

  const parameters = new URLSearchParams(hash.substring(1));
  if (!parameters.has("t")) return null;

  browserWindow.history.replaceState(
    browserWindow.history.state,
    "",
    browserWindow.location.pathname + browserWindow.location.search,
  );

  const tokens = parameters.getAll("t");
  if (tokens.length !== 1) return null;

  return isQuestionnaireInvitationToken(tokens[0]) ? tokens[0] : null;
};
