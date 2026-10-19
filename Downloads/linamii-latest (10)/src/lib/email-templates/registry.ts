import type { ComponentType } from 'react'
import { template as contactEnquiryTemplate } from './contact-enquiry'
import { template as vendorApplicationTemplate } from './vendor-application'
import { template as founding20Template } from './founding20-signup'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 */
export const TEMPLATES: Record<string, TemplateEntry> = {
  'contact-enquiry': contactEnquiryTemplate,
  'vendor-application': vendorApplicationTemplate,
  'founding20-signup': founding20Template,
}
