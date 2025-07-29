import './App.css'

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 16 }, (_, i) => `${i+8}:00`);

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 pl-50 pr-50">
      <input
        type="text"
        placeholder="Enter title..."
        className="text-4xl mb-4 border-none ml-22 w-140 mt-6"
        onKeyDown={(e) => { //Event handler for pressing enter
          if (e.key === "Enter") {
            e.preventDefault();      // prevents form submission or line breaks
            e.currentTarget.blur();  // removes focus (cursor disappears)
          }
        }}
      />

      <div className="flex">
        {/* Hour labels */}
        <div className="flex flex-col mr-2">
          <div className="h-8.5"></div>
          {hours.map((hour) => (
            <div key={hour} className="h-10 w-20 text-xs text-right pr-3">{hour}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 border border-gray-300">
          {/* Day headers */}
          {days.map((day) => (
            <div key={day} className="h-10 border-b border-gray-300 flex justify-center items-center font-bold">
              {day}
            </div>
          ))}

          {/* Availability cells */}
          {hours.map((hour) =>
            days.map((day) => (
              <div
                key={`${day}-${hour}`}
                className="h-10 w-20 border border-gray-300 hover:bg-green-300 transition-colors"
              ></div>
            ))
          )}
        </div>
        {/*Right bar*/}
        <div className="flex flex-col pl-10 pt-4">
          {/*Responses*/}
          <div className="mb-4 h-70 w-50 overflow-y-auto">
            <h1 className="font-bold text-2xl">Responses <a className="font-normal text-xl pl-2">(-/-)</a></h1>
            <ul className="pl-6 pt-2">
              <li>User1</li>
            </ul>
          </div>
          <button 
            type="button"
            className="border py-1.5 px-4 rounded bg-gray-100 hover:bg-green-300"
          >
            Add Availability
          </button>
        </div>
      </div>
    </div>
  );
}

export default App