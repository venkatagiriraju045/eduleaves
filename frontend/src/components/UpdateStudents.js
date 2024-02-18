import React, { useState } from 'react';
import axios from 'axios';

import * as XLSX from 'xlsx';
import './CSS/AdminAttendance.css';
const UpdateStudents = () => {
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

                    // Iterate through each student data and upload one by one
                    for (const data of excelData) {
                        const studentDataToUpdate = {
                            regNo: data['REG. NO.'],
                            name: data['NAME OF THE STUDENT'],
                            mentor: data['MENTOR'],
                            section: data['SECTION'],
                            year: data['YEAR'],
                            department: data['DEPARTMENT'],
                            role:"student"
                        };
                        console.log(studentDataToUpdate);
                        // Make a POST request to your server endpoint for each student
                        const response = await axios.post('https://eduleaves-api.vercel.app/api/update_students', { studentDataToUpdate });
                        console.log(response.data); // Handle the response as needed
                    }
                } catch (error) {
                    console.error('Error parsing Excel file:', error);
                }
            };

            reader.readAsArrayBuffer(excelFile);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="update-students-container">
            <p>Update Student Data</p>
            <div className='update-students-specific-container'>
                <input className="file-input" type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                <button className="upload-button" onClick={handleUpload}>Upload</button>
            </div>
        </div>
    );
};

export default UpdateStudents;
