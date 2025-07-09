// import React, { useEffect, useRef, useState } from 'react'
// import WhiteBoardPage from './WhiteBoardPage'

// const WhiteBoard = ({roomName}) => {

//     console.log("rendered")
//     const isDrawing = useRef(false);
//     const canvasRef = useRef(null);

//     const [color, setColor] = useState("#000000");
//     const [penSize, setPenSize] = useState(2);
//     const [tool, setTool] = useState("pen");

//     // const [currPage, setCurrPage] = useState()
//     // const [pageList, setPageList] = useState([])
//     const socketRef = useRef(null);
    
//     useEffect(() => {
//       // socket = new WebSocket(`ws://localhost:8000/ws/room/${roomName}/`);
//       socketRef.current = new WebSocket(`ws://localhost:8000/ws/room/${roomName}/`)
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");

//       socketRef.current.onmessage = (e) => {
//         const data = JSON.parse(e.data);

//         if (data.type === "clear") {
//           ctx.clearRect(0, 0, canvas.width, canvas.height);
//         } else {
//           const { x0, y0, x1, y1, color, penSize } = data;
//           drawLine(x0, y0, x1, y1, color, penSize, ctx, false);
//         }
//       };
//       return () => socketRef.current.close();
//     }, [roomName]);

//     const drawLine = (x0, y0, x1, y1, strokeColor, strokeWidth, ctx, emit = true) => {
//       ctx.strokeStyle = strokeColor;
//       ctx.lineWidth = strokeWidth;
//       ctx.lineCap = "round";

//       ctx.beginPath();
//       ctx.moveTo(x0, y0);
//       ctx.lineTo(x1, y1);
//       ctx.stroke();
//       ctx.closePath();

//       if (!emit) return;

//       socketRef.current.send(
//         JSON.stringify({ x0, y0, x1, y1, color: strokeColor, penSize: strokeWidth})
//       );
//     };

//     const MouseClick = (e) => {
//       const x = e.nativeEvent.offsetX;
//       const y = e.nativeEvent.offsetY;

//       isDrawing.current = true;
//       canvasRef.current.prevX = x;
//       canvasRef.current.prevY = y;
//     };

//     const MouseWriting = (e) => {
//       if (!isDrawing.current) return;

//       const x = e.nativeEvent.offsetX;
//       const y = e.nativeEvent.offsetY;

//       drawLine(
//         canvasRef.current.prevX,
//         canvasRef.current.prevY,
//         x,
//         y,
//         color,
//         penSize,
//         canvasRef.current.getContext("2d")
//       );

//       canvasRef.current.prevX = x;
//       canvasRef.current.prevY = y;
//     };

//     const MouseUnclick = () => {
//       isDrawing.current = false;
//     };

//     const clearCanvas = () => {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       socketRef.current.send(JSON.stringify({ type: "clear" }));
//     };

//     const handlePrevPage = () => {
//       console.log("Prev Page")
      
//     }

//     const handleNextPage = () => {
//       console.log("Next Page")
//     }

//   return (
//     <>
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 relative">
//         <h1 className="text-3xl font-semibold mb-4 text-gray-800">
//             Room: <span className="text-blue-600">{roomName}</span>
//         </h1>
//         {/* Toolbar */}
//       <div className="flex items-center space-x-4 mb-4">
//         <label className="flex items-center space-x-2">
//           <span className="text-sm text-gray-700">Color:</span>
//           <input
//             type="color"
//             value={color}
//             onChange={(e) => setColor(e.target.value)}
//             className="h-8 w-8 border border-gray-300 rounded"
//           />
//         </label>

//         <label className="flex items-center space-x-2">
//           <span className="text-sm text-gray-700">Size:</span>
//           <input
//             type="range"
//             min="1"
//             max="40"
//             value={penSize}
//             onChange={(e) => setPenSize(parseInt(e.target.value))}
//             className="w-28"
//           />
//           <span>{penSize}px</span>
//         </label>

//         <button
//           onClick={() => setTool("pen")}
//           className={`px-3 py-1 rounded ${tool === "pen" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
//           Pen
//         </button>

//         <button
//           onClick={() => {
//             setColor("#ffffff");     // white for eraser
//             setPenSize(40);          // thicker for ease
//             setTool("pen");
//           }}
//           className="px-3 py-1 rounded bg-gray-500 text-white">
//           Eraser
//         </button>

//         <button
//           onClick={clearCanvas}
//           className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600">
//           Clear
//         </button>
//       </div>
//       <button onClick={handlePrevPage} className="bg-emerald-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Prev</button>
//       <WhiteBoardPage canvasRef={canvasRef} handleMouseDown={MouseClick} handleMouseUp={MouseUnclick} handleMouseMove={MouseWriting}/>
//       <button onClick={handleNextPage} className="bg-emerald-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Next</button>
//     </div>
//     </>
//   )
// }

