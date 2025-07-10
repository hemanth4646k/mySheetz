const BottomRow = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-start px-2 py-2 overflow-x-auto">
        {/* All Orders - Default selected */}
        <div className="flex items-center whitespace-nowrap">
          <input 
            type="radio" 
            id="allOrders" 
            name="fav_language" 
            value="All orders"
            defaultChecked
            className="sr-only peer"
          />
          <label 
            htmlFor="allOrders" 
            className="px-4 py-2 text-sm font-medium cursor-pointer transition-colors duration-200 border-t-2 border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300 peer-checked:border-green-600 peer-checked:text-green-800 peer-checked:bg-green-100"
          >
            All Orders
          </label>
        </div>

        {/* Pending */}
        <div className="flex items-center whitespace-nowrap">
          <input 
            type="radio" 
            id="pending" 
            name="fav_language" 
            value="Pending"
            className="sr-only peer"
          />
          <label 
            htmlFor="pending" 
            className="px-4 py-2 text-sm font-medium cursor-pointer transition-colors duration-200 border-t-2 border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300 peer-checked:border-green-600 peer-checked:text-green-800 peer-checked:bg-green-100"
          >
            Pending
          </label>
        </div>

        {/* Reviewed */}
        <div className="flex items-center whitespace-nowrap">
          <input 
            type="radio" 
            id="reviewed" 
            name="fav_language" 
            value="Reviewed"
            className="sr-only peer"
          />
          <label 
            htmlFor="reviewed" 
            className="px-4 py-2 text-sm font-medium cursor-pointer transition-colors duration-200 border-t-2 border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300 peer-checked:border-green-600 peer-checked:text-green-800 peer-checked:bg-green-100"
          >
            Reviewed
          </label>
        </div>

        {/* Arrived */}
        <div className="flex items-center whitespace-nowrap">
          <input 
            type="radio" 
            id="arrived" 
            name="fav_language" 
            value="Arrived"
            className="sr-only peer"
          />
          <label 
            htmlFor="arrived" 
            className="px-4 py-2 text-sm font-medium cursor-pointer transition-colors duration-200 border-t-2 border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300 peer-checked:border-green-600 peer-checked:text-green-800 peer-checked:bg-green-100"
          >
            Arrived
          </label>
        </div>

        {/* Plus Button */}
        <div className="flex items-center ml-2">
          <button 
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            aria-label="Add new tab"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomRow;
