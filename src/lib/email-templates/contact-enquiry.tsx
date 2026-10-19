import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface ContactEnquiryProps {
  name?: string;
  email?: string;
  message?: string;
}

function ContactEnquiry({
  name = "A visitor",
  email = "unknown@example.com",
  message = "(no message)",
}: ContactEnquiryProps) {
  return (
    <Html>
      <Head />
      <Preview>New enquiry from {name}</Preview>
      <Body style={{ backgroundColor: "#f6f1ea", fontFamily: "Georgia, serif", margin: 0 }}>
        <Container style={{ backgroundColor: "#ffffff", borderRadius: 24, margin: "32px auto", maxWidth: 560, padding: 32 }}>
          <Text style={{ color: "#a97b52", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", margin: 0 }}>
            Linamii
          </Text>
          <Heading style={{ color: "#3b2b22", fontSize: 24, margin: "12px 0 0" }}>New website enquiry</Heading>
          <Hr style={{ borderColor: "#eee3d8", margin: "24px 0" }} />
          <Section>
            <Text style={{ color: "#3b2b22", fontSize: 14, margin: "0 0 8px" }}>
              <strong>Name:</strong> {name}
            </Text>
            <Text style={{ color: "#3b2b22", fontSize: 14, margin: "0 0 8px" }}>
              <strong>Email:</strong> {email}
            </Text>
            <Text style={{ color: "#3b2b22", fontSize: 14, margin: "16px 0 4px" }}>
              <strong>Message</strong>
            </Text>
            <Text style={{ color: "#5c4a3f", fontSize: 14, lineHeight: "22px", margin: 0, whiteSpace: "pre-wrap" }}>
              {message}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const template = {
  component: ContactEnquiry,
  displayName: "Contact enquiry",
  subject: (data: Record<string, any>) => `New enquiry from ${data['name'] ?? "a visitor"}`,
  to: "info@linamii.co.za",
  previewData: {
    name: "Thandi M",
    email: "thandi@example.com",
    message: "Hi, do you deliver to Cape Town?",
  },
} satisfies TemplateEntry;
