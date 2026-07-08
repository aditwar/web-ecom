import { SettingSidebar } from '@/components/setting-sidebar';
import {
  SidebarProvider,
} from '@/components/ui/sidebar';

export default function NavbarSetting() {
  return (
    <SidebarProvider>
      <SettingSidebar />
    </SidebarProvider>
  );
}
