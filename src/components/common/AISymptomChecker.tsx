import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Brain, Stethoscope, Clock } from 'lucide-react';
import { AIService } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface AISymptomCheckerProps {
  onRecommendation?: (recommendation: any) => void;
}

const AISymptomChecker: React.FC<AISymptomCheckerProps> = ({ onRecommendation }) => {
  const [symptoms, setSymptoms] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      toast({
        title: "Error",
        description: "Please describe your symptoms",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const aiService = AIService.getInstance();
      const result = await aiService.analyzeSymptoms(
        symptoms.split(',').map(s => s.trim()),
        30, // Default age
        'unknown' // Default gender
      );
      
      setAnalysis(result);
      
      if (onRecommendation) {
        onRecommendation(result);
      }

      toast({
        title: "Analysis Complete",
        description: "AI has analyzed your symptoms. Please review the recommendations.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze symptoms. Please try again or consult a doctor.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'emergency': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary" />
          <span>AI {t('symptomChecker')}</span>
        </CardTitle>
        <CardDescription>
          Describe your symptoms and get AI-powered health insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Disclaimer */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium">Medical Disclaimer</span>
          </div>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
            This AI tool provides general guidance only. For emergencies, call 108. 
            Always consult a qualified doctor for proper diagnosis and treatment.
          </p>
        </div>

        {/* Symptom Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Describe Your {t('symptoms')}
          </label>
          <Textarea
            placeholder="e.g., fever for 2 days, headache, body pain, cough..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={4}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Separate multiple symptoms with commas. Be as specific as possible.
          </p>
        </div>

        {/* Analyze Button */}
        <Button 
          onClick={handleAnalyze} 
          disabled={loading || !symptoms.trim()}
          variant="medical" 
          className="w-full"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Analyze {t('symptoms')}
            </>
          )}
        </Button>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-4 mt-6">
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Stethoscope className="h-4 w-4 mr-2 text-primary" />
                AI Analysis Results
              </h4>

              {/* Urgency Level */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Urgency Level:</span>
                  <Badge variant={getUrgencyColor(analysis.urgencyLevel)}>
                    {analysis.urgencyLevel.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Possible Conditions */}
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">Possible Conditions:</h5>
                <div className="space-y-2">
                  {analysis.possibleConditions.map((condition: any, index: number) => (
                    <div key={index} className="bg-muted/50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{condition.condition}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {Math.round(condition.probability * 100)}% match
                          </span>
                          <Badge 
                            variant="outline" 
                            className={getSeverityColor(condition.severity)}
                          >
                            {condition.severity}
                          </Badge>
                        </div>
                      </div>
                      {condition.recommendations && (
                        <ul className="text-xs text-muted-foreground list-disc list-inside">
                          {condition.recommendations.map((rec: string, i: number) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Specialist */}
              {analysis.suggestedSpecialist && (
                <div className="mb-4">
                  <span className="text-sm font-medium">Suggested Specialist: </span>
                  <Badge variant="outline">{analysis.suggestedSpecialist}</Badge>
                </div>
              )}

              {/* Recommendations */}
              {analysis.recommendations && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium mb-2">Recommendations:</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {analysis.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4 border-t">
                <Button variant="medical" size="sm">
                  Book Consultation
                </Button>
                <Button variant="outline" size="sm">
                  Find Specialist
                </Button>
                {analysis.urgencyLevel === 'emergency' && (
                  <Button variant="destructive" size="sm">
                    Call Emergency (108)
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AISymptomChecker;