import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/Test_Score.css';

const SemesterResult = ({ email}) => {
    const [testScores, setTestScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isClosed] = useState(false);
    const overlayClass = `loading-overlay${loading ? ' visible' : ''}`;

    useEffect(() => {
        const fetchTestScores = async () => {
            try {
                const response = await axios.get(`https://eduleaves-api.vercel.app/api/students?email=${email}`);
                const { semester_results } = response.data;
                setTestScores(semester_results);
                setLoading(false);  
            } catch (error) {
                console.error('Error fetching test scores:', error);
                setLoading(false);
            }
        };
        if (email) {
            fetchTestScores();
        } else {
            setLoading(false);
        }
    }, [email]);

    const getGrade = (score) => {
        if (score >= 90 && score <= 100) return 'O';
        if (score >= 80 && score <= 89) return 'A+';
        if (score >= 70 && score <= 79) return 'A';
        if (score >= 60 && score <= 69) return 'B+';
        if (score >= 50 && score <= 59) return 'B';
        return 'RA'; // Fail
    };
    
    const getResult = (score) => (score >= 50 ? 'Pass' : 'Fail');
    if (loading) {
        return <div>
            {loading && <div className={overlayClass}>
                <div className="spinner">
                    <img src="./uploads/loading-brand-logo.png" alt="loading-brand-logo" id="loading-brand-logo" />
                </div>
                <img src="./uploads/loading-brand-title.png" alt="loading-brand-title" id="loading-brand-title" />
            </div>}
        </div>;
    }

    if (isClosed) {
        return null; // Don't render the component if it's closed
    }

    return (
        <div className="test-scrollable-container">
            <div className="test-score-chart-container">
                <h2 id="chart-names">Final Year Odd Semester Results(Dummy)</h2>
                <div className="test-score-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Subject Code</th>
                                <th>Subject Name</th>
                                <th>Score</th>
                                <th>Grade</th>
                                <th>Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {testScores.map((subject, index) => (
                                <tr key={index}>
                                    <td>{subject?.subject_code || ''}</td>
                                    <td>{subject?.subject_name || ''}</td>
                                    <td>{subject?.score|| 'NaN'}</td>
                                    <td>{getGrade(subject.score) || ''}</td>
                                    <td>{getResult(subject.score) || ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default SemesterResult;

