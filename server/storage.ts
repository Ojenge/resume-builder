import { 
  users, type User, type InsertUser,
  profiles, type Profile, type InsertProfile,
  education, type Education, type InsertEducation,
  skills, type Skill, type InsertSkill,
  languages, type Language, type InsertLanguage,
  certifications, type Certification, type InsertCertification,
  experiences, type Experience, type InsertExperience,
  achievements, type Achievement, type InsertAchievement,
  technicalSkills, type TechnicalSkill, type InsertTechnicalSkill,
  strengths, type Strength, type InsertStrength,
  references, type Reference, type InsertReference,
  timeAllocations, type TimeAllocation, type InsertTimeAllocation
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Basic user interface remains the same
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Profile methods
  getProfile(id: number): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: number, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  
  // Education methods
  getEducationByProfileId(profileId: number): Promise<Education[]>;
  createEducation(education: InsertEducation): Promise<Education>;
  updateEducation(id: number, education: Partial<InsertEducation>): Promise<Education | undefined>;
  deleteEducation(id: number): Promise<boolean>;
  
  // Skills methods
  getSkillsByProfileId(profileId: number): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<boolean>;
  
  // Languages methods
  getLanguagesByProfileId(profileId: number): Promise<Language[]>;
  createLanguage(language: InsertLanguage): Promise<Language>;
  updateLanguage(id: number, language: Partial<InsertLanguage>): Promise<Language | undefined>;
  deleteLanguage(id: number): Promise<boolean>;
  
  // Certifications methods
  getCertificationsByProfileId(profileId: number): Promise<Certification[]>;
  createCertification(certification: InsertCertification): Promise<Certification>;
  updateCertification(id: number, certification: Partial<InsertCertification>): Promise<Certification | undefined>;
  deleteCertification(id: number): Promise<boolean>;
  
  // Experience methods
  getExperiencesByProfileId(profileId: number): Promise<Experience[]>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  updateExperience(id: number, experience: Partial<InsertExperience>): Promise<Experience | undefined>;
  deleteExperience(id: number): Promise<boolean>;
  
  // Achievements methods
  getAchievementsByProfileId(profileId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  updateAchievement(id: number, achievement: Partial<InsertAchievement>): Promise<Achievement | undefined>;
  deleteAchievement(id: number): Promise<boolean>;
  
  // Technical skills methods
  getTechnicalSkillsByProfileId(profileId: number): Promise<TechnicalSkill[]>;
  createTechnicalSkill(technicalSkill: InsertTechnicalSkill): Promise<TechnicalSkill>;
  updateTechnicalSkill(id: number, technicalSkill: Partial<InsertTechnicalSkill>): Promise<TechnicalSkill | undefined>;
  deleteTechnicalSkill(id: number): Promise<boolean>;
  
  // Strengths methods
  getStrengthsByProfileId(profileId: number): Promise<Strength[]>;
  createStrength(strength: InsertStrength): Promise<Strength>;
  updateStrength(id: number, strength: Partial<InsertStrength>): Promise<Strength | undefined>;
  deleteStrength(id: number): Promise<boolean>;
  
  // References methods
  getReferencesByProfileId(profileId: number): Promise<Reference[]>;
  createReference(reference: InsertReference): Promise<Reference>;
  updateReference(id: number, reference: Partial<InsertReference>): Promise<Reference | undefined>;
  deleteReference(id: number): Promise<boolean>;
  
  // Time allocations methods
  getTimeAllocationsByProfileId(profileId: number): Promise<TimeAllocation[]>;
  createTimeAllocation(timeAllocation: InsertTimeAllocation): Promise<TimeAllocation>;
  updateTimeAllocation(id: number, timeAllocation: Partial<InsertTimeAllocation>): Promise<TimeAllocation | undefined>;
  deleteTimeAllocation(id: number): Promise<boolean>;

  // Resume data method
  getCompleteResumeData(profileId: number): Promise<{
    profile: Profile | undefined;
    education: Education[];
    skills: Skill[];
    languages: Language[];
    certifications: Certification[];
    experiences: Experience[];
    achievements: Achievement[];
    technicalSkills: TechnicalSkill[];
    strengths: Strength[];
    references: Reference[];
    timeAllocations: TimeAllocation[];
  }>;
}

// Memory storage implementation keeps compatibility with previous code
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private profiles: Map<number, Profile>;
  private educationItems: Map<number, Education>;
  private skillItems: Map<number, Skill>;
  private languageItems: Map<number, Language>;
  private certificationItems: Map<number, Certification>;
  private experienceItems: Map<number, Experience>;
  private achievementItems: Map<number, Achievement>;
  private technicalSkillItems: Map<number, TechnicalSkill>;
  private strengthItems: Map<number, Strength>;
  private referenceItems: Map<number, Reference>;
  private timeAllocationItems: Map<number, TimeAllocation>;
  
  private currentIds: {
    user: number;
    profile: number;
    education: number;
    skill: number;
    language: number;
    certification: number;
    experience: number;
    achievement: number;
    technicalSkill: number;
    strength: number;
    reference: number;
    timeAllocation: number;
  };

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.educationItems = new Map();
    this.skillItems = new Map();
    this.languageItems = new Map();
    this.certificationItems = new Map();
    this.experienceItems = new Map();
    this.achievementItems = new Map();
    this.technicalSkillItems = new Map();
    this.strengthItems = new Map();
    this.referenceItems = new Map();
    this.timeAllocationItems = new Map();
    
    this.currentIds = {
      user: 1,
      profile: 1,
      education: 1,
      skill: 1,
      language: 1,
      certification: 1,
      experience: 1,
      achievement: 1,
      technicalSkill: 1,
      strength: 1,
      reference: 1,
      timeAllocation: 1
    };
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.user++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Profile methods
  async getProfile(id: number): Promise<Profile | undefined> {
    return this.profiles.get(id);
  }
  
  async createProfile(profile: InsertProfile): Promise<Profile> {
    const id = this.currentIds.profile++;
    const newProfile: Profile = { ...profile, id };
    this.profiles.set(id, newProfile);
    return newProfile;
  }
  
  async updateProfile(id: number, profile: Partial<InsertProfile>): Promise<Profile | undefined> {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) return undefined;
    
    const updatedProfile = { ...existingProfile, ...profile };
    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }
  
  // Education methods
  async getEducationByProfileId(profileId: number): Promise<Education[]> {
    return Array.from(this.educationItems.values())
      .filter(edu => edu.profileId === profileId);
  }
  
  async createEducation(education: InsertEducation): Promise<Education> {
    const id = this.currentIds.education++;
    const newEducation: Education = { ...education, id };
    this.educationItems.set(id, newEducation);
    return newEducation;
  }
  
  async updateEducation(id: number, education: Partial<InsertEducation>): Promise<Education | undefined> {
    const existingEducation = this.educationItems.get(id);
    if (!existingEducation) return undefined;
    
    const updatedEducation = { ...existingEducation, ...education };
    this.educationItems.set(id, updatedEducation);
    return updatedEducation;
  }
  
  async deleteEducation(id: number): Promise<boolean> {
    return this.educationItems.delete(id);
  }
  
  // Skills methods
  async getSkillsByProfileId(profileId: number): Promise<Skill[]> {
    return Array.from(this.skillItems.values())
      .filter(skill => skill.profileId === profileId);
  }
  
  async createSkill(skill: InsertSkill): Promise<Skill> {
    const id = this.currentIds.skill++;
    const newSkill: Skill = { ...skill, id };
    this.skillItems.set(id, newSkill);
    return newSkill;
  }
  
  async updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined> {
    const existingSkill = this.skillItems.get(id);
    if (!existingSkill) return undefined;
    
    const updatedSkill = { ...existingSkill, ...skill };
    this.skillItems.set(id, updatedSkill);
    return updatedSkill;
  }
  
  async deleteSkill(id: number): Promise<boolean> {
    return this.skillItems.delete(id);
  }
  
  // Languages methods
  async getLanguagesByProfileId(profileId: number): Promise<Language[]> {
    return Array.from(this.languageItems.values())
      .filter(language => language.profileId === profileId);
  }
  
  async createLanguage(language: InsertLanguage): Promise<Language> {
    const id = this.currentIds.language++;
    const newLanguage: Language = { ...language, id };
    this.languageItems.set(id, newLanguage);
    return newLanguage;
  }
  
  async updateLanguage(id: number, language: Partial<InsertLanguage>): Promise<Language | undefined> {
    const existingLanguage = this.languageItems.get(id);
    if (!existingLanguage) return undefined;
    
    const updatedLanguage = { ...existingLanguage, ...language };
    this.languageItems.set(id, updatedLanguage);
    return updatedLanguage;
  }
  
  async deleteLanguage(id: number): Promise<boolean> {
    return this.languageItems.delete(id);
  }
  
  // Certifications methods
  async getCertificationsByProfileId(profileId: number): Promise<Certification[]> {
    return Array.from(this.certificationItems.values())
      .filter(cert => cert.profileId === profileId);
  }
  
  async createCertification(certification: InsertCertification): Promise<Certification> {
    const id = this.currentIds.certification++;
    const newCertification: Certification = { ...certification, id };
    this.certificationItems.set(id, newCertification);
    return newCertification;
  }
  
  async updateCertification(id: number, certification: Partial<InsertCertification>): Promise<Certification | undefined> {
    const existingCertification = this.certificationItems.get(id);
    if (!existingCertification) return undefined;
    
    const updatedCertification = { ...existingCertification, ...certification };
    this.certificationItems.set(id, updatedCertification);
    return updatedCertification;
  }
  
  async deleteCertification(id: number): Promise<boolean> {
    return this.certificationItems.delete(id);
  }
  
  // Experience methods
  async getExperiencesByProfileId(profileId: number): Promise<Experience[]> {
    return Array.from(this.experienceItems.values())
      .filter(exp => exp.profileId === profileId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }
  
  async createExperience(experience: InsertExperience): Promise<Experience> {
    const id = this.currentIds.experience++;
    const newExperience: Experience = { ...experience, id };
    this.experienceItems.set(id, newExperience);
    return newExperience;
  }
  
  async updateExperience(id: number, experience: Partial<InsertExperience>): Promise<Experience | undefined> {
    const existingExperience = this.experienceItems.get(id);
    if (!existingExperience) return undefined;
    
    const updatedExperience = { ...existingExperience, ...experience };
    this.experienceItems.set(id, updatedExperience);
    return updatedExperience;
  }
  
  async deleteExperience(id: number): Promise<boolean> {
    return this.experienceItems.delete(id);
  }
  
  // Achievements methods
  async getAchievementsByProfileId(profileId: number): Promise<Achievement[]> {
    return Array.from(this.achievementItems.values())
      .filter(achievement => achievement.profileId === profileId);
  }
  
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentIds.achievement++;
    const newAchievement: Achievement = { ...achievement, id };
    this.achievementItems.set(id, newAchievement);
    return newAchievement;
  }
  
  async updateAchievement(id: number, achievement: Partial<InsertAchievement>): Promise<Achievement | undefined> {
    const existingAchievement = this.achievementItems.get(id);
    if (!existingAchievement) return undefined;
    
    const updatedAchievement = { ...existingAchievement, ...achievement };
    this.achievementItems.set(id, updatedAchievement);
    return updatedAchievement;
  }
  
  async deleteAchievement(id: number): Promise<boolean> {
    return this.achievementItems.delete(id);
  }
  
  // Technical skills methods
  async getTechnicalSkillsByProfileId(profileId: number): Promise<TechnicalSkill[]> {
    return Array.from(this.technicalSkillItems.values())
      .filter(skill => skill.profileId === profileId);
  }
  
  async createTechnicalSkill(technicalSkill: InsertTechnicalSkill): Promise<TechnicalSkill> {
    const id = this.currentIds.technicalSkill++;
    const newTechnicalSkill: TechnicalSkill = { ...technicalSkill, id };
    this.technicalSkillItems.set(id, newTechnicalSkill);
    return newTechnicalSkill;
  }
  
  async updateTechnicalSkill(id: number, technicalSkill: Partial<InsertTechnicalSkill>): Promise<TechnicalSkill | undefined> {
    const existingTechnicalSkill = this.technicalSkillItems.get(id);
    if (!existingTechnicalSkill) return undefined;
    
    const updatedTechnicalSkill = { ...existingTechnicalSkill, ...technicalSkill };
    this.technicalSkillItems.set(id, updatedTechnicalSkill);
    return updatedTechnicalSkill;
  }
  
  async deleteTechnicalSkill(id: number): Promise<boolean> {
    return this.technicalSkillItems.delete(id);
  }
  
  // Strengths methods
  async getStrengthsByProfileId(profileId: number): Promise<Strength[]> {
    return Array.from(this.strengthItems.values())
      .filter(strength => strength.profileId === profileId);
  }
  
  async createStrength(strength: InsertStrength): Promise<Strength> {
    const id = this.currentIds.strength++;
    const newStrength: Strength = { ...strength, id };
    this.strengthItems.set(id, newStrength);
    return newStrength;
  }
  
  async updateStrength(id: number, strength: Partial<InsertStrength>): Promise<Strength | undefined> {
    const existingStrength = this.strengthItems.get(id);
    if (!existingStrength) return undefined;
    
    const updatedStrength = { ...existingStrength, ...strength };
    this.strengthItems.set(id, updatedStrength);
    return updatedStrength;
  }
  
  async deleteStrength(id: number): Promise<boolean> {
    return this.strengthItems.delete(id);
  }
  
  // References methods
  async getReferencesByProfileId(profileId: number): Promise<Reference[]> {
    return Array.from(this.referenceItems.values())
      .filter(reference => reference.profileId === profileId);
  }
  
  async createReference(reference: InsertReference): Promise<Reference> {
    const id = this.currentIds.reference++;
    const newReference: Reference = { ...reference, id };
    this.referenceItems.set(id, newReference);
    return newReference;
  }
  
  async updateReference(id: number, reference: Partial<InsertReference>): Promise<Reference | undefined> {
    const existingReference = this.referenceItems.get(id);
    if (!existingReference) return undefined;
    
    const updatedReference = { ...existingReference, ...reference };
    this.referenceItems.set(id, updatedReference);
    return updatedReference;
  }
  
  async deleteReference(id: number): Promise<boolean> {
    return this.referenceItems.delete(id);
  }
  
  // Time allocations methods
  async getTimeAllocationsByProfileId(profileId: number): Promise<TimeAllocation[]> {
    return Array.from(this.timeAllocationItems.values())
      .filter(timeAllocation => timeAllocation.profileId === profileId);
  }
  
  async createTimeAllocation(timeAllocation: InsertTimeAllocation): Promise<TimeAllocation> {
    const id = this.currentIds.timeAllocation++;
    const newTimeAllocation: TimeAllocation = { ...timeAllocation, id };
    this.timeAllocationItems.set(id, newTimeAllocation);
    return newTimeAllocation;
  }
  
  async updateTimeAllocation(id: number, timeAllocation: Partial<InsertTimeAllocation>): Promise<TimeAllocation | undefined> {
    const existingTimeAllocation = this.timeAllocationItems.get(id);
    if (!existingTimeAllocation) return undefined;
    
    const updatedTimeAllocation = { ...existingTimeAllocation, ...timeAllocation };
    this.timeAllocationItems.set(id, updatedTimeAllocation);
    return updatedTimeAllocation;
  }
  
  async deleteTimeAllocation(id: number): Promise<boolean> {
    return this.timeAllocationItems.delete(id);
  }
  
  // Complete resume data
  async getCompleteResumeData(profileId: number) {
    return {
      profile: await this.getProfile(profileId),
      education: await this.getEducationByProfileId(profileId),
      skills: await this.getSkillsByProfileId(profileId),
      languages: await this.getLanguagesByProfileId(profileId),
      certifications: await this.getCertificationsByProfileId(profileId),
      experiences: await this.getExperiencesByProfileId(profileId),
      achievements: await this.getAchievementsByProfileId(profileId),
      technicalSkills: await this.getTechnicalSkillsByProfileId(profileId),
      strengths: await this.getStrengthsByProfileId(profileId),
      references: await this.getReferencesByProfileId(profileId),
      timeAllocations: await this.getTimeAllocationsByProfileId(profileId)
    };
  }
}

