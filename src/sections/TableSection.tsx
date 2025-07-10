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
  dueDate2: string;
  estimatedValue: string;
  extra?: Record<string, string>; // New property for extra columns
}  // Component for cell styling based on status

const StatusCell: React.FC<{ status: Status, onChange: (newStatus: Status) => void }> = ({ status, onChange }) => {
  const getStatusClass = (status: Status) => {
    switch(status) {
      case 'In-process': return 'status-pill status-in-process';
      case 'Need to start': return 'status-pill status-need-to-start';
      case 'Complete': return 'status-pill status-complete';
      case 'Blocked': return 'status-pill status-blocked';
      default: return 'status-pill';
    }
  };
  const statuses: Status[] = ['In-process', 'Need to start', 'Complete', 'Blocked'];
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isOpen) {
      if (e.key === 'Escape') setIsOpen(false);
      else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = statuses.indexOf(status);
        let newIndex: number;
        if (e.key === 'ArrowDown') newIndex = (currentIndex + 1) % statuses.length;
        else newIndex = (currentIndex - 1 + statuses.length) % statuses.length;
        onChange(statuses[newIndex]);
      }
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setIsOpen(true);
    }
  };
  return (
    <div className="relative" ref={dropdownRef} style={{width:'100%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
      <div 
        className={`${getStatusClass(status)}`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{
          cursor:'pointer',
          minWidth:'80px',
          textAlign:'center',
          margin:'2px 0',
          padding:'4px 8px',
          display:'inline-flex',
          alignItems:'center',
          justifyContent:'center',
          height:'22px', // smaller than cell height
          width:'fit-content',
          color:'#85640B'
        }}
      >
        {status}
      </div>
      {isOpen && (
        <div className="dropdown-menu" style={{position:'absolute',left:0,top:'100%',marginTop:4,zIndex:10,background:'#fff',boxShadow:'0 2px 8px rgba(0,0,0,0.08)',borderRadius:6,border:'1px solid #eee'}}>
          {statuses.map((s) => (
            <div 
              key={s} 
              className="dropdown-item"
              style={{padding:'8px 18px',cursor:'pointer',background:status===s?'#f3f4f6':'',fontWeight:status===s?'bold':'normal'}}
              onClick={() => {onChange(s);setIsOpen(false);}}
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
  const getPriorityClass = (priority: Priority) => {
    switch(priority) {
      case 'Low': return 'priority-low';
      case 'Medium': return 'priority-medium';
      case 'High': return 'priority-high';
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
    <div className="relative" ref={dropdownRef} style={{width:'100%',display:'flex',justifyContent:'center'}}>
      <div 
        className={getPriorityClass(priority)}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{cursor:'pointer',fontWeight:600,textAlign:'center'}}
      >
        {priority}
      </div>
      {isOpen && (
        <div className="dropdown-menu" style={{position:'absolute',left:0,top:'100%',marginTop:4,zIndex:10,background:'#fff',boxShadow:'0 2px 8px rgba(0,0,0,0.08)',borderRadius:6,border:'1px solid #eee'}}>
          {priorities.map((p) => (
            <div 
              key={p} 
              className="dropdown-item"
              style={{padding:'8px 18px',cursor:'pointer',background:priority===p?'#f3f4f6':'',fontWeight:priority===p?'bold':'normal'}}
              onClick={() => {onChange(p);setIsOpen(false);}}
            >
              {p}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Editable Cell Component - Always an input field
const EditableCell: React.FC<{
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
  onNavigate?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  row?: number;
  col?: number;
}> = ({ value, onChange, className = '', onNavigate, row, col }) => {
  // State for the current text value
  const [text, setText] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update text when value changes from parent component
  useEffect(() => {
    setText(value);
  }, [value]);

  // Handle changes to the input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  // Handle blur event (when user clicks away)
  const handleBlur = () => {
    setIsFocused(false);
    if (text !== value) {
      onChange(text); // Update the parent component with the new value
    }
  };

  // Handle focus event
  const handleFocus = () => {
    setIsFocused(true);
    if (inputRef.current) {
      // Select all text when focused for easy editing
      inputRef.current.select();
    }
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        inputRef.current?.blur(); // Remove focus
        onNavigate?.('down'); // Move down to the next row
        break;
      case 'Tab':
        e.preventDefault();
        inputRef.current?.blur(); // Remove focus
        onNavigate?.(e.shiftKey ? 'left' : 'right'); // Move to next/prev column
        break;
      case 'Escape':
        e.preventDefault();
        setText(value); // Reset to original value
        inputRef.current?.blur(); // Remove focus
        break;
      case 'ArrowUp':
        if (!isFocused) {
          e.preventDefault();
          onNavigate?.('up');
        }
        break;
      case 'ArrowDown':
        if (!isFocused) {
          e.preventDefault();
          onNavigate?.('down');
        }
        break;
      case 'ArrowLeft':
        if (!isFocused || e.currentTarget.selectionStart === 0) {
          e.preventDefault();
          onNavigate?.('left');
        }
        break;
      case 'ArrowRight':
        if (!isFocused || 
            e.currentTarget.selectionStart === e.currentTarget.value.length) {
          e.preventDefault();
          onNavigate?.('right');
        }
        break;
    }
  };

  return (
    <input
      ref={inputRef}
      value={text}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`cell-input ${className} ${isFocused ? 'cell-input-focused' : ''}`}
      data-row={row}
      data-col={col}
      style={{
        color: '#000000', 
        visibility: 'visible',
        opacity: 1,
        width: '100%',
        height: '100%',
        border: 'none',
        background: isFocused ? '#fff' : 'transparent',
        padding: '6px 8px',
        outline: isFocused ? '2px solid #3b82f6' : 'none',
        cursor: isFocused ? 'text' : 'cell',
        fontSize: '14px'
      }}
    />
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
      <div className="h-full w-[4px] mx-auto bg-transparent hover:bg-blue-400" />
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
      dueDate2: '20-11-2024',
      estimatedValue: '6,200,000'
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
      dueDate2: '30-10-2024',
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
      dueDate2: '10-12-2024',
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
      dueDate2: '15-01-2025',
      estimatedValue: '5,800,000'
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
      dueDate2: '30-01-2025',
      estimatedValue: '2,800,000'
    }
  ]);

  // Track the currently selected/active cell
  const [activeCell, setActiveCell] = useState<{row: number, col: number} | null>(null);

  // Track extra columns added by the user
  const [extraColumns, setExtraColumns] = useState<{ key: string; label: string }[]>([]);

  // Update headers to add a new column at the end with a '+' icon
  const baseHeaders = [
    { key: 'id', label: '#' },
    { key: 'title', label: 'Job Request' },
    { key: 'dueDate', label: 'Submitted' },
    { key: 'status', label: 'Status' },
    { key: 'submitter', label: 'Submitter' },
    { key: 'url', label: 'URL' },
    { key: 'assignee', label: 'Assigned' },
    { key: 'priority', label: 'Priority' },
    { key: 'dueDate2', label: 'Due Date' },
    { key: 'estimatedValue', label: 'Est. Value' },
  ];
  // Compose headers: base + extra + add
  const headers = [
    ...baseHeaders,
    ...extraColumns,
    { key: 'add', label: <span style={{fontSize:'20px',fontWeight:600,display:'flex',justifyContent:'center',alignItems:'center'}}>+</span> }
  ];

  // Update columnWidths to include the new columns (default width 120px for new columns, 60px for add column)
  const [columnWidths, setColumnWidths] = useState(() => {
    try {
      const savedWidths = localStorage.getItem('my-sheets-column-widths');
      if (savedWidths) {
        const arr = JSON.parse(savedWidths);
        // If new columns added, pad with default width
        if (arr.length < baseHeaders.length + 1) {
          return [...arr, ...Array(baseHeaders.length + 1 - arr.length).fill(60)];
        }
        return arr;
      }
    } catch (e) {
      console.error('Failed to load saved column widths:', e);
    }
    // Default widths if none are saved
    return [40, 300, 120, 120, 120, 140, 120, 100, 120, 120, 60];
  });

  // Update columnWidths when extraColumns changes
  useEffect(() => {
    setColumnWidths((prev: number[]) => {
      const baseLen = baseHeaders.length;
      const totalLen = baseHeaders.length + extraColumns.length + 1; // +1 for add column
      let newWidths = [...prev];
      // Add default width for new columns
      while (newWidths.length < totalLen) newWidths.splice(newWidths.length - 1, 0, 120);
      // Remove widths if columns removed
      while (newWidths.length > totalLen) newWidths.splice(baseLen, 1);
      return newWidths;
    });
  }, [extraColumns]);

  // Total number of rows (data + empty)
  const totalRows = tasks.length + 15;

  // Reference to the grid container for direct DOM manipulation
  const gridContainerRef = useRef<HTMLDivElement>(null);
  
  // These formatting helpers are now directly used where needed

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
    const value = task[headerKey as keyof TaskRow];
    if (value === undefined || value === null) return '';
    
    // Format values based on type
    if (headerKey === 'estimatedValue' && typeof value === 'string') {
      // Ensure numbers are properly formatted
      return value;
    }
    
    return value.toString();
  };

  // Handle add column (+) click
  const handleAddColumns = () => {
    setExtraColumns((prev) => {
      const startIdx = prev.length + 1;
      const newCols = Array.from({ length: 5 }, (_, i) => ({
        key: `extra_${startIdx + i}`,
        label: `New Col ${startIdx + i}`
      }));
      return [...prev, ...newCols];
    });
  };

  return (
    <div className="sheet-container" style={{width:'100vw',height:'calc(100vh - 120px)',background:'#fff',borderRadius:0,boxShadow:'none',padding:0,margin:0,display:'flex',flexDirection:'column',justifyContent:'flex-start'}}>
      <div style={{overflowX:'auto', width:'100%', flex:1, background:'#fff'}}>
        <div className="sheet-grid"
             style={{gridTemplateColumns, gridAutoRows:'minmax(38px,auto)', width:'max-content', minWidth:'100%', background:'#fff'}} 
             data-grid-container
             ref={gridContainerRef}>
        {/* Header row */}
        {headers.map((header, index) => (
          <div
            key={`header-${header.key}`}
            className="sheet-header"
            data-col-index={index}
            style={{
              gridColumn: index + 1,
              gridRow: 1,
              zIndex: 5,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f8f9fa',
              padding: '0 12px',
              height: 40,
              borderBottom: '2px solid #e5e7eb',
              cursor: header.key === 'add' ? 'pointer' : 'default',
              userSelect: 'none'
            }}
            onClick={header.key === 'add' ? handleAddColumns : undefined}
          >
            {header.label}
            <ColumnResizer index={index} onResize={handleColumnResize} columnWidths={columnWidths} gridRef={gridContainerRef} />
          </div>
        ))}

        {/* Data rows */}
        {tasks.map((task, rowIdx) => (
          <React.Fragment key={`task-${task.id}`}>
            {/* Row number */}
            <div 
              className="row-number"
              style={{ 
                gridColumn: 1, 
                gridRow: rowIdx + 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: rowIdx % 2 === 0 ? '#ffffff' : '#f9fafb',
                color: '#6b7280'
              }}
            >
              {task.id}
            </div>

            {/* Dynamic cells based on headers (skip id and add columns) */}
            {headers.slice(1, -1).map((header, colIdx) => {
              const key = header.key;
              const colIndex = colIdx + 1;  // +1 because first col is row number
              const isActive = isActiveCell(rowIdx, colIndex);
              const cellClassName = `sheet-cell p-2 border-r border-b ${isActive ? 'sheet-cell-active' : ''}`;
              const cellStyle = { 
                position: 'relative' as const,
                gridColumn: colIndex + 1,
                gridRow: rowIdx + 2,
                display: 'flex' as const,
                alignItems: 'center' as const,
                backgroundColor: rowIdx % 2 === 0 ? '#ffffff' : '#f9fafb',
              };
              // Handle base columns
              if (baseHeaders.find(h => h.key === key)) {
                if (key === 'status') {
                  return (
                    <div 
                      className={`${cellClassName} force-visible`} 
                      key={`cell-${rowIdx}-${key}`} 
                      onClick={() => handleCellClick(rowIdx, colIndex)}
                      style={cellStyle}
                    >
                      <StatusCell 
                        status={task.status} 
                        onChange={(value) => updateTaskField(task.id, 'status', value)} 
                      />
                    </div>
                  );
                }

                if (key === 'priority') {
                  return (
                    <div 
                      className={`${cellClassName} force-visible`} 
                      key={`cell-${rowIdx}-${key}`} 
                      onClick={() => handleCellClick(rowIdx, colIndex)}
                      style={cellStyle}
                    >
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
                
                // Additional cell styling based on row (alternate colors)
                const rowStyle = {
                  ...cellStyle,
                  backgroundColor: rowIdx % 2 === 0 ? '#ffffff' : '#f9fafb',
                };
                
                // For URL cells, wrap in a link styled container
                if (key === 'url') {
                  return (
                    <div 
                      className={`${cellClassName} force-visible`} 
                      key={`cell-${rowIdx}-${key}`} 
                      onClick={() => handleCellClick(rowIdx, colIndex)}
                      style={rowStyle}
                    >
                      <div className="w-full h-full">
                        <EditableCell 
                          value={getFieldByHeader(task, key)}
                          onChange={(value) => updateTaskField(task.id, key as keyof TaskRow, value)} 
                          className="text-blue-600 underline force-visible"
                          onNavigate={(direction) => navigateCell(rowIdx, colIndex, direction)}
                          row={rowIdx}
                          col={colIndex}
                        />
                      </div>
                    </div>
                  );
                }
                
                // For estimated value - right align
                if (key === 'estimatedValue') {
                  return (
                    <div 
                      className={`${cellClassName} force-visible`} 
                      key={`cell-${rowIdx}-${key}`} 
                      onClick={() => handleCellClick(rowIdx, colIndex)}
                      style={rowStyle}
                    >
                      <EditableCell 
                        value={getFieldByHeader(task, key)}
                        onChange={(value) => updateTaskField(task.id, key as keyof TaskRow, value)} 
                        className="text-right w-full force-visible"
                        onNavigate={(direction) => navigateCell(rowIdx, colIndex, direction)}
                        row={rowIdx}
                        col={colIndex}
                      />
                    </div>
                  );
                }
                
                // Standard cell
                return (
                  <div 
                    className={`${cellClassName} force-visible`} 
                    key={`cell-${rowIdx}-${key}`} 
                    onClick={() => handleCellClick(rowIdx, colIndex)}
                    style={rowStyle}
                  >
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
              }
              // Handle extra columns
              // Store extra column data in a new property on the task object
              if (!task.extra) task.extra = {};
              return (
                <div 
                  className={`${cellClassName} force-visible`} 
                  key={`cell-${rowIdx}-${key}`} 
                  onClick={() => handleCellClick(rowIdx, colIndex)}
                  style={cellStyle}
                >
                  <EditableCell 
                    value={task.extra[key] || ''}
                    onChange={(value) => {
                      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, extra: { ...t.extra, [key]: value } } : t));
                    }}
                    className="force-visible"
                    onNavigate={(direction) => navigateCell(rowIdx, colIndex, direction)}
                    row={rowIdx}
                    col={colIndex}
                  />
                </div>
              );
            })}
            {/* + column cell (empty box, styled like other cells) */}
            <div
              className={`sheet-cell force-visible`}
              key={`cell-${rowIdx}-add`}
              style={{
                position: 'relative',
                gridColumn: headers.length,
                gridRow: rowIdx + 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: rowIdx % 2 === 0 ? '#ffffff' : '#f9fafb',
                fontSize: 20,
                color: '#2563eb',
                border: '1px solid #e5e7eb',
                borderTop: 'none',
                borderLeft: 'none',
                minHeight: 38,
                minWidth: 60
              }}
            >
            </div>
          </React.Fragment>
        ))}

        {/* Empty rows to match image (you can add more or make this dynamic) */}
        {Array.from({ length: 15 }).map((_, idx) => {
          const rowIndex = tasks.length + idx;
          return (
            <React.Fragment key={`empty-row-${idx}`}>
              <div 
                className="row-number"
                style={{ 
                  gridColumn: 1, 
                  gridRow: rowIndex + 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : '#f9fafb',
                  color: '#6b7280'
                }}
              >
                {rowIndex + 1}
              </div>
              {/* Empty editable cells for all columns except id and add */}
              {headers.slice(1, -1).map((header, colIdx) => {
                const colIndex = colIdx + 1;
                const isActive = isActiveCell(rowIndex, colIndex);
                const cellClassName = `sheet-cell p-2 border-r border-b ${isActive ? 'sheet-cell-active' : ''}`;
                return (
                  <div 
                    key={`empty-cell-${rowIndex}-${colIdx}`} 
                    className={`${cellClassName} force-visible`} 
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    style={{ 
                      gridColumn: colIndex + 1, 
                      gridRow: rowIndex + 2,
                      backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : '#f9fafb'
                    }}
                  >
                    <EditableCell 
                      value=""
                      onChange={(value) => {
                        if (value.trim() !== '') {
                          const newTask: TaskRow & { extra: Record<string, string> } = {
                            id: rowIndex + 1,
                            title: '',
                            dueDate: '',
                            status: 'Need to start',
                            submitter: '',
                            url: '',
                            assignee: '',
                            priority: 'Medium',
                            dueDate2: '',
                            estimatedValue: '',
                            extra: {}
                          };
                          const headerKey = header.key;
                          if (headerKey in newTask) {
                            (newTask as any)[headerKey] = value;
                          } else {
                            newTask.extra[headerKey] = value;
                          }
                          setTasks(prev => [...prev, newTask]);
                        }
                      }}
                      onNavigate={(direction) => navigateCell(rowIndex, colIndex, direction)}
                      row={rowIndex}
                      col={colIndex}
                    />
                  </div>
                );
              })}
              {/* + column cell (empty box, styled like other cells) */}
              <div
                key={`empty-cell-${rowIndex}-add`}
                className={`sheet-cell force-visible`}
                style={{
                  gridColumn: headers.length,
                  gridRow: rowIndex + 2,
                  backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : '#f9fafb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e5e7eb',
                  borderTop: 'none',
                  borderLeft: 'none',
                  minHeight: 38,
                  minWidth: 60
                }}
              >
              </div>
            </React.Fragment>
          );
        })}
      </div>
      </div>
      {/* Tab bar at the bottom */}
      <div className="sheet-tab-bar" style={{display:'flex',borderTop:'1px solid #e5e7eb',background:'#f8f9fa',height:44,alignItems:'center',paddingLeft:8}}>
        {['All Orders','Pending','Reviewed','Arrived','+'].map((tab,idx) => (
          <div key={tab} className={`sheet-tab${idx===0?' sheet-tab-active':''}`} style={{padding:'0 28px',height:36,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:600,fontSize:15,cursor:'pointer',borderRadius:8,marginRight:8,background:idx===0?'#fff':'none',boxShadow:idx===0?'0 1px 4px rgba(0,0,0,0.04)':'none',border:idx===0?'1.5px solid #e5e7eb':'none',color:idx===0?'#2563eb':'#6b7280'}}>{tab}</div>
        ))}
      </div>
    </div>
  );
}