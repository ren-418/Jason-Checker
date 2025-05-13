import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
function DialogRoot({ children, open, onClose }) {
    return (
        <Dialog id="filterDialog" open={open} onClose={onClose} maxWidth="xl" fullWidth={true} PaperProps={{ style: { color: "white", padding: "0px", borderRadius: "16px 16px", background: "transparent" } }}>
            <DialogContent className="bg-[#DBDBDB] dark:bg-[rgb(34,34,34)] px-10 scrollbar-hidden">
                {children}
            </DialogContent>
        </Dialog>
    );
}

function Header({ children }) {
    return (
        <div className="flex absolute top-0 left-0 z-50 w-full text-base font-normal items-start xl:items-center bg-[#C5C5C5] dark:bg-[rgb(44,44,44)] px-4 py-6 rounded-t-2xl mb-6">
            {children}
        </div>
    );
}

function Body({ children, ...props }) {
    return (
        <form {...props} className="flex flex-col z-10 xl:flex-row mt-48 lg:mt-40 space-y-10 xl:space-y-0 xl:space-x-10 px-8 pb-5">
            {children}
        </form>
    );
}

export default Object.assign(DialogRoot, { Header, Body });