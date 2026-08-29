import type { CSSProperties } from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  render,
  toPlainText,
} from "react-email";
import {
  EMAIL_CONTACT_MESSAGE_INTERNAL_TEMPLATE,
  EMAIL_DELIVERY_TEST_TEMPLATE,
  type EmailContactMessageInternalJob,
  type EmailDeliveryTestJob,
  type EmailJob,
} from "@gm/qwik-core/email";

export type EmailTemplateConfig = Readonly<{
  appEnvironment: string;
  siteOrigin: string;
}>;

export type RenderedEmail = Readonly<{
  subject: string;
  html: string;
  text: string;
}>;

type DeliveryTestCopy = Readonly<{
  subject: string;
  preview: string;
  heading: string;
  introduction: string;
  environmentLabel: string;
  confirmation: string;
  action: string;
  footer: string;
}>;

type ContactMessageCopy = Readonly<{
  subject: string;
  preview: string;
  heading: string;
  name: string;
  email: string;
  subjectLabel: string;
  message: string;
  noSubject: string;
  footer: string;
}>;

const DELIVERY_TEST_COPY = {
  it: {
    subject: "Test di consegna email — Ferupis",
    preview: "Il servizio email asincrono è operativo.",
    heading: "Consegna email verificata",
    introduction:
      "Questo messaggio conferma che la coda Cloudflare, il common worker, React Email e Resend comunicano correttamente.",
    environmentLabel: "Ambiente",
    confirmation:
      "Se stai leggendo questa email, il provider ha accettato e consegnato il messaggio di prova.",
    action: "Apri Ferupis",
    footer: "Messaggio tecnico generato automaticamente da Ferupis.",
  },
  en: {
    subject: "Email delivery test — Ferupis",
    preview: "The asynchronous email service is operational.",
    heading: "Email delivery verified",
    introduction:
      "This message confirms that the Cloudflare queue, common worker, React Email and Resend communicate correctly.",
    environmentLabel: "Environment",
    confirmation:
      "If you are reading this email, the provider accepted and delivered the test message.",
    action: "Open Ferupis",
    footer: "Technical message generated automatically by Ferupis.",
  },
} as const satisfies Record<EmailJob["locale"], DeliveryTestCopy>;

const CONTACT_MESSAGE_COPY = {
  it: {
    subject: "Nuovo messaggio dal sito Ferupis",
    preview: "È arrivato un nuovo messaggio dal modulo Contattaci.",
    heading: "Nuovo messaggio dal sito",
    name: "Nome",
    email: "Email",
    subjectLabel: "Oggetto",
    message: "Messaggio",
    noSubject: "Nessun oggetto",
    footer:
      "Puoi rispondere direttamente a questa email: il Reply-To è impostato sull'indirizzo indicato dal visitatore.",
  },
  en: {
    subject: "New message from the Ferupis website",
    preview: "A new message arrived from the contact form.",
    heading: "New website message",
    name: "Name",
    email: "Email",
    subjectLabel: "Subject",
    message: "Message",
    noSubject: "No subject",
    footer:
      "You can reply directly to this email: Reply-To is set to the address supplied by the visitor.",
  },
} as const satisfies Record<EmailJob["locale"], ContactMessageCopy>;

const main: CSSProperties = {
  backgroundColor: "#f7f2e7",
  color: "#272116",
  fontFamily:
    "Georgia, 'Times New Roman', -apple-system, BlinkMacSystemFont, serif",
  margin: 0,
  padding: "32px 12px",
};

const container: CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #ded3bc",
  borderRadius: "16px",
  margin: "0 auto",
  maxWidth: "580px",
  padding: "40px",
};

const eyebrow: CSSProperties = {
  color: "#8a5a20",
  fontFamily: "Arial, sans-serif",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.12em",
  margin: "0 0 12px",
  textTransform: "uppercase",
};

const heading: CSSProperties = {
  color: "#272116",
  fontSize: "30px",
  lineHeight: "1.2",
  margin: "0 0 20px",
};

const paragraph: CSSProperties = {
  color: "#514735",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 18px",
};

const details: CSSProperties = {
  backgroundColor: "#fbf4df",
  borderRadius: "10px",
  color: "#624318",
  fontFamily: "Arial, sans-serif",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "24px 0",
  padding: "14px 16px",
};

