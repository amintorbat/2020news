import { Settings } from '@/types/settings'

export const fakeSettings: Settings = {
  siteName: '2020news',
  siteDescription: 'رسانه چندسکویی خبری ورزشی',
  siteStatus: 'active',

  requireContentApproval: true,
  enableComments: true,

  defaultUserRole: 'editor',

  maxAds: 5,

  maxUploadSizeMB: 20,
  allowedMediaTypes: ['jpg', 'png', 'mp4'],

  enableAuditLog: true,
};