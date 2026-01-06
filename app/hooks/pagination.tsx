"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getContactsApi, ContactsPaginatedResponse } from "@/services/contacts-api";

export function useContactsPagination(initialPage = 1, initialPerPage = 10) {
  const [contactsData, setContactsData] = useState<ContactsPaginatedResponse>({
    data: [],
    current_page: initialPage,
    last_page: 1,
    per_page: initialPerPage,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPage = async (page = contactsData.current_page, perPage = contactsData.per_page) => {
    if (loading) return; // prevent spam calls
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Loading page:", page, "limit:", perPage);
      const response = await getContactsApi(page, perPage);
      console.log("✅ API Response:", {
        page: response.current_page,
        per_page: response.per_page,
        total: response.total,
        dataLength: response.data.length,
        last_page: response.last_page
      });
      setContactsData(response);
    } catch (err) {
      setError("Failed to load contacts");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load contacts.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(initialPage, initialPerPage);
  }, []); // empty deps = ONE controlled load, no infinite calls

  return {
    contactsData,
    loading,
    error,
    fetchPage,
    setContactsData,
  };
}
