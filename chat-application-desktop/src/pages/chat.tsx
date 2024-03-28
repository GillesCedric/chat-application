import Conversation from '../components/conversation'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { notify } from '../components/toastify'

let conversations: string[] = [
  "Thomas",
  "Gilles",
  "Kaoutar",
  "Killian",
  "Gauthier",
  "Sana",
  "Johan"
]

export default function Home() {
  return (
    <div className='container mx-auto h-screen bg-gray-200'>
      <ToastContainer /> {/* Inclure le composant ToastContainer pour afficher les notifications toast */}
      <div className='flex flex-col h-full'>

        { /* Top */}
        <div className='flex justify-center items-center h-1/6 border-b border-gray-300 bg-blue-100'>
          <h1 className='text-lg font-bold text-blue-800'>Votre conversation avec </h1>
          <button onClick={() => notify("Test Notification", "error")} className="ml-2 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring focus:border-blue-700 transition duration-300">Test Notification</button>
        </div>

        { /* Middle */}
        <div className='flex flex-1 bg-white'>
          { /* Left side */}
          <div className='w-2/12 border-r border-gray-300 flex flex-col bg-blue-50'>
            {conversations.map((value, index) => <Conversation key={index} name={value} />)}
          </div>

          { /* Right side */}
          <div className='w-10/12 bg-gray-100 p-4'>
            {/* Content for the right side */}
          </div>
        </div>

        { /* Bottom */}
        <div className='flex justify-center items-center h-1/6 border-t border-gray-300 bg-blue-100'>
          <div className='w-2/12'>
            <button className='bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring focus:border-blue-700 transition duration-300'>Ajouter un contact</button>
          </div>
          <div className='w-10/12'>
            <textarea className='w-full h-full p-4 text-gray-400 bg-gray-200' placeholder='Commencez à taper ici...'></textarea>

          </div>
        </div>

      </div>
    </div>
  )
}
