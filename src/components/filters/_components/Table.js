import { twMerge } from "tailwind-merge";

function TableRoot({ children, ...props }) {
    return <div {...props} className="flex flex-col items-center xl:items-start">{children}</div>
}

function Header({ children }) {
    return <div className="flex w-full space-x-0.5 cursor-pointer">{children}</div>
}

function Column({ children, className }) {
    return (
        <h4 className={twMerge("bg-[#BABABA] dark:bg-[rgb(45,45,45)] p-3 text-ellipsis overflow-hidden flex items-center justify-center text-center rounded-t-lg text-[#161616] dark:text-[#d1d5db] font-semibold", className)}>
            {children}
        </h4>
    );
}

function Body({ children, ...props }) {
    return <div {...props} className="flex space-y-2 flex-col min-w-3/5 w-full">{children}</div>
}

function Row({ children, ...props }) {
    return <div {...props} className="flex w-fit space-x-0.5 cursor-pointer group focus:outline-none">{children}</div>
}

function Item({ children, className, selected = false, ...props }) {
    return <div {...props} className={twMerge(`p-3 group-last:first:rounded-bl-lg group-last:last:rounded-br-lg ${selected ? "bg-[#7d79a8]" : "bg-[#CACACA] dark:bg-[rgb(57,57,57)]"}`, className)}>{children}</div>
}

export default Object.assign(TableRoot, { Header, Column, Body, Row, Item });