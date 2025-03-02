import React, { useState } from 'react';
import './App.css';

// Grade point mapping based on the provided scale.
const gradePoints = {
  'A': 4.00,
  'A-': 3.67,
  'B+': 3.33,
  'B': 3.00,
  'B-': 2.67,
  'C+': 2.33,
  'C': 2.00,
  'C-': 1.67,
  'D+': 1.33,
  'D': 1.00,
  'F': 0.00
};

function App() {
  // State for previous academic records.
  const [prevCreditHours, setPrevCreditHours] = useState('');
  const [prevCGPA, setPrevCGPA] = useState('');

  // Start with 5 empty course rows.
  const [courses, setCourses] = useState(
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      courseName: '',
      creditHours: '',
      grade: '',
      coursePoints: 0
    }))
  );

  // Update course row data and recalc course points (creditHours * grade point).
  const handleCourseChange = (index, field, value) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;

    if (field === 'creditHours' || field === 'grade') {
      const credit = parseFloat(newCourses[index].creditHours);
      const gp = gradePoints[newCourses[index].grade] || 0;
      newCourses[index].coursePoints = !isNaN(credit) ? (credit * gp) : 0;
    }
    setCourses(newCourses);
  };

  // Dynamically add a new course row.
  const addCourseRow = () => {
    setCourses([
      ...courses,
      { id: courses.length, courseName: '', creditHours: '', grade: '', coursePoints: 0 }
    ]);
  };

  // Calculate totals and averages.
  const totalCreditHours = courses.reduce((sum, course) => {
    const credit = parseFloat(course.creditHours);
    return sum + (isNaN(credit) ? 0 : credit);
  }, 0);

  const totalPoints = courses.reduce((sum, course) => sum + course.coursePoints, 0);
  const sgpa = totalCreditHours > 0 ? (totalPoints / totalCreditHours).toFixed(2) : '0.00';

  // If previous academic data is provided, calculate overall CGPA.
  const overallCGPA =
    prevCreditHours && prevCGPA && parseFloat(prevCreditHours) > 0
      ? (
          ((parseFloat(prevCreditHours) * parseFloat(prevCGPA)) + totalPoints) /
          (parseFloat(prevCreditHours) + totalCreditHours)
        ).toFixed(2)
      : null;

  return (
    <div className="container">
      <header>
        <h1>GPA Calculator</h1>
        <p>Calculate your Semester GPA and Overall CGPA effortlessly.</p>
      </header>

      <section className="previous-records">
        <h2>Previous Academic Records</h2>
        <div className="input-group">
          <label>Previous Credit Hours</label>
          <input
            type="number"
            value={prevCreditHours}
            onChange={(e) => setPrevCreditHours(e.target.value)}
            placeholder="e.g. 120"
          />
        </div>
        <div className="input-group">
          <label>Previous CGPA</label>
          <input
            type="number"
            step="0.01"
            value={prevCGPA}
            onChange={(e) => setPrevCGPA(e.target.value)}
            placeholder="e.g. 3.5"
          />
        </div>
      </section>

      <section className="courses">
        <h2>Courses</h2>
        <table>
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Credit Hours</th>
              <th>Grade</th>
              <th>Course Points</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={course.id}>
                <td>
                  <input
                    type="text"
                    value={course.courseName}
                    onChange={(e) => handleCourseChange(index, 'courseName', e.target.value)}
                    placeholder="Course Name"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={course.creditHours}
                    onChange={(e) => handleCourseChange(index, 'creditHours', e.target.value)}
                    placeholder="0"
                  />
                </td>
                <td>
                  <select
                    value={course.grade}
                    onChange={(e) => handleCourseChange(index, 'grade', e.target.value)}
                  >
                    <option value="">Select Grade</option>
                    {Object.keys(gradePoints).map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </td>
                <td>
                  {course.coursePoints.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addCourseRow}>+ Add Course</button>
      </section>

      <section className="summary">
        <h2>Summary</h2>
        <div className="summary-item">
          <span>Total Credit Hours:</span>
          <span>{totalCreditHours}</span>
        </div>
        <div className="summary-item">
          <span>Total Points:</span>
          <span>{totalPoints.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span>SGPA:</span>
          <span>{sgpa}</span>
        </div>
        {overallCGPA && (
          <div className="summary-item">
            <span>Overall CGPA:</span>
            <span>{overallCGPA}</span>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
