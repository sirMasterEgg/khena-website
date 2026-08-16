import type {Lead, LeadResult, LeadService} from "@/domain/services/lead-service";

const leads: Lead[] = [];

/** Implementasi mock — mencatat lead di memori sampai backend siap (ISSUE-15). */
export class MockLeadService implements LeadService {
  async submit(lead: Lead): Promise<LeadResult> {
    leads.push(lead);
    return {id: `lead-${leads.length}`};
  }
}
