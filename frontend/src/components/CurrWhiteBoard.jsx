// import React, { useRef, useEffect, useState } from 'react';

// const CANVAS_WIDTH = 1200;
// const CANVAS_HEIGHT = 700;

// const CurrWhiteboard = ({ roomName }) => {
//   const canvasRef = useRef(null);
//   const ctxRef = useRef(null);
//   const socketRef = useRef(null);

//   const [isDrawing, setIsDrawing] = useState(false);
//   const [tool, setTool] = useState('pen');
//   const [color, setColor] = useState('#000000');
//   const [size, setSize] = useState(2);

//   // Multipage state
//   const [pages, setPages] = useState([null]); // Each page is an image (dataURL)
//   const [currentPage, setCurrentPage] = useState(0);

//     // Sync page and drawing actions via WebSocket
//   useEffect(() => {
//     // Canvas setup (runs once on mount or when roomName changes)
//     const canvas = canvasRef.current;
//     canvas.width = CANVAS_WIDTH;
//     canvas.height = CANVAS_HEIGHT;
//     canvas.classList.add('border', 'rounded-md', 'bg-white', 'shadow-md');

//     const ctx = canvas.getContext('2d');
//     ctx.lineCap = 'round';
//     ctx.strokeStyle = color;
//     ctx.lineWidth = size;
//     ctxRef.current = ctx;

//     // WebSocket setup
//     const socket = new WebSocket(`ws://localhost:8000/ws/room/${roomName}/`);
//     socketRef.current = socket;

//     socketRef.current.onopen = () => {
//         socketRef.current.send(JSON.stringify({ type: 'request_sync', page: currentPage }));
//     };

//     // Cleanup WebSocket on unmount
//     return () => socketRef.current.close();
//   }, [roomName]); // Only depends on roomName

//     // Separate useEffect for WebSocket message handling
//   useEffect(() => {
//     const socket = socketRef.current;
//     if (!socket) return;

//     socket.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         if (data.type === 'draw' && data.page === currentPage) {
//         drawFromServer(data);
//         } else if (data.type === 'page_change') {
//         handleRemotePageChange(data.page, data.pages);
//         } else if (data.type === 'add_page') {
//         setPages((prev) => [...prev, null]);
//         setCurrentPage((prev) => prev + 1); // Move to the new page
//         } else if (data.type === 'sync_page') {
//         setPages((prev) => {
//             const updated = [...prev];
//             updated[data.page] = data.image;
//             return updated;
//         });
//         if (data.page === currentPage) {
//             loadPageImage(data.image);
//         }
//         }
//     };

//         // No cleanup needed here since WebSocket is managed by the first useEffect
//   }, [currentPage]); // Depends on currentPage for message handling

//   useEffect(() => {
//     const ctx = ctxRef.current;
//     if (ctx) {
//       ctx.strokeStyle = color;
//       ctx.lineWidth = size;
//     }
//   }, [color, size]);

//   // When currentPage changes, load its image
//   useEffect(() => {
//     const image = pages[currentPage];
//     loadPageImage(image);
//     // eslint-disable-next-line
//   }, [currentPage, pages.length]);

//   const loadPageImage = (image) => {
//     const canvas = canvasRef.current;
//     const ctx = ctxRef.current;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     if (image) {
//       const img = new window.Image();
//       img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//       img.src = image;
//     }
//   };

//   const saveCurrentPage = () => {
//     const canvas = canvasRef.current;
//     const image = canvas.toDataURL();
//     setPages((prev) => {
//       const updated = [...prev];
//       updated[currentPage] = image;
//       return updated;
//     });
//     // Broadcast page image to others
//     socketRef.current.send(JSON.stringify({
//       type: 'sync_page',
//       page: currentPage,
//       image,
//     }));
//   };

//   // Drawing handlers
//   const startDrawing = ({ nativeEvent }) => {
//     const { offsetX, offsetY } = nativeEvent;
//     ctxRef.current.beginPath();
//     ctxRef.current.moveTo(offsetX, offsetY);
//     setIsDrawing(true);
//     ctxRef.current.__lastX = offsetX;
//     ctxRef.current.__lastY = offsetY;
//   };

