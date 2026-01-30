// This script powers the interactive GPA calculator.
// It handles adding/removing subjects, calculating individual subject GPAs,
// and computing the overall weighted GPA for all subjects.

// The 'DOMContentLoaded' event ensures that the script runs only after
// the entire HTML document has been fully loaded and parsed.
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element References ---
    // These variables store references to specific HTML elements,
    // allowing us to interact with them using JavaScript.
    const subjectInputsContainer = document.getElementById('subject-inputs-container'); // The container where all subject input rows will be added.
    const addSubjectBtn = document.getElementById('addSubjectBtn');                     // Button to add a new subject.
    const clearAllBtn = document.getElementById('clearAllBtn');                         // Button to clear all subjects and reset the calculator.
    const calculateBtn = document.getElementById('calculateBtn');                       // Button to trigger the overall GPA calculation.
    const overallGpaResult = document.getElementById('overallGpaResult');               // Element to display the final calculated overall GPA.

    // --- State Variables ---
    let subjectCounter = 0; // A simple counter to give unique IDs to new subject rows.
                            // Useful for debugging or if we ever need to reference a specific row.

    // --- Function: addSubjectRow() ---
    // This function creates a new HTML row for a subject, including inputs for
    // subject name, marks, and credit hours (dropdown), along with a remove button.
    function addSubjectRow() {
        subjectCounter++; // Increment the counter for a new unique ID.

        const subjectRow = document.createElement('div'); // Create a new <div> element for the subject row.
        subjectRow.classList.add('subject-input-row');   // Add a CSS class for styling.
        subjectRow.dataset.subjectId = subjectCounter;    // Store the unique ID as a data attribute on the row.

        // Set the inner HTML of the new subject row.
        // It includes:
        // 1. An input for the subject name.
        // 2. An input for marks (0-100).
        // 3. A <select> (dropdown) for credit hours (1, 2, 3, 4).
        // 4. A button to remove this specific subject row.
       subjectRow.innerHTML = `
    <input type="text" class="subject-name-input" placeholder="Subject Name (e.g., Math)" value="Subject ${subjectCounter}">
    <input type="number" class="subject-marks-input" min="0" max="100" placeholder="Marks (0-100)">

    <div class="select-wrapper">
        <select class="subject-credit-hours-select">
            <option value="1">1 Credit Hour</option>
            <option value="2">2 Credit Hours</option>
            <option value="3" selected>3 Credit Hours</option>
            <option value="4">4 Credit Hours</option>
        </select>
        <i class="fa fa-chevron-down"></i> <!-- Font Awesome icon -->
    </div>

    <button type="button" class="remove-subject-btn">Remove  <i class="fa fa-trash"></i></button>
`;

        // Append the newly created subject row to the main container.
        subjectInputsContainer.appendChild(subjectRow);

        // Add an event listener to the 'Remove' button of this new row.
        // When clicked, it will remove its parent subject row and then recalculate the GPA.
        subjectRow.querySelector('.remove-subject-btn').addEventListener('click', () => {
            subjectRow.remove(); // Remove the HTML element for this subject row.
            calculateOverallGpa(); // Recalculate GPA immediately after removal.
        });
    }

    // --- Function: getGpaAndGrade(marks) ---
    // This function determines the GPA and letter grade for a single subject
    // based on its marks, according to a predefined grading scale.
    // The GPA calculation from 80-89, 70-79, etc., interpolates the GPA
    // based on the marks within that range (e.g., 80 is 3.50, 81 is 3.55, ... 89 is 3.95).
    function getGpaAndGrade(marks) {
        let gpa = 0.00; // Default GPA to 0.00 (for failing marks).
        let grade = "F";  // Default grade to 'F'.

        if (marks >= 90 && marks <= 100) {
            gpa = 4.00; // A+ grade corresponds to 4.00 GPA.
            grade = "A+";
        } else if (marks >= 80 && marks < 90) {
            // For marks 80-89: GPA starts at 3.50 and increases by 0.05 for each mark.
            gpa = (3.50 + (marks - 80) * 0.05);
            grade = "A";
        } else if (marks >= 70 && marks < 80) {
            // For marks 70-79: GPA starts at 3.00 and increases by 0.05 for each mark.
            gpa = (3.00 + (marks - 70) * 0.05);
            grade = "B";
        } else if (marks >= 60 && marks < 70) {
            // For marks 60-69: GPA starts at 2.50 and increases by 0.05 for each mark.
            gpa = (2.50 + (marks - 60) * 0.05);
            grade = "C";
        } else if (marks >= 50 && marks < 60) {
            // For marks 50-59: GPA starts at 2.00 and increases by 0.05 for each mark.
            gpa = (2.00 + (marks - 50) * 0.05);
            grade = "D";
        }
        // If marks are less than 50, the default gpa (0.00) and grade (F) are used.

        return { gpa: gpa.toFixed(2), grade }; // Return GPA as a string with 2 decimal places.
    }

    // --- Function: calculateOverallGpa() ---
    // This is the core calculation function. It iterates through all subject rows,
    // calculates the weighted GPA for each, and then computes the final overall GPA.
    function calculateOverallGpa() {
        let totalWeightedGpa = 0;    // Accumulator for (subject GPA * credit hours).
        let totalCreditHours = 0;    // Accumulator for all credit hours.
        let allInputsValid = true;   // Flag to track if all inputs are valid.

        // Get all subject input rows currently present in the container.
        const subjectRows = document.querySelectorAll('.subject-input-row');

        // If there are no subject rows, display 0.00 and exit.
        if (subjectRows.length === 0) {
            overallGpaResult.textContent = '0.00';
            return;
        }

        // Iterate over each subject row to gather data and perform calculations.
        subjectRows.forEach(row => {
            // Get references to the marks input and credit hours dropdown for the current row.
            const marksInput = row.querySelector('.subject-marks-input');
            const creditHoursSelect = row.querySelector('.subject-credit-hours-select');

            // Convert input values to numbers. `parseFloat` handles decimal values.
            const marks = parseFloat(marksInput.value);
            const creditHours = parseFloat(creditHoursSelect.value); // Get value from the selected option.

            // --- Input Validation for Current Subject ---
            // Check if marks are valid (a number between 0 and 100).
            if (isNaN(marks) || marks < 0 || marks > 100) {
                marksInput.style.borderColor = 'red'; // Highlight invalid input with a red border.
                allInputsValid = false; // Mark that at least one input is invalid.
                // Do NOT `return` here, continue checking other inputs in the loop
                // so all errors can be highlighted visually.
            } else {
                marksInput.style.borderColor = '#ccc'; // Reset border if valid.
            }

            // Check if credit hours are valid (a positive number).
            if (isNaN(creditHours) || creditHours <= 0) {
                creditHoursSelect.style.borderColor = 'red'; // Highlight invalid input.
                allInputsValid = false; // Mark that at least one input is invalid.
                // Do NOT `return` here for the same reason as marks.
            } else {
                creditHoursSelect.style.borderColor = '#ccc'; // Reset border if valid.
            }

            // If any input for THIS specific row is invalid,
            // we skip its contribution to the total GPA calculation.
            if (!allInputsValid || isNaN(marks) || marks < 0 || marks > 100 || isNaN(creditHours) || creditHours <= 0) {
                return; // Skip to the next subject row.
            }

            // --- Calculation for Current Subject ---
            // Get the GPA for the current subject's marks.
            const { gpa: subjectGpaStr } = getGpaAndGrade(marks);
            const subjectGpa = parseFloat(subjectGpaStr); // Convert GPA string back to a number for arithmetic.

            // Add to the total weighted GPA: (subject's GPA * subject's credit hours).
            totalWeightedGpa += subjectGpa * creditHours;
            // Add to the total credit hours.
            totalCreditHours += creditHours;
        });

        // After checking all subjects, if any input was found to be invalid:
        if (!allInputsValid) {
            overallGpaResult.textContent = 'Invalid Input'; // Display an error message.
            return; // Stop the function here.
        }

        // --- Final Overall GPA Calculation ---
        // If no credit hours were entered (e.g., all subjects removed), prevent division by zero.
        if (totalCreditHours === 0) {
            overallGpaResult.textContent = 'N/A (No Credit Hours)';
        } else {
            // Calculate the overall GPA: (sum of weighted GPAs) / (sum of all credit hours).
            const overallGpa = (totalWeightedGpa / totalCreditHours).toFixed(2); // Format to 2 decimal places.
            overallGpaResult.textContent = overallGpa; // Display the result.
        }
    }

    // --- Function: clearAllSubjects() ---
    // Resets the calculator by removing all subject rows and re-adding a default one.
    function clearAllSubjects() {
        subjectInputsContainer.innerHTML = ''; // Clear all HTML content within the subject container.
        subjectCounter = 0; // Reset the subject counter.
        addSubjectRow();    // Add one default subject row back to start fresh.
        overallGpaResult.textContent = '--'; // Reset the overall GPA display.
        // Also clear any red borders that might have been applied to inputs.
        document.querySelectorAll('.subject-input-row input, .subject-input-row select').forEach(input => {
            input.style.borderColor = '#ccc';
        });
    }

    // --- Initial Setup ---
    addSubjectRow(); // Add one default subject row when the page first loads.

    // --- Event Listeners ---
    // These listeners react to user interactions with the buttons.
    addSubjectBtn.addEventListener('click', addSubjectRow);             // When 'Add Subject' is clicked, add a new row.
    clearAllBtn.addEventListener('click', clearAllSubjects);            // When 'Clear All' is clicked, reset the form.
    calculateBtn.addEventListener('click', calculateOverallGpa);        // When 'Calculate Overall GPA' is clicked, run the calculation.

    // This event listener listens for 'input' events (typing) on any element
    // within the `subjectInputsContainer`.
    // It specifically checks if the target is a 'subject-marks-input'.
    // This allows real-time GPA recalculation as marks are typed.
    subjectInputsContainer.addEventListener('input', (event) => {
        if (event.target.classList.contains('subject-marks-input')) {
            calculateOverallGpa(); // Recalculate if marks input changes.
        }
    });

    // This event listener listens for 'change' events on any element
    // within the `subjectInputsContainer`.
    // It specifically checks if the target is a 'subject-credit-hours-select'.
    // This allows real-time GPA recalculation when credit hours dropdown changes.
    subjectInputsContainer.addEventListener('change', (event) => {
        if (event.target.classList.contains('subject-credit-hours-select')) {
            calculateOverallGpa(); // Recalculate if credit hours dropdown changes.
        }
    });

    // Perform an initial GPA calculation when the page loads,
    // so the default subject's GPA is shown right away.
    calculateOverallGpa();
});


