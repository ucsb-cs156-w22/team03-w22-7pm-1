import { render, waitFor, fireEvent } from "@testing-library/react";
import UCSBSubjectsCreatePage from "main/pages/UCSBSubjects/UCSBSubjectsCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBSubjectsCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBSubjectsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const ucsbSubject = {
            id: 17,
            subjectCode: "DNCE",
            subjectTranslation: "Dance",
            deptCode: "L&S",
            collegeCode: "UCSB",
            relatedDeptCode: "DUNNO",
            inactive: false
        };

        axiosMock.onPost("/api/UCSBSubjects/post").reply( 202, ucsbSubject );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBSubjectsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("UCSBSubjectForm-subjectCode")).toBeInTheDocument();
        });

        const idField = getByTestId("UCSBSubjectForm-id");
        const subjectCodeField = getByTestId("UCSBSubjectForm-subjectCode");
        const subjectTranslationField = getByTestId("UCSBSubjectForm-subjectTranslation");
        const deptCodeField = getByTestId("UCSBSubjectForm-deptCode");
        const collegeCodeField = getByTestId("UCSBSubjectForm-collegeCode");
        const relatedDeptCodeField = getByTestId("UCSBSubjectForm-relatedDeptCode");
        const inactiveField = getByTestId("UCSBSubjectForm-inactive");
        const submitButton = getByTestId("UCSBSubjectForm-submit");

        fireEvent.change(subjectCodeField, { target: { value: 'DNCE' } })
        fireEvent.change(subjectTranslationField, { target: { value: 'Dance' } })
        fireEvent.change(deptCodeField, { target: { value: "L&S" } })
        fireEvent.change(collegeCodeField,{ target: { value: "UCSB" } })
        fireEvent.change(relatedDeptCodeField,{ target: { value: "DUNNO" } })
        fireEvent.change(inactiveField,{ target: { value: false } })

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "inactive": false,
            "relatedDeptCode": "DUNNO",
            "collegeCode": "UCSB",
            "deptCode": "L&S",
            "subjectTranslation": "Dance",
            "subjectCode": "DNCE"
        });

        expect(mockToast).toBeCalledWith("New ucsbSubject Created - id: 17 subject code: DNCE");
        expect(mockNavigate).toBeCalledWith({ "to": "/ucsbsubjects/list" });
    });


});


