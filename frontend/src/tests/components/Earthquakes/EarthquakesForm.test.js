import { render, waitFor, fireEvent } from "@testing-library/react";
import EarthquakesForm from "main/components/Earthquakes/EarthquakesForm";
import { earthquakesFixtures } from "fixtures/earthquakesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("EarthquakesForm tests", () => {

    test("renders correctly ", async () => {

        const { getByText } = render(
            <Router  >
                <EarthquakesForm />
            </Router>
        );
        await waitFor(() => expect(getByText(/Distance/)).toBeInTheDocument());
        await waitFor(() => expect(getByText(/Magnitude/)).toBeInTheDocument());
        await waitFor(() => expect(getByText(/Retrieve/)).toBeInTheDocument());
    });


    test("renders correctly when passing in an Earthquake", async () => {

        const { getByText, getByTestId } = render(
            <Router  >
                <EarthquakesForm initialEarthquake={earthquakesFixtures.oneEarthquake} />
            </Router>
        );
        await waitFor(() => expect(getByTestId(/EarthquakesForm-id/)).toBeInTheDocument());
        expect(getByText(/Id/)).toBeInTheDocument();
        expect(getByTestId(/EarthquakesForm-id/)).toHaveValue("1");
    });


    // test("Correct Error messsages on bad input", async () => {

    //     const { getByTestId, getByText } = render(
    //         <Router  >
    //             <EarthquakesForm />
    //         </Router>
    //     );
    //     await waitFor(() => expect(getByTestId("EarthquakesForm-quarterYYYYQ")).toBeInTheDocument());
    //     const quarterYYYYQField = getByTestId("EarthquakesForm-quarterYYYYQ");
    //     const localDateTimeField = getByTestId("EarthquakesForm-localDateTime");
    //     const submitButton = getByTestId("EarthquakesForm-submit");

    //     fireEvent.change(quarterYYYYQField, { target: { value: 'bad-input' } });
    //     fireEvent.change(localDateTimeField, { target: { value: 'bad-input' } });
    //     fireEvent.click(submitButton);

    //     await waitFor(() => expect(getByText(/QuarterYYYYQ must be in the format YYYYQ/)).toBeInTheDocument());
    //     expect(getByText(/localDateTime must be in ISO format/)).toBeInTheDocument();
    // });

    test("Correct Error messsages on missing input", async () => {

        const { getByTestId, getByText } = render(
            <Router  >
                <EarthquakesForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("EarthquakesForm-retrieve")).toBeInTheDocument());
        const submitButton = getByTestId("EarthquakesForm-retrieve");

        fireEvent.click(submitButton);

        await waitFor(() => expect(getByText(/Distance is required./)).toBeInTheDocument());
        expect(getByText(/Magnitude is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        const { getByTestId, queryByText } = render(
            <Router  >
                <EarthquakesForm submitAction={mockSubmitAction} />
            </Router>
        );
        await waitFor(() => expect(getByTestId("EarthquakesForm-distance")).toBeInTheDocument());

        const distanceField = getByTestId("EarthquakesForm-distance");
        const minMagField = getByTestId("EarthquakesForm-minMag");
        const submitButton = getByTestId("EarthquakesForm-retrieve");

        fireEvent.change(distanceField, { target: { value: '100' } });
        fireEvent.change(minMagField, { target: { value: '2' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(queryByText(/Distance is required./)).not.toBeInTheDocument();
        expect(queryByText(/Magnitude is required./)).not.toBeInTheDocument();

    });


    test("Test that navigate(-1) is called when Cancel is clicked", async () => {

        const { getByTestId } = render(
            <Router  >
                <EarthquakesForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("EarthquakesForm-cancel")).toBeInTheDocument());
        const cancelButton = getByTestId("EarthquakesForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});