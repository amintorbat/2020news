// types/settings.ts
export interface Settings {
    siteName: string;
    siteDescription: string;
    siteStatus: 'active' | 'maintenance' | 'disabled';
  
    requireContentApproval: boolean;
    enableComments: boolean;
  
    defaultUserRole: 'admin' | 'editor' | 'user';
  
    maxAds: number;
  
    maxUploadSizeMB: number;
    allowedMediaTypes: string[];
  
    enableAuditLog: boolean;
  }