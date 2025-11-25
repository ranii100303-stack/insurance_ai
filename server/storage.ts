import { type Claim, type InsertClaim } from "@shared/schema";
import { randomUUID } from "crypto";

// Storage interface for claims
export interface IStorage {
  getClaim(id: string): Promise<Claim | undefined>;
  getAllClaims(): Promise<Claim[]>;
  createClaim(claim: InsertClaim): Promise<Claim>;
  deleteClaim(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private claims: Map<string, Claim>;

  constructor() {
    this.claims = new Map();
    this.initializeDefaultClaims();
  }

  private initializeDefaultClaims() {
    const defaultClaims: Claim[] = [
      {
        id: "CLM-2024-0847",
        claimantName: "Sarah Johnson",
        summary: "Rear-end collision on Highway 101. Significant damage to rear bumper, trunk, and tail lights. Other driver admitted fault at scene.",
        reportedAmount: 8500,
        status: "Pending",
        submittedDate: "2024-11-20",
        claimantEmail: "sarah.johnson@email.com",
        claimantPhone: "(555) 234-5678",
        policyNumber: "POL-8472-9361",
        vehicleInfo: "2022 Honda Accord EX-L",
        photos: [
          "https://images.unsplash.com/photo-1605559424843-9e4c3ca4b7f1?w=500&h=400&fit=crop",
          "https://images.unsplash.com/photo-1609708536965-38519b91e7f8?w=500&h=400&fit=crop",
        ],
      },
      {
        id: "CLM-2024-0848",
        claimantName: "Michael Chen",
        summary: "Hail damage during severe storm. Multiple dents across hood, roof, and trunk. All windows intact but paint chipped in several areas.",
        reportedAmount: 12750,
        status: "Pending",
        submittedDate: "2024-11-21",
        claimantEmail: "m.chen@email.com",
        claimantPhone: "(555) 876-5432",
        policyNumber: "POL-3829-4721",
        vehicleInfo: "2023 Tesla Model 3 Long Range",
        photos: [
          "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=500&h=400&fit=crop",
          "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=500&h=400&fit=crop",
        ],
      },
      {
        id: "CLM-2024-0849",
        claimantName: "Jessica Martinez",
        summary: "Side-swipe accident in parking lot. Driver's side door, mirror, and front quarter panel damaged. Security footage available.",
        reportedAmount: 6200,
        status: "Processing",
        submittedDate: "2024-11-19",
        claimantEmail: "j.martinez@email.com",
        claimantPhone: "(555) 392-1847",
        policyNumber: "POL-5647-1928",
        vehicleInfo: "2021 Toyota RAV4 XLE",
        photos: [
          "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500&h=400&fit=crop",
          "https://images.unsplash.com/photo-1626814026554-af813a58b37c?w=500&h=400&fit=crop",
        ],
        assessmentResults: {
          recommendedPayout: 5270,
          confidence: 88,
          fraudScore: 8,
          suggestedPath: "Repair",
        },
      },
      {
        id: "CLM-2024-0850",
        claimantName: "Robert Williams",
        summary: "Total loss - vehicle rolled over during highway accident. Frame damage, crushed roof, deployed airbags. Police report filed.",
        reportedAmount: 28400,
        status: "Pending",
        submittedDate: "2024-11-22",
        claimantEmail: "r.williams@email.com",
        claimantPhone: "(555) 621-9384",
        policyNumber: "POL-9182-5473",
        vehicleInfo: "2020 Ford F-150 XLT",
        photos: [
          "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=400&fit=crop",
          "https://images.unsplash.com/photo-1581882947821-6a4f6ee0e39f?w=500&h=400&fit=crop",
          "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&h=400&fit=crop",
        ],
      },
      {
        id: "CLM-2024-0851",
        claimantName: "Emily Davis",
        summary: "Windshield crack from road debris. Single large crack spanning from driver's side to passenger side. No other damage.",
        reportedAmount: 850,
        status: "Closed",
        submittedDate: "2024-11-18",
        claimantEmail: "emily.davis@email.com",
        claimantPhone: "(555) 147-8362",
        policyNumber: "POL-2847-6391",
        vehicleInfo: "2023 Subaru Outback Premium",
        photos: [
          "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&h=400&fit=crop",
        ],
        assessmentResults: {
          recommendedPayout: 722,
          confidence: 95,
          fraudScore: 3,
          suggestedPath: "Repair",
        },
      },
    ];

    defaultClaims.forEach((claim) => {
      this.claims.set(claim.id, claim);
    });
  }

  async getClaim(id: string): Promise<Claim | undefined> {
    return this.claims.get(id);
  }

  async getAllClaims(): Promise<Claim[]> {
    return Array.from(this.claims.values());
  }

  async createClaim(insertClaim: InsertClaim): Promise<Claim> {
    const id = `CLM-${Date.now()}-${randomUUID().slice(0, 4).toUpperCase()}`;
    const claim: Claim = { ...insertClaim, id };
    this.claims.set(id, claim);
    return claim;
  }

  async deleteClaim(id: string): Promise<boolean> {
    return this.claims.delete(id);
  }
}

export const storage = new MemStorage();
