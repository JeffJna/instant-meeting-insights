
import { useState } from 'react';
import { FileText, DownloadCloud, RefreshCcw, Sparkles } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Transcription } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

interface MinutesGeneratorProps {
  transcriptions: Transcription[];
}

export function MinutesGenerator({ transcriptions }: MinutesGeneratorProps) {
  const [minutes, setMinutes] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Mock function to generate meeting minutes with a delay
  const generateMinutes = () => {
    if (transcriptions.length === 0) {
      toast({
        title: "Sem conteúdo para análise",
        description: "Não há transcrições disponíveis para gerar a ata.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      // Combine all transcriptions into a text
      const fullText = transcriptions.map(t => t.text).join(' ');
      
      // Mock AI-generated minutes
      const generatedMinutes = `# Ata da Reunião

## Participantes
- Time de desenvolvimento
- Stakeholders

## Pontos Discutidos
1. Análise do novo projeto proposto
2. Definição de prazos para as entregas
3. Discussão sobre a alocação de recursos

## Decisões Tomadas
- Iniciar o desenvolvimento na próxima semana
- Priorizar as funcionalidades essenciais
- Revisar o orçamento para adequar ao escopo

## Próximos Passos
- Agendar reunião de kickoff com a equipe
- Preparar documentação inicial do projeto
- Configurar ambiente de desenvolvimento

## Observações
Esta ata foi gerada automaticamente com base na transcrição da reunião.`;
      
      setMinutes(generatedMinutes);
      setIsGenerating(false);
      
      toast({
        title: "Ata gerada com sucesso",
        description: "A ata da reunião foi gerada com base nas transcrições.",
      });
    }, 2500);
  };
  
  const downloadMinutes = () => {
    if (!minutes) {
      toast({
        title: "Sem conteúdo para download",
        description: "Gere a ata primeiro para poder fazer o download.",
        variant: "destructive",
      });
      return;
    }
    
    // Create a blob from the content
    const blob = new Blob([minutes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `ata-reuniao-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download iniciado",
      description: "O arquivo da ata foi gerado e está sendo baixado.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Gerador de Atas
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ScrollArea className="h-[200px] w-full rounded-md border">
          {isGenerating ? (
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : minutes ? (
            <Textarea 
              className="min-h-[200px] resize-none border-0 focus-visible:ring-0" 
              value={minutes} 
              onChange={(e) => setMinutes(e.target.value)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
              <Sparkles className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-center text-sm">
                Gere uma ata de reunião automaticamente com base nas transcrições.
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="flex space-x-2 pt-2">
        <Button 
          onClick={generateMinutes} 
          disabled={isGenerating || transcriptions.length === 0}
          className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
        >
          {isGenerating ? (
            <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Gerar Ata
        </Button>
        
        <Button 
          variant="outline" 
          onClick={downloadMinutes}
          disabled={!minutes || isGenerating}
          className="flex-1"
        >
          <DownloadCloud className="h-4 w-4 mr-2" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
