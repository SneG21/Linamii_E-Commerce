import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface Props {
  firstName?: string;
  email?: string;
  consent?: boolean;
  timestamp?: string;
}

function Founding20Signup({ firstName = "Friend", email = "unknown@example.com", consent = true, timestamp = "" }: Props) {
  const row = { color: "#3b2b22", fontSize: 14, margin: "0 0 8px" };
  return (
    <Html>
      <Head />
      <Preview>New Founding 20 signup: {firstName}</Preview>
      <Body style={{ backgroundColor: "#f6f1ea", fontFamily: "Georgia, serif", margin: 0 }}>
        <Container style={{ backgroundColor: "#ffffff", borderRadius: 24, margin: "32px auto", maxWidth: 560, padding: 32 }}>
          <Heading style={{ color: "#3b2b22", fontSize: 24, margin: "0 0 20px" }}>New Founding 20 signup</Heading>
          <Text style={row}><strong>First name:</strong> {firstName}</Text>
          <Text style={row}><strong>Email:</strong> {email}</Text>
          <Text style={row}><strong>Email consent:</strong> {consent ? "Yes" : "No"}</Text>
          <Text style={row}><strong>Signed up at:</strong> {timestamp}</Text>
          <Text style={row}><strong>Code issued:</strong> FREESHIP20</Text>
        </Container>
      </Body>
    </Html>
  );
}

export const template = {
  component: Founding20Signup,
  subject: (d: Record<string, any>) => `Founding 20 signup: ${d["firstName"] ?? ""}`,
  displayName: "Founding 20 signup",
  to: "info@linamii.co.za",
  previewData: { firstName: "Thandi", email: "thandi@example.com", consent: true, timestamp: new Date().toISOString() },
} satisfies TemplateEntry;
