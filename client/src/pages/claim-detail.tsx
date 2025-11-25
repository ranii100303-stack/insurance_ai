import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Bot, 
  Calculator, 
  ShieldAlert, 
  ClipboardCheck,
  CheckCircle,
  XCircle
} from "lucide-react";
import type { Claim, AgentMessage } from "@shared/schema";

interface ClaimDetailProps {
  claim: Claim;
  onUpdateClaim: (claimId: string, updates: Partial<Claim>) => void;
}

export default function ClaimDetail({ claim, onUpdateClaim }: ClaimDetailProps) {
  const [, setLocation] = useLocation();
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessmentComplete, setAssessmentComplete] = useState(!!claim.assessmentResults);
  const [visibleMessages, setVisibleMessages] = useState<AgentMessage[]>([]);
  const [showResults, setShowResults] = useState(!!claim.assessmentResults);

  const agentMessages = useMemo<AgentMessage[]>(() => [
    {
      agent: "Intake Agent",
      message: "Extracting claim metadata and validating submission completeness...",
      icon: "bot",
    },
    {
      agent: "Estimator Agent",
      message: "Analyzing damage photos and estimating repair costs based on market data...",
      icon: "calculator",
    },
    {
      agent: "SIU Agent",
      message: "Running fraud detection algorithms and cross-referencing claim history...",
      icon: "shield",
    },
    {
      agent: "Triage Agent",
      message: "Evaluating optimal resolution path and generating payout recommendation...",
      icon: "clipboard",
    },
  ], []);

  const mockAssessmentResults = useMemo(() => ({
    recommendedPayout: Math.round(claim.reportedAmount * 0.85),
    confidence: 92,
    fraudScore: 12,
    suggestedPath: claim.reportedAmount > 15000 ? ("Total Loss" as const) : ("Repair" as const),
  }), [claim.reportedAmount]);

  useEffect(() => {
    if (isAssessing) {
      // Show first message immediately
      setVisibleMessages([agentMessages[0]]);
      
      let currentIndex = 1;
      const interval = setInterval(() => {
        if (currentIndex < agentMessages.length) {
          setVisibleMessages((prev) => [...prev, agentMessages[currentIndex]]);
          currentIndex++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setShowResults(true);
            setAssessmentComplete(true);
            setIsAssessing(false);
            onUpdateClaim(claim.id, {
              status: "Processing",
              assessmentResults: mockAssessmentResults,
            });
          }, 500);
        }
      }, 1500);

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAssessing, agentMessages, mockAssessmentResults, claim.id]);

  const handleRunAssessment = () => {
    setIsAssessing(true);
    setAssessmentComplete(false);
    setVisibleMessages([]);
    setShowResults(false);
  };

  const handleAccept = () => {
    onUpdateClaim(claim.id, { status: "Closed" });
  };

  const handleOverride = () => {
    onUpdateClaim(claim.id, { status: "Overridden" });
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "bot":
        return <Bot className="h-5 w-5" />;
      case "calculator":
        return <Calculator className="h-5 w-5" />;
      case "shield":
        return <ShieldAlert className="h-5 w-5" />;
      case "clipboard":
        return <ClipboardCheck className="h-5 w-5" />;
      default:
        return <Bot className="h-5 w-5" />;
    }
  };

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

  const getFraudScoreColor = (score: number) => {
    if (score < 25) return "text-green-600 dark:text-green-400";
    if (score < 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 flex-wrap flex-1 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/")}
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-semibold text-foreground">Claim Details</h1>
                <Badge variant={getStatusVariant(claim.status)} data-testid="badge-claim-status">
                  {claim.status}
                </Badge>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-4 flex-wrap">
                  <span>Claim Information</span>
                  <span className="font-mono text-sm text-muted-foreground" data-testid="text-claim-id">
                    {claim.id}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Summary</div>
                  <p className="text-sm text-foreground" data-testid="text-claim-summary">
                    {claim.summary}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Submitted Date</div>
                    <p className="text-sm text-foreground" data-testid="text-submitted-date">
                      {claim.submittedDate}
                    </p>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Reported Amount</div>
                    <p className="text-lg font-semibold font-mono text-foreground" data-testid="text-reported-amount">
                      ${claim.reportedAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submitted Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[1, 2, 3, 4].map((num) => (
                    <div
                      key={num}
                      className="aspect-video border-2 border-dashed border-border rounded-md bg-muted/20 flex flex-col items-center justify-center gap-2"
                      data-testid={`placeholder-photo-${num}`}
                    >
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Photo {num}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isAssessing && !assessmentComplete && (
                  <Button
                    onClick={handleRunAssessment}
                    className="w-full"
                    size="lg"
                    data-testid="button-run-assessment"
                  >
                    <Bot className="h-5 w-5 mr-2" />
                    Run AI Assessment
                  </Button>
                )}

                {!isAssessing && assessmentComplete && claim.status !== "Closed" && claim.status !== "Overridden" && (
                  <Button
                    onClick={handleRunAssessment}
                    variant="outline"
                    className="w-full"
                    size="lg"
                    data-testid="button-rerun-assessment"
                  >
                    <Bot className="h-5 w-5 mr-2" />
                    Re-run Assessment
                  </Button>
                )}

                {isAssessing && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                      Processing claim assessment...
                    </div>
                    {visibleMessages.filter(msg => msg && msg.icon).map((msg, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 animate-in fade-in slide-in-from-top-2 duration-500"
                        data-testid={`agent-message-${idx}`}
                      >
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {getIcon(msg.icon)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-foreground mb-1">{msg.agent}</div>
                          <p className="text-sm text-muted-foreground">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showResults && claim.assessmentResults && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {visibleMessages.length > 0 && (
                      <div className="space-y-4 pb-6 border-b border-border">
                        {visibleMessages.filter(msg => msg && msg.icon).map((msg, idx) => (
                          <div key={idx} className="flex gap-4" data-testid={`agent-message-${idx}`}>
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              {getIcon(msg.icon)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-foreground mb-1">{msg.agent}</div>
                              <p className="text-sm text-muted-foreground">{msg.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="bg-accent/20 border border-accent-border rounded-md p-6">
                      <h3 className="text-base font-semibold text-foreground mb-4">Assessment Results</h3>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-2">
                            Recommended Payout
                          </div>
                          <div className="text-3xl font-semibold font-mono text-foreground" data-testid="text-recommended-payout">
                            ${claim.assessmentResults.recommendedPayout.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-2">
                            Confidence Level
                          </div>
                          <div className="space-y-2">
                            <div className="text-2xl font-semibold text-foreground" data-testid="text-confidence">
                              {claim.assessmentResults.confidence}%
                            </div>
                            <Progress value={claim.assessmentResults.confidence} className="h-2" />
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-2">Fraud Score</div>
                          <div
                            className={`text-2xl font-semibold ${getFraudScoreColor(claim.assessmentResults.fraudScore)}`}
                            data-testid="text-fraud-score"
                          >
                            {claim.assessmentResults.fraudScore}/100
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {claim.assessmentResults.fraudScore < 25 && "Low Risk"}
                            {claim.assessmentResults.fraudScore >= 25 && claim.assessmentResults.fraudScore < 50 && "Medium Risk"}
                            {claim.assessmentResults.fraudScore >= 50 && "High Risk"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-2">
                            Suggested Path
                          </div>
                          <Badge variant="default" className="text-base px-3 py-1" data-testid="badge-suggested-path">
                            {claim.assessmentResults.suggestedPath}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {claim.status !== "Closed" && claim.status !== "Overridden" && (
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                          onClick={handleAccept}
                          className="flex-1"
                          size="lg"
                          data-testid="button-accept"
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Accept Recommendation
                        </Button>
                        <Button
                          onClick={handleOverride}
                          variant="outline"
                          className="flex-1"
                          size="lg"
                          data-testid="button-override"
                        >
                          <XCircle className="h-5 w-5 mr-2" />
                          Override
                        </Button>
                      </div>
                    )}

                    {claim.status === "Closed" && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-md p-4 flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-foreground">Claim Approved</div>
                          <div className="text-sm text-muted-foreground">
                            This claim has been closed and the recommendation has been accepted.
                          </div>
                        </div>
                      </div>
                    )}

                    {claim.status === "Overridden" && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 flex items-center gap-3">
                        <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-foreground">Claim Overridden</div>
                          <div className="text-sm text-muted-foreground">
                            This claim requires manual review and adjustment.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle>Claimant Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Name</div>
                  <p className="text-sm font-semibold text-foreground" data-testid="text-claimant-name">
                    {claim.claimantName}
                  </p>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Email</div>
                  <p className="text-sm text-foreground" data-testid="text-claimant-email">
                    {claim.claimantEmail}
                  </p>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Phone</div>
                  <p className="text-sm text-foreground" data-testid="text-claimant-phone">
                    {claim.claimantPhone}
                  </p>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Policy Number</div>
                  <p className="text-sm font-mono text-foreground" data-testid="text-policy-number">
                    {claim.policyNumber}
                  </p>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Vehicle</div>
                  <p className="text-sm text-foreground" data-testid="text-vehicle-info">
                    {claim.vehicleInfo}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
