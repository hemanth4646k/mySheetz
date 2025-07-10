export function OptionsRow() {
    return (
        <div className="h-[48px] flex justify-between items-center px-[8px] py-[6px] bg-white border-b border-gray-200 ">
            <LeftOptions></LeftOptions>
            <RightOptions></RightOptions>
        </div>
    )
}
function LeftOptions() {
    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-[4px] text-sm p-[8px] rounded-[4px] bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors duration-200 ease-in-out   ">
                Tool bar
                <img className="h-[16px] w-[16px]" src="icons/ChevronDouble.svg" alt="" />
            </div>
            <div className="h-[24px] w-[1px] bg-gray-300"></div>
            <div className="flex items-center gap-[4px] text-sm p-[8px] rounded-[4px] ">
                <OptionButton icon="icons/Eye.svg" label="Hide Fields" />
                <OptionButton icon="icons/ArrowSort.svg" label="Sort" />
                <OptionButton icon="icons/Filter.svg" label="Filter" />
                <OptionButton icon="icons/ArrowAutofit.svg" label="Cell View" />
            </div>
        </div>
    )
}
function RightOptions() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-[8px] text-sm p-[8px] rounded-[4px] ">
        <RightOptionButton icon="icons/ArrowDownload.svg" label="Import" />
        <RightOptionButton icon="icons/ArrowUpload.svg" label="Export" />
        <RightOptionButton icon="icons/Share.svg" label="Share" />
        <div className="bg-[#4B6A4F] text-white flex items-center gap-[4px] py-[8px] rounded-[6px] px-[24px] border
         border-gray-300 cursor-pointer hover:bg-green-700 transition-colors duration-200 ease-in-out">
          <img className="h-[20px] w-[20px]" src="icons/ArrowSplit.svg" alt="ArrowSplit" />
          <span>New Action</span>
        </div>
      </div>
    </div>
  );
}

function OptionButton({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-[4px] p-[8px] rounded-[4px] pr-[12px] cursor-pointer hover:bg-gray-200 transition-colors duration-200 ease-in-out">
      <img className="h-[16px] w-[16px]" src={icon} alt="" />
      <span>{label}</span>
    </div>
  );
}

function RightOptionButton({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="text-[#545454] flex items-center gap-[4px] p-[8px] rounded-[6px] pr-[12px] border border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors duration-200 ease-in-out">
      <img className="h-[20px] w-[20px]" src={icon} alt="" />
      <span>{label}</span>
    </div>
  );
}