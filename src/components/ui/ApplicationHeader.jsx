import back from "../../assets/images/back.png";
import burgerMenu from "../../assets/images/burgerMenu.png";
import useSideBarStore from "../../store/sideBar/sideBarStore";
import cn from "classnames"

const ApplicationHeader = ({ callBack, title, footer, hasBurger=true, className }) => {
  const { setShowSideBar } = useSideBarStore();

  return (
    <div className="admission-top-header ">
      <>
        <div className={cn("flex-col items-start flex !justify-start gap-8 py-8 px-4 md:flex-row md:items-center", className)}>
          <button className="cursor-pointer" onClick={callBack}>
            <img src={back} />
          </button>
          <h2 className="lg:text-[4rem] mb-0">{title}</h2>
        </div>

        {hasBurger && (
          <button
            onClick={() => setShowSideBar((prev) => !prev)}
            data-drawer-target="default-sidebar"
            data-drawer-toggle="default-sidebar"
            aria-controls="default-sidebar"
            type="button"
            className="inline-flex items-center py-2 px-8 mt-2 ms-3 text-sm text-gray-500 rounded-lg xl:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <img src={burgerMenu} alt="" className="w-5 h-5" />
          </button>
        )}
      </>
      {footer}
    </div>
  );
};

export default ApplicationHeader;
