import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Upload, ArrowLeft } from "lucide-react";
import type { InsertClaim, ClaimStatus } from "@shared/schema";

interface CreateClaimProps {
  onCreateClaim: (claim: InsertClaim) => Promise<any>;
}

export default function CreateClaim({ onCreateClaim }: CreateClaimProps) {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<InsertClaim>({
    claimantName: "",
    summary: "",
    reportedAmount: 0,
    status: "Pending" as ClaimStatus,
    submittedDate: new Date().toISOString().split("T")[0],
    claimantEmail: "",
    claimantPhone: "",
    policyNumber: "",
    vehicleInfo: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "reportedAmount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value as ClaimStatus,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    setUploadedFiles((prev) => [...prev, ...imageFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.claimantName.trim()) {
      alert("Please enter claimant name");
      return;
    }
    if (!formData.claimantEmail.trim()) {
      alert("Please enter email");
      return;
    }
    if (!formData.claimantPhone.trim()) {
      alert("Please enter phone number");
      return;
    }
    if (!formData.policyNumber.trim()) {
      alert("Please enter policy number");
      return;
    }
    if (!formData.vehicleInfo.trim()) {
      alert("Please enter vehicle information");
      return;
    }
    if (!formData.summary.trim()) {
      alert("Please enter claim summary");
      return;
    }
    if (formData.reportedAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    
    setLoading(true);
    try {
      console.log("Submitting claim:", formData);
      const result = await onCreateClaim(formData);
      if (result) {
        console.log("Claim created successfully, navigating to dashboard");
        // Wait a moment for state to update before navigating
        await new Promise(resolve => setTimeout(resolve, 500));
        setLocation("/");
      } else {
        console.error("Failed to create claim - API returned null");
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to create claim:", error);
      alert("Error: Failed to create claim");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/")} className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-semibold text-foreground">Submit New Claim</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Claimant Information Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Claimant Information</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="claimantName">Full Name</Label>
                <Input
                  id="claimantName"
                  name="claimantName"
                  placeholder="John Doe"
                  value={formData.claimantName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="claimantEmail">Email</Label>
                <Input
                  id="claimantEmail"
                  name="claimantEmail"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.claimantEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="claimantPhone">Phone (XXX-XXX-XXXX)</Label>
                <Input
                  id="claimantPhone"
                  name="claimantPhone"
                  placeholder="555-123-4567"
                  value={formData.claimantPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="policyNumber">Policy Number</Label>
                <Input
                  id="policyNumber"
                  name="policyNumber"
                  placeholder="POL-XXXX-XXXX"
                  value={formData.policyNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </Card>

          {/* Vehicle Information Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Vehicle Information</h2>
            <div className="space-y-2">
              <Label htmlFor="vehicleInfo">Vehicle Details</Label>
              <Input
                id="vehicleInfo"
                name="vehicleInfo"
                placeholder="e.g., 2022 Honda Accord EX-L"
                value={formData.vehicleInfo}
                onChange={handleInputChange}
                required
              />
            </div>
          </Card>

          {/* Claim Details Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Claim Details</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="summary">Claim Summary</Label>
                <Textarea
                  id="summary"
                  name="summary"
                  placeholder="Describe the incident and damage in detail..."
                  value={formData.summary}
                  onChange={handleInputChange}
                  required
                  rows={5}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="reportedAmount">Reported Amount ($)</Label>
                  <Input
                    id="reportedAmount"
                    name="reportedAmount"
                    type="number"
                    placeholder="0"
                    value={formData.reportedAmount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                      <SelectItem value="Overridden">Overridden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="submittedDate">Submitted Date</Label>
                <Input
                  id="submittedDate"
                  name="submittedDate"
                  type="date"
                  value={formData.submittedDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </Card>

          {/* Damage Photos Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Damage Photos</h2>
            <div className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
              >
                <input
                  id="photos"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="photos" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB each</p>
                  <p className="text-xs text-muted-foreground">{uploadedFiles.length}/5 photos uploaded</p>
                </label>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      >
                        ✕
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => setLocation("/")} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="min-w-40">
              {loading ? "Submitting..." : "Submit Claim"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
