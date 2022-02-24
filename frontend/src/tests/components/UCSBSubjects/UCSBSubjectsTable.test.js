import { fireEvent, render, waitFor } from "@testing-library/react";
import { subjectFixtures } from "fixtures/ucsbSubjectsFixtures";
import UCSBSubjectsTable from "main/components/UCSBSubjects/UCSBSubjectsTable"
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UCSBSubjectsTable tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing for empty table with user not logged in", () => {
    const currentUser = null;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBSubjectsTable subjects={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBSubjectsTable subjects={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBSubjectsTable subjects={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("Has the expected colum headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBSubjectsTable subjects={subjectFixtures.threeSubjects} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["ID", "Subject Code", "Subject Translation", "Department Code", "College Code", "Related Department Code", "Inactive"];
    const expectedFields = ["id", "subjectCode", "subjectTranslation", "deptCode", "collegeCode", "relatedDeptCode", "inactive"];
    const testId = "UCSBSubjectsTable";

    expectedHeaders.forEach( (headerText) => {
      const header = getByText(headerText);
      expect(header).toBeInTheDocument();
    } );

    expectedFields.forEach((field) => {
      const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

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

  test("Edit button navigates to the edit page for admin user", async () => {

    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBSubjectsTable subjects={subjectFixtures.threeSubjects} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(getByTestId(`UCSBSubjectsTable-cell-row-0-col-id`)).toHaveTextContent("1"); });

    const editButton = getByTestId(`UCSBSubjectsTable-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/ucsbsubjects/edit/1'));

  });

  test("Delete button works without crashing", async () => {

    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBSubjectsTable subjects={subjectFixtures.threeSubjects} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(getByTestId(`UCSBSubjectsTable-cell-row-0-col-id`)).toHaveTextContent("1"); });

    const deleteButton = getByTestId(`UCSBSubjectsTable-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);
  });

});