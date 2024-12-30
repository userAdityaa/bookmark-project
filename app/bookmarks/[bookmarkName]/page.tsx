'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import axios from 'axios';
import { LogOut, Plus, Trash2 } from 'lucide-react';
import {useRouter} from 'next/navigation';
import { NewGroupDialog } from '@/app/components';

interface ListItem {
    icon: string; 
    name: string; 
    link: string; 
    createdAt: string;
}

const convertDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

const BookmarkPage = () => {
    const [userName, setUserName] = useState<string>('');
    const [userIcon, setUserIcon] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [bookmarkList, setBookmarkList] = useState<{ name: string; icon: string }[]>([]);
    const [currentBookmark, setCurrentBookmark] = useState<{ name: string; icon: string } | null>(null);
    const [bookmarkId, setBookmarkId] = useState<string>('');
    const [inputValue, setInputValue] = useState<string>(''); 
    const [results, setResults] = useState<ListItem[]>([]); 
    const [bookmarkOpen, setBookmarkOpen] = useState<boolean>(false);
    const [userNameOpen, setUserNameOpen] = useState<boolean>(false);
    const [newGroupDialogOpen, setNewGroupDialogOpen] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const router = useRouter();

    const handleNewGroup = async (name: string) => { 
        try { 
            const response = await axios.post(`https://bkmarks.vercel.app/api/bookmarks/${userId}`, {bookmarkName: name}, {
                headers: {"Content-Type": "application/json"}
            })
            console.log("Response data: ", response.data);
            setNewGroupDialogOpen(false);
            window.location.reload();
        } catch (error) { 
            console.error('Error creating new bookmark:', error);
            alert('Failed to create new bookmark. Please try again.');
        }
    }

    const isValidLink = (input: string): boolean => {
        const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/\S*)?$/;
        return urlPattern.test(input.trim());
    };

    const formatDate = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const extractDomainName = (url: string): string => {
        const domain = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
        return domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
    };

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 1000); 
        });
    };

    useEffect(() => { 
        const fetchData = async () => {
            try {
                const userResponse = await axios.get("https://bkmarks.vercel.app/api/user", {
                    headers: {"Content-Type": "application/json"}
                });
                const userData = userResponse.data.user;
                setUserName(userData.name);
                setUserIcon(userData.icon);
                setUserId(userData.id);

                const bookmarkName = window.location.pathname.split('/').pop();
                const bookmarkResponse = await axios.post(
                    `https://bkmarks.vercel.app/api/bookmarks/user/${userData.id}`, 
                    { bookmarkName },
                    { headers: { "Content-Type": "application/json" } }
                );

                const bookmarkData = {
                    name: bookmarkResponse.data.name,
                    icon: bookmarkResponse.data.icon,
                };

                setCurrentBookmark(bookmarkData);
                setBookmarkId(bookmarkResponse.data.id);

                if (bookmarkResponse.data.listItems?.length > 0) { 
                    setResults(bookmarkResponse.data.listItems);
                }

                const bookmarkListResponse = await axios.get(
                    `https://bkmarks.vercel.app/api/user/${userData.id}`, 
                    { headers: { "Content-Type": "application/json" } }
                );

                const bookmarks = bookmarkListResponse.data.map((bookmark: any) => ({
                    name: bookmark.name,
                    icon: bookmark.icon,
                }));
                
                setBookmarkList(bookmarks)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleAddResult = async () => {
        if (inputValue.trim()) {
            let newItem: ListItem;
            const isURL = isValidLink(inputValue);
            const createdAt = formatDate(new Date());
            const isColorCode = /^#[0-9A-Fa-f]{6}$/i.test(inputValue.trim());
            
            if (isColorCode) {
                try {
                    const colorResponse = await fetch(`https://www.colorhexa.com/${inputValue.trim().substring(1)}.json`);
                    const colorData = await colorResponse.json();
    
                    newItem = {
                        icon: '/color_icon.svg', 
                        name: colorData.name || inputValue.trim(), 
                        link: inputValue.trim(),  
                        createdAt,
                    };
                } catch (error) {
                    console.error('Error fetching color data:', error);
                    newItem = {
                        icon: '/default_link.svg', 
                        name: inputValue.trim(),    
                        link: '',
                        createdAt,
                    };
                }
            } else if (isURL) {
                const domainName = extractDomainName(inputValue);
                const iconUrl = `https://logo.clearbit.com/${domainName.toLowerCase()}.com`;
                const isValidIcon = await fetch(iconUrl)
                    .then((response) => response.ok)
                    .catch(() => false);
    
                newItem = {
                    icon: isValidIcon ? iconUrl : '/default_link.svg',
                    name: domainName,
                    link: inputValue.trim(),
                    createdAt,
                };
            } else {
                newItem = {
                    icon: '/text_icon.svg',
                    name: inputValue.trim(),
                    link: '',
                    createdAt,
                };
            }
        
            try { 
                const response = await axios.post(
                    `https://bkmarks.vercel.app/api/list`, 
                    { newItem, bookmarkId }, 
                    { headers: { "Content-Type": "application/json" } }
                );
                
                if (response.status === 200) {
                    setResults(prevResults => [...prevResults, response.data]);
                } else {
                    console.error('Failed to create list item');
                }
            } catch(error) { 
                console.error('Error adding result:', error);
                alert('Error adding result. Please try again.');
            }
            setInputValue('');
        }
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post("https://bkmarks.vercel.app/api/auth/logout", {
                headers: { "Content-Type": "application/json" },
            });
            if (response.status === 200) {
                router.push("/login");
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleAddResult();
        }
    };

    const handleUsernameClick = () => { 
        setUserNameOpen(!userNameOpen)
    }

    const handleBookmarkClick = () => { 
        setBookmarkOpen(!bookmarkOpen);
    }

    const handleGroup = () => { 
        setNewGroupDialogOpen(true);
    }

    const  truncateText = (text: string, maxLength: number): string => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    }
    
    return (
        <>
            <nav className='flex justify-between items-center h-[2.5rem] mt-[1rem] w-[95vw] mx-auto'>
                <div className='flex items-center relative'>
                    <Image src='/logo.png' alt='logo' height={0} width={40} />
                    <Image src='/backslash.png' alt='backslash' height={0} width={30} />
                    <div className='flex items-center justify-center gap-2 hover:bg-[#343434] hover:rounded-3xl p-2' onClick={() => handleBookmarkClick()}>
                        {currentBookmark && (
                            <>
                                <Image src={currentBookmark.icon} alt='bookmark-icon' height={0} width={18} />
                                <p className='text-[#a0a0a0] text-[14px]'>{currentBookmark.name}</p>
                            </>
                        )}
                        <Image src='/arrow-key.svg' alt='arrow key' height={0} width={20} />
                    </div>

                {bookmarkOpen && (
                    <div className="absolute top-full left-20 mt-2 w-48 bg-[#1e1e1e] rounded-lg shadow-lg border border-zinc-700 overflow-hidden z-50">
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
                            >
                            <Trash2 className="w-4 h-4" />
                            Delete Group
                            </button>
                        </div>
                )}

                <NewGroupDialog
                    open={newGroupDialogOpen}
                    onOpenChange={setNewGroupDialogOpen}
                    onSubmit={handleNewGroup}
                />

                </div>
                <div className='flex items-center justify-center gap-2 relative hover:bg-[#343434] hover:rounded-3xl p-2' onClick={() => handleUsernameClick()}>
                    <Image src={userIcon} alt='user profile-icon' height={0} width={18} />
                    <p className='text-[#a0a0a0] font-light text-[14px] mb-[0.2rem]'>{userName}</p>
                    <Image src='/arrow-key.svg' alt='arrow key' height={0} width={20} />
                </div>

                {userNameOpen && (
                    <div className="absolute top-12 right-5 mt-2 w-48 bg-[#1e1e1e] rounded-lg shadow-lg border border-zinc-700 overflow-hidden z-50">
                        <div className="z-40"> 
                            <button
                                onClick={() => {
                                    handleLogout()
                                }}
                                className="z-50 flex items-center gap-3 w-full px-4 py-2 hover:bg-[#343434] text-[#a0a0a0] hover:cursor-pointer"
                            >
                                <LogOut size={18} />
                                <span className="text-[14px]">Log out</span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>
    
            <div className='flex items-center py-8 relative flex-col gap-8'>
                <div className="relative w-[55vw] mt-14">
                    <input 
                        className='border border-zinc-700 bg-[#161616] hover:border-zinc-600 h-[3rem] w-full mx-auto rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-600 px-10 text-[#f0e5e57f] pl-12' 
                        type='text' 
                        placeholder='Insert a link, color, or just plain text...'
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                        onKeyDown={handleKeyDown}
                    />
                    <Image 
                        src='/plus-icon.svg' 
                        alt='plus icon' 
                        height={0} 
                        width={25} 
                        className='absolute top-1/2 left-4 transform -translate-y-1/2 pointer-events-auto cursor-pointer'
                        onClick={handleAddResult}
                    />
                </div>
    
                <div className='flex justify-between items-center border-b border-zinc-700 py-4 w-[55vw] text-[13px] text-[#a0a0a0]'>
                    <div className='flex items-center justify-between w-full'>
                        <p>Title</p>
                        <p>Created At</p>
                    </div>
                </div>
    
                <div className='w-[55vw]'>
                    {results.map((result, index) => (
                        <div 
                            key={index} 
                            className='py-2 text-zinc-300 flex items-center gap-2 justify-between hover:bg-[#343434] hover:px-2 hover:rounded-lg cursor-pointer'
                            onClick={() => {
                                if (result.link) {
                                    const url = result.link.startsWith('http') ? result.link : `http://${result.link}`;
                                    window.open(url, '_blank');
                                } else { 
                                    handleCopy(result.name, index);
                                }
                            }}
                        >
                            <div className='flex items-center gap-2'>
                                <Image src={result.icon} alt='result icon' height={20} width={18} className={/^#[0-9A-Fa-f]{6}$/i.test(result.icon) ? 'rounded-full' : ''} />
                                <p>
                                    {copiedIndex === index ? "Copied!" : truncateText(result.name, 50)}
                                </p>
                                {result.link !== '' && 
                                    <p className='text-[14px] text-[#a0a0a0]'>{result.link}</p>
                                }
                            </div>
                            <p className='text-[13px] text-[#a0a0a0]'>{convertDate(result.createdAt)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default BookmarkPage