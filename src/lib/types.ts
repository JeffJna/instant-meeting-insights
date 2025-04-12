
export type AudioDevice = {
  id: string;
  label: string;
};

export type Transcription = {
  id: string;
  text: string;
  timestamp: number;
  speaker?: string;
  isInterim?: boolean;
};

export type Alert = {
  id: string;
  keyword: string;
  priority: 'low' | 'medium' | 'high';
  color: string;
  soundEnabled: boolean;
};

export type Meeting = {
  id: string;
  title: string;
  date: Date;
  duration: number; // in seconds
  transcriptions: Transcription[];
  alerts: Alert[];
};
