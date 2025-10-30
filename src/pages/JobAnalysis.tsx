import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const JobAnalysis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    isLegit: boolean;
    confidence: number;
    reasoning: string;
  } | null>(null);

  const analyzeJob = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter a job description",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Call edge function for fraud detection
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-job`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ jobDescription }),
        }
      );

      const data = await response.json();
      setAnalysisResult(data);

      if (data.isLegit) {
        toast({
          title: "Verification Complete",
          description: "Job posting appears legitimate. You may proceed.",
        });
      } else {
        toast({
          title: "Warning",
          description: "This job posting shows signs of potential fraud.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze job description",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const proceedToResume = () => {
    if (analysisResult?.isLegit) {
      navigate("/resume-upload", { state: { jobDescription } });
    }
  };

  return (
    <div className="min-h-screen gradient-hero py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-3">Job Description Analysis</h1>
          <p className="text-muted-foreground">
            Our AI will verify if this job posting is legitimate before proceeding
          </p>
        </div>

        <Card className="p-8 shadow-elegant animate-fade-in [animation-delay:100ms]">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Paste the job description below
              </label>
              <Textarea
                placeholder="Enter the complete job description including role, responsibilities, requirements, and company details..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[300px] resize-none"
                disabled={isAnalyzing}
              />
            </div>

            {analysisResult && (
              <Card className={`p-6 ${analysisResult.isLegit ? 'border-success' : 'border-destructive'}`}>
                <div className="flex items-start gap-4">
                  {analysisResult.isLegit ? (
                    <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">
                      {analysisResult.isLegit ? "Job Verified" : "Potential Fraud Detected"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Confidence: {Math.round(analysisResult.confidence * 100)}%
                    </p>
                    <p className="text-sm">{analysisResult.reasoning}</p>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="flex-1"
              >
                Back
              </Button>
              {!analysisResult ? (
                <Button
                  variant="hero"
                  onClick={analyzeJob}
                  disabled={isAnalyzing}
                  className="flex-1"
                >
                  {isAnalyzing && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Analyze Job Description
                </Button>
              ) : analysisResult.isLegit ? (
                <Button
                  variant="hero"
                  onClick={proceedToResume}
                  className="flex-1"
                >
                  Continue to Resume Upload
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setAnalysisResult(null)}
                  className="flex-1"
                >
                  Try Another Job
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default JobAnalysis;
