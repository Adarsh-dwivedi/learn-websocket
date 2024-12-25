import { useRef, useState } from 'react'
import Login from './components/Login';
import Landing from './components/Landing';

function App() {
  const [username, setUsername] = useState("");
  const [click, setClick] = useState(false);
  const [data, setData] = useState("");
  const id = useRef();

  return (
    <>
      {click? <Landing username={username} data={data}/>: <Login 
      onChange={(e)=>{
        setUsername(e.target.value);
      }} 
      onClick={(e)=>{
        const socket = new WebSocket(`ws://localhost:8000/?username=${username}`);
        const handleMouseEvent = (e) =>{
          clearTimeout(id.current);
          id.current = setTimeout(async ()=>{
            const data = JSON.stringify({"x": e.clientX, "y": e.clientY});
            socket.send(data);
          }, 50);
          
        };

        const handleMessageSocketEvent = (e) =>{
          setData(e.data);
        };

        const handleOpenSocketEvent = (e)=>{
          //send message when cursor update
          window.addEventListener("mousemove", handleMouseEvent);
          //listen for message
          socket.addEventListener("message", handleMessageSocketEvent);
        }
        
        const handleCloseSocketEvent = (e) =>{
          //clean up event
          socket.removeEventListener("message", handleMessageSocketEvent);
          window.removeEventListener("mousemove", handleMouseEvent);
          socket.removeEventListener("open", handleOpenSocketEvent);
        }
        socket.addEventListener("open", handleOpenSocketEvent);
        socket.addEventListener("close", handleCloseSocketEvent);
        setClick(true);
      }}/>}
    </>
  )
}

export default App
