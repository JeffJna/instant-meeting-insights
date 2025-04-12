
import { useState, useEffect, useRef } from 'react';
import { Transcription } from '@/lib/types';

// Mock function for real-time transcription
// In a real app, this would connect to Amazon Transcribe or similar service
export function useTranscription(audioStream: MediaStream | null) {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // For demo purposes, we'll simulate transcription with random phrases
  const mockPhrases = [
    "Vamos começar a reunião de hoje.",
    "Precisamos discutir o novo projeto.",
    "Quais são os próximos passos?",
    "Vamos definir os prazos para entrega.",
    "Como estão os resultados do trimestre?",
    "Alguém tem alguma pergunta?",
    "Podemos agendar a próxima reunião.",
    "Precisamos de mais recursos para este projeto.",
    "A equipe está pronta para começar?",
    "Quem será responsável por esta tarefa?",
    "Vamos revisar o orçamento.",
    "Os clientes estão satisfeitos com o serviço.",
    "Qual é a nossa prioridade agora?",
    "Precisamos melhorar nossos processos internos.",
    "Esta decisão é importante para o futuro da empresa."
  ];
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const startTranscription = () => {
    if (!audioStream) {
      setError('No audio stream available for transcription');
      return;
    }
    
    setIsTranscribing(true);
    setError(null);
    
    // In a real implementation, this would connect to Amazon Transcribe
    // For this demo, we'll simulate transcription with a timer
    intervalRef.current = setInterval(() => {
      const randomPhrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
      
      const newTranscription: Transcription = {
        id: Date.now().toString(),
        text: randomPhrase,
        timestamp: Date.now(),
        isInterim: false
      };
      
      setTranscriptions(prev => [...prev, newTranscription]);
    }, 3000); // Add a new transcription every 3 seconds
  };
  
  const stopTranscription = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTranscribing(false);
  };
  
  const clearTranscriptions = () => {
    setTranscriptions([]);
  };
  
  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return {
    transcriptions,
    isTranscribing,
    startTranscription,
    stopTranscription,
    clearTranscriptions,
    error
  };
}
