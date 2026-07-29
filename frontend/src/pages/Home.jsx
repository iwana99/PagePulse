
import { useMonitorStore } from "../hooks/monitorHook"
import {useEffect} from 'react'
import { useNavigate } from "react-router-dom"

const Home = () => {
const {monitors,getAllMonitors,loading,error}= useMonitorStore()
  const navigate = useNavigate();
      useEffect(()=>{getAllMonitors()},[getAllMonitors])

     
      if(loading){return<div>Stranica se ucitava...</div>}

      if(error){return  <div>Greska:{error}</div>}

        if (monitors.length === 0) {
    return <p>Nema monitora.</p>;
  }
    return (<>
      <div className="flex flex-wrap gap-4 m-10">
  {monitors.map((monitor) => (
    <div
      key={monitor._id}
      className="w-64 rounded-lg border border-gray-300 p-4 shadow-sm "
      onClick={()=>{navigate(`/monitor/${monitor._id}`)}}
    >
      <h1 className="text-lg font-semibold">
        TITLE: {monitor.title}
      </h1>
      <p>URL: {monitor.url}</p>
    </div>
  ))}
</div>
      </>
    )
}

export default Home