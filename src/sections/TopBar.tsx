
const breadcrumbItems = [
  { label: "Workspace", href: "#", active: false },
  { label: "Folder 2", href: "#", active: false },
  { label: "Spreadsheet 3", href: "#", active: true },
];
export const TopBar = () => {
  return (
    <div className="flex justify-between items-center px-[16px] py-[12px] bg-white border-b border-gray-200 shadow-sm">
      <Path />
      <ActionsRight />
    </div>
  )
};
function Path() {
  return (
    <div className="flex gap-[16px] items-center">
      <img className="w-[24px] h-[24px]" src="icons/topbar_icon1.svg" alt="icon" />
      <div className="px-2 flex gap-[4px] items-center text-sm">
        {breadcrumbItems.map((b, index) => 
            <div key={index} className={`flex items-center leading-[20px] ${index == breadcrumbItems.length - 1 ? "gap-[8px]" : "text-[#AFAFAF]"}`}>
              <div className="p-1 pb-1.5">{b.label}</div>
              <img 
                className={`${index == breadcrumbItems.length - 1 ? "w-[24px] h-[12px]" : "w-[12px] h-[12px]"}`} 
                src={index != breadcrumbItems.length - 1 ? "icons/Chevron.svg" : "icons/three_dots_icon.svg"} 
                alt="icon" 
              />
            </div>
        )}
      </div>
    </div>
  );
}
function ActionsRight(){
  return (
    <div className="flex gap-1 items-center">
      <div className="flex rounded-[6px] items-center gap-[8px] h-[40px] w-[165px] tracking-wide bg-[#F6F6F6] text-[#757575] p-[12px] text-xs">
        <img className="w-[16px] h-[16px]" src="icons/SearchIcon.svg" alt="" />
        <div className="flex items-center h-[16px]">
          Search within sheet
        </div>
      </div>
      <div className="flex items-center justify-center w-[40px] h-[40px]">
        <img className="w-full h-full" src="icons/Notification_bell.svg" alt="Notification_bell" />
      </div>
      <ProfileBlock />
    </div>
  )
}
function ProfileBlock(){
  return(
    <div className="flex items-center gap-3 pl-2 h-[40px]">
      <img 
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format" 
        alt="John Doe profile picture"
        className="border-2 border-white shadow-sm w-[28px] h-[28px] rounded-full"
      />
      <div className="flex flex-col">
        <div className="text-sm font-medium text-gray-900 leading-tight">
          John Doe
        </div>
        <div className="text-xs text-gray-500 leading-tight">
          john.doe@example.com
        </div>
      </div>
    </div>
  )
}