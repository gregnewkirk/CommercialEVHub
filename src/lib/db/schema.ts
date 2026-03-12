import {
  pgTable,
  uuid,
  text,
  integer,
  date,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  numeric,
} from "drizzle-orm/pg-core";

export const grantStatusEnum = pgEnum("grant_status", [
  "active",
  "upcoming",
  "archived",
  "exhausted",
]);

export const jurisdictionEnum = pgEnum("jurisdiction", [
  "federal",
  "state",
  "county",
  "city",
  "utility",
]);

export const incentiveTypeEnum = pgEnum("incentive_type", [
  "grant",
  "tax_credit",
  "rebate",
  "make_ready",
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "qualified",
  "distributed",
  "converted",
]);

export const installerTierEnum = pgEnum("installer_tier", [
  "free",
  "premium",
]);

export const distributionStatusEnum = pgEnum("distribution_status", [
  "sent",
  "viewed",
  "contacted",
  "won",
  "lost",
]);

export const syncStatusEnum = pgEnum("sync_status", [
  "success",
  "partial",
  "failed",
]);

export const contractorTierEnum = pgEnum("contractor_tier", [
  "standard",
  "verified",
  "enterprise",
]);

export const grants = pgTable("grants", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  amountMin: integer("amount_min"),
  amountMax: integer("amount_max"),
  deadline: date("deadline"),
  status: grantStatusEnum("status").notNull().default("active"),
  sourceUrl: text("source_url"),
  funder: text("funder").notNull().default(""),
  jurisdiction: jurisdictionEnum("jurisdiction").notNull().default("federal"),
  state: text("state"),
  city: text("city"),
  utility: text("utility"),
  eligibleEntities: text("eligible_entities")
    .array()
    .notNull()
    .default([]),
  eligibleHardware: text("eligible_hardware")
    .array()
    .notNull()
    .default([]),
  incentiveType: incentiveTypeEnum("incentive_type")
    .notNull()
    .default("grant"),
  justice40: boolean("justice40").notNull().default(false),
  source: text("source").notNull().default("manual"),
  rawData: jsonb("raw_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  grantId: uuid("grant_id").references(() => grants.id),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  zipCode: text("zip_code").notNull(),
  fleetSize: integer("fleet_size"),
  hardwareType: text("hardware_type"),
  numPorts: integer("num_ports"),
  estimatedInvestment: integer("estimated_investment"),
  status: leadStatusEnum("status").notNull().default("new"),
  sourcePage: text("source_page"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const installers = pgTable("installers", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id"),
  companyName: text("company_name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  logoUrl: text("logo_url"),
  website: text("website"),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  serviceAreas: text("service_areas").array().notNull().default([]),
  hardwareTypes: text("hardware_types").array().notNull().default([]),
  tier: installerTierEnum("tier").notNull().default("free"),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contractors = pgTable("contractors", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  location: text("location"),
  state: text("state"),
  city: text("city"),
  serviceArea: jsonb("service_area").default([]),
  specialties: jsonb("specialties").default([]),
  certifications: jsonb("certifications").default({}),
  licenseNumber: text("license_number"),
  rating: numeric("rating"),
  reviewCount: integer("review_count").default(0),
  tier: contractorTierEnum("tier").default("standard"),
  description: text("description"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const leadDistributions = pgTable("lead_distributions", {
  id: uuid("id").defaultRandom().primaryKey(),
  leadId: uuid("lead_id")
    .notNull()
    .references(() => leads.id),
  installerId: uuid("installer_id")
    .notNull()
    .references(() => installers.id),
  distributedAt: timestamp("distributed_at").defaultNow().notNull(),
  status: distributionStatusEnum("status").notNull().default("sent"),
});

export const grantSyncLogs = pgTable("grant_sync_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  source: text("source").notNull(),
  status: syncStatusEnum("status").notNull(),
  grantsAdded: integer("grants_added").notNull().default(0),
  grantsUpdated: integer("grants_updated").notNull().default(0),
  errorMessage: text("error_message"),
  ranAt: timestamp("ran_at").defaultNow().notNull(),
});

export const states = pgTable("states", {
  code: text("code").primaryKey(),
  name: text("name").notNull(),
  grantCount: integer("grant_count").notNull().default(0),
});

// Type exports
export type Grant = typeof grants.$inferSelect;
export type NewGrant = typeof grants.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type Installer = typeof installers.$inferSelect;
export type NewInstaller = typeof installers.$inferInsert;
export type Contractor = typeof contractors.$inferSelect;
export type NewContractor = typeof contractors.$inferInsert;
export type LeadDistribution = typeof leadDistributions.$inferSelect;
export type GrantSyncLog = typeof grantSyncLogs.$inferSelect;
export type State = typeof states.$inferSelect;
