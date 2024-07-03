import NavBar from '@/components/NavBar'
import React from 'react'

export default function layout({children}:{children:React.ReactNode}) {
  return (
    <div >
     <NavBar />
      {children}
    </div>
  )
}
