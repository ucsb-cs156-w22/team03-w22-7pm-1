import { render, waitFor, fireEvent } from "@testing-library/react";
import EarthquakesForm from "main/components/Earthquakes/EarthquakesForm";
import { EarthquakesFixtures } from "fixtures/EarthquakesFixtures";
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
        await waitFor(() => expect(getByText(/Retrieve/)).toBeInTheDocument());
//        await waitFor(() => expect(getByText(/Create/)).toBeInTheDocument());
    });



    // test("Correct Error messsages on bad input", async () => {

    //     const { getByTestId, getByText } = render(
    //         <Router  >
    //             <EarthquakesForm  />
    //         </Router>
    //     );
    //     await waitFor(() => expect(getByTestId("EarthquakesForm-retrieve")).toBeInTheDocument());
        
    //     const submitButton = getByTestId("EarthquakesForm-retrieve");

    //     fireEvent.change(invalidField, { target: { value: 'bad-input' } });
    //     fireEvent.click(submitButton);

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
        expect(getByText(/min Magnitude is required./)).toBeInTheDocument();


    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        const { getByTestId, queryByText } = render(
            <Router  >
                <EarthquakesForm submitAction={mockSubmitAction} />
            </Router>
        );
        await waitFor(() => expect(getByTestId("EarthquakesForm-distanceKM")).toBeInTheDocument());

        const distanceField = getByTestId("EarthquakesForm-distanceKM");
        const magField = getByTestId("EarthquakesForm-minMagnitude");
        const submitButton = getByTestId("EarthquakesForm-retrieve");

        fireEvent.change(distanceField, { target: { value: '1' } });
        fireEvent.change(magField, { target: { value: '5' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(queryByText(/Distance is required./)).not.toBeInTheDocument();
        expect(queryByText(/min Magnitude is required./)).not.toBeInTheDocument();

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



