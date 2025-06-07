'use client';
import { useRouter } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';

import { ModelSelector } from '@/components/model-selector';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { PlusIcon, } from './icons';
import { useSidebar } from './ui/sidebar';
import { memo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { type VisibilityType, VisibilitySelector } from './visibility-selector';

function PureChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
  onTabChange,
  currentTab,
}: {
  chatId: string;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
  onTabChange: (tab: 'chat' | 'dashboard' | 'studyplan') => void;
  currentTab: 'chat' | 'dashboard' | 'studyplan';
}) {
  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <div className="flex items-center gap-2">
        <SidebarToggle />
        {currentTab === 'chat' && (!open || windowWidth < 768) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="md:px-2 px-2 md:h-fit"
                onClick={() => {
                  router.push('/');
                  router.refresh();
                }}
              >
                <PlusIcon />
                <span className="md:sr-only">New Chat</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>New Chat</TooltipContent>
          </Tooltip>
        )}
        {currentTab === 'chat' && !isReadonly && (
          <ModelSelector
            selectedModelId={selectedModelId}
            className=""
          />
        )}
        {currentTab === 'chat' && !isReadonly && (
          <VisibilitySelector
            chatId={chatId}
            selectedVisibilityType={selectedVisibilityType}
            className=""
          />
        )}
      </div>
      <div className="flex gap-2 ml-auto">
        <Button
          variant={currentTab === 'chat' ? 'default' : 'outline'}
          onClick={() => onTabChange('chat')}
        >
          Chat
        </Button>
        <Button
          variant={currentTab === 'dashboard' ? 'default' : 'outline'}
          onClick={() => onTabChange('dashboard')}
        >
          Dashboard
        </Button>
        <Button
          variant={currentTab === 'studyplan' ? 'default' : 'outline'}
          onClick={() => onTabChange('studyplan')}
        >
          Study Plan
        </Button>
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader);
