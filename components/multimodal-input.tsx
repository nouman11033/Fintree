'use client';

import type {
  Attachment,
  ChatRequestOptions,
  CreateMessage,
  Message,
} from 'ai';
import cx from 'classnames';
import type React from 'react';
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
  type ChangeEvent,
  memo,
} from 'react';
import { toast } from 'sonner';
import { useLocalStorage, useWindowSize } from 'usehooks-ts';

import { sanitizeUIMessages } from '@/lib/utils';

import { ArrowUpIcon, PaperclipIcon, StopIcon, CrossIcon } from './icons';
import { PreviewAttachment } from './preview-attachment';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { SuggestedActions } from './suggested-actions';
import equal from 'fast-deep-equal';
import { VideoIcon, FileTextIcon, ClipboardListIcon } from './ui/lms-icons';

const DUMMY_CONTENT = [
  {
    type: 'video',
    label: 'BlueBox - Derivatives Example',
    link: 'https://dummy.link/bluebox-derivatives',
    icon: <VideoIcon className="w-4 h-4 text-blue-500" />,
    badge: 'BlueBox',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    type: 'video',
    label: 'Crash Course - Ethics',
    link: 'https://dummy.link/crashcourse-ethics',
    icon: <VideoIcon className="w-4 h-4 text-pink-500" />,
    badge: 'Crash',
    color: 'bg-pink-100 text-pink-800',
  },
  {
    type: 'note',
    label: 'Juke Notes - FRA',
    link: 'https://dummy.link/juke-notes-fra',
    icon: <FileTextIcon className="w-4 h-4 text-purple-500" />,
    badge: 'Juke',
    color: 'bg-purple-100 text-purple-800',
  },
  {
    type: 'test',
    label: 'Weekly Test - Quant',
    link: 'https://dummy.link/weekly-test-quant',
    icon: <ClipboardListIcon className="w-4 h-4 text-orange-500" />,
    badge: 'Test',
    color: 'bg-orange-100 text-orange-800',
  },
];

function getAtTriggerInfo(input: string, selectionStart: number) {
  // Find the last @ before the cursor, and return the query after it
  const before = input.slice(0, selectionStart);
  const atIdx = before.lastIndexOf('@');
  if (atIdx === -1) return null;
  // Only trigger if @ is at start or after a space
  if (atIdx > 0 && !/\s/.test(before[atIdx - 1])) return null;
  const query = before.slice(atIdx + 1);
  if (/[^\w\s-]/.test(query)) return null; // stop on special chars
  return { atIdx, query };
}

interface AtContentItem {
  type: string;
  label: string;
  link: string;
  icon: React.ReactNode;
  badge: string;
  color: string;
}

