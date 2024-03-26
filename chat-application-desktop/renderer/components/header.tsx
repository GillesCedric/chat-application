import React from "react"
import Image from "next/image"
import Link from "next/link"


export default function Header() {
	return (
		<header className="bg-gray-100 py-4">
			<div className="container mx-auto flex items-center justify-between">
				<div className="flex items-center space-x-8">
					<Image width={40} height={40} alt="Forum Icon" src="./forum_icon.svg" className="ml-4" />
				</div>
				<span className="font-bold text-lg text-center">ChatCommunication</span>
				<div className="flex items-center space-x-4">
					<Image width={40} height={40} alt="Information Icon" src="./bell_no_notification_icon.svg" className="mr-4" />
					<Link href="/userPage">
					<button  >
						<img width={40} height={40} alt="Add Image Icon" src="./chat_app.JPG" />
					</button>
					</Link>
				</div>
			</div>
		</header>
	)
}