// Database storage implementation
export class PostgresStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    const connectionString = process.env.DATABASE_URL as string;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not defined");
    }

    const client = postgres(connectionString);
    this.db = drizzle(client);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }
  
  // Profile methods
  async getProfile(id: number): Promise<Profile | undefined> {
    const result = await this.db.select().from(profiles).where(eq(profiles.id, id));
    return result[0];
  }
  
  async createProfile(profile: InsertProfile): Promise<Profile> {
    const result = await this.db.insert(profiles).values(profile).returning();
    return result[0];
  }
  
  async updateProfile(id: number, profile: Partial<InsertProfile>): Promise<Profile | undefined> {
    const result = await this.db.update(profiles)
      .set(profile)
      .where(eq(profiles.id, id))
      .returning();
    return result[0];
  }
  
  // Education methods
  async getEducationByProfileId(profileId: number): Promise<Education[]> {
    return await this.db.select()
      .from(education)
      .where(eq(education.profileId, profileId));
  }
  
  async createEducation(educationItem: InsertEducation): Promise<Education> {
    const result = await this.db.insert(education)
      .values(educationItem)
      .returning();
    return result[0];
  }
  
  async updateEducation(id: number, educationItem: Partial<InsertEducation>): Promise<Education | undefined> {
    const result = await this.db.update(education)
      .set(educationItem)
      .where(eq(education.id, id))
      .returning();
    return result[0];
  }
  
  async deleteEducation(id: number): Promise<boolean> {
    const result = await this.db.delete(education)
      .where(eq(education.id, id))
      .returning();
    return result.length > 0;
  }
  
  // Skills methods
  async getSkillsByProfileId(profileId: number): Promise<Skill[]> {
    return await this.db.select()
      .from(skills)
      .where(eq(skills.profileId, profileId));
  }
  
  async createSkill(skill: InsertSkill): Promise<Skill> {
    const result = await this.db.insert(skills)
      .values(skill)
      .returning();
    return result[0];
  }
  
  async updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined> {
    const result = await this.db.update(skills)
      .set(skill)
      .where(eq(skills.id, id))
      .returning();
    return result[0];
  }
  
  async deleteSkill(id: number): Promise<boolean> {
    const result = await this.db.delete(skills)
      .where(eq(skills.id, id))
      .returning();
    return result.length > 0;
  }
  
  // Languages methods
  async getLanguagesByProfileId(profileId: number): Promise<Language[]> {
    return await this.db.select()
      .from(languages)
      .where(eq(languages.profileId, profileId));
  }
  
  async createLanguage(language: InsertLanguage): Promise<Language> {
    const result = await this.db.insert(languages)
      .values(language)
      .returning();
    return result[0];
  }
  
  async updateLanguage(id: number, language: Partial<InsertLanguage>): Promise<Language | undefined> {
    const result = await this.db.update(languages)
      .set(language)
      .where(eq(languages.id, id))
      .returning();
    return result[0];
  }
  
  async deleteLanguage(id: number): Promise<boolean> {
    const result = await this.db.delete(languages)
      .where(eq(languages.id, id))
      .returning();
    return result.length > 0;
  }
  
  // Certifications methods
  async getCertificationsByProfileId(profileId: number): Promise<Certification[]> {
    return await this.db.select()
      .from(certifications)
      .where(eq(certifications.profileId, profileId));
  }
  
  async createCertification(certification: InsertCertification): Promise<Certification> {
    const result = await this.db.insert(certifications)
      .values(certification)
      .returning();
    return result[0];
  }
  
  async updateCertification(id: number, certification: Partial<InsertCertification>): Promise<Certification | undefined> {
    const result = await this.db.update(certifications)
      .set(certification)
      .where(eq(certifications.id, id))
      .returning();
    return result[0];
  }
  
  async deleteCertification(id: number): Promise<boolean> {
    const result = await this.db.delete(certifications)
      .where(eq(certifications.id, id))
      .returning();
    return result.length > 0;
  }
  
  // Experience methods
  async getExperiencesByProfileId(profileId: number): Promise<Experience[]> {
    return await this.db.select()
      .from(experiences)
      .where(eq(experiences.profileId, profileId))
      .orderBy(experiences.displayOrder);
  }
  
  async createExperience(experience: InsertExperience): Promise<Experience> {
    const result = await this.db.insert(experiences)
      .values(experience)
      .returning();
    return result[0];
  }
  
  async updateExperience(id: number, experience: Partial<InsertExperience>): Promise<Experience | undefined> {
    const result = await this.db.update(experiences)
      .set(experience)
      .where(eq(experiences.id, id))
      .returning();
    return result[0];
  }
  
  async deleteExperience(id: number): Promise<boolean> {
    const result = await this.db.delete(experiences)
      .where(eq(experiences.id, id))
      .returning();
    return result.length > 0;
  }
  
  // Achievements methods
  async getAchievementsByProfileId(profileId: number): Promise<Achievement[]> {
    return await this.db.select()
      .from(achievements)
      .where(eq(achievements.profileId, profileId));
  }
  
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const result = await this.db.insert(achievements)
      .values(achievement)
      .returning();
    return result[0];
  }
  
  async updateAchievement(id: number, achievement: Partial<InsertAchievement>): Promise<Achievement | undefined> {
    const result = await this.db.update(achievements)
      .set(achievement)
      .where(eq(achievements.id, id))
      .returning();
    return result[0];
  }
  
  async deleteAchievement(id: number): Promise<boolean> {
    const result = await this.db.delete(achievements)
      .where(eq(achievements.id, id))
      .returning();
    return result.length > 0;
  }
  
  // Technical skills methods
  async getTechnicalSkillsByProfileId(profileId: number): Promise<TechnicalSkill[]> {
    return await this.db.select()
      .from(technicalSkills)
      .where(eq(technicalSkills.profileId, profileId));
  }
  
  async createTechnicalSkill(technicalSkill: InsertTechnicalSkill): Promise<TechnicalSkill> {
    const result = await this.db.insert(technicalSkills)
      .values(technicalSkill)
      .returning();
    return result[0];
  }
  
  async updateTechnicalSkill(id: number, technicalSkill: Partial<InsertTechnicalSkill>): Promise<TechnicalSkill | undefined> {
    const result = await this.db.update(technicalSkills)
      .set(technicalSkill)
      .where(eq(technicalSkills.id, id))
      .returning();
    return result[0];
  }
  
  async deleteTechnicalSkill(id: number): Promise<boolean> {
    const result = await this.db.delete(technicalSkills)
      .where(eq(technicalSkills.id, id))
      .returning();
    return result.length > 0;
  }
  
  // Strengths methods
  async getStrengthsByProfileId(profileId: number): Promise<Strength[]> {
    return await this.db.select()
      .from(strengths)
      .where(eq(strengths.profileId, profileId));
  }
  
  async createStrength(strength: InsertStrength): Promise<Strength> {
    const result = await this.db.insert(strengths)
      .values(strength)
      .returning();
    return result[0];
  }
  
  async updateStrength(id: number, strength: Partial<InsertStrength>): Promise<Strength | undefined> {
    const result = await this.db.update(strengths)
      .set(strength)
      .where(eq(strengths.id, id))
      .returning();
    return result[0];
  }
  
  async deleteStrength(id: number): Promise<boolean> {
    const result = await this.db.delete(strengths)
      .where(eq(strengths.id, id))
      .returning();
    return result.length > 0;
  }
  
  // References methods
  async getReferencesByProfileId(profileId: number): Promise<Reference[]> {
    return await this.db.select()
      .from(references)
      .where(eq(references.profileId, profileId));
  }
  
  async createReference(reference: InsertReference): Promise<Reference> {
    const result = await this.db.insert(references)
      .values(reference)
      .returning();
    return result[0];
  }
  
  async updateReference(id: number, reference: Partial<InsertReference>): Promise<Reference | undefined> {
    const result = await this.db.update(references)
      .set(reference)
      .where(eq(references.id, id))
      .returning();
    return result[0];
  }
  
  async deleteReference(id: number): Promise<boolean> {
    const result = await this.db.delete(references)
      .where(eq(references.id, id))
      .returning();
    return result.length > 0;
  }
  
  // Time allocations methods
  async getTimeAllocationsByProfileId(profileId: number): Promise<TimeAllocation[]> {
    return await this.db.select()
      .from(timeAllocations)
      .where(eq(timeAllocations.profileId, profileId));
  }
  
  async createTimeAllocation(timeAllocation: InsertTimeAllocation): Promise<TimeAllocation> {
    const result = await this.db.insert(timeAllocations)
      .values(timeAllocation)
      .returning();
    return result[0];
  }
  
  async updateTimeAllocation(id: number, timeAllocation: Partial<InsertTimeAllocation>): Promise<TimeAllocation | undefined> {
    const result = await this.db.update(timeAllocations)
      .set(timeAllocation)
      .where(eq(timeAllocations.id, id))
      .returning();
    return result[0];
  }
  
  async deleteTimeAllocation(id: number): Promise<boolean> {
    const result = await this.db.delete(timeAllocations)
      .where(eq(timeAllocations.id, id))
      .returning();
    return result.length > 0;
  }
  
  // Complete resume data
  async getCompleteResumeData(profileId: number) {
    return {
      profile: await this.getProfile(profileId),
      education: await this.getEducationByProfileId(profileId),
      skills: await this.getSkillsByProfileId(profileId),
      languages: await this.getLanguagesByProfileId(profileId),
      certifications: await this.getCertificationsByProfileId(profileId),
      experiences: await this.getExperiencesByProfileId(profileId),
      achievements: await this.getAchievementsByProfileId(profileId),
      technicalSkills: await this.getTechnicalSkillsByProfileId(profileId),
      strengths: await this.getStrengthsByProfileId(profileId),
      references: await this.getReferencesByProfileId(profileId),
      timeAllocations: await this.getTimeAllocationsByProfileId(profileId)
    };
  }
}

// Export PostgresStorage instance for production, or MemStorage for development
export const storage = process.env.NODE_ENV === 'production' 
  ? new PostgresStorage() 
  : new MemStorage();
