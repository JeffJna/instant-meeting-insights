
import { useState, useEffect } from 'react';
import { AudioDevice } from '@/lib/types';

export function useAudioCapture() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<AudioDevice | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get available audio devices
  useEffect(() => {
    async function getDevices() {
      try {
        // Request permission to get devices
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        
        const audioDevices = deviceList
          .filter(device => device.kind === 'audioinput')
          .map(device => ({
            id: device.deviceId,
            label: device.label || `Microphone ${device.deviceId.substring(0, 5)}...`
          }));
        
        setDevices(audioDevices);
        
        // Select first device by default
        if (audioDevices.length > 0 && !selectedDevice) {
          setSelectedDevice(audioDevices[0]);
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);
        setError('Failed to access audio devices. Please check your permissions.');
      }
    }

    getDevices();
  }, []);

  // Start audio capture
  const startCapture = async () => {
    try {
      if (!selectedDevice) {
        setError('No audio device selected');
        return;
      }

      const constraints = {
        audio: {
          deviceId: selectedDevice.id ? { exact: selectedDevice.id } : undefined,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setAudioStream(stream);
      setIsCapturing(true);
      setError(null);
    } catch (err) {
      console.error('Error starting audio capture:', err);
      setError('Failed to start audio capture. Please check your device settings.');
    }
  };

  // Stop audio capture
  const stopCapture = () => {
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
    setIsCapturing(false);
  };

  return {
    devices,
    selectedDevice,
    setSelectedDevice,
    isCapturing,
    startCapture,
    stopCapture,
    audioStream,
    error
  };
}
