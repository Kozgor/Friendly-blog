export const AppLayout = ({ children }) => {
    return (
        <div className='grid grid-cols-[300px_1fr] h-screen max-h-screen'>
            <div className='flex flex-col text-white overflow-hidden'>
                <div className='bg-slate-800'>
                    <div>logo</div>
                    <div>cta button</div>
                    <div>tokens</div>
                </div>
                <div className='flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800'>
                    List of posts</div>
                <div className='bg-cyan-800'>Logoot button</div>
            </div>
            <div>{children}</div>
        </div>
    )
}