//   const finishDrawing = () => {
//     ctxRef.current.closePath();
//     setIsDrawing(false);
//     saveCurrentPage();
//   };

//   const draw = ({ nativeEvent }) => {
//     if (!isDrawing) return;
//     const { offsetX, offsetY } = nativeEvent;
//     const ctx = ctxRef.current;

//     const data = {
//       type: 'draw',
//       page: currentPage,
//       from: { x1: ctx.__lastX, y1: ctx.__lastY },
//       to: { x2: offsetX, y2: offsetY },
//       color,
//       width: size,
//       mode: tool,
//     };
//     socketRef.current.send(JSON.stringify(data));

//     ctx.save();
//     ctx.lineWidth = size;
//     ctx.strokeStyle = tool === 'pen' ? color : 'rgba(0,0,0,1)';
//     ctx.globalCompositeOperation = tool === 'pen' ? 'source-over' : 'destination-out';
//     ctx.lineTo(offsetX, offsetY);
//     ctx.stroke();
//     ctx.beginPath();
//     ctx.moveTo(offsetX, offsetY);
//     ctx.restore();

//     ctx.__lastX = offsetX;
//     ctx.__lastY = offsetY;
//   };

//   const drawFromServer = ({ from, to, color, width, mode }) => {
//     const ctx = ctxRef.current;
//     ctx.save();
//     ctx.lineWidth = width;
//     ctx.strokeStyle = mode === 'pen' ? color : 'rgba(0,0,0,1)';
//     ctx.globalCompositeOperation = mode === 'pen' ? 'source-over' : 'destination-out';
//     ctx.beginPath();
//     ctx.moveTo(from.x1, from.y1);
//     ctx.lineTo(to.x2, to.y2);
//     ctx.stroke();
//     ctx.restore();
//   };

//   // Page controls
//   const handlePrevPage = () => {
//     if (currentPage === 0) return;
//     saveCurrentPage();
//     const newPage = currentPage - 1;
//     setCurrentPage(newPage);
//     socketRef.current.send(JSON.stringify({ type: 'page_change', page: newPage, pages: pages.length }));
//   };

//   const handleNextPage = () => {
//     if (currentPage === pages.length - 1) return;
//     saveCurrentPage();
//     const newPage = currentPage + 1;
//     setCurrentPage(newPage);
//     socketRef.current.send(JSON.stringify({ type: 'page_change', page: newPage, pages: pages.length }));
//   };

//   const handleAddPage = () => {
//     saveCurrentPage();
    
//     if(socketRef.current && socketRef.current.readyState !== WebSocket.OPEN) {
//       // Don't update pages or currentPage here!
//       socketRef.current.send(JSON.stringify({ type: 'add_page' }));
//       // Also send page_change so everyone moves to the new page
//       socketRef.current.send(JSON.stringify({ type: 'page_change', page: pages.length, pages: pages.length + 1 }));
//     } else{
//       // If WebSocket is not ready, just update the state
//       setPages((prev) => [...prev, null]);
//       setCurrentPage((prev) => prev + 1);
//     }
//   };

//   // Handle remote page change
//   const handleRemotePageChange = (page, totalPages) => {
//     if (totalPages > pages.length) {
//       setPages((prev) => {
//         const updated = [...prev];
//         while (updated.length < totalPages) updated.push(null);
//         return updated;
//       });
//     }
//     setCurrentPage(page);
//   };

//   // Clear current page
//   const clearCanvas = () => {
//     const canvas = canvasRef.current;
//     const ctx = ctxRef.current;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     saveCurrentPage();
//   };

