import React, { useEffect, useState } from 'react';
import { Chart, LinearScale, CategoryScale, DoughnutController, ArcElement, LineController, LineElement } from 'chart.js/auto';
import DepartmentClassWise from './DepartmentClassWise.js';
import ClassAttendance from './ClassAttendance.js'


const calculateAttendancePercentage = (presentCount, absentCount) => {
  const totalDays = presentCount + absentCount;
  if (totalDays === 0) return { percentage: 0, count: 0, absentees: [] };
  const percentage = ((presentCount / totalDays) * 100).toFixed(2);
  return { percentage, count: presentCount, absentees: [] };
};
const calculateOverallAttendance = (students) => {
  const studentList = students.filter((student) => student.role === 'student');

  if (studentList.length === 0) {
    return {
      presentPercentage: 0,
      absentPercentage: 0,
      presentCount: 0,
      totalCount: 0,
      absentees: [],
    };
  }

  const currentDate = new Date();
  let presentCount = 0;
  let absentCount = 0;
  const absentees = []; // Array to store the names of absentees

  studentList.forEach((student) => {
    student.present_array.forEach((dateStr) => {
      const date = new Date(dateStr);
      if (date.toDateString() === currentDate.toDateString()) {
        presentCount++;
      }
    });

    student.leave_array.forEach((dateStr) => {
      const date = new Date(dateStr);
      if (date.toDateString() === currentDate.toDateString()) {
        absentCount++;
        absentees.push(student);
      }
    });
  });

  const presentResult = calculateAttendancePercentage(presentCount, absentCount);
  const absentResult = calculateAttendancePercentage(absentCount, presentCount);

  return {
    presentPercentage: presentResult.percentage,
    absentPercentage: absentResult.percentage,
    presentCount: presentResult.count,
    totalCount: studentList.length,
    absentees, // Include the list of absentees in the result
  };
};


