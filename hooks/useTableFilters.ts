"use client";

import { useMemo, useState } from "react";
import type { WaitlistEntry } from "@/types/waitlist";

type RoleFilter = "ALL" | "ARTISAN" | "CUSTOMER" | "BOTH";
type ContactFilter = "ALL" | "YES" | "NO";

export function useTableFilters() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [contactFilter, setContactFilter] = useState<ContactFilter>("ALL");

  function applyFilters(rows: WaitlistEntry[]): WaitlistEntry[] {
    return useMemo(() => {
      return rows.filter((row) => {
        if (roleFilter !== "ALL" && row.role !== roleFilter) return false;
        if (contactFilter === "YES" && !row.agreesToContact) return false;
        if (contactFilter === "NO" && row.agreesToContact) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          const haystack = `${row.fullName} ${row.email} ${row.city} ${row.country} ${row.serviceInterest}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      });
    }, [rows, roleFilter, contactFilter, search]);
  }

  return {
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    contactFilter,
    setContactFilter,
    applyFilters
  };
}

