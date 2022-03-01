import { render, waitFor, fireEvent } from "@testing-library/react";
import EarthquakesRetrievePage from "main/pages/Earthquakes/EarthquakesRetrievePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { EarthquakesFixtures } from "fixtures/EarthquakesFixtures";
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

describe("EarthquakesRetrieve tests", () => {

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
                    <EarthquakesRetrievePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const earthquakes = [{
        "id": '621c60d90303313487d98d92',
        "title": "M 1.12 - 7km W of Isla Vista, CA",
        "mag": "2.16",
        "place": "10km ESE of Ojai, CA",
        "time": 1644571919000
        }];

        axiosMock.onPost("/api/earthquakes/retrieve").reply( 202, earthquakes );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <EarthquakesRetrievePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("EarthquakesForm-distanceKM")).toBeInTheDocument();
        });

        const Field = getByTestId("EarthquakesForm-distanceKM");
        const magField = getByTestId("EarthquakesForm-minMagnitude");
        const submitButton = getByTestId("EarthquakesForm-retrieve");

        fireEvent.change(Field, { target: { value: '2.6' } });
        fireEvent.change(magField, { target: { value: '1' } });
 
        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "distanceKM": "2.6",
            "minMagnitude": "1",
        });

        expect(mockToast).toBeCalledWith("1 Earthquakes retrieved");
        expect(mockNavigate).toBeCalledWith({ "to": "/earthquakes/list" });
    });


});


