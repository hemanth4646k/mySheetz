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
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
                Tool bar
                <img src="icons/ChevronDouble.svg" alt="" />
            </div>
            <button className="text-sm text-gray-700">Option 2</button>
        </div>
    )
}
function RightOptions() {
    return (
        <div className="flex items-center gap-2">
            <button className="text-sm text-gray-700">Option 3</button>
            <button className="text-sm text-gray-700">Option 4</button>
        </div>
    )
}