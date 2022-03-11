import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import EarthquakesForm from "main/components/Earthquakes/EarthquakesForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function EarthquakesRetrievePage() {

  const objectToAxiosParams = (earthquakes) => ({
    url: "/api/earthquakes/retrieve",
    method: "POST",
    params: {
      
      minMagnitude: earthquakes.minMagnitude,
      distanceKM: earthquakes.distanceKM,
    }
  });
//this line need to be fix 
  const onSuccess = (earthquakes) => {
    toast(`${earthquakes.length} Earthquakes retrieved`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
   // Stryker disable next-line all : hard to set up test for caching
     ["/api/earthquakes/all"]
     );
  
     const { isSuccess } = mutation

     const onSubmit = async (data) => {
       mutation.mutate(data);
     }
   
     if (isSuccess) {
       return <Navigate to="/earthquakes/list" />
     }



  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Retrieved earthquakes</h1>

        <EarthquakesForm submitAction={onSubmit} />


      </div>
    </BasicLayout>
  )
}

