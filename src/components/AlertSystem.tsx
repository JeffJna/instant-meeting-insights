
import { useState } from 'react';
import { AlertCircle, Plus, Trash2, VolumeX, Volume2, X } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';

interface AlertSystemProps {
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
}

const PRIORITY_COLORS = {
  low: 'green',
  medium: 'yellow',
  high: 'red'
};

export function AlertSystem({ alerts, setAlerts }: AlertSystemProps) {
  const [keyword, setKeyword] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  const handleAddAlert = () => {
    if (keyword.trim() === '') {
      toast({
        title: "Palavra-chave vazia",
        description: "Por favor, insira uma palavra-chave para adicionar um alerta.",
        variant: "destructive",
      });
      return;
    }
    
    if (alerts.some(alert => alert.keyword.toLowerCase() === keyword.toLowerCase())) {
      toast({
        title: "Palavra-chave duplicada",
        description: "Esta palavra-chave já existe na lista de alertas.",
        variant: "destructive",
      });
      return;
    }
    
    const newAlert: Alert = {
      id: Date.now().toString(),
      keyword,
      priority,
      color: PRIORITY_COLORS[priority],
      soundEnabled: true
    };
    
    setAlerts(prev => [...prev, newAlert]);
    setKeyword('');
    
    toast({
      title: "Alerta adicionado",
      description: `Monitorando a palavra-chave "${keyword}".`,
    });
  };
  
  const handleRemoveAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    toast({
      title: "Alerta removido",
      description: "A palavra-chave foi removida da lista de alertas.",
    });
  };
  
  const handleToggleSound = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, soundEnabled: !alert.soundEnabled } : alert
    ));
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">Baixa</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Média</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">Alta</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          Sistema de Alertas
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              placeholder="Digite uma palavra-chave..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddAlert();
              }}
            />
          </div>
          
          <div>
            <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={handleAddAlert} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="h-[180px] w-full rounded-md border p-2">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
              <AlertCircle className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-center text-sm">
                Nenhum alerta adicionado. Adicione palavras-chave para monitorar durante a reunião.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`flex items-center justify-between p-2 rounded-lg bg-${alert.color}-50 border border-${alert.color}-200`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{alert.keyword}</span>
                    {getPriorityBadge(alert.priority)}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-7 w-7" 
                      onClick={() => handleToggleSound(alert.id)}
                    >
                      {alert.soundEnabled ? (
                        <Volume2 className="h-4 w-4" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-7 w-7 text-red-500 hover:bg-red-100 hover:text-red-600" 
                      onClick={() => handleRemoveAlert(alert.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="pt-2 text-xs text-muted-foreground">
        <p>
          Os alertas serão acionados quando palavras-chave forem detectadas na transcrição.
        </p>
      </CardFooter>
    </Card>
  );
}
