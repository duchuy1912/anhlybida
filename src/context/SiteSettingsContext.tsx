"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

interface SiteSettingsContextType {
  contactInfo: any;
  loading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  contactInfo: {},
  loading: true,
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [contactInfo, setContactInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "contact_info")
          .single();

        if (data && data.value) {
          const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
          setContactInfo(parsed);
        }
      } catch (err) {
        console.error("Error fetching site settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ contactInfo, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
