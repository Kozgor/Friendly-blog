import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@auth0/nextjs-auth0/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from '@fortawesome/free-solid-svg-icons'

export const AppLayout = ({ children }) => {
    const { user } = useUser()

    return (
        <div className='grid grid-cols-[300px_1fr] h-screen max-h-screen'>
            <div className='flex flex-col text-white overflow-hidden'>
                <div className='bg-slate-800 px-2'>
                    <div>logo</div>
                    <Link
                        href='/post/new'
                        className='bg-green-400 tracking-wider w-full text-center text-white font-bold cursor-pointer uppercase px-4 py-2 py-2 rounded-md hover:bg-green-600 transition-colors block'>
                        New post
                    </Link>
                    <Link href='/token-topup' className='block mt-2 text-center'>
                        <FontAwesomeIcon icon={faCoins} className='text-yellow-500 ' />
                        <span className='pl-1'> 0 Tokens available</span>
                    </Link>
                </div>
                <div className='flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800'>
                    List of posts</div>
                <div className='flex items-center border-t border-t-black/50 gap-2 h-20 px-2 bg-cyan-800'>
                    {!!user ? <>
                        <div className='min-w-[50px]'>
                            <Image
                                src={user.picture}
                                alt={user.name}
                                height={50} width={50}
                                className='rounded-full'
                            />
                        </div>
                        <div className='flex-1'>
                            <div className='font-bold'>{user.email}</div>
                            <Link className='text-sm' href='/api/auth/logout'>Logout</Link>
                        </div>
                    </> : <Link href='/api/auth/login'>Login</Link>}
                </div>
            </div>
            <div>{children}</div>
        </div>
    )
}