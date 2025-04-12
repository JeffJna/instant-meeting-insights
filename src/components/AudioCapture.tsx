
import { useState } from 'react';
import { Mic, MicOff, PlayCircle, StopCircle, Volume2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/components/ui/use-toast';
import { DeviceSelector } from './DeviceSelector';
import { useAudioCapture } from '@/hooks/useAudioCapture';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AudioCaptureProps {
  onStreamChange: (stream: MediaStream | null) => void;
  isTranscribing: boolean;
  onTranscribeStart: () => void;
  onTranscribeStop: () => void;
}

export function AudioCapture({ 
  onStreamChange, 
  isTranscribing,
  onTranscribeStart,
  onTranscribeStop
}: AudioCaptureProps) {
  const { toast } = useToast();
  const {
    devices,
    selectedDevice,
    setSelectedDevice,
    isCapturing,
    startCapture,
    stopCapture,
    audioStream,
    error
  } = useAudioCapture();
  
  const [activeTab, setActiveTab] = useState("setup");

  // Handle starting both capture and transcription
  const handleStart = async () => {
    await startCapture();
    if (audioStream) {
      onStreamChange(audioStream);
      onTranscribeStart();
      toast({
        title: "Gravação iniciada",
        description: "Capturando áudio e transcrevendo...",
      });
    }
  };

  // Handle stopping both
  const handleStop = () => {
    stopCapture();
    onStreamChange(null);
    onTranscribeStop();
    toast({
      title: "Gravação finalizada",
      description: "Áudio e transcrição pausados.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>Captura de Áudio</CardTitle>
        <CardDescription>
          Capture áudio do seu dispositivo para transcrição automática
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="setup">Configuração</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup" className="space-y-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">Dispositivo de Áudio</label>
              <DeviceSelector
                devices={devices}
                selectedDevice={selectedDevice}
                onSelect={setSelectedDevice}
                disabled={isCapturing}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Dica</AlertTitle>
              <AlertDescription>
                Para capturar áudio de alto-falantes no Windows, habilite "Stereo Mix". 
                No macOS, use BlackHole ou Loopback. No Linux, configure o PulseAudio ou JACK.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="status" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Status</span>
                {isCapturing ? (
                  <Badge variant="success" className="bg-green-500">
                    <Volume2 className="mr-1 h-3 w-3 animate-pulse" />
                    Ativo
                  </Badge>
                ) : (
                  <Badge variant="outline">Inativo</Badge>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Dispositivo</span>
                <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                  {selectedDevice?.label || "Nenhum"}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Transcrição</span>
                {isTranscribing ? (
                  <Badge variant="success" className="bg-green-500">
                    Processando
                  </Badge>
                ) : (
                  <Badge variant="outline">Parada</Badge>
                )}
              </div>
            </div>
            
            {isCapturing && (
              <div className="bg-muted p-3 rounded-md">
                <div className="flex items-center">
                  <div className="relative h-2 w-full bg-muted-foreground/30 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-primary animate-pulse w-full opacity-60"></div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="pt-2">
        {!isCapturing ? (
          <Button 
            onClick={handleStart} 
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
          >
            <PlayCircle className="mr-2 h-4 w-4" />
            Iniciar Gravação
          </Button>
        ) : (
          <Button 
            onClick={handleStop} 
            variant="destructive" 
            className="w-full"
          >
            <StopCircle className="mr-2 h-4 w-4" />
            Parar Gravação
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