function AtContentDropdown({
  items,
  onSelect,
  query,
  textareaRef,
  selectedIndex = 0,
}: {
  items: AtContentItem[];
  onSelect: (item: AtContentItem) => void;
  query: string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  selectedIndex?: number;
}) {
  // Position dropdown below textarea
  return (
    <div className="absolute left-0 bottom-14 z-50 w-full max-w-lg bg-popover border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg p-2 flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2">
      {items.length === 0 ? (
        <div className="text-xs text-muted-foreground px-2 py-1">No matches</div>
      ) : (
        items.map((item, idx) => (
          <button
            key={item.label}
            type="button"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${selectedIndex === idx ? 'bg-blue-100 dark:bg-blue-900/40' : 'hover:bg-muted/60'}`}
            onClick={() => onSelect(item)}
          >
            <span className={`rounded px-2 py-0.5 text-xs font-semibold ${item.color}`}>{item.badge}</span>
            {item.icon}
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))
      )}
    </div>
  );
}

function PureMultimodalInput({
  chatId,
  input,
  setInput,
  isLoading,
  stop,
  attachments,
  setAttachments,
  messages,
  setMessages,
  append,
  handleSubmit,
  className,
}: {
  chatId: string;
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  messages: Array<Message>;
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = '98px';
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    'input',
    '',
  );

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || '';
      setInput(finalValue);
      adjustHeight();
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);
  const [showAtDropdown, setShowAtDropdown] = useState(false);
  const [atQuery, setAtQuery] = useState('');
  const [atIdx, setAtIdx] = useState(-1);
  const [filteredContent, setFilteredContent] = useState(DUMMY_CONTENT);
  const [selectedRefs, setSelectedRefs] = useState<AtContentItem[]>([]);
  const [dropdownIndex, setDropdownIndex] = useState(0);

  const submitForm = useCallback(() => {
    window.history.replaceState({}, '', `/chat/${chatId}`);

    handleSubmit(undefined, {
      experimental_attachments: attachments,
    });

    setAttachments([]);
    setLocalStorageInput('');
    resetHeight();

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [
    attachments,
    handleSubmit,
    setAttachments,
    setLocalStorageInput,
    width,
    chatId,
  ]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType: contentType,
        };
      }
      const { error } = await response.json();
      toast.error(error);
    } catch (error) {
      toast.error('Failed to upload file, please try again!');
    }
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined,
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error('Error uploading files!', error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setAttachments],
  );

  useEffect(() => {
    if (!textareaRef.current) return;
    const handler = (e: KeyboardEvent) => {
      if (!textareaRef.current) return;
      const selectionStart = textareaRef.current.selectionStart;
      const info = getAtTriggerInfo(input, selectionStart);
      if (info) {
        setShowAtDropdown(true);
        setAtQuery(info.query);
        setAtIdx(info.atIdx);
        setFilteredContent(
          DUMMY_CONTENT.filter((item) =>
            item.label.toLowerCase().includes(info.query.toLowerCase())
          )
        );
        setDropdownIndex(0);
      } else {
        setShowAtDropdown(false);
        setAtQuery('');
        setAtIdx(-1);
      }
    };
    textareaRef.current.addEventListener('keyup', handler);
    return () => textareaRef.current?.removeEventListener('keyup', handler);
  }, [input]);

  // Keyboard navigation for dropdown
  useEffect(() => {
    if (!showAtDropdown) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setDropdownIndex((i) => (i + 1) % filteredContent.length);
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        setDropdownIndex((i) => (i - 1 + filteredContent.length) % filteredContent.length);
        e.preventDefault();
      } else if (e.key === 'Enter' && filteredContent.length > 0) {
        handleSelectAtItem(filteredContent[dropdownIndex]);
        e.preventDefault();
      } else if (e.key === 'Escape') {
        setShowAtDropdown(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAtDropdown, filteredContent, dropdownIndex]);

  const handleSelectAtItem = (item: AtContentItem) => {
    setSelectedRefs((refs) => [...refs, item]);
    // Remove @... from input
    if (!textareaRef.current) return;
    const before = input.slice(0, atIdx);
    const after = input.slice(textareaRef.current.selectionStart);
    setInput(before + after);
    setShowAtDropdown(false);
    setAtQuery('');
    setAtIdx(-1);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleRemoveRef = (idx: number) => {
    setSelectedRefs((refs) => refs.filter((_, i) => i !== idx));
  };

  const handleSend = () => {
    // Merge chips and text into message
    let msg = '';
    if (selectedRefs.length > 0) {
      msg += `${selectedRefs.map(ref => `@[${ref.label}](${ref.link})`).join(' ')} `;
    }
    msg += input.trim();
    setSelectedRefs([]);
    setInput(msg);
    submitForm();
  };

  return (
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 &&
        attachments.length === 0 &&
        uploadQueue.length === 0 && (
          <SuggestedActions append={append} chatId={chatId} />
        )}

      {showAtDropdown && (
        <AtContentDropdown
          items={filteredContent}
          onSelect={handleSelectAtItem}
          query={atQuery}
          textareaRef={textareaRef}
          selectedIndex={dropdownIndex}
        />
      )}

      <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
      />

      {(attachments.length > 0 || uploadQueue.length > 0) && (
        <div className="flex flex-row gap-2 overflow-x-scroll items-end">
          {attachments.map((attachment) => (
            <PreviewAttachment key={attachment.url} attachment={attachment} />
          ))}

          {uploadQueue.map((filename) => (
            <PreviewAttachment
              key={filename}
              attachment={{
                url: '',
                name: filename,
                contentType: '',
              }}
              isUploading={true}
            />
          ))}
        </div>
      )}

      {selectedRefs.length > 0 && (
        <div className="flex flex-row flex-wrap gap-2 mb-1 px-1">
          {selectedRefs.map((ref, idx) => (
            <span key={ref.label + idx} className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${ref.color} border border-zinc-200 dark:border-zinc-700`}>
              {ref.icon}
              {ref.label}
              <button type="button" className="ml-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200" onClick={() => handleRemoveRef(idx)}>
                <CrossIcon size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2 px-3 py-2 bg-background border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow transition-all focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-2 focus-within:ring-offset-background">
        <Textarea
          ref={textareaRef}
          placeholder="Send a message..."
          value={input}
          onChange={handleInput}
          className={cx(
            'min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none !text-base bg-transparent border-none shadow-none rounded-xl px-4 py-2 transition placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none',
            className,
          )}
          rows={2}
          autoFocus
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              if (isLoading) {
                toast.error('Please wait for the model to finish its response!');
              } else {
                handleSend();
              }
            }
          }}
        />
      </div>

      <div className="absolute bottom-0 p-2 w-fit flex flex-row justify-start">
        <AttachmentsButton fileInputRef={fileInputRef} isLoading={isLoading} />
      </div>

      <div className="absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-end">
        {isLoading ? (
          <StopButton stop={stop} setMessages={setMessages} />
        ) : (
          <SendButton
            input={input}
            submitForm={handleSend}
            uploadQueue={uploadQueue}
          />
        )}
      </div>
    </div>
  );
}

export const MultimodalInput = memo(
  PureMultimodalInput,
  (prevProps, nextProps) => {
    if (prevProps.input !== nextProps.input) return false;
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (!equal(prevProps.attachments, nextProps.attachments)) return false;

    return true;
  },
);

function PureAttachmentsButton({
  fileInputRef,
  isLoading,
}: {
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  isLoading: boolean;
}) {
  return (
    <Button
      className="rounded-md rounded-bl-lg p-[7px] h-fit dark:border-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-200"
      onClick={(event) => {
        event.preventDefault();
        fileInputRef.current?.click();
      }}
      disabled={isLoading}
      variant="ghost"
    >
      <PaperclipIcon size={14} />
    </Button>
  );
}

const AttachmentsButton = memo(PureAttachmentsButton);

function PureStopButton({
  stop,
  setMessages,
}: {
  stop: () => void;
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
}) {
  return (
    <Button
      className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
      onClick={(event) => {
        event.preventDefault();
        stop();
        setMessages((messages) => sanitizeUIMessages(messages));
      }}
    >
      <StopIcon size={14} />
    </Button>
  );
}

const StopButton = memo(PureStopButton);

function PureSendButton({
  submitForm,
  input,
  uploadQueue,
}: {
  submitForm: () => void;
  input: string;
  uploadQueue: Array<string>;
}) {
  return (
    <Button
      className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
      onClick={(event) => {
        event.preventDefault();
        submitForm();
      }}
      disabled={input.length === 0 || uploadQueue.length > 0}
    >
      <ArrowUpIcon size={14} />
    </Button>
  );
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length)
    return false;
  if (prevProps.input !== nextProps.input) return false;
  return true;
});
