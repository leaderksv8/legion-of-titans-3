import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import ContactModal from "@/features/contact/ContactModal";

type Ctx = {
  open: boolean;
  openContact: () => void;
  closeContact: () => void;
};

const ContactModalContext = createContext<Ctx | null>(null);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const value = useMemo<Ctx>(
    () => ({
      open,
      openContact: () => setOpen(true),
      closeContact: () => setOpen(false),
    }),
    [open]
  );

  return (
    <ContactModalContext.Provider value={value}>
      {children}
      <ContactModal open={open} onClose={() => setOpen(false)} />
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const ctx = useContext(ContactModalContext);
  if (!ctx) throw new Error("useContactModal must be used within ContactModalProvider");
  return ctx;
}

