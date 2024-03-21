//@ts-ignore
import Conversation from '@/components/conversation'
import Image from 'next/image'

let conversations: string[] = [
  "Thomas",
  "Gilles",
  "Kaoutar",
  "Killian",
  "Gauthier",
  "Sana"
]

export default function Home() {
  return (
    <div className='container mx-auto h-screen'>
      <div className='flex flex-col h-full'>

        { /* Top */}
        <div className='flex justify-center items-center h-1/6 border-b border-gray-300'>
          <h1 className='text-lg font-bold'>Votre conversation avec </h1>
        </div>

        { /* Middle */}
        <div className='flex flex-1'>
          { /* Left side */}
          <div className='w-2/12 border-r border-gray-300 flex flex-col'>
            {conversations.map((value, index) => <Conversation key={index} name={value} />)}
          </div>

          { /* Right side */}
          <div className='w-10/12 bg-gray-100 p-4'>
            {/* Content for the right side */}
          </div>
        </div>

        { /* Bottom */}
        <div className='flex justify-center items-center h-1/6 border-t border-gray-300'>
          <div className='w-2/12'>
            <button className='bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring focus:border-blue-700 transition duration-300'>Ajouter un contact</button>
          </div>
          <div className='w-10/12'>
            <textarea className='w-full h-full p-4 text-gray-400' placeholder='Commencez à taper ici...'></textarea>
          </div>
        </div>

      </div>
    </div>
  )
}
