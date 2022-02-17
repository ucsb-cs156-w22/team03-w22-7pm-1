import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
// import { toast } from "react-toastify";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/UCSBSubjectUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

//EX: To be completely honest I'm not sure if I need those arguements in this functions's parameters
export default function UCSBSubjectsTable({ id,subjectCode,subjectTranslation,deptCode,collegeCode,relatedDeptCode,inactive, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/ucsbsubjects/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/ucsbsubjects/all"]
    );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Subject Code',
            accessor: 'subjectCode',
        },
        {
            Header: 'Subject Translation',
            accessor: 'subjectTranslation',
        },
        {
            Header: 'Department Code',
            accessor: 'deptCode',
        },
        {
            Header: 'College Code',
            accessor: 'collegeCode',
        },
        {
            Header: 'Related Department Code',
            accessor: 'relatedDeptCode',
        },
        {
            Header: 'Inactive',
            accessor: 'inactive',
        }
        
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "UCSBSubjectsTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "UCSBSubjectsTable"));
    } 

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const memoizedDates = React.useMemo(() => dates, [dates]);

    return <OurTable
        data={memoizedDates}
        columns={memoizedColumns}
        testid={"UCSBSubjectsTable"}
    />;
};