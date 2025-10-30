import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Shield, FileText, Mic, TrendingUp } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-hero">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            AI-Powered Interview Platform
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Intelligent fraud detection • Resume-based questioning • Real-time voice feedback
          </p>
          <Button 
            variant="hero" 
            size="lg"
            onClick={() => navigate("/job-analysis")}
            className="text-lg px-8 py-6 h-auto"
          >
            Start Your Interview Journey
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="p-6 shadow-elegant hover:shadow-glow transition-smooth animate-fade-in">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Fraud Detection</h3>
            <p className="text-sm text-muted-foreground">
              AI analyzes job descriptions to verify authenticity before you invest time
            </p>
          </Card>

          <Card className="p-6 shadow-elegant hover:shadow-glow transition-smooth animate-fade-in [animation-delay:100ms]">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Resume Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Personalized questions based on your skills and experience
            </p>
          </Card>

          <Card className="p-6 shadow-elegant hover:shadow-glow transition-smooth animate-fade-in [animation-delay:200ms]">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Voice Interview</h3>
            <p className="text-sm text-muted-foreground">
              Natural conversation with AI that adapts to your responses
            </p>
          </Card>

          <Card className="p-6 shadow-elegant hover:shadow-glow transition-smooth animate-fade-in [animation-delay:300ms]">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Detailed Feedback</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive analysis of clarity, confidence, and content depth
            </p>
          </Card>
        </div>
      </div>

      {/* Process Section */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-6">
            {[
              { step: 1, title: "Submit Job Description", desc: "Our AI verifies the job posting is legitimate" },
              { step: 2, title: "Upload Your Resume", desc: "We analyze your skills and experience" },
              { step: 3, title: "Voice Interview", desc: "Have a natural conversation with our AI interviewer" },
              { step: 4, title: "Get Feedback", desc: "Receive detailed insights on your performance" }
            ].map((item, idx) => (
              <Card key={idx} className="p-6 flex items-start gap-4 shadow-elegant">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
