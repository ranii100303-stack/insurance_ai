import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Claim } from "@shared/schema";

interface DashboardProps {
  claims: Claim[];
}

export default function Dashboard({ claims }: DashboardProps) {

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Pending":
        return "secondary";
      case "Processing":
        return "default";
      case "Closed":
        return "outline";
      case "Overridden":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusStyle = (status: string): React.CSSProperties | undefined => {
    if (status === "Pending") {
      return {
        backgroundColor: "#fed7aa",
        color: "#92400e",
        borderColor: "#fed7aa",
      };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">Insurance Claims Dashboard</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Active Claims</h2>
            <p className="text-sm text-muted-foreground mt-1">Review and process submitted insurance claims</p>
          </div>
        </div>

        <div className="space-y-3">
          {claims.map((claim) => (
            <Link key={claim.id} href={`/claim/${claim.id}`} className="block" data-testid={`link-claim-${claim.id}`}>
              <Card className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <Badge variant={getStatusVariant(claim.status)} style={getStatusStyle(claim.status)} data-testid={`badge-status-${claim.id}`}>
                        {claim.status}
                      </Badge>
                      <span className="font-mono text-sm text-muted-foreground" data-testid={`text-claim-id-${claim.id}`}>
                        {claim.id}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-1" data-testid={`text-claimant-name-${claim.id}`}>
                      {claim.claimantName}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-summary-${claim.id}`}>
                      {claim.summary}
                    </p>
                  </div>
                  <div className="flex-shrink-0 sm:text-right">
                    <div className="text-2xl font-semibold text-foreground font-mono" data-testid={`text-amount-${claim.id}`}>
                      ${claim.reportedAmount.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Reported Amount</div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {claims.length === 0 && (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No claims found</h3>
            <p className="text-sm text-muted-foreground">There are no claims to display at this time.</p>
          </Card>
        )}
      </main>
    </div>
  );
}
