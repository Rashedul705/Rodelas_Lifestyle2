
'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

type SidebarContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
  isDesktop: boolean;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const value = {
    isOpen: isDesktop || isOpen,
    setIsOpen,
    toggle,
    isDesktop,
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}


const SidebarTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ asChild = false, ...props }, ref) => {
    const { toggle, isDesktop } = useSidebar();
    const Comp = asChild ? Slot : 'button';

    if (isDesktop) {
        return null;
    }

    return <Comp ref={ref} onClick={toggle} {...props} />;
});
SidebarTrigger.displayName = 'SidebarTrigger';

const SidebarClose = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ asChild = false, ...props }, ref) => {
    const { setIsOpen, isDesktop } = useSidebar();
    const Comp = asChild ? Slot : 'button';

    if (isDesktop) {
        return null;
    }

    return <Comp ref={ref} onClick={() => setIsOpen(false)} {...props} />;
});
SidebarClose.displayName = 'SidebarClose';

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isOpen, isDesktop } = useSidebar();
  
  return (
    <div
      ref={ref}
      className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transition-transform duration-300 ease-in-out md:translate-x-0',
        {
          'translate-x-0': isOpen,
          '-translate-x-full': !isOpen && !isDesktop,
        },
        className
      )}
      {...props}
    />
  );
});
Sidebar.displayName = 'Sidebar';

const SidebarOverlay = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const { isOpen, isDesktop, setIsOpen } = useSidebar();

    if (isDesktop || !isOpen) {
        return null;
    }

    return (
        <div
            ref={ref}
            className={cn(
                'fixed inset-0 z-30 bg-black/50 md:hidden',
                className
            )}
            onClick={() => setIsOpen(false)}
            {...props}
        />
    );
});
SidebarOverlay.displayName = 'SidebarOverlay';

export {
  Sidebar,
  SidebarTrigger,
  SidebarClose,
  SidebarOverlay,
};
