import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { RealtimeChat } from "@/utils/RealtimeAudio";

const Interview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<Array<{ role: string; text: string }>>([]);
  
  const chatRef = useRef<RealtimeChat | null>(null);
  
  const { jobDescription, resumeData } = location.state || {};

  const systemPrompt = `You are conducting a professional mock interview. You are an experienced HR interviewer who is supportive, curious, and professional.

Job Description:
${jobDescription}

Candidate's Resume Summary:
${resumeData?.summary || "No resume data available"}

Your role:
1. Ask interview questions ONE AT A TIME - never list multiple questions
2. Listen carefully to the candidate's spoken answer
3. Analyze their answer for:
   - Clarity (how clearly they explained)
   - Confidence (how sure they sounded)
   - Content depth (how well they covered the topic)
4. After each answer, give a short encouraging remark (under 20 words)
5. Then ask the NEXT question, logically connected to their previous response
6. Occasionally increase question difficulty if the candidate performs well
7. Maintain natural pacing with short pauses between replies
8. Keep your responses under 60 words
9. Stay polite and human-like
10. If they stop responding, gently ask: "Would you like to continue?"
11. Only end if they say "stop," "end," or "thank you"

Begin by introducing yourself briefly and asking the first question about their background.`;

  const handleMessage = (event: any) => {
    console.log('Received message type:', event.type);
    
    if (event.type === 'response.audio_transcript.delta') {
      setTranscript(prev => {
        const lastEntry = prev[prev.length - 1];
        if (lastEntry && lastEntry.role === 'assistant') {
          return [
            ...prev.slice(0, -1),
            { ...lastEntry, text: lastEntry.text + (event.delta || '') }
          ];
        }
        return [...prev, { role: 'assistant', text: event.delta || '' }];
      });
    } else if (event.type === 'conversation.item.input_audio_transcription.completed') {
      setTranscript(prev => [...prev, { role: 'user', text: event.transcript }]);
    } else if (event.type === 'response.audio.delta') {
      setIsSpeaking(true);
    } else if (event.type === 'response.audio.done') {
      setIsSpeaking(false);
    }
  };

  const startInterview = async () => {
    try {
      setIsConnecting(true);
      
      chatRef.current = new RealtimeChat(handleMessage, systemPrompt);
      await chatRef.current.init();
      
      setIsConnected(true);
      setIsConnecting(false);
      
      toast({
        title: "Connected",
        description: "Interview started. You can begin speaking.",
      });
    } catch (error) {
      console.error('Error starting interview:', error);
      setIsConnecting(false);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to start interview',
        variant: "destructive",
      });
    }
  };

  const endInterview = () => {
    chatRef.current?.disconnect();
    setIsConnected(false);
    setIsSpeaking(false);
    
    // Navigate to feedback page with transcript
    navigate("/feedback", { state: { transcript } });
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen gradient-hero py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-3">Voice Interview</h1>
          <p className="text-muted-foreground">
            Speak naturally and answer questions as they come
          </p>
        </div>

        {/* Microphone Visualization */}
        <div className="flex justify-center mb-8 animate-fade-in [animation-delay:100ms]">
          <div className={`relative ${isSpeaking ? 'animate-pulse-glow' : ''}`}>
            <div className="w-32 h-32 rounded-full gradient-primary flex items-center justify-center shadow-glow">
              {isConnected ? (
                isSpeaking ? (
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-12 bg-white rounded-full animate-wave"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                ) : (
                  <Mic className="w-12 h-12 text-white" />
                )
              ) : (
                <MicOff className="w-12 h-12 text-white opacity-50" />
              )}
            </div>
          </div>
        </div>

        {/* Transcript */}
        <Card className="p-6 mb-6 shadow-elegant max-h-96 overflow-y-auto animate-fade-in [animation-delay:200ms]">
          <h2 className="font-semibold mb-4">Conversation</h2>
          {transcript.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {isConnected ? "Listening..." : "Start the interview to begin"}
            </p>
          ) : (
            <div className="space-y-4">
              {transcript.map((entry, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    entry.role === 'user'
                      ? 'bg-primary/10 ml-8'
                      : 'bg-accent/10 mr-8'
                  }`}
                >
                  <p className="text-xs font-semibold mb-1 uppercase text-muted-foreground">
                    {entry.role === 'user' ? 'You' : 'Interviewer'}
                  </p>
                  <p className="text-sm">{entry.text}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Controls */}
        <div className="flex gap-4 animate-fade-in [animation-delay:300ms]">
          <Button
            variant="outline"
            onClick={() => navigate("/resume-upload")}
            disabled={isConnected}
            className="flex-1"
          >
            Back
          </Button>
          {!isConnected ? (
            <Button
              variant="hero"
              onClick={startInterview}
              disabled={isConnecting}
              className="flex-1"
            >
              {isConnecting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Start Interview
            </Button>
          ) : (
            <Button
              variant="accent"
              onClick={endInterview}
              className="flex-1"
            >
              End Interview & Get Feedback
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interview;
