import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Loader2 } from "lucide-react";

const ResumeUpload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const jobDescription = location.state?.jobDescription || "";

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setSelectedFile(file);
        toast({
          title: "Resume Selected",
          description: `${file.name} is ready to upload`,
        });
      } else {
        toast({
          title: "Invalid File",
          description: "Please upload a PDF or DOCX file",
          variant: "destructive"
        });
      }
    }
  };

  const processResume = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a resume file",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);
      formData.append("jobDescription", jobDescription);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-resume`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      toast({
        title: "Resume Processed",
        description: "Ready to start your interview",
      });

      navigate("/interview", { 
        state: { 
          jobDescription,
          resumeData: data 
        } 
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process resume",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-3">Upload Your Resume</h1>
          <p className="text-muted-foreground">
            We'll analyze your experience to create personalized interview questions
          </p>
        </div>

        <Card className="p-8 shadow-elegant animate-fade-in [animation-delay:100ms]">
          <div className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-smooth cursor-pointer"
                 onClick={() => document.getElementById('resume-input')?.click()}>
              <input
                id="resume-input"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
              {selectedFile ? (
                <div className="flex flex-col items-center gap-3">
                  <FileText className="w-16 h-16 text-success" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-16 h-16 text-muted-foreground" />
                  <div>
                    <p className="font-medium mb-1">Click to upload resume</p>
                    <p className="text-sm text-muted-foreground">
                      PDF or DOCX • Max 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/job-analysis")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                variant="hero"
                onClick={processResume}
                disabled={!selectedFile || isProcessing}
                className="flex-1"
              >
                {isProcessing && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Start Interview
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResumeUpload;
