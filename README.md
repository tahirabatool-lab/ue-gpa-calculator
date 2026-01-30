# UE GPA Calculator

A **dynamic and interactive GPA Calculator** for **University of Education (UE)** students.  
This tool calculates **semester GPA** based on marks and credit hours for each subject.

---

## Features (According to Your Code)

- **Add Subject** button to dynamically add multiple subjects.
- **Remove** button for each subject to delete specific rows.
- **Clear All** button to reset all subjects and GPA calculation.
- Input fields for **Subject Name**, **Marks (0-100)**, and **Credit Hours (1-4)**.
- **Real-time GPA calculation** as marks or credit hours are changed.
- Highlights invalid inputs with red borders and shows `"Invalid Input"` if marks/credits are incorrect.
- Responsive design for **mobile and desktop**.
- Modern UI with hover effects, subtle animations, and clean layout.

---

## UE Grading Scale (Implemented in Code)

| Marks Range | Letter Grade | GPA  |
|------------|-------------|------|
| 90 - 100   | A+          | 4.00 |
| 80 - 89    | A           | 3.50 – 3.95 |
| 70 - 79    | B           | 3.00 – 3.45 |
| 60 - 69    | C           | 2.50 – 2.95 |
| 50 - 59    | D           | 2.00 – 2.45 |
| < 50       | F           | 0.00 |

> Note: GPA is weighted by **credit hours** for each subject.

---

## How to Use

1. Open `index.html` in your browser.
2. Use **Add Subject** to add more subjects.
3. Enter **marks** and select **credit hours** for each subject.
4. Remove subjects with the **Remove** button if needed.
5. Click **Calculate Overall GPA** to get the semester GPA, or see real-time GPA update as you type.
6. Use **Clear All** to reset the form and start fresh.

---

## Technologies Used

- HTML for structure
- CSS for styling and responsiveness
- JavaScript for dynamic functionality and GPA calculation

---

## License

This project is licensed under the **MIT License**.

---

## Notes

- The design is responsive and works on both mobile and desktop devices.
- Invalid marks (less than 0 or more than 100) or invalid credit hours are highlighted and ignored in calculation.
- GPA is calculated using UE's grading system and weighted by credit hours for accurate semester GPA.