//   return (
//     <div className="flex flex-col items-center py-6 px-4">
//         <div className='m-2 p-3 bg-blue-300 border rounded-sm border-blue-400'>Room : {roomName}</div>
//       <div className="flex flex-wrap items-center gap-4 mb-6">
//         <button
//           className={`px-4 py-2 rounded-md font-medium shadow-md ${
//             tool === 'pen' ? 'bg-emerald-600 text-white' : 'bg-gray-100'
//           }`}
//           onClick={() => setTool('pen')}
//         >
//           🖊️ Pen
//         </button>
//         <button
//           className={`px-4 py-2 rounded-md font-medium shadow-md ${
//             tool === 'eraser' ? 'bg-emerald-600 text-white' : 'bg-gray-100'
//           }`}
//           onClick={() => setTool('eraser')}
//         >
//           🧽 Eraser
//         </button>
//         <div className="flex items-center gap-2">
//           <label className="font-medium">Color:</label>
//           <input
//             type="color"
//             value={color}
//             onChange={(e) => setColor(e.target.value)}
//             className="w-10 h-10 p-1 rounded-md border border-gray-300"
//           />
//         </div>
//         <div className="flex items-center gap-2">
//           <label className="font-medium">Size:</label>
//           <input
//             type="range"
//             min="1"
//             max="40"
//             value={size}
//             onChange={(e) => setSize(parseInt(e.target.value))}
//             className="w-32"
//           />
//           <span className="text-sm text-gray-600">{size}px</span>
//         </div>
//         <button
//           onClick={clearCanvas}
//           className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
//         >
//           Clear
//         </button>
//       </div>
//       <div className="flex items-center gap-4 mb-4">
//         <button
//           onClick={handlePrevPage}
//           disabled={currentPage === 0}
//           className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300"
//         >
//           ⬅ Prev
//         </button>
//         <span className="font-semibold text-lg">
//           Page {currentPage + 1} / {pages.length}
//         </span>
//         <button
//           onClick={handleNextPage}
//           disabled={currentPage === pages.length - 1}
//           className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300"
//         >
//           Next ➡
//         </button>
//         <button
//           onClick={handleAddPage}
//           className="px-3 py-1 rounded bg-green-500 text-white"
//         >
//           + Add Page
//         </button>
//       </div>
//       <canvas
//         ref={canvasRef}
//         width={CANVAS_WIDTH}
//         height={CANVAS_HEIGHT}
//         onMouseDown={startDrawing}
//         onMouseUp={finishDrawing}
//         onMouseOut={finishDrawing}
//         onMouseMove={draw}
//         style={{ background: 'white', border: '1px solid #ccc', borderRadius: 8 }}
//       />
//     </div>
//   );
// };

// export default CurrWhiteboard;

import React, { useRef, useEffect, useState } from 'react';
import jsPDF from 'jspdf';

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 700;

