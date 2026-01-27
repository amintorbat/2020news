'use client';

import { fakeSettings } from '@/data/fakeSettings';
import { useState } from 'react';

export default function SettingsClient() {
  const [settings, setSettings] = useState(fakeSettings);

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold">تنظیمات سیستم</h1>

      {/* General */}
      <section className="rounded-xl border bg-white p-6 space-y-4">
        <h2 className="font-semibold">تنظیمات عمومی</h2>

        <input
          className="w-full rounded-lg border px-3 py-2 text-sm"
          value={settings.siteName}
          onChange={(e) =>
            setSettings({ ...settings, siteName: e.target.value })
          }
        />

        <textarea
          className="w-full rounded-lg border px-3 py-2 text-sm"
          value={settings.siteDescription}
          onChange={(e) =>
            setSettings({ ...settings, siteDescription: e.target.value })
          }
        />
      </section>

      {/* Content */}
      <section className="rounded-xl border bg-white p-6 space-y-4">
        <h2 className="font-semibold">محتوا</h2>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.requireContentApproval}
            onChange={(e) =>
              setSettings({
                ...settings,
                requireContentApproval: e.target.checked,
              })
            }
          />
          تأیید خبر قبل از انتشار
        </label>
      </section>
    </div>
  );
}