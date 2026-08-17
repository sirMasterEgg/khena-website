export type LeadSourceType = "catalogue";

export type Lead = {
  sourceType: LeadSourceType;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country: string;
  industry: string;
  marketingConsent: boolean;
};

export type LeadResult = {
  id: string;
};

/** Abstraksi penyimpanan lead (form gate katalog dst.) — bagian 4.9 issue.md. */
export interface LeadService {
  submit(lead: Lead): Promise<LeadResult>;
}
