import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Dashboard from "@/pages/dashboard";
import ClaimDetail from "@/pages/claim-detail";
import NotFound from "@/pages/not-found";
import type { Claim } from "@shared/schema";

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
  },
];

function Router() {
  const [claims, setClaims] = useState<Claim[]>(initialClaims);

  const handleUpdateClaim = (claimId: string, updates: Partial<Claim>) => {
    setClaims((prevClaims) =>
      prevClaims.map((claim) =>
        claim.id === claimId ? { ...claim, ...updates } : claim
      )
    );
  };

  return (
    <Switch>
      <Route path="/">
        <Dashboard claims={claims} />
      </Route>
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
