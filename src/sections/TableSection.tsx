import React, { useState, useRef, useEffect } from 'react';
import '../styles/Spreadsheet.css'; // Import our new spreadsheet styles

// Types for our data
type Status = 'In-process' | 'Need to start' | 'Complete' | 'Blocked';
type Priority = 'Low' | 'Medium' | 'High';

interface TaskRow {
  id: number;
  title: string;
  dueDate: string;
  status: Status;
  submitter: string;
  url: string;
  assignee: string;
  priority: Priority;
  estimatedValue: string;
}

// Component for cell styling based on status
const StatusCell: React.FC<{ status: Status, onChange: (newStatus: Status) => void }> = ({ status, onChange }) => {
  const getStatusColor = (status: Status) => {
    switch(status) {
      case 'In-process': return 'bg-yellow-100 text-yellow-800';
      case 'Need to start': return 'bg-orange-100 text-orange-800';
      case 'Complete': return 'bg-green-100 text-green-800';
      case 'Blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100';
    }
  };

  const statuses: Status[] = ['In-process', 'Need to start', 'Complete', 'Blocked'];
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isOpen) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = statuses.indexOf(status);
        let newIndex: number;
        
        if (e.key === 'ArrowDown') {
          newIndex = (currentIndex + 1) % statuses.length;
        } else {
          newIndex = (currentIndex - 1 + statuses.length) % statuses.length;
        }
        
        onChange(statuses[newIndex]);
      }
    } else {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsOpen(true);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(status)} cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {status}
      </div>
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 z-10 bg-white shadow-lg rounded border">
          {statuses.map((s) => (
            <div 
              key={s} 
              className={`px-4  py-2 hover:bg-gray-100 cursor-pointer ${status === s ? 'bg-gray-50' : ''}`}
              onClick={() => {
                onChange(s);
                setIsOpen(false);
              }}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Component for priority styling
const PriorityCell: React.FC<{ priority: Priority, onChange: (newPriority: Priority) => void }> = ({ priority, onChange }) => {
  const getPriorityColor = (priority: Priority) => {
    switch(priority) {
      case 'Low': return 'text-blue-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return '';
    }
  };

  const priorities: Priority[] = ['Low', 'Medium', 'High'];
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isOpen) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = priorities.indexOf(priority);
        let newIndex: number;
        
        if (e.key === 'ArrowDown') {
          newIndex = (currentIndex + 1) % priorities.length;
        } else {
          newIndex = (currentIndex - 1 + priorities.length) % priorities.length;
        }
        
        onChange(priorities[newIndex]);
      }
    } else {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsOpen(true);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className={`cursor-pointer ${getPriorityColor(priority)}`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {priority}
      </div>
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 z-10 bg-white shadow-lg rounded border">
          {priorities.map((p) => (
            <div 
              key={p} 
              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${getPriorityColor(p)}`}
              onClick={() => {
                onChange(p);
                setIsOpen(false);
              }}
            >
              {p}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Editable Cell Component
const EditableCell: React.FC<{
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
  onNavigate?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  row?: number;
  col?: number;
}> = ({ value, onChange, className = '', onNavigate, row, col }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);

  // Update text when value changes (e.g. from external changes)
  useEffect(() => {
    setText(value);
    console.log(`EditableCell value updated to: ${value}`);
  }, [value]);

  // Focus and select input when editing starts
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  // Handle save and cancel
  const handleBlur = () => {
    // First update the data
    if (text !== value) {
      onChange(text);
    }
    
    // Short timeout to ensure the value is updated before stopping edit mode
    setTimeout(() => {
      setEditing(false);
      
      // Force visibility of the cell content after editing
      if (cellRef.current) {
        cellRef.current.style.visibility = 'visible';
        cellRef.current.style.opacity = '1';
        cellRef.current.style.color = '#000000';
      }
    }, 10);
  };

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleSingleClick = () => {
    // For single click, just highlight the cell to indicate selection
    if (!editing) {
      cellRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (editing) {
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          handleBlur();
          onNavigate?.('down');
          break;
        case 'Tab':
          e.preventDefault();
          handleBlur();
          onNavigate?.(e.shiftKey ? 'left' : 'right');
          break;
        case 'Escape':
          e.preventDefault();
          setText(value); // Reset to original
          setEditing(false);
          break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          // Don't handle arrow keys while editing
          break;
      }
    } else {
      // When not editing
      switch (e.key) {
        case 'Enter':
        case 'F2':
          e.preventDefault();
          setEditing(true);
          break;
        case 'ArrowUp':
          e.preventDefault();
          onNavigate?.('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          onNavigate?.('down');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onNavigate?.('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNavigate?.('right');
          break;
      }
    }
  };

  return editing ? (
    <input
      ref={inputRef}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`editable-cell-input ${className}`}
      data-row={row}
      data-col={col}
      style={{ 
        color: '#000000', 
        visibility: 'visible', 
        opacity: 1,
        width: '100%',
        height: '100%',
        padding: '2px 4px'
      }}
    />
  ) : (
    <div 
      ref={cellRef}
      className={`editable-cell-content cursor-cell ${className}`}
      onClick={handleSingleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      data-row={row}
      data-col={col}
      style={{ 
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        color: '#000000', 
        visibility: 'visible', 
        opacity: 1,
        display: 'block',
        width: '100%',
        height: '100%',
        padding: '2px 0'
      }}
    >
      {value || "\u00A0"} {/* Use non-breaking space if value is empty */}
    </div>
  );
};

// Resizer component for column resizing
const ColumnResizer: React.FC<{
  index: number;
  onResize: (index: number, width: number) => void;
  columnWidths: number[];
  gridRef: React.RefObject<HTMLDivElement | null>;
}> = ({ index, onResize, columnWidths, gridRef }) => {
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Capture starting coordinates
    startX.current = e.clientX;
    
    // Use column width directly from props
    startWidth.current = columnWidths[index];
    
    // Create a semi-transparent overlay div to capture all mouse events
    const overlay = document.createElement('div');
    overlay.id = 'resize-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.zIndex = '9999';
    overlay.style.cursor = 'col-resize';
    document.body.appendChild(overlay);
    
    // Create wrapper functions that call the current ref values
    const mouseMoveHandler = (e: MouseEvent) => handleMouseMoveRef.current(e);
    const mouseUpHandler = (e: MouseEvent) => {
      handleMouseUpRef.current(e);
      if (document.getElementById('resize-overlay')) {
        document.body.removeChild(overlay);
      }
    };
    
    // Add event listeners to the overlay
    overlay.addEventListener('mousemove', mouseMoveHandler, { capture: true });
    overlay.addEventListener('mouseup', mouseUpHandler, { capture: true });
    
    // Also add to document as a fallback
    document.addEventListener('mousemove', mouseMoveHandler, { capture: true });
    document.addEventListener('mouseup', mouseUpHandler, { capture: true });
    
    // Update drag state
    setIsDragging(true);
    
    // Add a class to the body to indicate resizing is happening
    document.body.classList.add('column-resizing');
    
    // Apply specific styling to the current column
    const headerCell = document.querySelector(`[data-col-index="${index}"]`) as HTMLElement;
    if (headerCell) {
      headerCell.classList.add('resizing-column');
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    // Calculate the new width with a minimum of 40px
    const diff = e.clientX - startX.current;
    const newWidth = Math.max(40, startWidth.current + diff);
    
    // Direct DOM manipulation for smoother visual feedback during drag
    const gridElement = gridRef.current;
    if (!gridElement) return;
    
    // Create a new array of column widths
    const newColumnWidths = [...columnWidths];
    newColumnWidths[index] = newWidth;
    
    // Apply the new column widths to the grid
    const gridTemplateColumns = newColumnWidths.map(width => `${width}px`).join(' ');
    gridElement.style.gridTemplateColumns = gridTemplateColumns;
    
    // Optional: Add visual indicator that shows the current column being resized
    const allHeaderCells = document.querySelectorAll('[data-col-index]');
    allHeaderCells.forEach((cell, i) => {
      if (i === index) {
        (cell as HTMLElement).classList.add('resizing-column');
      } else {
        (cell as HTMLElement).classList.remove('resizing-column');
      }
    });
    
    // Prevent text selection during resize
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging) return;
    
    // Remove all event listeners
    document.removeEventListener('mousemove', handleMouseMoveRef.current, { capture: true });
    document.removeEventListener('mouseup', handleMouseUpRef.current, { capture: true });
    
    // Clean up overlay if it exists
    const overlay = document.getElementById('resize-overlay');
    if (overlay) {
      overlay.removeEventListener('mousemove', handleMouseMoveRef.current, { capture: true });
      overlay.removeEventListener('mouseup', handleMouseUpRef.current, { capture: true });
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }
    
    // Clean up
    document.body.classList.remove('column-resizing');
    
    // Calculate the final width directly
    const diff = e.clientX - startX.current;
    const finalWidth = Math.max(40, startWidth.current + diff);
    
    // Update the column width in the state
    onResize(index, finalWidth);
    setIsDragging(false);
  };

  // Store the event handlers in refs to avoid dependency issues in useEffect
  const handleMouseMoveRef = useRef(handleMouseMove);
  const handleMouseUpRef = useRef(handleMouseUp);
  
  // Update refs when functions change
  useEffect(() => {
    handleMouseMoveRef.current = handleMouseMove;
    handleMouseUpRef.current = handleMouseUp;
  }, [handleMouseMove, handleMouseUp]);

  // Add useEffect to ensure cleanup if component unmounts during resize
  useEffect(() => {
    // Cleanup function that runs on unmount or when isDragging changes
    return () => {
      if (isDragging) {
        // Remove overlay if it exists
        const overlay = document.getElementById('resize-overlay');
        if (overlay) {
          document.body.removeChild(overlay);
        }
        
        // Remove classes
        document.body.classList.remove('column-resizing');
        
        // Clean up any column-specific styling
        const headerCells = document.querySelectorAll('[data-col-index]');
        headerCells.forEach(cell => {
          cell.classList.remove('resizing-column');
        });
      }
    };
  }, [isDragging]);

  return (
    <div 
      className={`column-resizer ${isDragging ? 'column-resizer-active' : ''}`}
      onMouseDown={handleMouseDown}
      title="Drag to resize column"
      style={{ cursor: 'col-resize' }}
    >
      {/* Visual indicator for the resizer */}
      <div className="h-full w-1 mx-auto bg-transparent hover:bg-blue-400" />
    </div>
  );
};

export function TableSection() {
  // Sample data based on the image
  const [tasks, setTasks] = useState<TaskRow[]>([
    {
      id: 1, 
      title: 'Launch social media campaign for product release', 
      dueDate: '15-11-2024', 
      status: 'In-process',
      submitter: 'Aisha Patel',
      url: 'www.alishapatel.com',
      assignee: 'Sophie Choudhury',
      priority: 'Medium',
      estimatedValue: '4,200,000'
    },
    {
      id: 2, 
      title: 'Update press kit for company redesign', 
      dueDate: '28-10-2024', 
      status: 'Need to start',
      submitter: 'Irfan Khan',
      url: 'www.irfankhan.com',
      assignee: 'Tejus Pandey',
      priority: 'High',
      estimatedValue: '3,500,000'
    },
    {
      id: 3, 
      title: 'Finalize user testing feedback for app update', 
      dueDate: '05-12-2024', 
      status: 'In-process',
      submitter: 'Mark Johnson',
      url: 'www.markjohnson.com',
      assignee: 'Rachel Lee',
      priority: 'Medium',
      estimatedValue: '4,750,000'
    },
    {
      id: 4, 
      title: 'Design new features for the website', 
      dueDate: '10-01-2025', 
      status: 'Complete',
      submitter: 'Emily Green',
      url: 'www.emilygreen.com',
      assignee: 'Tom Wright',
      priority: 'Low',
      estimatedValue: '5,900,000'
    },
    {
      id: 5, 
      title: 'Prepare financial report for Q4', 
      dueDate: '25-01-2025', 
      status: 'Blocked',
      submitter: 'Jessica Brown',
      url: 'www.jessicabrown.com',
      assignee: 'Kevin Smith',
      priority: 'Low',
      estimatedValue: '2,800,000'
    }
  ]);

  // Track the currently selected/active cell
  const [activeCell, setActiveCell] = useState<{row: number, col: number} | null>(null);

  const headers = [
    { key: 'id', label: '#' },
    { key: 'title', label: 'Job Request' },
    { key: 'dueDate', label: 'Submitted' },
    { key: 'status', label: 'Status' },
    { key: 'submitter', label: 'Submitter' },
    { key: 'url', label: 'URL' },
    { key: 'assignee', label: 'Assigned' },
    { key: 'priority', label: 'Priority' },
    { key: 'estimatedValue', label: 'Est. Value' }
  ];

  // Initial column widths in pixels
  const [columnWidths, setColumnWidths] = useState(() => {
    // Try to load saved column widths from localStorage
    try {
      const savedWidths = localStorage.getItem('my-sheets-column-widths');
      if (savedWidths) {
        return JSON.parse(savedWidths);
      }
    } catch (e) {
      console.error('Failed to load saved column widths:', e);
    }
    
    // Default widths if none are saved
    return [40, 300, 120, 120, 120, 140, 120, 100, 120];
  });

  // Total number of rows (data + empty)
  const totalRows = tasks.length + 15;

  // Reference to the grid container for direct DOM manipulation
  const gridContainerRef = useRef<HTMLDivElement>(null);
  
  // Update grid template columns whenever columnWidths change
  useEffect(() => {
    if (gridContainerRef.current) {
      const gridTemplateColumnsStyle = columnWidths.map((width: number) => `${width}px`).join(' ');
      gridContainerRef.current.style.gridTemplateColumns = gridTemplateColumnsStyle;
    }
  }, [columnWidths]);

  // Handle column resize
  const handleColumnResize = (index: number, width: number) => {
    // Update the state with new widths
    const newWidths = [...columnWidths];
    newWidths[index] = width;
    setColumnWidths(newWidths);
    
    // Apply to DOM directly in case React hasn't updated the DOM yet
    if (gridContainerRef.current) {
      const gridTemplateColumnsStyle = newWidths.map((w) => `${w}px`).join(' ');
      gridContainerRef.current.style.gridTemplateColumns = gridTemplateColumnsStyle;
    }
    
    // Clean up any column-specific styling
    const headerCells = document.querySelectorAll('[data-col-index]');
    headerCells.forEach(cell => {
      cell.classList.remove('resizing-column');
    });
    
    // Force content visibility after resize
    setTimeout(() => {
      // Make sure all cell content is visible after column resize
      document.querySelectorAll('.sheet-cell').forEach((cell) => {
        if (cell instanceof HTMLElement) {
          cell.style.visibility = 'visible';
          cell.style.opacity = '1';
          
          // Also make all child elements visible
          cell.querySelectorAll('*').forEach((element) => {
            if (element instanceof HTMLElement) {
              element.style.visibility = 'visible';
              element.style.opacity = '1';
            }
          });
        }
      });
    }, 100);
    
    // Optional: Save column widths to localStorage for persistence
    try {
      localStorage.setItem('my-sheets-column-widths', JSON.stringify(newWidths));
    } catch (e) {
      console.error('Failed to save column widths to localStorage:', e);
    }
  };

  // Handle cell navigation
  const navigateCell = (row: number, col: number, direction: 'up' | 'down' | 'left' | 'right') => {
    const newRow = direction === 'up' 
      ? Math.max(0, row - 1) 
      : direction === 'down' 
        ? Math.min(totalRows - 1, row + 1) 
        : row;
        
    const newCol = direction === 'left' 
      ? Math.max(1, col - 1)  // Minimum col is 1 (skip row numbers)
      : direction === 'right' 
        ? Math.min(headers.length - 1, col + 1) 
        : col;
    
    setActiveCell({ row: newRow, col: newCol });
    
    // Find and focus the new cell
    setTimeout(() => {
      const newCellElement = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
      if (newCellElement instanceof HTMLElement) {
        newCellElement.focus();
      }
    }, 0);
  };

  // Handle cell click to set active cell
  const handleCellClick = (row: number, col: number) => {
    setActiveCell({ row, col });
  };

  // Create grid template columns based on column widths
  const gridTemplateColumns = columnWidths.map((width: number) => `${width}px`).join(' ');

  // Check if a cell is the active cell
  const isActiveCell = (row: number, col: number) => {
    return activeCell?.row === row && activeCell?.col === col;
  };

  // Update task data
  const updateTaskField = (taskId: number, field: keyof TaskRow, value: any) => {
    // Console log for debugging
    console.log(`Updating task ${taskId}, field ${field.toString()}, value:`, value);
    
    // Force state update with new value
    setTasks(prev => {
      const newTasks = prev.map(task => 
        task.id === taskId 
          ? { ...task, [field]: value }
          : task
      );
      
      // Make sure cell content is visible after update
      setTimeout(() => {
        // Force reflow of cells to ensure content is visible
        const cells = document.querySelectorAll('.sheet-cell');
        cells.forEach((cell) => {
          if (cell instanceof HTMLElement) {
            cell.style.visibility = 'visible';
            cell.style.opacity = '1';
            
            // Also ensure any child elements are visible
            const children = cell.querySelectorAll('*');
            children.forEach((child) => {
              if (child instanceof HTMLElement) {
                child.style.visibility = 'visible';
                child.style.opacity = '1';
              }
            });
          }
        });
      }, 50);
      
      // For debugging, log the new task
      const updatedTask = newTasks.find(t => t.id === taskId);
      console.log(`Task after update:`, updatedTask);
      
      return newTasks;
    });
  };

  // Get field value by header key and row
  const getFieldByHeader = (task: TaskRow, headerKey: string): string => {
    return task[headerKey as keyof TaskRow]?.toString() || '';
  };

  return (
    <div className="sheet-container overflow-auto">
      {/* Grid container */}
      <div className="grid sheet-grid border-b relative" style={{ gridTemplateColumns }} data-grid-container ref={gridContainerRef}>
        {/* Header row */}
        {headers.map((header, index) => (
          <div 
            key={header.key} 
            className="sheet-header p-2 text-sm border-r border-b relative"
            data-col-index={index}
          >
            {header.label}
            {/* Resizer component */}
            <ColumnResizer index={index} onResize={handleColumnResize} columnWidths={columnWidths} gridRef={gridContainerRef} />
          </div>
        ))}

        {/* Data rows */}
        {tasks.map((task, rowIdx) => (
          <React.Fragment key={task.id}>
            {/* Row number */}
            <div className="row-number p-2 border-r border-b">{task.id}</div>

            {/* Dynamic cells based on headers */}
            {headers.slice(1).map((header, colIdx) => {
              const key = header.key as keyof TaskRow;
              const colIndex = colIdx + 1;  // +1 because first col is row number
              const isActive = isActiveCell(rowIdx, colIndex);
              const cellClassName = `sheet-cell p-2 border-r border-b ${isActive ? 'sheet-cell-active' : ''}`;

              if (key === 'status') {
                return (
                  <div className={`${cellClassName} force-visible`} key={key} onClick={() => handleCellClick(rowIdx, colIndex)}>
                    <StatusCell 
                      status={task.status} 
                      onChange={(value) => updateTaskField(task.id, 'status', value)} 
                    />
                  </div>
                );
              }

              if (key === 'priority') {
                return (
                  <div className={`${cellClassName} force-visible`} key={key} onClick={() => handleCellClick(rowIdx, colIndex)}>
                    <PriorityCell 
                      priority={task.priority} 
                      onChange={(value) => updateTaskField(task.id, 'priority', value)} 
                    />
                  </div>
                );
              }

              // Default editable cell
              const extraClass = key === 'url' ? 'url-cell force-visible' : 
                               key === 'estimatedValue' ? 'text-right force-visible' : 'force-visible';
              
              return (
                <div className={`${cellClassName} force-visible`} key={key} onClick={() => handleCellClick(rowIdx, colIndex)}>
                  <EditableCell 
                    value={getFieldByHeader(task, key)}
                    onChange={(value) => updateTaskField(task.id, key as keyof TaskRow, value)} 
                    className={extraClass}
                    onNavigate={(direction) => navigateCell(rowIdx, colIndex, direction)}
                    row={rowIdx}
                    col={colIndex}
                  />
                </div>
              );
            })}
          </React.Fragment>
        ))}

        {/* Empty rows to match image (you can add more or make this dynamic) */}
        {Array.from({ length: 15 }).map((_, idx) => {
          const rowIndex = tasks.length + idx;
          
          return (
            <React.Fragment key={`empty-${idx}`}>
              <div className="row-number p-2 border-r border-b">
                {rowIndex + 1}
              </div>
              
              {/* Empty editable cells */}
              {Array.from({ length: headers.length - 1 }).map((_, colIdx) => {
                const colIndex = colIdx + 1;  // +1 because first col is row number
                const isActive = isActiveCell(rowIndex, colIndex);
                const cellClassName = `sheet-cell p-2 border-r border-b ${isActive ? 'sheet-cell-active' : ''}`;
                
                return (
                  <div key={`empty-${idx}-${colIdx}`} className={cellClassName} onClick={() => handleCellClick(rowIndex, colIndex)}>
                    <EditableCell 
                      value=""
                      onChange={() => {}} // No-op for now, could create a new row if needed
                      onNavigate={(direction) => navigateCell(rowIndex, colIndex, direction)}
                      row={rowIndex}
                      col={colIndex}
                    />
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}