const CurrWhiteboard = ({ roomName }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const socketRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(2);
  const [pages, setPages] = useState([null]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    canvas.classList.add('border', 'rounded-md', 'bg-white', 'shadow-md');

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctxRef.current = ctx;

    const socket = new WebSocket(`ws://localhost:8000/ws/room/${roomName}/`);
    socketRef.current = socket;

    socketRef.current.onopen = () => {
      socketRef.current.send(JSON.stringify({ type: 'request_sync', page: currentPage }));
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    socketRef.current.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => socketRef.current.close();
  }, [roomName]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'draw' && data.page === currentPage) {
        drawFromServer(data);
      } else if (data.type === 'page_change') {
        handleRemotePageChange(data.page, data.pages);
      } else if (data.type === 'add_page') {
        setPages((prev) => [...prev, null]);
        setCurrentPage((prev) => prev + 1);
      } else if (data.type === 'sync_page') {
        setPages((prev) => {
          const updated = [...prev];
          updated[data.page] = data.image;
          return updated;
        });
        if (data.page === currentPage) {
          loadPageImage(data.image);
        }
      }
    };
  }, [currentPage]);

  useEffect(() => {
    const ctx = ctxRef.current;
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
    }
  }, [color, size]);

  useEffect(() => {
    const image = pages[currentPage];
    loadPageImage(image);
  }, [currentPage, pages.length]);

  const loadPageImage = (image) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (image) {
      const img = new window.Image();
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src = image;
    }
  };

  const saveCurrentPage = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL();
    setPages((prev) => {
      const updated = [...prev];
      updated[currentPage] = image;
      return updated;
    });
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'sync_page',
        page: currentPage,
        image,
      }));
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [CANVAS_WIDTH, CANVAS_HEIGHT],
    });

    let hasContent = false;
    pages.forEach((page, index) => {
      if (page) {
        if (index > 0) {
          doc.addPage([CANVAS_WIDTH, CANVAS_HEIGHT], 'landscape');
        }
        doc.addImage(page, 'PNG', 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        hasContent = true;
      }
    });

    if (!hasContent) {
      alert('No pages with content to export!');
      return;
    }

    doc.save(`whiteboard-${roomName}.pdf`);
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    ctxRef.current.__lastX = offsetX;
    ctxRef.current.__lastY = offsetY;
  };

  const finishDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
    saveCurrentPage();
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const ctx = ctxRef.current;

    const data = {
      type: 'draw',
      page: currentPage,
      from: { x1: ctx.__lastX, y1: ctx.__lastY },
      to: { x2: offsetX, y2: offsetY },
      color,
      width: size,
      mode: tool,
    };
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }

    ctx.save();
    ctx.lineWidth = size;
    ctx.strokeStyle = tool === 'pen' ? color : 'rgba(0,0,0,1)';
    ctx.globalCompositeOperation = tool === 'pen' ? 'source-over' : 'destination-out';
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    ctx.restore();

    ctx.__lastX = offsetX;
    ctx.__lastY = offsetY;
  };

  const drawFromServer = ({ from, to, color, width, mode }) => {
    const ctx = ctxRef.current;
    ctx.save();
    ctx.lineWidth = width;
    ctx.strokeStyle = mode === 'pen' ? color : 'rgba(0,0,0,1)';
    ctx.globalCompositeOperation = mode === 'pen' ? 'source-over' : 'destination-out';
    ctx.beginPath();
    ctx.moveTo(from.x1, from.y1);
    ctx.lineTo(to.x2, to.y2);
    ctx.stroke();
    ctx.restore();
  };

  const handlePrevPage = () => {
    if (currentPage === 0) return;
    saveCurrentPage();
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'page_change', page: newPage, pages: pages.length }));
    }
  };

  const handleNextPage = () => {
    if (currentPage === pages.length - 1) return;
    saveCurrentPage();
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'page_change', page: newPage, pages: pages.length }));
    }
  };

  const handleAddPage = () => {
    saveCurrentPage();
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'add_page' }));
      socketRef.current.send(JSON.stringify({ type: 'page_change', page: pages.length, pages: pages.length + 1 }));
    } else {
      setPages((prev) => [...prev, null]);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleRemotePageChange = (page, totalPages) => {
    if (totalPages > pages.length) {
      setPages((prev) => {
        const updated = [...prev];
        while (updated.length < totalPages) updated.push(null);
        return updated;
      });
    }
    setCurrentPage(page);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveCurrentPage();
  };

  return (
    <div className="flex flex-col items-center py-6 px-4">
      <div className='m-2 p-3 bg-blue-300 border rounded-sm border-blue-400'>Room: {roomName}</div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md font-medium shadow-md ${
            tool === 'pen' ? 'bg-emerald-600 text-white' : 'bg-gray-100'
          }`}
          onClick={() => setTool('pen')}
        >
          🖊️ Pen
        </button>
        <button
          className={`px-4 py-2 rounded-md font-medium shadow-md ${
            tool === 'eraser' ? 'bg-emerald-600 text-white' : 'bg-gray-100'
          }`}
          onClick={() => setTool('eraser')}
        >
          🧽 Eraser
        </button>
        <div className="flex items-center gap-2">
          <label className="font-medium">Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 p-1 rounded-md border border-gray-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-medium">Size:</label>
          <input
            type="range"
            min="1"
            max="40"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-32"
          />
          <span className="text-sm text-gray-600">{size}px</span>
        </div>
        <button
          onClick={clearCanvas}
          className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
        >
          Clear
        </button>
        <button
          onClick={generatePDF}
          className="px-4 py-2 rounded bg-purple-500 text-white hover:bg-purple-600"
        >
          Download PDF
        </button>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300"
        >
          ⬅ Prev
        </button>
        <span className="font-semibold text-lg">
          Page {currentPage + 1} / {pages.length}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === pages.length - 1}
          className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300"
        >
          Next ➡
        </button>
        <button
          onClick={handleAddPage}
          className="px-3 py-1 rounded bg-green-500 text-white"
        >
          + Add Page
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseOut={finishDrawing}
        onMouseMove={draw}
        style={{ background: 'white', border: '1px solid #ccc', borderRadius: 8 }}
      />
    </div>
  );
};

export default CurrWhiteboard;