import Link from 'next/link'
import React from 'react'

const Logo = () => {
  return (
        <div>
        <Link href="/">
            <img src="/favicon.svg" alt="CodeSync Logo" width={64} height={64} className='max-w-12 max-h-12'/>
        </Link>
    </div>
  )
}

export default Logo