import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(255),
      message: z.string().trim().min(10).max(2000),
      });

      export const sendContactEnquiry = createServerFn({ method: "POST" })
        .validator((data: unknown) => contactSchema.parse(data))
          .handler(async ({ data }) => {
              const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
                  const result = await sendTemplateEmail("contact-enquiry", "info@linamii.co.za", {
                        templateData: data,
                              replyTo: data.email,
                                  });
                                      return { ok: result.sent };
                                        });

                                        const vendorSchema = z.object({
                                          registrationNumber: z.string().trim().min(5).max(30),
                                            businessName: z.string().trim().min(2).max(120),
                                              contactName: z.string().trim().min(2).max(100),
                                                email: z.string().trim().email().max(255),
                                                  phone: z.string().trim().min(6).max(20),
                                                    productTypes: z.string().trim().min(2).max(200),
                                                      about: z.string().trim().max(1000).optional().default(""),
                                                        website: z.string().trim().max(255).optional().default("Not provided"),
                                                          wantsSynaps: z.boolean().optional().default(false),
                                                            documents: z.array(z.string().max(300)).max(60).optional().default([]),
                                                            });

                                                            export const sendVendorApplication = createServerFn({ method: "POST" })
                                                              .validator((data: unknown) => vendorSchema.parse(data))
                                                                .handler(async ({ data }) => {
                                                                    const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
                                                                        const result = await sendTemplateEmail("vendor-application", "info@linamii.co.za", {
                                                                              templateData: data,
                                                                                    replyTo: data.email,
                                                                                        });
                                                                                            return { ok: result.sent };
                                                                                              });

                                                                                              const founding20Schema = z.object({
                                                                                                firstName: z.string().trim().min(1).max(60),
                                                                                                  email: z.string().trim().email().max(255),
                                                                                                    consent: z.boolean().optional().default(false),
                                                                                                    });

                                                                                                    /** Best-effort Shopify customer sync. An already-registered email is not an error. */
                                                                                                    async function syncShopifyCustomer(firstName: string, email: string, acceptsMarketing: boolean) {
                                                                                                      const { SHOPIFY_STOREFRONT_URL, SHOPIFY_STOREFRONT_TOKEN } = await import("@/lib/shopify");
                                                                                                        const mutation = `
                                                                                                            mutation customerCreate($input: CustomerCreateInput!) {
                                                                                                                  customerCreate(input: $input) {
                                                                                                                          customer { id }
                                                                                                                                  customerUserErrors { code field message }
                                                                                                                                        }
                                                                                                                                            }
                                                                                                                                              `;
                                                                                                                                                const password = `Lin-${crypto.randomUUID()}`;
                                                                                                                                                  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
                                                                                                                                                      method: "POST",
                                                                                                                                                          headers: {
                                                                                                                                                                "Content-Type": "application/json",
                                                                                                                                                                      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
                                                                                                                                                                          },
                                                                                                                                                                              body: JSON.stringify({
                                                                                                                                                                                    query: mutation,
                                                                                                                                                                                          variables: { input: { firstName, email, password, acceptsMarketing } },
                                                                                                                                                                                              }),
                                                                                                                                                                                                });
                                                                                                                                                                                                  if (!response.ok) {
                                                                                                                                                                                                      console.warn("Shopify customer sync skipped", response.status);
                                                                                                                                                                                                          return { synced: false };
                                                                                                                                                                                                            }
                                                                                                                                                                                                              const json = (await response.json()) as {
                                                                                                                                                                                                                  data?: { customerCreate?: { customer?: { id: string } | null; customerUserErrors?: Array<{ code?: string; message: string }> } };
                                                                                                                                                                                                                    };
                                                                                                                                                                                                                      const errors = json.data?.customerCreate?.customerUserErrors ?? [];
                                                                                                                                                                                                                        if (errors.length > 0) {
                                                                                                                                                                                                                            // TAKEN / already subscribed is expected for returning visitors.
                                                                                                                                                                                                                                console.info("Shopify customer already present or rejected", errors.map((e) => e.code ?? e.message).join(", "));
                                                                                                                                                                                                                                    return { synced: false, alreadyExists: errors.some((e) => e.code === "TAKEN") };
                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                        return { synced: Boolean(json.data?.customerCreate?.customer?.id) };
                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                        export const sendFounding20Signup = createServerFn({ method: "POST" })
                                                                                                                                                                                                                                          .validator((data: unknown) => founding20Schema.parse(data))
                                                                                                                                                                                                                                            .handler(async ({ data }) => {
                                                                                                                                                                                                                                                const timestamp = new Date().toISOString();

                                                                                                                                                                                                                                                    // 1. Save to the database first so no signup is ever lost.
                                                                                                                                                                                                                                                        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
                                                                                                                                                                                                                                                            const { error } = await supabaseAdmin.from("founding20_signups").insert({
                                                                                                                                                                                                                                                                  first_name: data.firstName,
                                                                                                                                                                                                                                                                        email: data.email,
                                                                                                                                                                                                                                                                              consent: data.consent,
                                                                                                                                                                                                                                                                                    created_at: timestamp,
                                                                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                                                                            if (error && error.code !== "23505") {
                                                                                                                                                                                                                                                                                                  console.error("Signup save failed", error);
                                                                                                                                                                                                                                                                                                        throw new Error("Could not save signup");
                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                // 2. Server-side Shopify customer sync (best effort).
                                                                                                                                                                                                                                                                                                                    try {
                                                                                                                                                                                                                                                                                                                          await syncShopifyCustomer(data.firstName, data.email, data.consent);
                                                                                                                                                                                                                                                                                                                              } catch (e) {
                                                                                                                                                                                                                                                                                                                                    console.warn("Shopify customer sync failed", e);
                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                            // 3. Notification email is best effort; the signup is already saved.
                                                                                                                                                                                                                                                                                                                                                try {
                                                                                                                                                                                                                                                                                                                                                      const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
                                                                                                                                                                                                                                                                                                                                                            await sendTemplateEmail("founding20-signup", "info@linamii.co.za", {
                                                                                                                                                                                                                                                                                                                                                                    templateData: { ...data, timestamp },
                                                                                                                                                                                                                                                                                                                                                                            replyTo: data.email,
                                                                                                                                                                                                                                                                                                                                                                                  });
                                                                                                                                                                                                                                                                                                                                                                                      } catch (e) {
                                                                                                                                                                                                                                                                                                                                                                                            console.warn("Signup notification email not sent", e);
                                                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                                                    return { ok: true };
                                                                                                                                                                                                                                                                                                                                                                                                      });

