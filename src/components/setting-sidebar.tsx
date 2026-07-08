"use client"

import * as React from "react"
import {
  AudioWaveform,
  Bot,
  KeyRound,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  IdCard,
  ShieldUser,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import Image from "next/image"
import Link from "next/link"
import { NavMainSetting } from "./nav-main-setting";

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/defaultAvatar.svg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Profile Setting',
      url: '#',
      icon: IdCard,
      isActive: true,
      items: [
        {
          title: 'Public Profile',
          url: '/setting/publicprofile',
        },
        {
          title: 'Account',
          url: '/setting/account',
        },
        {
          title: 'Accessibility',
          url: '/setting/accessibility',
        },
        {
          title: 'Notifications',
          url: '/setting/notifications',
        },
      ],
    },
    {
      title: 'Access',
      url: '#',
      icon: KeyRound,
      items: [
        {
          title: 'Billing and licensing',
          url: '/setting/billinglicensing',
        },
        {
          title: 'Email',
          url: '/setting/email',
        },
        {
          title: 'Authentication',
          url: '/setting/password',
        },
        {
          title: 'Sessions',
          url: '/setting/sessions',
        },
        {
          title: 'SSH and GPG keys',
          url: '/setting/ssh-gpg',
        },
      ],
    },
    {
      title: 'Code and automation',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Repositories',
          url: '/setting/repositories',
        },
        {
          title: 'Codespaces',
          url: '/setting/codespaces',
        },
        {
          title: 'Models',
          url: '/setting/models',
        },
        {
          title: 'Packages',
          url: '/setting/packages',
        },
      ],
    },
    {
      title: 'Security',
      url: '#',
      icon: ShieldUser,
      items: [
        {
          title: 'Code security',
          url: '/setting/codesecurity',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};

export function SettingSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <>
      <div className="">
        <div className="">
          <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="p-[20px] mt-[10px]">
                    <Link href={'/'}>
                      <Image
                        src="/assets/svg/logo.svg"
                        alt="Logo"
                        height={1000}
                        width={1000}
                        priority={true}
                        className="h-[20px] w-auto hover:drop-shadow-[0_0_0.3rem_#ffffff]"
                      />
                      <span className="text-base font-semibold">adit_war</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
              <NavMainSetting items={data.navMain} />
            </SidebarContent>
            <SidebarRail />
          </Sidebar>
        </div>
      </div>
    </>
  );
}
