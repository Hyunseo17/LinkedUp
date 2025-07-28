const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-5xl font-bold mb-6">Linked Up</h1>
      
      <div className="flex">
        {/* Hour labels */}
        <div className="flex flex-col mr-2">
          <div className="h-10"></div>
          {hours.map((hour) => (
            <div key={hour} className="h-10 w-12 text-xs text-right pr-2">{hour}</div>
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
                className="h-10 w-16 border border-gray-300 hover:bg-green-300 transition-colors"
              ></div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App