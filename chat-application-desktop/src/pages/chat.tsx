import Conversation from '../components/conversation'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { notify } from '../components/toastify'
import { useEffect, useState } from 'react';
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
  const [darkMode, setDarkMode] = useState(false);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`container mx-auto min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`} style={{ height: `${windowHeight}px` }}>
      <ToastContainer />
      <div className='flex flex-col h-full'>

        {/* Top */}
        <div className={`flex justify-center items-center h-1/6 border-b border-gray-300 ${darkMode ? 'bg-gray-900' : 'bg-blue-100'}`}>
          <h1 className='text-lg font-bold'>{darkMode ? 'Votre conversation en mode sombre' : 'Votre conversation avec'}</h1>
          <button onClick={() => notify("Notification", "error")} className={`ml-2 ${darkMode ? 'bg-blue-500' : 'bg-blue-500 text-white'} text-white font-bold py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring focus:border-blue-700 transition duration-300`}>Test Notification</button>
        </div>

        {/* Middle */}
        <div className={`flex flex-1 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Left side */}
          <div className={`w-full sm:w-2/12 border-r border-gray-300 flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
            {conversations.map((value, index) => <Conversation key={index} name={value} />)}
          </div>

          {/* Right side */}
          <div className={`w-full sm:w-10/12 p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            {/* Content for the right side */}
          </div>
        </div>

        {/* Bottom */}
        <div className={`flex justify-center items-center h-1/6 border-t border-gray-300 ${darkMode ? 'bg-gray-900' : 'bg-blue-100'}`}>
          <div className='w-full sm:w-2/12 flex justify-center'>
            <button onClick={toggleDarkMode} className={`bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring focus:border-blue-700 transition duration-300`}>{darkMode ? 'Mode Clair' : 'Mode Sombre'}</button>
          </div>
          <div className='w-full sm:w-10/12'>
            {/* Fixed height textarea */}
            <textarea className={`w-full h-20 p-4 text-gray-400 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} resize-none`} placeholder='Commencez à taper ici...'></textarea>
          </div>
        </div>
      </div>
    </div >
  );
} 