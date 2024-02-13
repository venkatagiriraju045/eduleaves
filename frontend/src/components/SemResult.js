import React from 'react';
import './CSS/SemResult.css';
import { useReactToPrint } from 'react-to-print';

const SemResult = ({ student }) => {


    function getInstituteFullName(institute) {
        const instituteNameMap = {
            "KIOT": "Knowledge Institute of Technology",
            "MHS": "MUNICIPAL HIGHER SECONDARY SCHOOL",
            "PSG": "PSG ENGINEERING COLLEGE",
        };
        return instituteNameMap[institute] || institute;
    }
    const componentRef = React.useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        pageStyle: `
            @page {
                size: A4;
                margin: 0cm;
            }
        `,
    });
    return (
        <div >
            <button onClick={handlePrint} className='result-download-button'>Print (pdf)</button>
            <div className="sem-result-container" ref={componentRef}>
                <div className='sem-result-header'>
                    <div className='sem-result-institution-logo'>
                        <img src="./uploads/knowledge-logo.png" className="knowledge-logo" />
                    </div>
                    <div className='institution-details-kiot'>
                        <p className='college-name-sem-result'>Knowledge Institute of Technology</p>
                        <p className='sub-college-name-sem-result'>(An Autonomous Institution)</p>
                        <p className='sub-college-name-sem-result'>Approved by AICTE, New Delhi and Affiliated to Anna University, Chennai – 25.</p>
                        <p className='sub-college-name-sem-result'>Accredited by NAAC with ‛A’ Grade</p>
                        <p className='sub-college-name-sem-result'>NH 544, KIOT – Campus, Kakapalayam, Salem, Tamilnadu, 637504.</p>
                    </div>
                </div>
                <p className='date-of-announcement'>Provisional Results of End Semester Examination April / May - 2023</p>
                <table className="result-table">
                    <tbody>
                        <tr>
                            <td>Name of the Student</td>
                            <td>{student.studentName}</td>
                            <td>Register Number</td>
                            <td>{student.registerNumber}</td>
                        </tr>
                        <tr>
                            <td>Degree & Branch</td>
                            <td>{student.degreeAndBranch}</td>
                            <td>Regulation</td>
                            <td>{student.regulation}</td>
                        </tr>
                    </tbody>
                </table>
                <table className="result-table">
                    <thead>
                        <tr>
                            <th>Sem.</th>
                            <th>Subject Code</th>
                            <th>Subject Name</th>
                            <th>Credit</th>
                            <th>Grade</th>
                            <th>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {student.semester_results.map((subject, index) => (
                            <tr key={index}>
                                <td>{subject.semester}</td>
                                <td>{subject.code}</td>
                                <td className='subjct-name-cell-sem-result'>{subject.name}</td>
                                <td>{subject.credit}</td>
                                <td>{subject.grade}</td>
                                <td>{subject.result}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="grade-legend">
                    <table className="result-table">
                        <tbody>
                            <tr>
                                <td>Letter Grade:</td>
                                <td>O</td>
                                <td>A+</td>
                                <td>A</td>
                                <td>B+</td>
                                <td>B</td>
                                <td>C</td>
                                <td>RA</td>
                                <td>WH</td>
                                <td>AB</td>
                                <td>WD</td>
                            </tr>
                            <tr>
                                <td>Grade Point:</td>
                                <td>10</td>
                                <td>9</td>
                                <td>8</td>
                                <td>7</td>
                                <td>6</td>
                                <td>5</td>
                                <td>Reappear</td>
                                <td>With Held</td>
                                <td>Absent</td>
                                <td>Withdrawal</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className='disclaimer-para'>
                    DISCLAIMER: This result published at this website is provisional only. We are not responsible for any inadvertent error
                    that may have crept in the data / results being published on the net. This is being published on the Net just for immediate
                    information to the students. The Final Grade Sheets issued by the institutions should only be treated as authentic and final in the record.
                </p>
            </div>

        </div>
    );
};

export default SemResult;
