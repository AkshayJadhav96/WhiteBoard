// import { useEffect, useRef, useState } from "react";

function WhiteBoardPage({canvasRef,handleMouseDown,handleMouseMove,handleMouseUp}) {

  return (
      <div className="bg-white shadow-lg rounded-xl p-4 m-5 border border-gray-200 relative">
        <canvas
          ref={canvasRef}
          width={900}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="border-2 border-gray-300 rounded-lg bg-white cursor-crosshair"
        />
      </div>
  );
}

export default WhiteBoardPage;
