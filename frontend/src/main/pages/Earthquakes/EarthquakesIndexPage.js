import React from 'react'
import { useBackend } from 'main/utils/useBackend';
import { toast } from "react-toastify";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import EarthquakesTable from 'main/components/Earthquakes/EarthquakesTable';
import { useCurrentUser } from 'main/utils/currentUser'
import { useBackendMutation } from 'main/utils/useBackend';
import { Button } from 'react-bootstrap';


export default function EarthquakesIndexPage() {

  const currentUser = useCurrentUser();

  const { data: earthquakes, error: _error, status: _status } =
    useBackend(
      ["/api/earthquakes/all"],
      { method: "GET", url: "/api/earthquakes/all" },
      []
    );

    const objectToAxiosParams = (earthquakes) => ({
      url: "/api/earthquakes/purge",
      method: "POST"
    });
  
  
    const purgeMutation = useBackendMutation(
      objectToAxiosParams,
      {
        onSuccess: () =>  toast("purge all"),
      },
      ['/api/earthquakes/all'],
    );
  
    const earthquakesPurge = async (data) => {
      purgeMutation.mutate(data);
    }


  return (

    <BasicLayout>
      <div className="pt-2">
        <h1>Earthquakes</h1>
        <EarthquakesTable earthquakes={earthquakes} currentUser={currentUser} />
        <Button
            type="Purge"
            onClick={earthquakesPurge}
            data-testid="EarthquakesIndexPage-purge"
        >
            Purge
        </Button>
     
      </div>
    </BasicLayout>


  )
}
// import React from 'react'
// import { useBackend } from 'main/utils/useBackend';

// import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
// import EarthquakesTable from 'main/components/Earthquakes/EarthquakesTable';
// import { useCurrentUser } from 'main/utils/currentUser'


// export default function EarthquakesIndexPage() {

//   const currentUser = useCurrentUser();

//   const { data: earthquakes, error: _error, status: _status } =
//     useBackend(
//       // Stryker disable next-line all : don't test internal caching of React Query
//       ["/api/earthquakes/all"],
//       { method: "GET", url: "/api/earthquakes/all" },
//       []
//     );

//   return (
//     <BasicLayout>
//       <div className="pt-2">
//         <h1>Earthquakes</h1>
//         <EarthquakesTable earthquakes={earthquakes} currentUser={currentUser} />
//       </div>
//     </BasicLayout>
//   )
// }