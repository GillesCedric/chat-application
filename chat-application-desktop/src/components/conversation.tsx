import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"


export default function Conversation(props: { name: string }) {
  return (
    <button className="bg-blue-500 text-white font-bold py-2 px-4 mb-2 hover:bg-red-600 focus:outline-none focus:ring focus:border-blue-700">{props.name}</button>
  )
}

