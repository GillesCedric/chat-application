import Conversation from '@/components/conversation'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>

        {
          //<!-- Page content -->
        }
        <div className="bg-gray-100 p-2">
          <div className="container mx-auto flex">
            {
              //<!-- Left top rectangle -->
            }
            <div className="w-1/12 p-2 border-r border-gray-300">
              <h2 className="font-bold text-lg text-center">Vos Contacts</h2>
            </div>

            {
              //<!-- Right top rectangle -->
            }
            <div className="w-11/12 p-2">
              <h2 className="font-bold ml-4">Nom et prénom du contact</h2>
            </div>
          </div>
        </div>

        {
          //<!-- Grand rectangle -->
        }
        <div className="bg-gray-100 p-2">
          <div className="container mx-auto flex">
            {
              //<!-- Left side of the grand rectangle (2/10 width) -->
            }
            <div className="w-1/12 p-2 border-r border-gray-300 flex flex-col">
              {
                //<!-- List of buttons with spacing -->
              }
              <Conversation />
              <Conversation />
              <Conversation />
              <Conversation />
              <Conversation />
              <Conversation />

            </div>
          </div>

          {
            //<!-- Right side of the grand rectangle (8/10 width) -->
          }
          <div className="w-11/12 p-2">
          </div>
        </div>


        <div className="bg-gray-100 border-b border-gray-300 p-2 absolute inset-x-0 bottom-11">
          <div className="container mx-auto flex">
            {
              //<!-- Left bottom rectangle -->
            }
            <div className="w-1/12 p-2 border-r border-gray-300">
              <button className="bg-blue-500 text-white font-bold py-1 px-1 rounded-full hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-700">Ajouter un contact</button>
            </div>

            {
              //<!-- Right bottom rectangle -->
            }
            <div className="w-11/12 p-2">
              <textarea className="w-full text-gray-400" placeholder="Start typing here..."></textarea>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
