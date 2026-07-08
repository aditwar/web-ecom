import { AppSidebar } from '@/components/app-sidebar';
import {
  SidebarProvider,
} from '@/components/ui/sidebar';

export default function NavbarDashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>
  );
}
