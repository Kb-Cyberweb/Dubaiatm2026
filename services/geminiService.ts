import { GoogleGenAI, Type } from "@google/genai";
import type { LeadsResponse, SocialGroup } from '../types';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- Schemas ---

const leadSchema = {
  type: Type.OBJECT,
  properties: {
    businessName: { type: Type.STRING, description: "The name of the business." },
    industry: { type: Type.STRING, description: "The industry or type of the business (e.g., hotel, restaurant)." },
    location: { type: Type.STRING, description: "Approximate location or area in Dubai or a neighboring Emirate." },
    contact: { type: Type.STRING, description: "Public contact info (email, phone, or social media handle)." },
    reason: { type: Type.STRING, description: "1-2 sentences explaining why it’s a strong lead for IT services." }
  },
  required: ["businessName", "industry", "location", "contact", "reason"]
};

const strategySchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A catchy title for the strategy." },
        description: { type: Type.STRING, description: "A detailed description of the lead-generation strategy." }
    },
    required: ["title", "description"]
};

const socialGroupSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The name of the Facebook or LinkedIn group." },
        platform: { type: Type.STRING, description: "The platform, either 'Facebook' or 'LinkedIn'." },
        description: { type: Type.STRING, description: "A brief description of the group and why it's relevant for lead generation." },
        link: { type: Type.STRING, description: "A direct link to the group if available." }
    },
    required: ["name", "platform", "description"]
};

const leadsResponseSchema = {
  type: Type.OBJECT,
  properties: {
    leads: {
      type: Type.ARRAY,
      description: "A comprehensive list of at least 15-20 small business leads in Dubai and neighboring Emirates (like Sharjah) across a wide variety of industries.",
      items: leadSchema
    },
    strategies: {
      type: Type.ARRAY,
      description: "Exactly 3 distinct lead-generation strategy ideas tailored for Dubai’s market and culture. This should ONLY be included for the first page of results.",
      items: strategySchema
    }
  },
  required: ["leads"]
};

const socialGroupsResponseSchema = {
    type: Type.OBJECT,
    properties: {
      socialGroups: {
        type: Type.ARRAY,
        description: "A curated list of 3-4 business networking groups.",
        items: socialGroupSchema
      }
    },
    required: ["socialGroups"]
};


// --- Prompts ---

const generateLeadsPrompt = (url: string, category: string, page: number) => `
**CRITICAL INSTRUCTION: This is page ${page} of a 5-page deep search. Your primary objective is to conduct a deep, real-time search for small businesses in Dubai and its neighboring Emirates, using the provided URL as your main data source. You MUST NOT repeat any business leads you have provided in previous responses for other pages. Each page must yield a completely fresh and unique list.**

You are an expert UAE business research assistant helping me find high-quality leads for my company, cgsinfotech.com, which provides a comprehensive suite of IT services for small businesses (IT infrastructure, cloud solutions, cybersecurity, custom software, ERP, IT consulting).

Your goal is to discover a diverse list of small, growing, and up-and-coming businesses that are prime candidates for IT service upgrades. **Scrap and use the website ${url} as a primary source and reference to find businesses.**

**Search Criteria:**
1.  **Category:** Focus your search on businesses within the **'${category === 'All Categories' ? 'Any business category' : category}'** industry.
2.  **Location:** Dubai and neighboring Emirates (e.g., Sharjah, Ajman).
3.  **Size:** Small to medium-sized businesses (typically under 50 employees).
4.  **Uniqueness:** The leads MUST be unique to this page (${page}). Do not repeat leads from other pages.
5.  **Quality:** Find companies that are often overlooked. Look for signs of IT needs: no HTTPS, slow/non-mobile-friendly website, generic email addresses (@gmail.com), or recent customer complaints about digital experiences.

Please generate a detailed, verified list of at least 15-20 potential leads based on the criteria. For each lead, provide the business name, specific industry, location, a public contact detail, and a compelling, concise reason why they are a strong lead for our IT services.

**Output instructions:**
-   For page 1 ONLY, also provide exactly 3 creative and actionable outreach strategies tailored to selling IT services to these types of small businesses in the UAE market.
-   For pages 2, 3, 4, and 5, DO NOT provide strategies, only provide the list of leads.
-   Format the entire output as a single JSON object that strictly adheres to the provided schema. Ensure the 'strategies' field is only present for page 1.
`;

const generateSocialGroupsPrompt = (platform: 'Facebook' | 'LinkedIn') => `
You are an expert Dubai business research assistant. Your task is to find relevant business networking groups in Dubai on ${platform}.

The goal is to help a company called CGSInfotech.com generate leads for its IT services (e.g., web development, cybersecurity, cloud solutions) by posting in these groups.

Please provide a list of 3-4 active and relevant ${platform} groups. For each group, provide its name, platform ("${platform}"), a direct link if possible, and a brief reason why it's a good fit for generating IT service leads.

Format the entire output as a single JSON object that strictly adheres to the provided schema.
`;

// --- API Functions ---

export async function generateLeads(url: string, category: string, page: number): Promise<LeadsResponse> {
  if (!url || !url.trim()) {
    throw new Error("Source URL is required for lead generation.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: generateLeadsPrompt(url, category, page),
      config: {
        responseMimeType: "application/json",
        responseSchema: leadsResponseSchema,
        temperature: 0.8, // Slightly higher temp for more variety across pages
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("API returned an empty response for leads.");
    }

    return JSON.parse(jsonText) as LeadsResponse;
    
  } catch (error) {
    console.error("Error calling Gemini API for leads:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate leads from AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating leads.");
  }
}

export async function generateSocialGroups(platform: 'Facebook' | 'LinkedIn'): Promise<SocialGroup[]> {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: generateSocialGroupsPrompt(platform),
        config: {
          responseMimeType: "application/json",
          responseSchema: socialGroupsResponseSchema,
          temperature: 0.2,
        },
      });

    const jsonText = response.text.trim();
    if (!jsonText) {
      // It's better to return an empty array than to throw an error if no groups are found
      return [];
    }
    
    const parsedData = JSON.parse(jsonText);
    return (parsedData.socialGroups || []) as SocialGroup[];

  } catch (error) {
    console.error(`Error calling Gemini API for ${platform} groups:`, error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate ${platform} groups from AI: ${error.message}`);
    }
    throw new Error(`An unknown error occurred while generating ${platform} groups.`);
  }
}
