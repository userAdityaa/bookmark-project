import { useRef, useEffect } from 'react';
import { LogOut } from 'lucide-react';

interface UserMenuProps {
  userNameOpen: boolean;
  setUserNameOpen: (open: boolean) => void;
  handleLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
  userNameOpen,
  setUserNameOpen,
  handleLogout
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserNameOpen(false);
      }
    };

    if (userNameOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userNameOpen, setUserNameOpen]);

  return userNameOpen ? (
    <div 
      ref={menuRef}
      className="absolute top-12 right-5 mt-2 w-48 bg-[#1e1e1e] rounded-lg shadow-lg border border-zinc-700 overflow-hidden z-50"
    >
      <div className="z-40">
        <button
          onClick={() => {
            handleLogout();
          }}
          className="z-50 flex items-center gap-3 w-full px-4 py-2 hover:bg-[#343434] text-[#a0a0a0] hover:cursor-pointer"
        >
          <LogOut size={18} />
          <span className="text-[14px]">Log out</span>
        </button>
      </div>
    </div>
  ) : null;
};

export default UserMenu;