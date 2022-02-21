import {  render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBSubjectsIndexPage from "main/pages/UCSBSubjects/UCSBSubjectsIndexPage";


import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { subjectFixtures } from "fixtures/ucsbSubjectsFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

describe("UCSBSubjectsIndexPage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    const testId = "UCSBSubjectsTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    test("renders without crashing for regular user", () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/UCSBSubjects/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBSubjectsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );


    });

    test("renders without crashing for admin user", () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/UCSBSubjects/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBSubjectsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );


    });

    test("renders two subjects without crashing for regular user", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/UCSBSubjects/all").reply(200, subjectFixtures.twoSubjects);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBSubjectsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
            expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");

            expect(getByTestId(`${testId}-cell-row-0-col-subjectCode`)).toHaveTextContent("CMPSC");
            expect(getByTestId(`${testId}-cell-row-1-col-subjectCode`)).toHaveTextContent("COMM");

            expect(getByTestId(`${testId}-cell-row-0-col-subjectTranslation`)).toHaveTextContent("Computer Science");
            expect(getByTestId(`${testId}-cell-row-1-col-subjectTranslation`)).toHaveTextContent("Communications");

            expect(getByTestId(`${testId}-cell-row-0-col-deptCode`)).toHaveTextContent("ENGR");
            expect(getByTestId(`${testId}-cell-row-1-col-deptCode`)).toHaveTextContent("L&S");

            expect(getByTestId(`${testId}-cell-row-0-col-collegeCode`)).toHaveTextContent("UCSB");
            expect(getByTestId(`${testId}-cell-row-1-col-collegeCode`)).toHaveTextContent("UCSB");

            expect(getByTestId(`${testId}-cell-row-0-col-relatedDeptCode`)).toHaveTextContent("DUNNO");
            expect(getByTestId(`${testId}-cell-row-1-col-relatedDeptCode`)).toHaveTextContent("DUNNO");

            expect(getByTestId(`${testId}-cell-row-0-col-inactive`)).toHaveTextContent("false");
            expect(getByTestId(`${testId}-cell-row-1-col-inactive`)).toHaveTextContent("false");
        });
    });

    test("renders two subjects without crashing for admin user", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/UCSBSubjects/all").reply(200, subjectFixtures.twoSubjects);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBSubjectsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { 
            expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
            expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");

            expect(getByTestId(`${testId}-cell-row-0-col-subjectCode`)).toHaveTextContent("1A");
            expect(getByTestId(`${testId}-cell-row-1-col-subjectCode`)).toHaveTextContent("2A");

            expect(getByTestId(`${testId}-cell-row-0-col-subjectTranslation`)).toHaveTextContent("1B");
            expect(getByTestId(`${testId}-cell-row-1-col-subjectTranslation`)).toHaveTextContent("2B");

            expect(getByTestId(`${testId}-cell-row-0-col-deptCode`)).toHaveTextContent("1C");
            expect(getByTestId(`${testId}-cell-row-1-col-deptCode`)).toHaveTextContent("2C");

            expect(getByTestId(`${testId}-cell-row-0-col-collegeCode`)).toHaveTextContent("1D");
            expect(getByTestId(`${testId}-cell-row-1-col-collegeCode`)).toHaveTextContent("2D");

            expect(getByTestId(`${testId}-cell-row-0-col-relatedDeptCode`)).toHaveTextContent("1E");
            expect(getByTestId(`${testId}-cell-row-1-col-relatedDeptCode`)).toHaveTextContent("2E");

            expect(getByTestId(`${testId}-cell-row-0-col-inactive`)).toHaveTextContent("true");
            expect(getByTestId(`${testId}-cell-row-1-col-inactive`)).toHaveTextContent("false");
         });
    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/UCSBSubjects/all").timeout();

        const restoreConsole = mockConsole();

        const { queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBSubjectsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/UCSBSubjects/all");
        restoreConsole();

        expect(queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });

});