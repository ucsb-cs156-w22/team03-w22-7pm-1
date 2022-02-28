import React from "react";
import OurTable from "main/components/OurTable";
//import { useBackendMutation } from "main/utils/useBackend";
//import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/EarthquakesUtils"
//import { useNavigate } from "react-router-dom";
//import { hasRole } from "main/utils/currentUser";

export default function EarthquakesTable({  earthquakes, currentUser }) {

 /*   
    const navigate = useNavigate();
    const editCallback = (cell) => {
        navigate(`/Earthquakes/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/earthquakes/all"]
    );
    // Stryker enable all 

    // Stryker disable next-li　ne all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }
*/
    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'title',
            accessor: 'eqproperties.title',
        },
        {
            Header: 'mag',
            accessor: 'eqproperties.mag',
        },
        {
            Header: 'place',
            accessor: 'eqproperties.place',
        },
        {
            Header: 'time',
            accessor: 'eqproperties.time',
        }
    ];

    // Stryker disable ArrayDeclaration : [columns] and [students] are performance optimization; mutation preserves correctness
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const memoizedDates = React.useMemo(() =>  earthquakes, [earthquakes]);
    // Stryker enable ArrayDeclaration

    return <OurTable
        data={memoizedDates}
        columns={memoizedColumns}
        testid={"EarthquakesTable"}
    />;
};