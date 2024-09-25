'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';

const Bookmarks = () => {
  const router = useRouter();
  useEffect(() => { 
    const token = localStorage.getItem('token');
    if(!token) { 
      router.push('/login');
    }
  }, [])
  return (
    <div>Temp</div>
  )
}

export default Bookmarks