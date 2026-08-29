import {
  $,
  component$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import {
  Checkbox,
  CircleCheckRegularIcon,
  ClassicSpinner,
  FloatingInput,
  FloatingTextarea,
  PrimaryActionBtn,
} from "@gm/qwik-core/ui";

const TURNSTILE_CHALLENGE_TOKEN_HEADER = "X-Turnstile-Challenge-Token";
const TURNSTILE_ACTION_CONTACT_SUBMIT = "contact_submit";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type TurnstileWidgetOptions = Readonly<{
  sitekey: string;
  action: string;
  appearance: "interaction-only";
  execution: "execute";
  callback: (token: string) => void;
  "error-callback": () => void;
  "expired-callback": () => void;
}>;

type TurnstileApi = Readonly<{
  render(container: HTMLElement, options: TurnstileWidgetOptions): string;
  execute(widgetId: string): void;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}>;

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type SuccessResponse = Readonly<{
  ok: true;
  requestId: string;
}>;

const isSuccessResponse = (value: unknown): value is SuccessResponse => {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<SuccessResponse>;
  return (
    candidate.ok === true &&
    typeof candidate.requestId === "string" &&
    UUID_V4_PATTERN.test(candidate.requestId)
  );
};

const parseErrorCode = (value: unknown): string | undefined => {
  if (typeof value !== "object" || value === null) return undefined;
  const code = (value as { code?: unknown }).code;
  return typeof code === "string" ? code : undefined;
};

export type ContactFormProps = Readonly<{
  turnstileSiteKey: string;
}>;

export const ContactForm = component$<ContactFormProps>((props) => {
  const requestId = useSignal(crypto.randomUUID());
  const name = useSignal("");
  const email = useSignal("");
  const subject = useSignal("");
  const message = useSignal("");
  const privacyAccepted = useSignal(false);
  const nameTouched = useSignal(false);
  const emailTouched = useSignal(false);
  const messageTouched = useSignal(false);
  const submitted = useSignal(false);
  const pending = useSignal(false);
  const succeeded = useSignal(false);
  const serverError = useSignal("");
  const turnstileClientError = useSignal("");
  const formRef = useSignal<HTMLFormElement>();
  const nameRef = useSignal<HTMLInputElement>();
  const emailRef = useSignal<HTMLInputElement>();
  const messageRef = useSignal<HTMLTextAreaElement>();
  const turnstileContainerRef = useSignal<HTMLElement>();
  const turnstileWidgetId = useSignal<string>();
  const turnstileToken = useSignal("");

  const nameMissing = name.value.trim().length === 0;
  const emailMissing = email.value.trim().length === 0;
  const emailInvalid =
    !emailMissing && !EMAIL_PATTERN.test(email.value.trim());
  const messageMissing = message.value.trim().length === 0;
  const formInvalid =
    nameMissing ||
    emailMissing ||
    emailInvalid ||
    messageMissing ||
    !privacyAccepted.value;

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup, track }) => {
    track(() => succeeded.value);
    if (succeeded.value) return;

    const container = turnstileContainerRef.value;
    if (!container) return;

    if (!props.turnstileSiteKey) {
      turnstileClientError.value =
        "La verifica anti-spam non è configurata in questo ambiente.";
      return;
    }

    let active = true;
    cleanup(() => {
      active = false;
      const turnstile = window.turnstile;
      const widgetId = turnstileWidgetId.value;
      if (turnstile && widgetId) {
        try {
          turnstile.remove(widgetId);
        } catch {
          // The widget may already have been detached during navigation.
        }
      }
      turnstileWidgetId.value = undefined;
      turnstileToken.value = "";
    });

    const waitForTurnstile = async () => {
      for (let attempt = 0; attempt < 80; attempt++) {
        if (window.turnstile) return window.turnstile;
        await new Promise((resolve) => window.setTimeout(resolve, 100));
      }
      return null;
    };

    const turnstile = await waitForTurnstile();
    if (!active) return;

    if (!turnstile) {
      turnstileClientError.value =
        "La verifica anti-spam non è disponibile. Ricarica la pagina e riprova.";
      return;
    }

    const renderedWidget = { id: undefined as string | undefined };
    renderedWidget.id = turnstile.render(container, {
      sitekey: props.turnstileSiteKey,
      action: TURNSTILE_ACTION_CONTACT_SUBMIT,
      appearance: "interaction-only",
      execution: "execute",
      callback: (token) => {
        if (turnstileWidgetId.value !== renderedWidget.id) return;
        turnstileToken.value = token;
        turnstileClientError.value = "";
      },
      "error-callback": () => {
        if (turnstileWidgetId.value !== renderedWidget.id) return;
        turnstileToken.value = "";
        turnstileClientError.value =
          "Non siamo riusciti a verificare la richiesta. Riprova tra qualche secondo.";
      },
      "expired-callback": () => {
        if (turnstileWidgetId.value !== renderedWidget.id) return;
        turnstileToken.value = "";
      },
    });
    turnstileWidgetId.value = renderedWidget.id;
  });

  const getTurnstileToken$ = $(async () => {
    turnstileToken.value = "";
    turnstileClientError.value = "";

    let turnstile = window.turnstile;
    let widgetId = turnstileWidgetId.value;
    for (
      let attempt = 0;
      attempt < 30 && (!turnstile || !widgetId);
      attempt++
    ) {
      await new Promise((resolve) => window.setTimeout(resolve, 100));
      turnstile = window.turnstile;
      widgetId = turnstileWidgetId.value;
    }

    if (!turnstile || !widgetId) {
      turnstileClientError.value =
        "La verifica anti-spam non è ancora pronta. Riprova tra qualche secondo.";
      throw new Error("TURNSTILE_NOT_READY");
    }

    turnstile.reset(widgetId);
    turnstile.execute(widgetId);

    for (let attempt = 0; attempt < 100; attempt++) {
      if (turnstileToken.value) return turnstileToken.value;
      await new Promise((resolve) => window.setTimeout(resolve, 100));
    }

    turnstileClientError.value =
      "La verifica anti-spam ha impiegato troppo tempo. Riprova.";
    throw new Error("TURNSTILE_TIMEOUT");
  });

  const focusFirstInvalid$ = $(() => {
    if (!name.value.trim()) {
      nameRef.value?.focus();
      return;
    }
    const normalizedEmail = email.value.trim();
    if (!normalizedEmail || !EMAIL_PATTERN.test(normalizedEmail)) {
      emailRef.value?.focus();
      return;
    }
    if (!message.value.trim()) {
      messageRef.value?.focus();
      return;
    }
    if (!privacyAccepted.value) {
      document.getElementById("contact-privacy")?.focus();
    }
  });

  const resetForm$ = $(() => {
    requestId.value = crypto.randomUUID();
    name.value = "";
    email.value = "";
    subject.value = "";
    message.value = "";
    privacyAccepted.value = false;
    nameTouched.value = false;
    emailTouched.value = false;
    messageTouched.value = false;
    submitted.value = false;
    pending.value = false;
    succeeded.value = false;
    serverError.value = "";
    turnstileClientError.value = "";
    turnstileToken.value = "";
    formRef.value?.reset();
    window.setTimeout(() => nameRef.value?.focus(), 0);
  });

  if (succeeded.value) {
    return (
      <section
        class="font-sans mt-10 rounded-2xl border border-emerald-300 bg-emerald-50 p-6 shadow-sm sm:p-8 dark:border-emerald-800 dark:bg-emerald-950/30"
        role="status"
        aria-live="polite"
      >
        <h2 class="flex items-center gap-2.5 text-2xl font-semibold text-emerald-950 dark:text-emerald-100">
          <CircleCheckRegularIcon class="shrink-0 size-12" />
          <span>Messaggio ricevuto</span>
        </h2>
        <p class="mt-3 leading-7 text-emerald-900 dark:text-emerald-200">
          Grazie per averci contattato. Ti risponderemo appena possibile.
        </p>
        <div class="mt-6 max-w-sm">
          <PrimaryActionBtn
            label="Invia un altro messaggio"
            isLink={false}
            action={resetForm$}
            adjunctiveTwClassList="min-h-12"
          />
        </div>
      </section>
    );
  }

  return (
    <form
      ref={formRef}
      class="mt-10 grid w-full gap-6 font-sans"
      preventdefault:submit
      noValidate
      aria-busy={pending.value ? "true" : undefined}
      onSubmit$={async () => {
        submitted.value = true;
        serverError.value = "";

        if (formInvalid) {
          serverError.value = "Controlla i campi evidenziati e riprova.";
          await focusFirstInvalid$();
          return;
        }

        pending.value = true;
        try {
          const turnstileChallengeToken = await getTurnstileToken$();
          const response = await fetch("/api/contact/messages/", {
            method: "POST",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
              [TURNSTILE_CHALLENGE_TOKEN_HEADER]: turnstileChallengeToken,
            },
            body: JSON.stringify({
              requestId: requestId.value,
              name: name.value,
              email: email.value,
              subject: subject.value,
              message: message.value,
              privacyAccepted: privacyAccepted.value,
            }),
          });

          const responseBody: unknown = await response.json().catch(() => null);
          if (!response.ok || !isSuccessResponse(responseBody)) {
            const code = parseErrorCode(responseBody);
            serverError.value =
              code === "INVALID_INPUT"
                ? "Alcuni dati non sono validi. Controlla il modulo e riprova."
                : code === "TURNSTILE_VERIFICATION_FAILED"
                  ? "Non siamo riusciti a verificare la richiesta. Riprova tra qualche secondo."
                  : "Il servizio contatti non è disponibile in questo momento. Riprova più tardi.";
            return;
          }

          succeeded.value = true;
        } catch {
          serverError.value = turnstileClientError.value
            ? ""
            : "Il servizio contatti non è disponibile in questo momento. Riprova più tardi.";
        } finally {
          const turnstile = window.turnstile;
          const widgetId = turnstileWidgetId.value;
          if (turnstile && widgetId) turnstile.reset(widgetId);
          turnstileToken.value = "";
          pending.value = false;
        }
      }}
    >
      <div class="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm 2xs:p-5 sm:grid-cols-2 sm:p-7 dark:border-slate-700 dark:bg-neutral-900">
        <div class="min-w-0">
          <FloatingInput
            inputRef={nameRef}
            bgClass="bg-white"
            id="contact-name"
            label="Nome"
            autocomplete="name"
            value={name.value}
            required
            maxLength={100}
            touched={submitted.value || nameTouched.value}
            invalid={nameMissing}
            validationErrors={nameMissing ? { required: true } : undefined}
            errors={{ required: "Inserisci il tuo nome." }}
            onInput$={(value) => {
              name.value = value;
              serverError.value = "";
            }}
            onBlur$={() => {
              nameTouched.value = true;
            }}
          />
        </div>

        <div class="min-w-0">
          <FloatingInput
            inputRef={emailRef}
            bgClass="bg-white"
            id="contact-email"
            label="Email"
            type="email"
            inputMode="email"
            autocomplete="email"
            value={email.value}
            required
            maxLength={254}
            touched={submitted.value || emailTouched.value}
            invalid={emailMissing || emailInvalid}
            validationErrors={
              emailMissing
                ? { required: true }
                : emailInvalid
                  ? { invalid: true }
                  : undefined
            }
            errors={{
              required: "Inserisci il tuo indirizzo email.",
              invalid: "Inserisci un indirizzo email valido.",
            }}
            onInput$={(value) => {
              email.value = value;
              serverError.value = "";
            }}
            onBlur$={() => {
              emailTouched.value = true;
            }}
          />
        </div>

        <div class="min-w-0 sm:col-span-2">
          <FloatingInput
            bgClass="bg-white"
            id="contact-subject"
            label="Oggetto (facoltativo)"
            autocomplete="off"
            value={subject.value}
            maxLength={160}
            onInput$={(value) => {
              subject.value = value;
              serverError.value = "";
            }}
          />
        </div>

        <div class="min-w-0 sm:col-span-2">
          <FloatingTextarea
            textareaRef={messageRef}
            bgClass="bg-white"
            id="contact-message"
            name="message"
            label="Messaggio"
            value={message.value}
            required
            rows={8}
            maxLength={4_000}
            touched={submitted.value || messageTouched.value}
            invalid={messageMissing}
            validationErrors={messageMissing ? { required: true } : undefined}
            errors={{ required: "Scrivi il tuo messaggio." }}
            onInput$={(value) => {
              message.value = value;
              serverError.value = "";
            }}
            onBlur$={() => {
              messageTouched.value = true;
            }}
          />
        </div>
      </div>

      <Checkbox
        id="contact-privacy"
        checked={privacyAccepted.value}
        required
        invalid={submitted.value && !privacyAccepted.value}
        errorMessage="Conferma la presa visione prima di inviare il messaggio."
        reserveErrorSpace={false}
        variant="card"
        onChange$={(checked) => {
          privacyAccepted.value = checked;
          serverError.value = "";
        }}
      >
        <span q:slot="label">
          Ho preso visione che i dati inseriti saranno utilizzati per gestire e
          rispondere alla mia richiesta.
        </span>
        <span q:slot="description">
          Evita di inserire nel messaggio dati personali non necessari.
        </span>
      </Checkbox>

      <div class="min-w-0">
        <PrimaryActionBtn
          label={pending.value ? "" : "Invia messaggio"}
          isLink={false}
          buttonType="submit"
          disabled={pending.value}
          adjunctiveTwClassList="min-h-12 sm:grid sm:gris-cols-3 sm:col-span-2"
        >
          {pending.value ? (
            <>
              <ClassicSpinner size={25} />
              <span class="sr-only">Invio in corso</span>
            </>
          ) : null}
        </PrimaryActionBtn>

        <div class="mt-4 flex min-h-0 w-full flex-col items-center">
          <div ref={turnstileContainerRef} class="flex w-full justify-center" />
          <p
            class="mt-2 min-h-5 text-center text-sm font-semibold text-red-700 dark:text-red-200"
            role="status"
            aria-live="polite"
          >
            {turnstileClientError.value}
          </p>
        </div>

        <p
          class="mt-2 min-h-6 text-center text-sm font-semibold text-red-700 dark:text-red-200"
          role="status"
          aria-live="polite"
        >
          {serverError.value}
        </p>
      </div>
    </form>
  );
});
