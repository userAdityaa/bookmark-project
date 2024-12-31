import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Bookmark {
    name: string;
    icon: string;
  }
  
  interface BookmarkMenuProps {
    bookmarkOpen: boolean;
    setBookmarkOpen: (open: boolean) => void;
    bookmarkList: Bookmark[];
    currentBookmark: Bookmark | null;
    setCurrentBookmark: (bookmark: Bookmark) => void;
    handleGroup: () => void;
    handleDeleteGroup: () => void;
  }
  

const BookmarkMenu: React.FC<BookmarkMenuProps> = ({
  bookmarkOpen,
  setBookmarkOpen,
  bookmarkList,
  currentBookmark,
  setCurrentBookmark,
  handleGroup,
  handleDeleteGroup
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setBookmarkOpen(false);
      }
    };

    if (bookmarkOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [bookmarkOpen, setBookmarkOpen]);

  return bookmarkOpen ? (
    <div 
      ref={menuRef}
      className="absolute top-full left-20 mt-2 w-48 bg-[#1e1e1e] rounded-lg shadow-lg border border-zinc-700 overflow-hidden z-50"
    >
      <div className="py-1 z-40">
        {bookmarkList.map((bookmark, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 px-4 py-2 hover:bg-[#343434] hover:cursor-pointer ${
              currentBookmark?.name === bookmark.name ? 'bg-[#2e2e2e]' : ''
            }`}
            onClick={() => {
              if (currentBookmark?.name !== bookmark.name) {
                setCurrentBookmark(bookmark);
                router.push(`/bookmarks/${bookmark.name}`);
              }
            }}
          >
            <Image
              src={bookmark.icon}
              alt="bookmark icon"
              height={0}
              width={18}
            />
            <span className="text-[#a0a0a0] text-[14px]">{bookmark.name}</span>
          </div>
        ))}
      </div>
      <div className="h-px bg-zinc-700 my-1" />
      <button
        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-[#343434] text-[#a0a0a0] text-sm"
        onClick={handleGroup}
      >
        <Plus className="w-4 h-4" />
        New Group
      </button>
      <button
        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-[#343434] text-[#a0a0a0] text-sm"
        onClick={handleDeleteGroup}
      >
        <Trash2 className="w-4 h-4" />
        Delete Group
      </button>
    </div>
  ) : null;
};

export default BookmarkMenu;