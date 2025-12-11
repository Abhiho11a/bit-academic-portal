import '../../App.css'
export default function Loading({msg}){
    return(
        <div className='flex flex-col justify-center items-center'>
            <div className="flex justify-center items-center h-20">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-[#1a3a6f] rounded-full animate-spin"></div>
            </div>
            <h2 className='text-xl'>{msg}</h2>
        </div>
    )
}