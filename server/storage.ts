import { type ContactForm, type ContactSubmission } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createContactSubmission(data: ContactForm): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
}

export class MemStorage implements IStorage {
  private contacts: ContactSubmission[];

  constructor() {
    this.contacts = [];
  }

  async createContactSubmission(data: ContactForm): Promise<ContactSubmission> {
    const submission: ContactSubmission = {
      ...data,
      id: randomUUID(),
      submittedAt: new Date().toISOString(),
    };
    this.contacts.push(submission);
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return [...this.contacts];
  }
}

export const storage = new MemStorage();