const DepartmentMenuDashboard = ({ students, department }) => {
  const [selectedYear, setSelectedYear] = useState('');
  const [departmentName, setDepartmentName] = useState("");
  const [showDepartment, setShowDepartment] = useState(false);
  const { presentPercentage, absentPercentage, presentCount, totalCount } = calculateOverallAttendance(
    students
  );
  const [showAttendanceOverlay, setShowAttendanceOverlay] = useState(false);
  useEffect(() => {
    if (!selectedYear) {
      createPassFailChart();
      createHostelerChart();
      
      createGenderDepartmentLineChart();
      setDepartmentName(department);

    }
  }, [students, selectedYear]);


  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDepartment(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []); // This effect runs once on component mount


  const calculatePassFailRatio = (students) => {
    let passCount = 0;
    let failCount = 0;
    let totalSubjects = 0;

    students.forEach((student) => {
      student.subjects.forEach((subject) => {
        for (let i = 1; i <= 3; i++) {
          const iatScore = parseFloat(subject.scores[`iat_${i}`]);
          if (!isNaN(iatScore)) {
            totalSubjects++;
            if (iatScore >= 50) {
              passCount++;
            } else {
              failCount++;
            }
          }
        }
      });
    });

    const passPercentage = (passCount / totalSubjects) * 100;
    const failPercentage = (failCount / totalSubjects) * 100;

    return {
      passCount,
      failCount,
      passPercentage,
      failPercentage,
    };
  };
  const createPassFailChart = () => {
    Chart.register(LinearScale, CategoryScale, DoughnutController, ArcElement);
    const canvas = document.getElementById('pass-fail-chart');
    const ctx = canvas.getContext('2d');
    if (typeof canvas.chart !== 'undefined') {
      canvas.chart.destroy();
    }
    const chartWidth = 320;
    const chartHeight = 250;
    canvas.width = chartWidth;
    canvas.height = chartHeight;
    const passColor = 'rgb(14, 129, 116)';
    const failColor = 'rgb(255, 99, 71)';

    // Calculate pass/fail statistics for all subjects
    const passFailStats = calculatePassFailRatio(students);

    canvas.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Pass', 'Fail'],
        datasets: [
          {
            data: [
              passFailStats.passPercentage,
              passFailStats.failPercentage
            ],
            backgroundColor: [passColor, failColor],
            borderColor: [
              'rgb(14, 129, 116)',
              'rgb(255, 99, 71)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              color: 'black',
            },
          },
          annotation: {
            annotations: {
              value: {
                type: 'text',
                color: 'black',
                fontSize: 24,
                fontStyle: 'bold',
                textAlign: 'center',
                value: `${passFailStats.passPercentage.toFixed(2)}% Pass`,
                x: '50%',
                y: '50%',
              },
            },
          },
        },
      },
    });
  };

  const createGenderDepartmentLineChart = () => {
    Chart.register(LinearScale, CategoryScale, LineController, LineElement);
    const canvas = document.getElementById('iat-performance-chart-department');
    const ctx = canvas.getContext('2d');
    if (typeof canvas.chart !== 'undefined') {
      canvas.chart.destroy();
    }

    // Set the desired fixed dimensions for the chart
    const chartWidth = 450;
    const chartHeight = 225;

    // Set the canvas width and height to match the chart dimensions
    canvas.width = chartWidth;
    canvas.height = chartHeight;

    // Get the average scores for males and females for each iat
    const maleAverages = [1, 2, 3].map((iatIndex) => calculateAverageByGender(iatIndex, 'male'));
    const femaleAverages = [1, 2, 3].map((iatIndex) => calculateAverageByGender(iatIndex, 'female'));

    canvas.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['iat1', 'iat2', 'iat3'],
        datasets: [
          {
            label: 'Male',
            data: maleAverages,
            borderColor: 'rgb( 0, 127, 255)',
            fill: true,
          },
          {
            label: 'Female',
            data: femaleAverages,
            borderColor: 'rgb(0, 204, 153)',
            fill: true,
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              color: 'black',
            },
          },
          annotation: {
            annotations: {
              // Add any annotations you want (if needed)
            },
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: false,
              text: 'IAT',
              color: 'black',
            },
            ticks: {
              color: 'black',
            },
          },
          y: {
            display: true,
            title: {
              display: false,
              text: 'Scores',
              color: 'black',
            },
            ticks: {
              color: 'black',
              beginAtZero: true,
              stepSize: 20,
            },
          },
        },
      },
    });
  };
  const calculateAverageByGender = (iatIndex, gender) => {
    const filteredStudents = students.filter((student) => student.gender === gender);

    // Filter out students who have scores for the given iatIndex
    const studentsWithScores = filteredStudents.filter((student) => student.subjects.some((subject) => subject.scores[`iat_${iatIndex}`]));

    // Calculate the total score and count of students with scores for the iatIndex
    const totalScore = studentsWithScores.reduce((total, student) => {
      const iatScore = parseInt(student.subjects.find((subject) => subject.scores[`iat_${iatIndex}`])?.scores[`iat_${iatIndex}`]);
      return total + iatScore;
    }, 0);

    const averageScore = totalScore / studentsWithScores.length;
    return averageScore;
  };
  const createHostelerChart = () => {
    Chart.register(LinearScale, CategoryScale, LineController, LineElement);
    const canvas = document.getElementById('iat-performance-hosteler-chart');
    const ctx = canvas.getContext('2d');
    if (typeof canvas.chart !== 'undefined') {
        canvas.chart.destroy();
    }
    // Set the desired fixed dimensions for the chart
    const chartWidth = 450;
    const chartHeight = 225;

    // Set the canvas width and height to match the chart dimensions
    canvas.width = chartWidth;
    canvas.height = chartHeight;

    const hostelAverages = [1, 2, 3].map((iatIndex) => calculateAverageByType(iatIndex, 'hostel'));
    const dayScholarAverages = [1, 2, 3].map((iatIndex) => calculateAverageByType(iatIndex, 'day-scholar'));
    canvas.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['iat1', 'iat2', 'iat3'],
            datasets: [
                {
                    label: 'Hosteler Average',
                    data: hostelAverages,
                    borderColor: 'rgb(255, 79, 0)',
                    borderWidth: 2,
                    fill: true,
                },
                {
                    label: 'Day Scholar Average',
                    data: dayScholarAverages,
                    borderColor: 'rgb(253, 255, 0)',
                    borderWidth: 2,
                    fill: true,
                },
            ],
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: false,
                        text: 'IAT',
                        color: 'black',
                    },
                    ticks: {
                        color: 'black',
                    },
                },
                y: {
                    display: true,
                    title: {
                        display: false,
                        text: 'Scores',
                        color: 'black',
                    },
                    ticks: {
                        color: 'black',
                        beginAtZero: true,
                        stepSize: 20,
                    },
                },
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
            },
        },
    });
};
const calculateAverageByType = (iatIndex, type) => {
  const filteredStudents = students.filter((student) => student.type === type);
  const studentsWithScores = filteredStudents.filter((student) => student.subjects.some((subject) => subject.scores[`iat_${iatIndex}`]));
  const totalScore = studentsWithScores.reduce((total, student) => {
      const iatScore = parseInt(student.subjects.find((subject) => subject.scores[`iat_${iatIndex}`])?.scores[`iat_${iatIndex}`]);
      return total + iatScore;
  }, 0);
  const averageScore = totalScore / studentsWithScores.length;
  return averageScore;
};

  const handleCloseOverlay = () => {
    setShowAttendanceOverlay(false);
  };

  const handleTodayClick = () => {
    setShowAttendanceOverlay(true);
  }

  const handleMenuClick = (year) => {
    setSelectedYear(year);
  };

  const handleCloseClassWiseAnalytics = () => {
    setSelectedYear("");


  }
  const calculateYearWiseAttendance = (students) => {
    const currentDate = new Date();
  
    // Initialize variables to store attendance counts for each class
    let firstYearPresentCount = 0;
    let firstYearAbsentCount = 0;
    let secondYearPresentCount = 0;
    let secondYearAbsentCount = 0;
    let thirdYearPresentCount = 0;
    let thirdYearAbsentCount = 0;
    let finalYearPresentCount = 0;
    let finalYearAbsentCount = 0;
  
    // Loop through the students and calculate attendance for each class
    students.forEach((student) => {
      if (student.role === 'student') {
        const year = student.year; // Assuming the student object has the 'class' property indicating the year of study
  
        // Determine if the student is present or absent for the current date
        const isPresent = student.present_array.some((dateStr) => new Date(dateStr).toDateString() === currentDate.toDateString());
        const isAbsent = student.leave_array.some((dateStr) => new Date(dateStr).toDateString() === currentDate.toDateString());
  
        // Update the attendance counts based on the student's class and attendance status
        if (year === 'First year') {
          if (isPresent) {
            firstYearPresentCount++;
          } else if (isAbsent) {
            firstYearAbsentCount++;
          }
        } else if (year === 'Second year') {
          if (isPresent) {
            secondYearPresentCount++;
          } else if (isAbsent) {
            secondYearAbsentCount++;
          }
        } else if (year === 'Third year') {
          if (isPresent) {
            thirdYearPresentCount++;
          } else if (isAbsent) {
            thirdYearAbsentCount++;
          }
        } else if (year === 'Final year') {
          if (isPresent) {
            finalYearPresentCount++;
          } else if (isAbsent) {
            finalYearAbsentCount++;
          }
        }
      }
    });
  
    // Calculate percentages for each class using the existing calculateAttendancePercentage function
    const firstYearAttendance = calculateAttendancePercentage(firstYearPresentCount, firstYearAbsentCount);
    const secondYearAttendance = calculateAttendancePercentage(secondYearPresentCount, secondYearAbsentCount);
    const thirdYearAttendance = calculateAttendancePercentage(thirdYearPresentCount, thirdYearAbsentCount);
    const finalYearAttendance = calculateAttendancePercentage(finalYearPresentCount, finalYearAbsentCount);
  
    return {
      firstYear: {
        presentPercentage: firstYearAttendance.percentage,
        presentCount: firstYearAttendance.count,
        totalCount: firstYearPresentCount + firstYearAbsentCount,
      },
      secondYear: {
        presentPercentage: secondYearAttendance.percentage,
        presentCount: secondYearAttendance.count,
        totalCount: secondYearPresentCount + secondYearAbsentCount,
      },
      thirdYear: {
        presentPercentage: thirdYearAttendance.percentage,
        presentCount: thirdYearAttendance.count,
        totalCount: thirdYearPresentCount + thirdYearAbsentCount,
      },
      finalYear: {
        presentPercentage: finalYearAttendance.percentage,
        presentCount: finalYearAttendance.count,
        totalCount: finalYearPresentCount + finalYearAbsentCount,
      },
    };
  };
  const handleCopyClassAttendance = () => {
    const yearWiseAttendance = calculateYearWiseAttendance(students);
    const { firstYear, secondYear, thirdYear, finalYear } = yearWiseAttendance;

    const classAttendanceText = `
      
      Year-wise Attendance:
      
      First Year:
        Total Students: ${firstYear.totalCount}
        Present Count: ${firstYear.presentCount}
        Present Percentage: ${firstYear.presentPercentage}%
        
      Second Year:
        Total Students: ${secondYear.totalCount}
        Present Count: ${secondYear.presentCount}
        Present Percentage: ${secondYear.presentPercentage}%
        
      Third Year:
        Total Students: ${thirdYear.totalCount}
        Present Count: ${thirdYear.presentCount}
        Present Percentage: ${thirdYear.presentPercentage}%

      Final Year:
        Total Students: ${finalYear.totalCount}
        Present Count: ${finalYear.presentCount}
        Present Percentage: ${finalYear.presentPercentage}%

      Overall Attendance:

        Total Students: ${totalCount}
        No. of Students Present: ${presentCount}
        Overall Attendance Percentage: ${presentPercentage}%
        
    `;

    // Create a new textarea element (it's not visible on the page)
    const textarea = document.createElement('textarea');
    textarea.value = classAttendanceText;
    document.body.appendChild(textarea);

    // Select the text inside the textarea and copy it to the clipboard
    textarea.select();
    document.execCommand('copy');

    // Remove the textarea element from the DOM
    document.body.removeChild(textarea);

    // Optionally, show a notification that the text has been copied
    alert('Class-wise attendance details copied to the clipboard!');
  };

  const yearWiseAttendance = calculateYearWiseAttendance(students);
  const { firstYear, secondYear, thirdYear, finalYear } = yearWiseAttendance;
  return (
    <div>
      {showAttendanceOverlay && (
        <div className="dep-admin-overlay">
          <div className="dep-admin-overlay-content">
            <button className="close-button" id="close-button" onClick={handleCloseOverlay}>
              Close
            </button>
            <div className="attendance-details-container">
              <div className='main-attendance-details'>
                <p className='present-details-percentage'>Present Percentage: {presentPercentage}%</p>
                <p>Students Present Today: {presentCount}</p>
                <p>Total Students: {totalCount}</p>
                <button className="copy-button" onClick={handleCopyClassAttendance}>
                  Copy Report
                </button>
              </div>
              <br></br>
              <br></br>
              {/* Display First Year Attendance */}
              <div className='year-attendance-container'>
                <h2>First Year Attendance</h2>
                <p>Total Students: {firstYear.totalCount}</p>
                <p>Present Count {firstYear.presentCount}</p>
                <p>Present Percentage: {firstYear.presentPercentage}%</p>

              </div>

              {/* Display Second Year Attendance */}
              <div className='year-attendance-container'>
                <h2>Second Year Attendance</h2>
                <p>Total Students: {secondYear.totalCount}</p>
                <p>Present Count {secondYear.presentCount}</p>
                <p>Present Percentage: {secondYear.presentPercentage}%</p>
              </div>

              {/* Display Third Year Attendance */}
              <div className='year-attendance-container'>
                <h2>Third Year Attendance</h2>
                <p>Total Students: {thirdYear.totalCount}</p>
                <p>Present Count {thirdYear.presentCount}</p>
                <p>Present Percentage: {thirdYear.presentPercentage}%</p>
              </div>

              {/* Display Final Year Attendance */}
              <div className='year-attendance-container'>
                <h2>Final Year Attendance</h2>
                <p>Total Students: {finalYear.totalCount}</p>
                <p>Present Count {finalYear.presentCount}</p>
                <p>Present Percentage: {finalYear.presentPercentage}%</p>
              </div>
              <br></br>
            </div>
          </div>
        </div>
      )}

      <div className='admin-year-choosing-menu '>
        <div className='department-header-container'>
          {showDepartment && students && (
            <h1 className='department-wise-chart-heading'>{students[0].department} Department</h1>
          )}
          <div className='menu-buttons'>
            <a href="#class-wise-page"><button className="today-button" onClick={handleTodayClick}>Attendance</button></a>
            <a href="#class-wise-page"><button onClick={() => handleMenuClick('First year')}>First year</button></a>
            <a href="#class-wise-page"><button onClick={() => handleMenuClick('Second year')}>Second year</button></a>
            <a href="#class-wise-page"><button onClick={() => handleMenuClick('Third year')}>Third year</button></a>
            <a href="#class-wise-page"><button onClick={() => handleMenuClick('Final year')}>Final year</button></a>
            {selectedYear && <button className="class-wise-analytics-close-button" onClick={handleCloseClassWiseAnalytics}>close</button>}
          </div>
        </div>
      </div>
      {!selectedYear &&
        <div>
          <div className='profile-chart-container'>
            <div className='overall-department-performance-chart-container'>
              <div className='inside-container'>
                <div className='sub-charts-container'>
                  <canvas id="pass-fail-chart"></canvas>
                </div>
              </div>
              <p className='chart-heads'>Department Pass Fail Ratio (in percentage)</p>
            </div>
            <div >

              <ClassAttendance classStudents={students} />
            </div>
          </div>
          <div className='profile-chart-container'>
            <div className='overall-department-performance-chart-container'>
              <div className='inside-container'>
                <div className='sub-charts-container'>
                <canvas id="iat-performance-chart-department"></canvas>
                <p className='chart-heads'>Gender Wise IAT Performance</p>
                </div>
              </div>
            </div>
            <div className='overall-department-performance-chart-container'>
              <div className='inside-container'>
                <div className='sub-charts-container'>
                  <canvas id="iat-performance-hosteler-chart"></canvas>
                  <p className='chart-heads'>Hosteler vs Day-Scholar Performance</p>
                </div>
              </div>
            </div>
          </div>
        </div>}
      {selectedYear &&
        <div id='class-wise-page' className='class-wise-analytics-page'>
          <DepartmentClassWise students={students} year={selectedYear} />
        </div>
      }

      {/*<div id="department-students-table"></div>*/}
    </div>
  );
};

export default DepartmentMenuDashboard;