// export default WhiteBoard

// 44444444444444444444444444444444444444444444444444444444


// import React, { useRef, useEffect, useState } from 'react';

// const Whiteboard = ({ roomName }) => {
//   const canvasRef = useRef(null);
//   const ctxRef = useRef(null);
//   const socketRef = useRef(null);

//   const [isDrawing, setIsDrawing] = useState(false);
//   const [tool, setTool] = useState('pen');
//   const [color, setColor] = useState('#000000');
//   const [size, setSize] = useState(2);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     canvas.width = window.outerWidth;
//     canvas.height = window.outerHeight;
//     canvas.classList.add('border', 'rounded-md', 'bg-white', 'shadow-md');

//     const ctx = canvas.getContext('2d');
//     ctx.lineCap = 'round';
//     ctx.strokeStyle = color;
//     ctx.lineWidth = size;
//     ctxRef.current = ctx;

//     const socket = new WebSocket(`ws://localhost:8000/ws/room/${roomName}/`);
//     socketRef.current = socket;

//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.type === 'draw') {
//         drawFromServer(data);
//       }
//     };

//     return () => socket.close();
//   }, []);

//   useEffect(() => {
//     const ctx = ctxRef.current;
//     ctx.strokeStyle = color;
//     ctx.lineWidth = size;
//   }, [color, size]);

//   const startDrawing = ({ nativeEvent }) => {
//     const { offsetX, offsetY } = nativeEvent;
//     ctxRef.current.beginPath();
//     ctxRef.current.moveTo(offsetX, offsetY);
//     setIsDrawing(true);
//   };

//   const finishDrawing = () => {
//     ctxRef.current.closePath();
//     setIsDrawing(false);
//   };

//   const draw = ({ nativeEvent }) => {
//     if (!isDrawing) return;

//     const { offsetX, offsetY } = nativeEvent;
//     const ctx = ctxRef.current;

//     const data = {
//       type: 'draw',
//       from: { x1: ctx.__lastX || offsetX, y1: ctx.__lastY || offsetY },
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

//   return (
//     <div className="flex flex-col items-center py-6 px-4">
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
//           <span  className="text-sm text-gray-600">{size}px</span>
//         </div>
//       </div>
//       <canvas
//         ref={canvasRef}
//         onMouseDown={startDrawing}
//         onMouseUp={finishDrawing}
//         onMouseOut={finishDrawing}
//         onMouseMove={draw}
//       />
//     </div>
//   );
// };

// export default Whiteboard;


// 44444444444444444444444444444444444444444444444444444444

// import React, { useRef, useEffect, useState } from 'react';

// const CANVAS_WIDTH = 1200;
// const CANVAS_HEIGHT = 700;

// const Whiteboard = ({ roomName }) => {
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

//   // Sync page and drawing actions via WebSocket
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     canvas.width = CANVAS_WIDTH;
//     canvas.height = CANVAS_HEIGHT;
//     canvas.classList.add('border', 'rounded-md', 'bg-white', 'shadow-md');

//     const ctx = canvas.getContext('2d');
//     ctx.lineCap = 'round';
//     ctx.strokeStyle = color;
//     ctx.lineWidth = size;
//     ctxRef.current = ctx;

//     const socket = new WebSocket(`ws://localhost:8000/ws/room/${roomName}/`);
//     socketRef.current = socket;

//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.type === 'draw' && data.page === currentPage) {
//         drawFromServer(data);
//       } else if (data.type === 'page_change') {
//         handleRemotePageChange(data.page, data.pages);
//       } else if (data.type === 'add_page') {
//         setPages((prev) => [...prev, null]);
//         setCurrentPage(prev => prev + 1); // Move to the new page
//       } else if (data.type === 'sync_page') {
//         setPages((prev) => {
//           const updated = [...prev];
//           updated[data.page] = data.image;
//           return updated;
//         });
//         if (data.page === currentPage) {
//           loadPageImage(data.image);
//         }
//       }
//     };

//     // On mount, request current page state from others
//     socket.onopen = () => {
//       socket.send(JSON.stringify({ type: 'request_sync', page: currentPage }));
//     };

//     return () => socket.close();
//     // eslint-disable-next-line
//   }, [roomName, currentPage]);

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
//     // Don't update pages or currentPage here!
//     socketRef.current.send(JSON.stringify({ type: 'add_page' }));
//     // Also send page_change so everyone moves to the new page
//     socketRef.current.send(JSON.stringify({ type: 'page_change', page: pages.length, pages: pages.length + 1 }));
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

// export default Whiteboard;


// Copilot Code Khatam