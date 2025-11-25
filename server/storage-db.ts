import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { claims as claimsTable, users as usersTable } from "@shared/db-schema";
import type { User, InsertUser, Claim, InsertClaim } from "@shared/schema";
import { randomUUID } from "crypto";

if (!process.env.DATABASE_URL) {
  console.warn(
    "DATABASE_URL not set. Using in-memory storage fallback for development."
  );
}

// Fallback in-memory storage for local development
export class MemStorage {
  private users: Map<string, User>;
  private claims: Map<string, Claim>;

  constructor() {
    this.users = new Map();
    this.claims = new Map();
    this.initializeDefaultClaims();
  }

  private initializeDefaultClaims() {
    const defaultClaims: Claim[] = [
      {
        id: "CLM-2024-0847",
        claimantName: "Sarah Johnson",
        summary:
          "Rear-end collision on Highway 101. Significant damage to rear bumper, trunk, and tail lights. Other driver admitted fault at scene.",
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
        summary:
          "Hail damage during severe storm. Multiple dents across hood, roof, and trunk. All windows intact but paint chipped in several areas.",
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
        summary:
          "Side-swipe accident in parking lot. Driver's side door, mirror, and front quarter panel damaged. Security footage available.",
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
        summary:
          "Total loss - vehicle rolled over during highway accident. Frame damage, crushed roof, deployed airbags. Police report filed.",
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
        summary:
          "Windshield damage from rock on freeway. Impact point center of windshield with radiating cracks. Vehicle safe to drive but visibility affected.",
        reportedAmount: 450,
        status: "Closed",
        submittedDate: "2024-11-18",
        claimantEmail: "emily.davis@email.com",
        claimantPhone: "(555) 111-2222",
        policyNumber: "POL-2847-3950",
        vehicleInfo: "2023 Mazda CX-5",
        photos: [
          "https://images.unsplash.com/photo-1608423a75c90c1872c6a3ae4fba3e16?w=500&h=400&fit=crop",
        ],
      },
    ];

    defaultClaims.forEach((claim) => this.claims.set(claim.id, claim));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async getClaim(id: string): Promise<Claim | undefined> {
    return this.claims.get(id);
  }

  async getAllClaims(): Promise<Claim[]> {
    return Array.from(this.claims.values());
  }

  async createClaim(claim: InsertClaim): Promise<Claim> {
    const id = `CLM-${Date.now()}-${randomUUID().substring(0, 8)}`;
    const newClaim: Claim = {
      ...claim,
      id,
    };
    this.claims.set(id, newClaim);
    return newClaim;
  }

  async deleteClaim(id: string): Promise<boolean> {
    return this.claims.delete(id);
  }
}

// Database storage with Drizzle ORM
export class DatabaseStorage {
  private db: ReturnType<typeof drizzle>;

  constructor(connectionString: string) {
    this.db = drizzle({ connectionString });
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);
    return result[0] as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);
    return result[0] as User | undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const newUser = { ...user, id };
    await this.db.insert(usersTable).values(newUser);
    return newUser;
  }

  async getClaim(id: string): Promise<Claim | undefined> {
    const result = await this.db
      .select()
      .from(claimsTable)
      .where(eq(claimsTable.id, id))
      .limit(1);

    if (!result[0]) return undefined;

    return this.formatClaim(result[0]);
  }

  async getAllClaims(): Promise<Claim[]> {
    const results = await this.db.select().from(claimsTable);
    return results.map((row) => this.formatClaim(row));
  }

  async createClaim(claim: InsertClaim): Promise<Claim> {
    const id = `CLM-${Date.now()}-${randomUUID().substring(0, 8)}`;
    const newClaim = {
      ...claim,
      id,
      photos: claim.photos || [],
    };
    await this.db.insert(claimsTable).values(newClaim);
    return newClaim as Claim;
  }

  async deleteClaim(id: string): Promise<boolean> {
    const result = await this.db
      .delete(claimsTable)
      .where(eq(claimsTable.id, id));
    return result.rowCount > 0;
  }

  private formatClaim(row: any): Claim {
    return {
      id: row.id,
      claimantName: row.claimant_name,
      summary: row.summary,
      reportedAmount: Number(row.reported_amount),
      status: row.status,
      submittedDate: row.submitted_date,
      claimantEmail: row.claimant_email,
      claimantPhone: row.claimant_phone,
      policyNumber: row.policy_number,
      vehicleInfo: row.vehicle_info,
      photos: row.photos,
      assessmentResults: row.assessment_results,
    };
  }
}

// Determine which storage to use
export function getStorage(): MemStorage | DatabaseStorage {
  if (process.env.DATABASE_URL) {
    console.log("Using Neon PostgreSQL database");
    return new DatabaseStorage(process.env.DATABASE_URL) as any;
  } else {
    console.log("Using in-memory storage (development mode)");
    return new MemStorage();
  }
}

// Export default instance
export const storage = getStorage();
