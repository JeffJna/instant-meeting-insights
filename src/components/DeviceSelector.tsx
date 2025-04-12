
import { useState } from 'react';
import { Check, ChevronDown, Mic } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AudioDevice } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DeviceSelectorProps {
  devices: AudioDevice[];
  selectedDevice: AudioDevice | null;
  onSelect: (device: AudioDevice) => void;
  disabled?: boolean;
}

export function DeviceSelector({ 
  devices, 
  selectedDevice, 
  onSelect, 
  disabled = false 
}: DeviceSelectorProps) {
  const [open, setOpen] = useState(false);
  
  if (devices.length === 0) {
    return (
      <Button variant="outline" disabled className="w-full justify-between">
        <div className="flex items-center gap-2">
          <Mic className="h-4 w-4" />
          <span>No devices found</span>
        </div>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <Mic className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{selectedDevice?.label || "Select device"}</span>
          </div>
          <ChevronDown className="h-4 w-4 flex-shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {devices.map((device) => (
          <DropdownMenuItem
            key={device.id}
            onClick={() => {
              onSelect(device);
              setOpen(false);
            }}
            className={cn(
              "cursor-pointer",
              selectedDevice?.id === device.id && "bg-accent"
            )}
          >
            <span className="flex-1 truncate">{device.label}</span>
            {selectedDevice?.id === device.id && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
