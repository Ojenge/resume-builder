import { pgTable, text, serial, integer, boolean, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table (keeping original implementation)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Profile information
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  summary: text("summary").notNull(),
  profileImage: text("profile_image"),
});

export const insertProfileSchema = createInsertSchema(profiles).pick({
  fullName: true,
  title: true,
  email: true,
  phone: true,
  location: true,
  summary: true,
  profileImage: true,
});

// Education information
export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  degree: varchar("degree", { length: 100 }).notNull(),
  institution: varchar("institution", { length: 100 }).notNull(),
  years: varchar("years", { length: 30 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  profileId: integer("profile_id").notNull(),
});

export const insertEducationSchema = createInsertSchema(education).pick({
  degree: true,
  institution: true,
  years: true,
  location: true,
  profileId: true,
});

// Skills information
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  percentage: integer("percentage").notNull(),
  profileId: integer("profile_id").notNull(),
});

export const insertSkillSchema = createInsertSchema(skills).pick({
  name: true,
  percentage: true,
  profileId: true,
});

// Languages information
export const languages = pgTable("languages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  level: varchar("level", { length: 50 }).notNull(),
  percentage: integer("percentage").notNull(),
  profileId: integer("profile_id").notNull(),
});

export const insertLanguageSchema = createInsertSchema(languages).pick({
  name: true,
  level: true,
  percentage: true,
  profileId: true,
});

// Certifications
export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  organization: varchar("organization", { length: 150 }).notNull(),
  profileId: integer("profile_id").notNull(),
});

export const insertCertificationSchema = createInsertSchema(certifications).pick({
  name: true,
  organization: true,
  profileId: true,
});

// Experience
export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  company: varchar("company", { length: 100 }).notNull(),
  period: varchar("period", { length: 50 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  description: text("description"),
  responsibilities: json("responsibilities").notNull().$type<string[]>(),
  profileId: integer("profile_id").notNull(),
  displayOrder: integer("display_order").notNull(),
});

export const insertExperienceSchema = createInsertSchema(experiences).pick({
  title: true,
  company: true,
  period: true,
  location: true,
  description: true,
  responsibilities: true,
  profileId: true,
  displayOrder: true,
});

// Achievements
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  percentage: integer("percentage").notNull(),
  description: text("description").notNull(),
  profileId: integer("profile_id").notNull(),
});

export const insertAchievementSchema = createInsertSchema(achievements).pick({
  percentage: true,
  description: true,
  profileId: true,
});

// Technical expertise
export const technicalSkills = pgTable("technical_skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // programming, business, etc.
  profileId: integer("profile_id").notNull(),
});

export const insertTechnicalSkillSchema = createInsertSchema(technicalSkills).pick({
  name: true,
  category: true,
  profileId: true,
});

// Professional strengths
export const strengths = pgTable("strengths", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  profileId: integer("profile_id").notNull(),
});

export const insertStrengthSchema = createInsertSchema(strengths).pick({
  title: true,
  description: true,
  icon: true,
  profileId: true,
});

// References
export const references = pgTable("references", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  profileId: integer("profile_id").notNull(),
});

export const insertReferenceSchema = createInsertSchema(references).pick({
  name: true,
  title: true,
  location: true,
  email: true,
  phone: true,
  profileId: true,
});

// Time allocation
export const timeAllocations = pgTable("time_allocations", {
  id: serial("id").primaryKey(),
  activity: varchar("activity", { length: 100 }).notNull(),
  percentage: integer("percentage").notNull(),
  color: varchar("color", { length: 30 }).notNull(),
  profileId: integer("profile_id").notNull(),
});

export const insertTimeAllocationSchema = createInsertSchema(timeAllocations).pick({
  activity: true,
  percentage: true,
  color: true,
  profileId: true,
});

// Export types for all schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type Education = typeof education.$inferSelect;

export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;

export type InsertLanguage = z.infer<typeof insertLanguageSchema>;
export type Language = typeof languages.$inferSelect;

export type InsertCertification = z.infer<typeof insertCertificationSchema>;
export type Certification = typeof certifications.$inferSelect;

export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experiences.$inferSelect;

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

export type InsertTechnicalSkill = z.infer<typeof insertTechnicalSkillSchema>;
export type TechnicalSkill = typeof technicalSkills.$inferSelect;

export type InsertStrength = z.infer<typeof insertStrengthSchema>;
export type Strength = typeof strengths.$inferSelect;

export type InsertReference = z.infer<typeof insertReferenceSchema>;
export type Reference = typeof references.$inferSelect;

export type InsertTimeAllocation = z.infer<typeof insertTimeAllocationSchema>;
export type TimeAllocation = typeof timeAllocations.$inferSelect;