const messageStyle: CSSProperties = {
  ...paragraph,
  overflowWrap: "anywhere",
  whiteSpace: "pre-wrap",
};

const button: CSSProperties = {
  backgroundColor: "#6b461b",
  borderRadius: "999px",
  color: "#ffffff",
  display: "inline-block",
  fontFamily: "Arial, sans-serif",
  fontSize: "15px",
  fontWeight: 700,
  padding: "13px 22px",
  textDecoration: "none",
};

const footer: CSSProperties = {
  color: "#7c725f",
  fontFamily: "Arial, sans-serif",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "20px 0 0",
};

const DeliveryTestEmail = ({
  job,
  config,
}: Readonly<{
  job: EmailDeliveryTestJob;
  config: EmailTemplateConfig;
}>) => {
  const copy = DELIVERY_TEST_COPY[job.locale];

  return (
    <Html lang={job.locale}>
      <Head />
      <Preview>{copy.preview}</Preview>
      <Body lang={job.locale} style={main}>
        <Container style={container}>
          <Text style={eyebrow}>Ferupis</Text>
          <Heading as="h1" style={heading}>
            {copy.heading}
          </Heading>
          <Text style={paragraph}>{copy.introduction}</Text>
          <Section style={details}>
            {copy.environmentLabel}: <strong>{config.appEnvironment}</strong>
          </Section>
          <Text style={paragraph}>{copy.confirmation}</Text>
          <Button href={config.siteOrigin} style={button}>
            {copy.action}
          </Button>
          <Hr style={{ borderColor: "#ded3bc", margin: "32px 0 0" }} />
          <Text style={footer}>{copy.footer}</Text>
        </Container>
      </Body>
    </Html>
  );
};

const ContactMessageEmail = ({
  job,
}: Readonly<{ job: EmailContactMessageInternalJob }>) => {
  const copy = CONTACT_MESSAGE_COPY[job.locale];

  return (
    <Html lang={job.locale}>
      <Head />
      <Preview>{copy.preview}</Preview>
      <Body lang={job.locale} style={main}>
        <Container style={container}>
          <Text style={eyebrow}>Ferupis</Text>
          <Heading as="h1" style={heading}>
            {copy.heading}
          </Heading>
          <Section style={details}>
            <Text style={{ margin: "0 0 6px" }}>
              <strong>{copy.name}:</strong> {job.payload.name}
            </Text>
            <Text style={{ margin: "0 0 6px" }}>
              <strong>{copy.email}:</strong> {job.payload.email}
            </Text>
            <Text style={{ margin: 0 }}>
              <strong>{copy.subjectLabel}:</strong>{" "}
              {job.payload.subject ?? copy.noSubject}
            </Text>
          </Section>
          <Heading as="h2" style={{ ...heading, fontSize: "20px" }}>
            {copy.message}
          </Heading>
          <Text style={messageStyle}>{job.payload.message}</Text>
          <Hr style={{ borderColor: "#ded3bc", margin: "32px 0 0" }} />
          <Text style={footer}>{copy.footer}</Text>
        </Container>
      </Body>
    </Html>
  );
};

export const renderEmailJob = async (
  job: EmailJob,
  config: EmailTemplateConfig,
): Promise<RenderedEmail> => {
  if (job.template === EMAIL_DELIVERY_TEST_TEMPLATE) {
    const html = await render(<DeliveryTestEmail job={job} config={config} />);
    return {
      subject: DELIVERY_TEST_COPY[job.locale].subject,
      html,
      text: toPlainText(html),
    };
  }

  if (job.template === EMAIL_CONTACT_MESSAGE_INTERNAL_TEMPLATE) {
    const html = await render(<ContactMessageEmail job={job} />);
    const baseSubject = CONTACT_MESSAGE_COPY[job.locale].subject;
    return {
      subject: job.payload.subject
        ? `${baseSubject}: ${job.payload.subject}`
        : baseSubject,
      html,
      text: toPlainText(html),
    };
  }

  const exhaustive: never = job;
  throw new TypeError(`Unsupported email job: ${String(exhaustive)}`);
};
