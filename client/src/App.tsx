import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Dashboard from "@/pages/dashboard";
import ClaimDetail from "@/pages/claim-detail";
import NotFound from "@/pages/not-found";
import type { Claim, InsertClaim } from "@shared/schema";

const initialClaims: Claim[] = [
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
    "https://feherlawfirm.com/wp-content/uploads/damaged-in-heavy-car-accident-vehicles-after-colli-2023-11-27-05-22-40-utc_1920x1280.webp"
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
    "https://www.milehighdents.net/wp-content/webp-express/webp-images/uploads/2025/06/hail-damage-total-vehicle.jpeg.webp"
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
    assessmentResults: {
      recommendedPayout: 5270,
      confidence: 88,
      fraudScore: 8,
      suggestedPath: "Repair",
    },
    photos: [
    "https://imgs.search.brave.com/ogB0LFr3V7HHdVrm5uesHC_K0Ob0_dArZHjlFWSTZ2c/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cHJvZC53ZWJzaXRl/LWZpbGVzLmNvbS82/NGYzMTRmYTkyZjY2/YTBjY2M5NTBjNWUv/NjVkZDdiOWI1Mjdj/MWU4YjdlMDM3YTQ1/X3NvbWVvbmUlMjBo/aXQlMjBteSUyMHdp/bmclMjBtaXJyb3Il/MjBhbmQlMjBkcm92/ZSUyMG9mZiUyMHdo/YXQlMjB0byUyMGRv/LmpwZw",
    "https://www.thelawplace.com/wp-content/uploads/2021/11/vehicle-damaged-after-a-sideswipe-accident-768x511.jpg"
    ],
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
    "https://imgs.search.brave.com/UFxfOFKfzcDh5MoBOHSjMMaHkVEy56OOFQfMS0-EKCI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9lcGlj/dmluLnMzLmFtYXpv/bmF3cy5jb20vYmxv/Zy9taW4vMTJhZjdm/ZDMtOGY4OS00MTIw/LTk1OTYtZmY0Y2Iy/NDU2MWM5LmpwZw",
    "https://imgs.search.brave.com/gUsHTOh-SVifMu0ZYUS0cGox-gT85XWKsrmghmyEJN4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Y2x1YnRvdWFyZWcu/Y29tL2QyL2F0dGFj/aG1lbnRzLzEyLzEy/MzQ3LTM4ZmQxMDJk/YTFlYTI4YmI4OTY2/YjdiNTVjMTc0MjNm/LmpwZw"
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
    assessmentResults: {
      recommendedPayout: 722,
      confidence: 95,
      fraudScore: 3,
      suggestedPath: "Repair",
    },
    photos: [
    "https://imgs.search.brave.com/O0v2Xn7GLYW-HNdQc3j6OtE1WaBPXmb6X0GbhtCKa_g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9saDMu/Z29vZ2xldXNlcmNv/bnRlbnQuY29tL3lL/REZDMVBHaURrZHpz/UjAwczJWejFXMnlN/SW5pQ2xtSC1EVFB5/RXI2WnVNeGVYSndk/QW9mN1liUFIwaVQw/aGtGemJRZ09hUHFK/Z0RJX01oUkV5R1hP/UWt0MzlQZGZfeDVV/dHpuT0g5V0E2YnM1/c19ZT3FhZ0xiOVA0/M0xXczBhV1dpMnNp/T0E9czA"
    ],
  },
];

function Router() {
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [loading, setLoading] = useState(true);

  const loadClaims = async () => {
    try {
      const response = await fetch("/api/claims");
      if (response.ok) {
        const data = await response.json();
        console.log("Loaded claims from API:", data);
        setClaims(data.length > 0 ? data : initialClaims);
      }
    } catch (error) {
      console.error("Failed to load claims:", error);
      setClaims(initialClaims);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClaims();
  }, []);

  const handleUpdateClaim = (claimId: string, updates: Partial<Claim>) => {
    setClaims((prevClaims) =>
      prevClaims.map((claim) =>
        claim.id === claimId ? { ...claim, ...updates } : claim
      )
    );
  };

  const handleCreateClaim = async (newClaim: InsertClaim) => {
    try {
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClaim),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log("Claim created:", data);
        setClaims((prevClaims) => [data, ...prevClaims]);
        return data;
      } else {
        console.error("Failed to create claim:", data);
        alert(`Error: ${data.error || "Failed to create claim"}`);
        return null;
      }
    } catch (error) {
      console.error("Failed to create claim:", error);
      alert("Error: Failed to submit claim. Please try again.");
      return null;
    }
  };

  const handleDeleteClaim = async (claimId: string) => {
    try {
      const response = await fetch(`/api/claims/${claimId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setClaims((prevClaims) => prevClaims.filter((c) => c.id !== claimId));
        return true;
      }
    } catch (error) {
      console.error("Failed to delete claim:", error);
    }
    return false;
  };

  return (
    <Switch>
      <Route path="/">
        <Dashboard claims={claims} onDeleteClaim={handleDeleteClaim} />
      </Route>
      {/* Create page removed from navigation - create route disabled */}
      <Route path="/claim/:id">
        {(params) => {
          const claim = claims.find((c) => c.id === params.id);
          if (!claim) return <NotFound />;
          return <ClaimDetail claim={claim} onUpdateClaim={handleUpdateClaim} />;
        }}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
