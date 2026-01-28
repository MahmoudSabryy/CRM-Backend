export enum UserRole {
  Admin = 'admin',
  Manager = 'manager',
  SalesRep = 'Sales Rep',
}

export enum LeadSource {
  Facebook = 'facebook',
  Instagram = 'instagram',
  Tiktok = 'tiktok',
  Twitter = 'twitter',
  Website = 'website',
  Referral = 'referral',
  Other = 'other',
}

export enum LeadStatus {
  New = 'new',
  Contacted = 'contacted',
  Qualified = 'qualified',
  Converted = 'converted',
  UnQualified = 'unqualified',
}

export enum ActivityType {
  Call = 'call',
  Email = 'email',
  Meeting = 'meeting',
  FollowUp = 'follow-up',
}

export enum StageType {
  Prospecting = 'prospecting', // لسه فرصة
  Qualification = 'qualification', // بنشوف مناسب ولا لا
  Proposal = 'proposal', // عرض سعر / عرض
  Negotiation = 'negotiation', // تفاوض
  Won = 'won', // كسبنا الديل
  Lost = 'lost', // خسرنا الديل
}

export enum DealStatus {
  Open = 'open', // شغال
  Closed = 'closed', // اتقفل (won أو lost)
  OnHold = 'on_hold', // متوقف مؤقتًا
  Cancelled = 'cancelled',
}

export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  isActive: boolean;
  deletedAt: Date;
  createdAt: Date;
  address: string;
}
