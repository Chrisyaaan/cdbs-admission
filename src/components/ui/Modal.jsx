import { IoMdClose } from "react-icons/io";
import cn from "classnames"

const Modal = ({ bodyContent, footerContent, onClose, className }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className={cn("bg-white rounded-2xl shadow-lg w-full max-w-[32rem] px-12 pt-6 pb-12  min-h-[37rem] flex flex-col flex-grow", className)}>
      {/* Header */}
      <div className="flex justify-end">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <IoMdClose size={24} />
        </button>
      </div>

      {/* Body */}
      {bodyContent}

      {/* Footer */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        {footerContent}
      </div>
    </div>
  </div>
  );
};

export default Modal;