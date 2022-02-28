import { fireEvent, render, waitFor } from "@testing-library/react";
import { EarthquakesFixtures } from "fixtures/EarthquakesFixtures";
import EarthquakesTable from "main/components/Earthquakes/EarthquakesTable"
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UserTable tests", () => {
  const queryClient = new QueryClient();


  test("renders without crashing for empty table with user not logged in", () => {
    const currentUser = null;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EarthquakesTable earthquakes ={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });
  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EarthquakesTable earthquakes={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = EarthquakesFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EarthquakesTable earthquakes={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("Has the expected colum headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EarthquakesTable earthquakes={EarthquakesFixtures.threeEarthquakes} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["id", "Title", "Mag", "Place","Time"];
    const expectedFields = ["id", "title", "mag", "place","time"];
    const testId = "EarthquakesTable";

    expectedHeaders.forEach((headerText) => {
      const header = getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
    expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");

    expect(getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("M 2.2 - 10km ESE of Ojai, CA");
    expect(getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("M 2.2 - 5km ESE of Ojai, CA");
    expect(getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("M 2.2 - 3km ESE of Ojai, CA");

    expect(getByTestId(`${testId}-cell-row-1-col-mag`)).toHaveTextContent("2.16");
    expect(getByTestId(`${testId}-cell-row-1-col-mag`)).toHaveTextContent("3.16");
    expect(getByTestId(`${testId}-cell-row-1-col-mag`)).toHaveTextContent("1.16");

    expect(getByTestId(`${testId}-cell-row-1-col-palce`)).toHaveTextContent("10km ESE of Ojai, CA");
    expect(getByTestId(`${testId}-cell-row-1-col-place`)).toHaveTextContent("5km ESE of Ojai, CA");
    expect(getByTestId(`${testId}-cell-row-1-col-place`)).toHaveTextContent("3km ESE of Ojai, CA");

    expect(getByTestId(`${testId}-cell-row-1-col-mag`)).toHaveTextContent("1644571919000");
    expect(getByTestId(`${testId}-cell-row-1-col-mag`)).toHaveTextContent("1234571919000");
    expect(getByTestId(`${testId}-cell-row-1-col-mag`)).toHaveTextContent("1644571123000");



  });

  // test("Edit button navigates to the edit page for admin user", async () => {

  //   const currentUser = currentUserFixtures.adminUser;

  //   const { getByText, getByTestId } = render(
  //     <QueryClientProvider client={queryClient}>
  //       <MemoryRouter>
  //         <EarthquakesTable earthquakes={EarthquakesFixtures.threeEarthquakes} currentUser={currentUser} />
  //       </MemoryRouter>
  //     </QueryClientProvider>

  //   );

  //   await waitFor(() => { expect(getByTestId(`EarthquakesTable-cell-row-0-col-id`)).toHaveTextContent("1"); });

  //   const editButton = getByTestId(`EarthquakesTable-cell-row-0-col-Edit-button`);
  //   expect(editButton).toBeInTheDocument();
    
  //   fireEvent.click(editButton);

  //   await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/Earthqukes/edit/1'));

  // });

});

