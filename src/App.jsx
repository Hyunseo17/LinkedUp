import './App.css'
import { useState, useRef, useEffect } from 'react'

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 16 }, (_, i) => `${i+8}:00`);

const App = () => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [tempName, setTempName] = useState("");
  const [responses, setResponses] = useState([]); // {name, cells}
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const gridRef = useRef(null);

  // Handle mouseup anywhere on the document to stop selection
  useEffect(() => {
    if (!isSelecting) return;
    const handleMouseUp = () => setIsMouseDown(false);
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [isSelecting]);

  const handleCellMouseDown = (cellKey) => {
    if (!isSelecting) return;
    setIsMouseDown(true);
    setSelectedCells(prev => new Set(prev).add(cellKey));
  };

  const handleCellMouseEnter = (cellKey) => {
    if (!isSelecting || !isMouseDown) return;
    setSelectedCells(prev => {
      const newSet = new Set(prev);
      newSet.add(cellKey);
      return newSet;
    });
  };

  const handleAddAvailability = () => {
    setIsSelecting(true);
    setSelectedCells(new Set()); // Always clear previous selection for new user
  };

  // Instead of hours.map, use a new array that includes both hour and half-hour slots
  const timeSlots = [];
  for (let i = 0; i < hours.length; i++) {
    timeSlots.push({ label: hours[i], isHalf: false });
    if (i < hours.length - 1) {
      timeSlots.push({ label: '', isHalf: true });
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pl-50 pr-50">
      {/* Drawer Menu Button */}
      <button
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <div className={`w-5 h-0.5 bg-gray-600 transition-all ${isDrawerOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
          <div className={`w-5 h-0.5 bg-gray-600 my-1 transition-all ${isDrawerOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-5 h-0.5 bg-gray-600 transition-all ${isDrawerOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
        </div>
      </button>

      {/* Drawer Overlay - Very transparent */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-10 z-40"
          onClick={() => setIsDrawerOpen(false)}
        ></div>
      )}

      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Menu</h2>
          <button
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => {
              // Handle edit event logic here
              console.log('Edit Event clicked');
              setIsDrawerOpen(false);
            }}
          >
            Edit Event
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Enter title..."
        className="text-4xl mb-4 border-none ml-22 w-140 mt-10"
        onKeyDown={(e) => { //Event handler for pressing enter
          if (e.key === "Enter") {
            e.preventDefault();      // prevents form submission or line breaks
            e.currentTarget.blur();  // removes focus (cursor disappears)
          }
        }}
      />

      <div className="flex">
        {/* Hour labels */}
        <div className="flex flex-col mr-2 relative">
          <div className="h-8.5"></div>
          {hours.map((hour, idx) => (
            <div key={hour} className="w-20 h-10 flex items-center justify-end pr-3 relative" style={{height: '2.5rem', position: 'relative'}}>
              <span style={{position: 'absolute', top: 0, height: '2.5rem', display: 'flex', alignItems: 'center', right: '0'}} className="text-xs">{hour}</span>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 border border-gray-300" ref={gridRef}>
          {/* Day headers */}
          {days.map((day) => (
            <div key={day} className="h-10 border-b border-gray-300 flex justify-center items-center font-bold">
              {day}
            </div>
          ))}

          {/* Availability cells */}
          {timeSlots.map((slot, slotIdx) =>
            days.map((day) => {
              // For half-hour slots, use a different key and style
              const cellKey = slot.isHalf ? `${day}-${slotIdx}-half` : `${day}-${slot.label}`;
              const isSelected = selectedCells.has(cellKey);
              const usersForCell = responses.filter(r => r.cells.includes(cellKey));
              const isSaved = usersForCell.length > 0;
              let cellClass = 'w-20 h-5 transition-colors border border-gray-300';
              if (slot.isHalf) {
                cellClass += ' border-t border-dotted border-gray-400';
              }
              // In the grid cell rendering, treat showNamePrompt as part of selection mode
              if (isSelecting || showNamePrompt) {
                if (isSelected) {
                  cellClass += ' bg-green-400';
                } else {
                  cellClass += ' bg-white hover:bg-green-300';
                }
              } else {
                if (responses.length > 0) {
                  const n = responses.length;
                  const c = usersForCell.length;
                  if (c === 0) {
                    cellClass += ' bg-white';
                  } else {
                    // Dynamically assign green shade based on overlap ratio
                    let shade = 100;
                    if (n === 1) {
                      shade = 500;
                    } else if (c === n) {
                      shade = 500;
                    } else {
                      // Use 5 buckets, but strongest green only for full overlap
                      const bucket = Math.ceil((c / n) * 4); // 1-4
                      shade = [100, 200, 300, 400][bucket - 1] || 100;
                    }
                    cellClass += ` bg-green-${shade}`;
                  }
                } else {
                  cellClass += ' bg-white';
                }
              }
              return (
                <div
                  key={cellKey}
                  className={cellClass + (isSelecting ? ' cursor-pointer' : '')}
                  onMouseDown={() => handleCellMouseDown(cellKey)}
                  onMouseEnter={() => handleCellMouseEnter(cellKey)}
                  onDragStart={e => e.preventDefault()}
                  style={{ position: 'relative' }}
                ></div>
              );
            })
          )}
          {/* Extra bottom row */}
          {days.map((day, idx) => (
            <div
              key={`extra-bottom-${day}`}
              className="w-20 h-5 border border-gray-300 bg-white"
              style={{ position: 'relative' }}
            ></div>
          ))}
        </div>
        {/*Right bar*/}
        <div className="flex flex-col pl-10 pt-4">
          {/*Responses*/}
          <div className="mb-4 h-70 w-50 overflow-y-auto">
            <h1 className="font-bold text-2xl">Responses </h1>
            <ul className="pl-6 pt-2">
              {responses.map((resp, idx) => (
                <li key={idx}>{resp.name}</li>
              ))}
            </ul>
          </div>
          {!isSelecting && !showNamePrompt ? (
            <button 
              type="button"
              className="border py-1.5 px-4 rounded bg-gray-100 hover:bg-green-400 hover:cursor-pointer"
              onClick={handleAddAvailability}
            >
              Add Availability
            </button>
          ) : null}
          {(isSelecting && !showNamePrompt) && (
            <div className="flex gap-2">
              <button
                type="button"
                className="border py-1.5 px-4 rounded bg-gray-100 hover:bg-red-200 hover:cursor-pointer"
                onClick={() => {
                  setIsSelecting(false);
                  setSelectedCells(new Set());
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="border py-1.5 px-4 rounded bg-gray-100 hover:bg-green-500 hover:cursor-pointer"
                onClick={() => {
                  setShowNamePrompt(true);
                  setIsSelecting(false);
                }}
              >
                Save
              </button>
            </div>
          )}
          {showNamePrompt && (
            <div className="flex flex-col gap-2 mt-2">
              <input
                type="text"
                className="border rounded px-2 py-1"
                placeholder="Enter your name..."
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  className="border py-1.5 px-4 rounded bg-gray-100 hover:bg-red-200 hover:cursor-pointer"
                  onClick={() => {
                    setShowNamePrompt(false);
                    setSelectedCells(new Set());
                    setTempName("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="border py-1.5 px-4 rounded bg-gray-100 hover:bg-green-500 hover:cursor-pointer"
                  disabled={!tempName.trim()}
                  onClick={() => {
                    setResponses(prev => [...prev, { name: tempName.trim(), cells: Array.from(selectedCells) }]);
                    setShowNamePrompt(false);
                    setTempName("");
                    setSelectedCells(new Set());
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App