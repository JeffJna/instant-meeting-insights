
import { BarChart2, Mic, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

export function Header() {
  const isMobile = useIsMobile();

  return (
    <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Mic className="h-6 w-6" />
          <h1 className="text-xl font-bold">Meeting Insights</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isMobile && (
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <BarChart2 className="h-5 w-5 mr-1" />
              <span>Dashboard</span>
            </Button>
          )}
          
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <Settings className="h-5 w-5 mr-1" />
            {!isMobile && <span>Settings</span>}
          </Button>
        </div>
      </div>
    </header>
  );
}
