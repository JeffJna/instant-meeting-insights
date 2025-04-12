
import { useEffect, useRef } from 'react';
import { Clock, FileText, Save } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Transcription, Alert } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface TranscriptionViewProps {
  transcriptions: Transcription[];
  alerts: Alert[];
  isTranscribing: boolean;
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function TranscriptionView({ transcriptions, alerts, isTranscribing }: TranscriptionViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when new transcriptions come in
  useEffect(() => {
    if (bottomRef.current && isTranscribing) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcriptions, isTranscribing]);

  // Find keywords in text and highlight them
  const highlightKeywords = (text: string) => {
    if (alerts.length === 0) return text;

    let result = text;
    alerts.forEach(alert => {
      const regex = new RegExp(`\\b${alert.keyword}\\b`, 'gi');
      result = result.replace(regex, (match) => {
        return `<span class="bg-${alert.color}-200 text-${alert.color}-800 px-1 rounded font-medium">${match}</span>`;
      });
    });
    
    return result;
  };

  // Function to check if a transcription contains an alert keyword
  const containsAlertKeyword = (text: string): boolean => {
    return alerts.some(alert => {
      const regex = new RegExp(`\\b${alert.keyword}\\b`, 'gi');
      return regex.test(text);
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Transcrição em Tempo Real
          </CardTitle>
          
          {isTranscribing && (
            <div className="flex items-center text-xs text-green-500 font-medium">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
              Transcrevendo...
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] w-full rounded-md border-t p-4">
          {transcriptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <FileText className="h-12 w-12 mb-2 opacity-20" />
              <p className="text-center">
                {isTranscribing 
                  ? "Aguardando transcrição..."
                  : "Nenhuma transcrição disponível. Inicie a gravação para começar."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {transcriptions.map((item, index) => (
                <div 
                  key={item.id} 
                  className={cn(
                    "py-2",
                    containsAlertKeyword(item.text) && "animate-pulse"
                  )}
                >
                  <div className="flex items-center text-xs text-muted-foreground mb-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatTimestamp(item.timestamp)}</span>
                    {item.speaker && (
                      <span className="ml-2 bg-slate-100 px-1.5 py-0.5 rounded-full text-slate-700 text-[10px]">
                        {item.speaker}
                      </span>
                    )}
                  </div>
                  
                  <p 
                    className="text-sm leading-relaxed" 
                    dangerouslySetInnerHTML={{ __html: highlightKeywords(item.text) }}
                  />
                  
                  {index < transcriptions.length - 1 && <Separator className="mt-2" />}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="pt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          disabled={transcriptions.length === 0}
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar transcrição
        </Button>
      </CardFooter>
    </Card>
  );
}
