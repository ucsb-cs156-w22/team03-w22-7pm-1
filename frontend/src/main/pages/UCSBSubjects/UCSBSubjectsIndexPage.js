<<<<<<< HEAD
=======
// import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

// export default function UCSBSubjectsIndexPage() {
//   return (
//     <BasicLayout>
//       <div className="pt-2">
//         <h1>UCSBSubjects</h1>
//         <p>
//           This is where the index page will go
//         </p>
//       </div>
//     </BasicLayout>
//   )
// }

>>>>>>> dcddd208268ebdc51183f2461ab79ada08a96d97
import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBSubjectsTable from 'main/components/UCSBSubjects/UCSBSubjectsTable';
import { useCurrentUser } from 'main/utils/currentUser'
<<<<<<< HEAD

import { subjectFixtures } from "fixtures/ucsbSubjectsFixtures";
=======
>>>>>>> dcddd208268ebdc51183f2461ab79ada08a96d97

export default function UCSBSubjectsIndexPage() {

  const currentUser = useCurrentUser();

  const { data: subjects, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
<<<<<<< HEAD
      ["/api/UCSBSubjects/all"],
      { method: "GET", url: "/api/UCSBSubjects/all" },
=======
      ["/api/ucsbsubjects/all"],
      { method: "GET", url: "/api/ucsbsubjects/all" },
>>>>>>> dcddd208268ebdc51183f2461ab79ada08a96d97
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>UCSBSubjects</h1>
        <UCSBSubjectsTable subjects={subjects} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
} 