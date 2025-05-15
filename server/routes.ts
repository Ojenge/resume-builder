import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertProfileSchema, 
  insertEducationSchema, 
  insertSkillSchema,
  insertLanguageSchema,
  insertCertificationSchema,
  insertExperienceSchema,
  insertAchievementSchema,
  insertTechnicalSkillSchema,
  insertStrengthSchema,
  insertReferenceSchema,
  insertTimeAllocationSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Resume data endpoints
  // All routes are prefixed with /api
  
  // Get complete resume data for a profile
  app.get("/api/resume/:profileId", async (req: Request, res: Response) => {
    try {
      const profileId = parseInt(req.params.profileId);
      if (isNaN(profileId)) {
        return res.status(400).json({ error: "Invalid profile ID" });
      }
      
      const resumeData = await storage.getCompleteResumeData(profileId);
      return res.json(resumeData);
    } catch (error) {
      console.error("Error fetching resume data:", error);
      return res.status(500).json({ error: "Failed to fetch resume data" });
    }
  });
  
  // Profile endpoints
  app.post("/api/profile", async (req: Request, res: Response) => {
    try {
      const validatedData = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(validatedData);
      return res.status(201).json(profile);
    } catch (error) {
      console.error("Error creating profile:", error);
      return res.status(400).json({ error: "Invalid profile data" });
    }
  });
  
  app.get("/api/profile/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid profile ID" });
      }
      
      const profile = await storage.getProfile(id);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      
      return res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      return res.status(500).json({ error: "Failed to fetch profile" });
    }
  });
  
  app.put("/api/profile/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid profile ID" });
      }
      
      // Use a partial schema validation since this is an update
      const validatedData = insertProfileSchema.partial().parse(req.body);
      const updatedProfile = await storage.updateProfile(id, validatedData);
      
      if (!updatedProfile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      
      return res.json(updatedProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(400).json({ error: "Invalid profile data" });
    }
  });
  
  // Education endpoints
  app.get("/api/profile/:profileId/education", async (req: Request, res: Response) => {
    try {
      const profileId = parseInt(req.params.profileId);
      if (isNaN(profileId)) {
        return res.status(400).json({ error: "Invalid profile ID" });
      }
      
      const educationItems = await storage.getEducationByProfileId(profileId);
      return res.json(educationItems);
    } catch (error) {
      console.error("Error fetching education items:", error);
      return res.status(500).json({ error: "Failed to fetch education items" });
    }
  });
  
  app.post("/api/education", async (req: Request, res: Response) => {
    try {
      const validatedData = insertEducationSchema.parse(req.body);
      const educationItem = await storage.createEducation(validatedData);
      return res.status(201).json(educationItem);
    } catch (error) {
      console.error("Error creating education item:", error);
      return res.status(400).json({ error: "Invalid education data" });
    }
  });
  
  app.put("/api/education/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid education ID" });
      }
      
      const validatedData = insertEducationSchema.partial().parse(req.body);
      const updatedEducation = await storage.updateEducation(id, validatedData);
      
      if (!updatedEducation) {
        return res.status(404).json({ error: "Education item not found" });
      }
      
      return res.json(updatedEducation);
    } catch (error) {
      console.error("Error updating education item:", error);
      return res.status(400).json({ error: "Invalid education data" });
    }
  });
  
  app.delete("/api/education/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid education ID" });
      }
      
      const success = await storage.deleteEducation(id);
      if (!success) {
        return res.status(404).json({ error: "Education item not found" });
      }
      
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting education item:", error);
      return res.status(500).json({ error: "Failed to delete education item" });
    }
  });
  
  // Skills endpoints
  app.get("/api/profile/:profileId/skills", async (req: Request, res: Response) => {
    try {
      const profileId = parseInt(req.params.profileId);
      if (isNaN(profileId)) {
        return res.status(400).json({ error: "Invalid profile ID" });
      }
      
      const skills = await storage.getSkillsByProfileId(profileId);
      return res.json(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      return res.status(500).json({ error: "Failed to fetch skills" });
    }
  });
  
  app.post("/api/skill", async (req: Request, res: Response) => {
    try {
      const validatedData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(validatedData);
      return res.status(201).json(skill);
    } catch (error) {
      console.error("Error creating skill:", error);
      return res.status(400).json({ error: "Invalid skill data" });
    }
  });
  
  app.put("/api/skill/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid skill ID" });
      }
      
      const validatedData = insertSkillSchema.partial().parse(req.body);
      const updatedSkill = await storage.updateSkill(id, validatedData);
      
      if (!updatedSkill) {
        return res.status(404).json({ error: "Skill not found" });
      }
      
      return res.json(updatedSkill);
    } catch (error) {
      console.error("Error updating skill:", error);
      return res.status(400).json({ error: "Invalid skill data" });
    }
  });
  
  app.delete("/api/skill/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid skill ID" });
      }
      
      const success = await storage.deleteSkill(id);
      if (!success) {
        return res.status(404).json({ error: "Skill not found" });
      }
      
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting skill:", error);
      return res.status(500).json({ error: "Failed to delete skill" });
    }
  });
  
  // Similar endpoints for Languages, Certifications, Experiences, etc.
  // The pattern is the same for all these resources
  
  // Languages
  app.get("/api/profile/:profileId/languages", async (req: Request, res: Response) => {
    try {
      const profileId = parseInt(req.params.profileId);
      if (isNaN(profileId)) {
        return res.status(400).json({ error: "Invalid profile ID" });
      }
      
      const languages = await storage.getLanguagesByProfileId(profileId);
      return res.json(languages);
    } catch (error) {
      console.error("Error fetching languages:", error);
      return res.status(500).json({ error: "Failed to fetch languages" });
    }
  });
  
  app.post("/api/language", async (req: Request, res: Response) => {
    try {
      const validatedData = insertLanguageSchema.parse(req.body);
      const language = await storage.createLanguage(validatedData);
      return res.status(201).json(language);
    } catch (error) {
      console.error("Error creating language:", error);
      return res.status(400).json({ error: "Invalid language data" });
    }
  });
  
  // Experiences
  app.get("/api/profile/:profileId/experiences", async (req: Request, res: Response) => {
    try {
      const profileId = parseInt(req.params.profileId);
      if (isNaN(profileId)) {
        return res.status(400).json({ error: "Invalid profile ID" });
      }
      
      const experiences = await storage.getExperiencesByProfileId(profileId);
      return res.json(experiences);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      return res.status(500).json({ error: "Failed to fetch experiences" });
    }
  });
  
  app.post("/api/experience", async (req: Request, res: Response) => {
    try {
      const validatedData = insertExperienceSchema.parse(req.body);
      const experience = await storage.createExperience(validatedData);
      return res.status(201).json(experience);
    } catch (error) {
      console.error("Error creating experience:", error);
      return res.status(400).json({ error: "Invalid experience data" });
    }
  });
  
  // Populate the database with initial data (if empty)
  app.post("/api/populate-resume", async (req: Request, res: Response) => {
    try {
      // Create profile
      const profile = await storage.createProfile({
        fullName: "Collins Ojenge",
        title: "Systems & Automation Director",
        email: "collinsojenge@gmail.com",
        phone: "+254 723 722 204",
        location: "Nairobi, Kenya",
        summary: "Result oriented Information Technology Consultant with diverse industry experience in Public Service, Banking, Health Sector and Education. Professional expertise includes strategy automation, data visualization, software development, database development, business development, project management and data analysis.",
        profileImage: null
      });
      
      const profileId = profile.id;
      
      // Add education
      await storage.createEducation({
        degree: "Bachelor of Science Business Information Technology",
        institution: "Strathmore University",
        years: "2011 - 2014",
        location: "Nairobi, Kenya",
        profileId
      });
      
      await storage.createEducation({
        degree: "Diploma in Business Information Technology",
        institution: "Strathmore University",
        years: "2010 - 2011",
        location: "Nairobi, Kenya",
        profileId
      });
      
      // Add skills
      const skills = [
        { name: "Software Development", percentage: 90 },
        { name: "Data Analysis", percentage: 95 },
        { name: "Project Management", percentage: 85 },
        { name: "Database Development", percentage: 90 },
        { name: "Strategy Tools", percentage: 85 },
      ];
      
      for (const skill of skills) {
        await storage.createSkill({
          ...skill,
          profileId
        });
      }
      
      // Add languages
      const languages = [
        { name: "English", level: "Proficient", percentage: 100 },
        { name: "Swahili", level: "Proficient", percentage: 100 },
        { name: "Spanish", level: "Intermediate", percentage: 65 },
        { name: "Latin", level: "Intermediate", percentage: 65 },
      ];
      
      for (const language of languages) {
        await storage.createLanguage({
          ...language,
          profileId
        });
      }
      
      // Add certifications
      const certifications = [
        {
          name: "Certified Public Accountant (CPA II)",
          organization: "KASNEB 2011",
        },
        {
          name: "ORACLE DB Certification",
          organization: "Strathmore University",
        },
      ];
      
      for (const certification of certifications) {
        await storage.createCertification({
          ...certification,
          profileId
        });
      }
      
      // Add experiences
      const experiences = [
        {
          title: "Data Analyst / Systems & Automation Director",
          company: "Statehouse / Ministry of Defence / President's Delivery Unit",
          period: "Aug 2018 - Present",
          location: "Nairobi, Kenya",
          description: "Accent analytics is a performance management and business intelligence platform that optimizes and automates strategies, processes, and performances.",
          responsibilities: [
            "Development and maintenance of Government Performance Reporting Software (GPRS)",
            "Development and maintenance of a database server containing national projects data for GPRS",
            "Server orchestration and maintenance of the official PDU servers",
            "Development and maintenance of the delivery portal (www.delivery.go.ke)",
            "Managing the procurement, deployment and maintenance of Hardware and software for PDU",
            "Development, testing and rolling out new software features for GPRS",
            "Working with county field officers in the collection and analysis of project-based data for reporting purposes",
            "Supporting county and ministry teams in report preparation for National Development Implementation Technical Committee meetings",
            "Supporting management of virtual National Development Implementation Cabinet Committee meetings",
            "Worked with Presidential Policy and Strategy Unit to develop dashboards analyzing donor funded projects"
          ],
          displayOrder: 1
        },
        {
          title: "Strategy & Automation Consultant",
          company: "Accent Analytics - KEPSA Project",
          period: "Feb 2015 - Present",
          location: "Nairobi, Kenya",
          description: "Accent analytics is a performance management and business intelligence platform that optimizes and automates strategies, processes, and performances.",
          responsibilities: [
            "Designed and automated a framework capturing the 5-year strategic plan including operational and human resource strategy",
            "Automated the Balanced Scorecard and customized it to fit the firm's strategy, objectives and KPIs",
            "Led integration of the automated Balanced Scorecard by training existing and incoming staff members",
            "Customization of Accent Analytics to fit their unique needs as a publisher",
            "Automation of their strategic plan over a 2-year period",
            "Development of custom dashboards to aid in data-based decision-making across different managerial levels",
            "Trained the team on Balanced Scorecard principles",
            "Alignment of employees' roles and objectives with the overall strategic goals of the organization"
          ],
          displayOrder: 2
        },
        {
          title: "IT Consultant",
          company: "Longhorn Publishers",
          period: "Contractual Project",
          location: "Nairobi, Kenya",
          description: "Longhorn Publishers is a leading provider of innovative publishing solutions in East Africa.",
          responsibilities: [
            "Designed and automated a framework capturing the 5-year strategic plan",
            "Automated the Balanced Scorecard and customized it to fit the firm's strategy, objectives and KPIs",
            "Led integration of the automated Balanced Scorecard by training staff members",
            "Development of custom dashboards for data-based decision-making across managerial levels",
            "Trained the team on Balanced Scorecard principles",
            "Aligned employees' roles and objectives with the organization's strategic goals"
          ],
          displayOrder: 3
        },
        {
          title: "IT Consultant",
          company: "Commercial Bank of Africa (now NCBA)",
          period: "Contractual Project",
          location: "Nairobi, Kenya",
          description: "",
          responsibilities: [
            "Automated scorecards for Kenya, Uganda and Tanzania on Quick score",
            "Analyzed data collected over a one-year period and developed actionable insights for various business units",
            "Assisted the strategy department to develop objectives and KPIs for different business units across East Africa"
          ],
          displayOrder: 4
        },
        {
          title: "Database Developer",
          company: "Clinton Health Access Initiative (CHAI)",
          period: "June 2013 - June 2015",
          location: "Nairobi, Kenya",
          description: "",
          responsibilities: [
            "Developed a database administration system for CHAI operations in Kenya",
            "Led implementation and spearheaded impact analyses procedures in multiple regions including Turkana, Garissa, Mombasa, and others",
            "Managed a $4M project funded by the Clinton Foundation"
          ],
          displayOrder: 5
        }
      ];
      
      for (const experience of experiences) {
        await storage.createExperience({
          ...experience,
          profileId
        });
      }
      
      // Add achievements
      const achievements = [
        {
          percentage: 70,
          description: "Enhanced accountability by developing dashboards that analyze donor funded projects to monitor utilization of funds"
        },
        {
          percentage: 40,
          description: "Improved decision making by government executive by creating GPRS which enables tracking & troubleshooting of priority development projects"
        },
        {
          percentage: 33,
          description: "Cost reduction by creating performance management systems for Longhorn Publishers and NCBA"
        },
        {
          percentage: 43,
          description: "Improved efficiency of government agencies by creating a GPRS system that coordinates projects across all government agencies"
        },
        {
          percentage: 30,
          description: "Saved time for government agencies by creating and maintaining government database servers that contain national projects data"
        },
        {
          percentage: 38,
          description: "Improved employee productivity in Longhorn Publishers and NCBA through strategic alignment initiatives"
        }
      ];
      
      for (const achievement of achievements) {
        await storage.createAchievement({
          ...achievement,
          profileId
        });
      }
      
      // Add technical skills
      const programmingSkills = [
        "Python", "PHP", "Shell Scripting", "MongoDB", "ORACLE", "PostgreSQL"
      ];
      
      const businessSkills = [
        "Data Visualization", "Business Intelligence", "Balanced Scorecard", 
        "Strategy Automation", "Project Management", "Program Management", "Sage"
      ];
      
      for (const skill of programmingSkills) {
        await storage.createTechnicalSkill({
          name: skill,
          category: "programming",
          profileId
        });
      }
      
      for (const skill of businessSkills) {
        await storage.createTechnicalSkill({
          name: skill,
          category: "business",
          profileId
        });
      }
      
      // Add strengths
      const strengths = [
        {
          title: "Excellent Communication Skills",
          description: "Communicates and interacts effectively with colleagues and team members",
          icon: "ri-chat-4-line"
        },
        {
          title: "Detail Oriented",
          description: "Thoroughness in accomplishing tasks through concern for all areas involved",
          icon: "ri-search-eye-line"
        },
        {
          title: "Problem Solving",
          description: "High ability to make timely, well-considered and logical decisions in challenging situations",
          icon: "ri-lightbulb-line"
        },
        {
          title: "Honesty & Integrity",
          description: "Truthful and consistent with uncompromising adherence to strong moral and ethical principles",
          icon: "ri-shield-check-line"
        }
      ];
      
      for (const strength of strengths) {
        await storage.createStrength({
          ...strength,
          profileId
        });
      }
      
      // Add references
      const references = [
        {
          name: "Dr. Jude Mwenda Ntabathia",
          title: "Independent Researcher",
          location: "Nairobi, Kenya",
          email: "judemwenda@gmail.com",
          phone: "+254 793 955 045"
        },
        {
          name: "Nicodemus Maingi",
          title: "Senior Lecturer",
          location: "Strathmore University, Nairobi",
          email: "nmaingi@strathmore.edu",
          phone: "+254 733 499 437"
        },
        {
          name: "Maurice Kimani",
          title: "Inclusive Investment Manager",
          location: "CASA Plus at TechnoServe",
          email: "kimani.maurice@gmail.com",
          phone: "+254 723 688 899"
        }
      ];
      
      for (const reference of references) {
        await storage.createReference({
          ...reference,
          profileId
        });
      }
      
      // Add time allocations
      const timeAllocations = [
        { activity: "Tennis", percentage: 25, color: "#1E3A8A" },
        { activity: "Security operations", percentage: 25, color: "#2563EB" },
        { activity: "Research", percentage: 25, color: "#60A5FA" },
        { activity: "Reading", percentage: 25, color: "#93C5FD" },
      ];
      
      for (const timeAllocation of timeAllocations) {
        await storage.createTimeAllocation({
          ...timeAllocation,
          profileId
        });
      }
      
      return res.status(201).json({ 
        message: "Resume data populated successfully", 
        profileId 
      });
    } catch (error) {
      console.error("Error populating resume data:", error);
      return res.status(500).json({ error: "Failed to populate resume data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
