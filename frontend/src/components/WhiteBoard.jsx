import React, { useEffect, useRef, useState } from 'react'
import WhiteBoardPage from './WhiteBoardPage'

const WhiteBoard = ({roomName}) => {

    const isDrawing = useRef(false);
    const canvasRef = useRef(null);

    const [color, setColor] = useState("#000000");
    const [penSize, setPenSize] = useState(2);
    const [tool, setTool] = useState("pen");

    // const [currPage, setCurrPage] = useState()
    // const [pageList, setPageList] = useState([])
    const socketRef = useRef(null);
    socketRef.current = new WebSocket(`ws://localhost:8000/ws/room/${roomName}/`)

    useEffect(() => {
    // socket = new WebSocket(`ws://localhost:8000/ws/room/${roomName}/`);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      socketRef.current.onmessage = (e) => {
        const data = JSON.parse(e.data);

        if (data.type === "clear") {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
          const { x0, y0, x1, y1, color, penSize } = data;
          drawLine(x0, y0, x1, y1, color, penSize, ctx, false);
        }
      };
      return () => socketRef.current.close();
    }, [roomName]);

    const drawLine = (x0, y0, x1, y1, strokeColor, strokeWidth, ctx, emit = true) => {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.closePath();

      if (!emit) return;

      socketRef.current.send(
        JSON.stringify({ x0, y0, x1, y1, color: strokeColor, penSize: strokeWidth })
      );
    };

    const MouseClick = (e) => {
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;

      isDrawing.current = true;
      canvasRef.current.prevX = x;
      canvasRef.current.prevY = y;
    };

    const MouseWriting = (e) => {
      if (!isDrawing.current) return;

      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;

      drawLine(
        canvasRef.current.prevX,
        canvasRef.current.prevY,
        x,
        y,
        color,
        penSize,
        canvasRef.current.getContext("2d")
      );

      canvasRef.current.prevX = x;
      canvasRef.current.prevY = y;
    };

    const MouseUnclick = () => {
      isDrawing.current = false;
    };

    const clearCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      socketRef.current.send(JSON.stringify({ type: "clear" }));
    };

    const handlePrevPage = () => {
      console.log("Prev Page")
      
    }

    const handleNextPage = () => {
      console.log("Next Page")
    }

  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 relative">
        <h1 className="text-3xl font-semibold mb-4 text-gray-800">
            Room: <span className="text-blue-600">{roomName}</span>
        </h1>
        {/* Toolbar */}
      <div className="flex items-center space-x-4 mb-4">
        <label className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Color:</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-8 w-8 border border-gray-300 rounded"
          />
        </label>

        <label className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Size:</span>
          <input
            type="range"
            min="1"
            max="40"
            value={penSize}
            onChange={(e) => setPenSize(parseInt(e.target.value))}
            className="w-28"
          />
          <span>{penSize}px</span>
        </label>

        <button
          onClick={() => setTool("pen")}
          className={`px-3 py-1 rounded ${tool === "pen" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
          Pen
        </button>

        <button
          onClick={() => {
            setColor("#ffffff");     // white for eraser
            setPenSize(40);          // thicker for ease
            setTool("pen");
          }}
          className="px-3 py-1 rounded bg-gray-500 text-white">
          Eraser
        </button>

        <button
          onClick={clearCanvas}
          className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600">
          Clear
        </button>
      </div>
      <button onClick={handlePrevPage} className="bg-emerald-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Prev</button>
      <WhiteBoardPage canvasRef={canvasRef} handleMouseDown={MouseClick} handleMouseUp={MouseUnclick} handleMouseMove={MouseWriting}/>
      <button onClick={handleNextPage} className="bg-emerald-500 hover:bg-green-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Next</button>
    </div>
    </>
  )
}

export default WhiteBoard
