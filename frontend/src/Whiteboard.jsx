import { useEffect, useRef } from "react";

function Whiteboard({ roomName }) {
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    socketRef.current = new WebSocket(`ws://localhost:8000/ws/room/${roomName}/`);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    socketRef.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if(data.type == "init"){
            data.data.forEach(({x0,y0,x1,y1}) => {
                drawLine(x0,y0,x1,y1,ctx,false);
            });
        }else{
            const {x0, y0, x1, y1 } = data;
            drawLine(x0, y0, x1, y1, ctx, false);
        }
    };

    return () => socketRef.current.close();
  }, [roomName]);

  const drawLine = (x0, y0, x1, y1, ctx, emit = true) => {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();

    if (!emit) return;
    socketRef.current.send(JSON.stringify({ x0, y0, x1, y1 }));
  };

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    canvasRef.current.prevX = e.nativeEvent.offsetX;
    canvasRef.current.prevY = e.nativeEvent.offsetY;
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    drawLine(canvasRef.current.prevX, canvasRef.current.prevY, x, y, canvasRef.current.getContext("2d"));
    canvasRef.current.prevX = x;
    canvasRef.current.prevY = y;
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        Room: <span className="text-blue-600">{roomName}</span>
      </h1>

      <div className="bg-white shadow-lg rounded-xl p-4 border border-gray-200">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="border-2 border-gray-300 rounded-lg bg-white cursor-crosshair"
        />
      </div>
    </div>
  );
}

export default Whiteboard;
