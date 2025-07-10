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
            <div className="flex items-center gap-[4px] text-sm p-[8px] rounded-[4px] bg-gray-100">
                Tool bar
                <img className="h-[16px] w-[16px]" src="icons/ChevronDouble.svg" alt="" />
            </div>
            <div className="h-[24px] w-[1px] bg-gray-300"></div>
            <div className="flex items-center gap-[4px] text-sm p-[8px] rounded-[4px] ">
                <div className="flex items-center gap-[4px] p-[8px] rounded-[4px] pr-[12px]">
                    <img className="h-[16px] w-[16px]" src="icons/Eye.svg" alt="" />
                    <span>Hide Fields</span>
                </div>
                <div className="flex items-center gap-[4px] p-[8px] rounded-[4px] pr-[12px]">
                    <img className="h-[16px] w-[16px]" src="icons/ArrowSort.svg" alt="" />
                    <span>Sort</span>
                </div>
                <div className="flex items-center gap-[4px] p-[8px] rounded-[4px] pr-[12px]">
                    <img className="h-[16px] w-[16px]" src="icons/Filter.svg" alt="" />
                    <span>Filter</span>
                </div>
                <div className="flex items-center gap-[4px] p-[8px] rounded-[4px] pr-[12px]">
                    <img className="h-[16px] w-[16px]" src="icons/ArrowAutofit.svg" alt="" />
                    <span>Cell View</span>
                </div>
            </div>
        </div>
    )
}
function RightOptions() {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-[8px] text-sm p-[8px] rounded-[4px] ">
                <div className="text-[#545454] flex items-center gap-[4px] p-[8px] rounded-[6px] pr-[12px] border border-gray-300">
                    <img className="h-[20px] w-[20px]" src="icons/ArrowDownload.svg" alt="" />
                    <span>Import</span>
                </div>
                <div className="text-[#545454] flex items-center gap-[4px] p-[8px] rounded-[6px] pr-[12px] border border-gray-300">
                    <img className="h-[20px] w-[20px]" src="icons/ArrowUpload.svg" alt="" />
                    <span>Export</span>
                </div>
                <div className="text-[#545454] flex items-center gap-[4px] p-[8px] rounded-[6px] pr-[12px] border border-gray-300">
                    <img className="h-[20px] w-[20px]" src="icons/Share.svg" alt="" />
                    <span>Share</span>
                </div>
                <div className="bg-[#4B6A4F] text-white flex items-center gap-[4px] py-[8px] rounded-[6px] px-[24px] border border-gray-300">
                    <img className="h-[20px] w-[20px]" src="icons/ArrowSplit.svg" alt="ArrowSplit" />
                    <span>New Action</span>
                </div>
            </div>
        </div>
    )
}