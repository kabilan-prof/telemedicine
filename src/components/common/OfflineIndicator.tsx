import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WifiOff, Wifi, RefreshCw, AlertTriangle } from 'lucide-react';
import { OfflineService } from '@/services/offlineService';
import { useToast } from '@/hooks/use-toast';

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [networkQuality, setNetworkQuality] = useState<'good' | 'poor' | 'offline'>('good');
  const [pendingActions, setPendingActions] = useState(0);
  const { toast } = useToast();
  const offlineService = OfflineService.getInstance();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connection Restored",
        description: "You're back online. Syncing pending actions...",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Connection Lost",
        description: "You're now offline. Actions will be queued for sync.",
        variant: "destructive"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check network quality periodically
    const qualityCheck = setInterval(() => {
      setNetworkQuality(offlineService.getNetworkQuality());
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(qualityCheck);
    };
  }, [toast, offlineService]);

  const handleRetry = () => {
    window.location.reload();
  };

  const getStatusColor = () => {
    if (!isOnline) return 'destructive';
    if (networkQuality === 'poor') return 'secondary';
    return 'default';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (networkQuality === 'poor') return 'Poor Connection';
    return 'Online';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="h-3 w-3" />;
    if (networkQuality === 'poor') return <AlertTriangle className="h-3 w-3" />;
    return <Wifi className="h-3 w-3" />;
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
      <Badge variant={getStatusColor()} className="flex items-center space-x-1">
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </Badge>
      
      {!isOnline && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRetry}
          className="h-6 px-2"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      )}
      
      {pendingActions > 0 && (
        <Badge variant="outline" className="text-xs">
          {pendingActions} pending
        </Badge>
      )}
    </div>
  );
};

export default OfflineIndicator;