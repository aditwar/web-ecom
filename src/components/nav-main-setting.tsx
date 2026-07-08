'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { useAppSelector } from '@/redux/hooks';
import { splitStr } from '@/helper/splitStr';

export function NavMainSetting({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const author = useAppSelector((state) => state.author);
  const users = useAppSelector((state) => state.auth);
  return (
    <SidebarGroup>
      <div className="flex w-full gap-3 pb-4 items-center">
        {/* Avatar dengan shadow tipis */}
        <div
          className="w-[50px] h-[50px] rounded-full overflow-hidden
             transition-shadow duration-300
             hover:shadow-lg hover:shadow-black/50
             dark:hover:shadow-lg dark:hover:shadow-white/70"
        >
          <img
            className="w-full h-full object-cover"
            src={
              author.avatar || users.avatar || '/assets/svg/defaultAvatar.svg'
            }
            alt={author.name || users.name || 'Your Name'}
            onError={(e) =>
              (e.currentTarget.src =
                author.avatar ||
                users.avatar ||
                '/assets/svg/defaultAvatar.svg')
            }
          />
        </div>

        <div className="flex flex-col">
          <Link
            href={'/setting'}
            className="group transition flex items-center"
          >
            <span className="relative text-base font-semibold tracking-tight">
              {splitStr(author.name || users.name || 'Your Name', 15)}
              <span
                className="absolute left-0 -bottom-0.5 h-[2px] bg-red-500
                 w-0 transition-all duration-300 ease-in-out
                 group-hover:w-full"
              />
            </span>
          </Link>

          <span className="text-sm font-light text-muted-foreground">
            {splitStr(author.email || users.email || 'your@email.com', 15)}
          </span>
        </div>
      </div>

      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
