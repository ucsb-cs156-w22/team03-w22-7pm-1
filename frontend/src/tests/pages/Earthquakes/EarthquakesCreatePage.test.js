import { render, waitFor, fireEvent } from "@testing-library/react";
import EarthquakesCreatePage from "main/pages/Earthquakes/EarthquakesCreatePage";
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

describe("EarthquakesCreatePage tests", () => {

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
                    <EarthquakesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const earthquakes = {
            distance:1,
            mag:2.6,
            length:1,
        };

        axiosMock.onPost("/api/earthquakes/post").reply( 202, earthquakes );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EarthquakesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("EarthquakesForm-distance")).toBeInTheDocument();
        });

        const distanceField = getByTestId("EarthquakesForm-distance");
        const magField = getByTestId("EarthquakesForm-mag");
        const submitButton = getByTestId("EarthquakesForm-retrieve");

        fireEvent.change(distanceField, { target: { value: '1' } });
        fireEvent.change(magField, { target: { value: '2.6' } });
 
        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "distance": "2.6",
            "mag": "1",
        });

        expect(mockToast).toBeCalledWith("New ucsbDate Created - id: 17 name: Groundhog Day");
        expect(mockNavigate).toBeCalledWith({ "to": "/earthquakes/list" });
    });


});


