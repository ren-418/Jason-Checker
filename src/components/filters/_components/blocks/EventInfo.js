export default function EventInfo({ name, date, venue, fullURL, price }) {
    return (
        <div className="w-full flex flex-col justify-center items-center text-[#3C3C3C] dark:text-white">
            <div className="w-full flex flex-col xl:flex-row items-center justify-around space-y-2 xl:space-y-0 xl:space-x-6 mt-5 md:mt-0">
                <h1 className="text-sm xl:text-xl font-bold text-[#3C3C3C] dark:text-white !select-text">
                    Date:<span className="!select-text dark:text-[#d1d5db] font-light ml-1">{date}</span>
                </h1>
                <div className="flex flex-col items-center">
                    <h1 className="flex text-sm xl:text-xl font-bold text-[#3C3C3C] dark:text-white !select-text">
                        <a href={fullURL} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                            Name:<span className="!select-text dark:text-[#d1d5db] font-light ml-1">{name}</span>
                        </a>
                    </h1>
                    <h1 className="text-sm xl:text-xl font-bold text-[#3C3C3C] dark:text-white !select-text">
                        Price Range:<span className="!select-text dark:text-[#d1d5db] font-light ml-1">{price}</span>
                    </h1>
                </div>
                <h1 className="text-sm xl:text-xl font-bold text-[#3C3C3C] dark:text-white !select-text">
                    Venue:<span className="!select-text dark:text-[#d1d5db] font-light ml-1">{venue}</span>
                </h1>
            </div>
        </div>
    );
}