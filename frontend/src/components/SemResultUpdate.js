import React, { useState } from 'react';
import axios from 'axios';

import * as XLSX from 'xlsx';

const SemResultUpdate = () => {
    const [excelFile, setExcelFile] = useState(null);

    const handleFileChange = (event) => {
        setExcelFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
    
                    if (workbook.SheetNames.length === 0) {
                        console.error('No sheets found in the Excel file.');
                        return;
                    }
    
                    const sheetName = workbook.SheetNames[0];
                    const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
                    if (excelData.length === 0) {
                        console.error('No data found in the Excel sheet.');
                        return;
                    }
    
                    const semesterResultsToUpdate = {};
    
                    // Process each row in the Excel sheet
                    excelData.forEach((data) => {
                        const { registerNumber, coursecode, coursename, credit, result, grade, semester , DOB, studentName, degreeAndBranch, regulation} = data;
    
                        // Check if register number exists in the resultsToUpdate object
                        if (!semesterResultsToUpdate[registerNumber]) {
                            semesterResultsToUpdate[registerNumber] = [];
                        }
    
                        // Add subject result object to the register number's array
                        semesterResultsToUpdate[registerNumber].push({
                            semester,
                            code:coursecode,
                            name: coursename,
                            credit,
                            result,
                            grade,
                            DOB,
                            studentName,
                            regulation,
                            degreeAndBranch,
                            
                        });
                    });
                    console.log(semesterResultsToUpdate);
                    // Make a POST request to your server endpoint
                    const response = await axios.post('https://eduleaves-api.vercel.app/api/update_semester_results', { semesterResultsToUpdate });
                    console.log(response.data); // Handle the response as needed
                } catch (error) {
                    console.error('Error parsing Excel file:', error);
                }
            };
    
            reader.readAsArrayBuffer(excelFile);
        } catch (error) {
            console.error('Error uploading semester results:', error);
        }
    };
    
    return (
        <div className="sem-result-update-container">
            <h1>Update Semester Results</h1>
            <div className='sem-result-update-specific-container'>
                <input className="file-input" type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                <button className="upload-button" onClick={handleUpload}>
                    Upload
                </button>
            </div>
        </div>
    );
};

export default SemResultUpdate;
