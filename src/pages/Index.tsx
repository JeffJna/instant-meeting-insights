
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { AudioCapture } from '@/components/AudioCapture';
import { TranscriptionView } from '@/components/TranscriptionView';
import { AlertSystem } from '@/components/AlertSystem';
import { MinutesGenerator } from '@/components/MinutesGenerator';
import { useTranscription } from '@/hooks/useTranscription';
import { Alert, Transcription } from '@/lib/types';
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', keyword: 'decisão', priority: 'high', color: 'red', soundEnabled: true },
    { id: '2', keyword: 'orçamento', priority: 'medium', color: 'yellow', soundEnabled: true },
    { id: '3', keyword: 'prazo', priority: 'medium', color: 'yellow', soundEnabled: true },
    { id: '4', keyword: 'aprovado', priority: 'low', color: 'green', soundEnabled: true }
  ]);
  
  const {
    transcriptions,
    isTranscribing,
    startTranscription,
    stopTranscription,
    clearTranscriptions
  } = useTranscription(audioStream);

  // Play alert sound when a keyword is detected
  useEffect(() => {
    if (transcriptions.length === 0 || !isTranscribing) return;
    
    const latestTranscription = transcriptions[transcriptions.length - 1];
    
    // Check if any alert keywords are in the latest transcription
    const matchedAlert = alerts.find(alert => {
      if (!alert.soundEnabled) return false;
      
      const regex = new RegExp(`\\b${alert.keyword}\\b`, 'gi');
      return regex.test(latestTranscription.text);
    });
    
    if (matchedAlert) {
      // Play a sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YWoGAACBhYqFbF1fdJOsrJiDbXBK/9MdKsIQFdZldpvDqJN5aW9TQc8pBsoBB9dubJW2qpJ6Z2tKOcgnIdkHDd5ib5e5q5J3ZGRAOA0ZeuBZTIaCZ2ZwlbDHu6uahHRcU0s2DEZhn2wTUf/8vaqdkoJ9i7rY19n14/z9kFZI/N8qaLVev7COPMoKUphe0bmTYvFz7QS8DpxXcUcc6OpKsps/iYn0lODZ9ORZvA1ICJ73qoQgB9nZVHWJcfDuCYQaFgHD87W3snXuYLztkISZbsR+ke4Ywd9O0PXr9/5TUEGXxwdHWkO37vb+9/Xp+gtoKBNNv5vedUR9ObMNE1MaElWDXP9lE3C0qpCegKXlcY9mvHamrJpiXlRXWVlneZOlt6+olZGYnKWak7J4iY+VmpOVj/2YQAuFu740lOZtc5330Pe0MD5MQAwsxJLbn4xjSCX6/IbmZXAnCOoLolW+x+LAQPW1Ul18e3WGhHptYvXMDC1mas7Wxaekg5SUhpWTgtykHys90FA8uhUX9/gVrBehZ29xYWkFZPGU0vadeJqhZlEyG/8OkR2GDxPbb8u1pokK/s5WRiEYg8l+x1pS1Fwk+zFrMzXMVl+2zH+MgwT1UzADYreWvI21J8Xpvqpep5lzVBKur32qn8J5fbbq28GHVFp1tsaE0UqYa/qUScPowuOmHbYoNR7rYcmwl5+jk2Hr9dpnzIFEEE1JOhVq9bCsmOAHQAHeBX5dOzWeJnBur/lNWaZ9+NZXBRJwdXKdasW9wI3kNyclWhfNBzPN1+keZAqAwtGBdqK1JOJwP2GFrfV0qqn1a4mVlugfLD9VMDehEPJ7EZTACVzt8wNwW1UOfledmBFJDTdbMUjjJtX1dpDe/7MLvsSd5l/LJMe9yXDUbK7jdDM920evKw7tzqiEPXuEZ62Or9W/fFmh9Xmr9PGUSfKGIw5SY4fXolMoOZc69wNXMYMhiL2cfLTEQpCPz48OYj0R0nGntiWrragevwLBLRBrsi+AmmH28SQxGecL6YrIcx/bNraNQY9GMMZgRnmF1Lx+yXczZE4kQ8DWEkJ9U0cMlRQWG+xn5eIX2n4YFCQw8MuHiXOMqA10QRui7yY2jE3FbFjIWm+kpZ/OYLc97mARtU8rFQkGNVBHwV5LIBgpOUh1YqXRUEuKCwPiEDZMS0IjIRkNYx3Kn7HBeC5DzfEHOpsFdSMeQDEik8A1gJub05cOJIBQex0P4MFlIDoXJZu/67Vud7Huqz05+lXEYEsdFvfoGT9I2H88CypJ3aprEwL4nIz6yZGVh+zMnKO76gu9w5LgtRKw04zVRUJL34ICIZRLQWgWnsjmcKrRu0tzKGEwrO2Fh/6Syrg9zwR8PCTdpJXS7Kj1vVb/bebZ0LhN2dYM7aZE4cAUqXNHt0bXfLbnkicdHXEimGLFJGO3sJaou7l/5ZkIj2kK7+yBGqwRvvnk1pAk/y8O3Tqklu+xX6pbguzCfZ+SWwaG3SIlG093ROnW5cLtPc0XYX+NLTYjEuokCdPKDuAHDHLMAn26EvspPSMJFMx8PdQtWGz2bKdRwnLzhC87BQcd9abyZkZHUkMttNuST2+w4WGo1rYS3bSSrZjkdKGB4+w1momzJbx7rezNTj6F5QYBGMUSsmjdINKa0Vj1gfCb5ON2JsygPsRGJmY2D/r6xqXvm/AoAK6+qpgvFc5s88ETLtmQH0VWr2v43vwv0JsA5IveXRFaBud2FUQRbdvApPlmFoEJPAJMSSUra+joOwjZnIZJXiQQT+O6lJQro/YplUhkl7vMaWyuh2w0WnSSK+/R+wUgOb9IO92a58b7r+uvRQqbMP6O+LWu9XJ+kpR8RxU++uaurru54Kuv0Vz7kaXh08C5N0j2q+fJhv7p/rC6AAABAAIAAgADAAMABAAEAAQABQAFAAUABgAGAAYABgAHAAcABwAG');
      audio.play();
    }
  }, [transcriptions, alerts, isTranscribing]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: Audio controls and alerts */}
          <div className="md:col-span-1 space-y-6">
            <AudioCapture 
              onStreamChange={setAudioStream}
              isTranscribing={isTranscribing}
              onTranscribeStart={startTranscription}
              onTranscribeStop={stopTranscription}
            />
            <AlertSystem alerts={alerts} setAlerts={setAlerts} />
          </div>
          
          {/* Right column: Transcription and minutes */}
          <div className="md:col-span-2 space-y-6">
            <TranscriptionView 
              transcriptions={transcriptions} 
              alerts={alerts}
              isTranscribing={isTranscribing}
            />
            <MinutesGenerator transcriptions={transcriptions} />
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-6 text-center text-sm text-gray-500">
          Meeting Insights © {new Date().getFullYear()} - Developed with ❤️
        </div>
      </footer>
    </div>
  );
};

export default Index;
