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
      <div className='container w-full h-screen'>

          {
            //<!-- Top -->
          }
        <div className='container w-full flex'>
          <div className="w-2/12 border-r border-gray-300 font-bold text-lg text-center p-4">
            Vos Contacts
          </div>

          <div className=" w-10/12 font-bold text-lg p-4">
            Nom et prénom du contact
          </div>
        </div>

            {
              //<!-- Middle -->
            }
        <div className="bg-gray-100 container w-full h-5/6 flex">
            {
              //<!-- Left side of the grand rectangle (2/10 width) -->
            }
            <div className="w-2/12 border-r border-gray-300 flex flex-col p-2">
              {
                //<!-- List of buttons with spacing -->
                conversations.map((value, index) => <Conversation key={index} name={value} />
                )
              }

            </div>


            {
              //<!-- Right side of the grand rectangle (8/10 width) -->
            }
            <div className="w-10/12 p-2">
            </div>
          </div>

          {
              //<!-- Bottom -->
          }

          <div className="bg-gray-100 border-gray-300 container w-full h-1/6 flex">
              {
                //<!-- Left bottom rectangle -->
              }
              <div className="w-2/12 p-2 border-r border-gray-300 flex items-center justify-center">
                <button className="bg-blue-500 text-white font-bold py-1 px-1 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-700">Ajouter un contact</button>
              </div>

              {
                //<!-- Right bottom rectangle -->
              }
              <div className="w-10/12 p-2">
                <textarea className="w-full text-gray-400" placeholder="Start typing here..."></textarea>
              </div>
            </div>

      </div>
  )
}