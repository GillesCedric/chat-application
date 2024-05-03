export const EmptyFriendRequest = () => {
  return (
    <div
      className="w-full h-full flex items-center flex-wrap justify-center gap-10 
		"
    >
      <div className="">
        <img
          className="w-42 h-12 mx-auto"
          style={{ filter: "drop-shadow(2px 4px 6px gray)" }}
          src="https://cdn2.iconfinder.com/data/icons/outline-web-application-1/20/cart-512.png"
          alt="belt"
        />
        <div>
          <h2 className="text-center text-black text-xl font-semibold leading-loose pb-2">
            There are no friend request in your center
          </h2>
          <p className="text-center text-black text-base font-normal leading-relaxed pb-4">
            Come back later 😉
            <br />
          </p>
        </div>
      </div>
    </div>
  );
};
