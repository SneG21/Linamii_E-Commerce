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

interface VendorApplicationProps {
  businessName?: string;
  registrationNumber?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  productTypes?: string;
  about?: string;
  website?: string;
  wantsSynaps?: boolean;
  documents?: string[];
}

const rowStyle = { color: "#3b2b22", fontSize: 14, margin: "0 0 8px" } as const;

function VendorApplication({
  businessName = "Unnamed business",
  registrationNumber = "—",
  contactName = "—",
  email = "—",
  phone = "—",
  productTypes = "—",
  about = "",
  website = "Not provided",
  wantsSynaps = false,
  documents = [],
}: VendorApplicationProps) {
  return (
    <Html>
      <Head />
      <Preview>Vendor application from {businessName}</Preview>
      <Body style={{ backgroundColor: "#f6f1ea", fontFamily: "Georgia, serif", margin: 0 }}>
        <Container style={{ backgroundColor: "#ffffff", borderRadius: 24, margin: "32px auto", maxWidth: 600, padding: 32 }}>
          <Text style={{ color: "#a97b52", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", margin: 0 }}>
            Linamii · Vendor programme
          </Text>
          <Heading style={{ color: "#3b2b22", fontSize: 24, margin: "12px 0 0" }}>New vendor application</Heading>
          <Hr style={{ borderColor: "#eee3d8", margin: "24px 0" }} />
          <Section>
            <Text style={rowStyle}><strong>Business name:</strong> {businessName}</Text>
            <Text style={rowStyle}><strong>Registration number:</strong> {registrationNumber}</Text>
            <Text style={rowStyle}><strong>Contact person:</strong> {contactName}</Text>
            <Text style={rowStyle}><strong>Email:</strong> {email}</Text>
            <Text style={rowStyle}><strong>Phone:</strong> {phone}</Text>
            <Text style={rowStyle}><strong>Products:</strong> {productTypes}</Text>
            <Text style={rowStyle}><strong>Website:</strong> {website}</Text>
            <Text style={rowStyle}>
              <strong>Wants SYNAPS to build a website:</strong> {wantsSynaps ? "Yes" : "No"}
            </Text>
          </Section>
          {about ? (
            <Section>
              <Text style={{ ...rowStyle, margin: "16px 0 4px" }}><strong>About the brand</strong></Text>
              <Text style={{ color: "#5c4a3f", fontSize: 14, lineHeight: "22px", margin: 0, whiteSpace: "pre-wrap" }}>
                {about}
              </Text>
            </Section>
          ) : null}
          <Section>
            <Text style={{ ...rowStyle, margin: "16px 0 4px" }}><strong>Documents listed by the applicant</strong></Text>
            {documents.length ? (
              documents.map((d) => (
                <Text key={d} style={{ color: "#5c4a3f", fontSize: 13, margin: "0 0 4px" }}>• {d}</Text>
              ))
            ) : (
              <Text style={{ color: "#5c4a3f", fontSize: 13, margin: 0 }}>None listed</Text>
            )}
            <Text style={{ color: "#8a776a", fontSize: 12, margin: "12px 0 0" }}>
              Reply to this email to request the document files directly from the applicant.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const template = {
  component: VendorApplication,
  displayName: "Vendor application",
  subject: (data: Record<string, any>) =>
    `Vendor application — ${data['businessName'] ?? "new applicant"}`,
  to: "info@linamii.co.za",
  previewData: {
    businessName: "Little Loom (Pty) Ltd",
    registrationNumber: "2021/123456/07",
    contactName: "Naledi K",
    email: "naledi@littleloom.co.za",
    phone: "+27 71 000 0000",
    productTypes: "Baby clothing, blankets",
    about: "Hand-knitted newborn essentials made in Soweto.",
    website: "https://littleloom.co.za",
    wantsSynaps: false,
    documents: ["CIPC Registration Documents: cipc.pdf", "Proof of Residence: proof.pdf"],
  },
} satisfies TemplateEntry;
