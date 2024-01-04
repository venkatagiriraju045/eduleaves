import React, { useState } from 'react';
import axios from 'axios';
import './CSS/UpdateIAT.css';

import * as XLSX from 'xlsx';

const UpdateIAT = () => {
    const [iatType, setIatType] = useState('iat_1');
    const [excelFile, setExcelFile] = useState(null);

    const handleIatTypeChange = (event) => {
        setIatType(event.target.value);
    };

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
    
                    const iatScoresToUpdate = excelData.map((data) => {
                        const subjectScores = {};
                        Object.keys(data).forEach((key) => {
                            if (key !== 'registerNumber') {
                                subjectScores[key] = data[key] ? data[key].toString() : '0';
                            }
                        });
    
                        return {
                            registerNumber: data.registerNumber,
                            iatType: iatType,
                            scores: subjectScores,
                        };
                    });
                    console.log(iatScoresToUpdate);

                    // Make a POST request to your server endpoint
                    const response = await axios.post('https://eduleaves-api.vercel.app/api/update_iat', { iatScoresToUpdate });
    
                    console.log(response.data); // Handle the response as needed
                } catch (error) {
                    console.error('Error parsing Excel file:', error);
                }
            };
    
            reader.readAsArrayBuffer(excelFile);
        } catch (error) {
            console.error('Error uploading IAT scores:', error);
        }
    };
    
    
    return (
        <div className="update-iat-container">
            <h1>Update Internal Assessment Scores</h1>
            <div className='update-iat-specific-container'>

            <label className="iat-label">
                Select IAT Type:
                <select className="iat-select" value={iatType} onChange={handleIatTypeChange}>
                    <option value="iat_1">IAT 1</option>
                    <option value="iat_2">IAT 2</option>
                    <option value="iat_3">IAT 3</option>
                </select>
            </label>

            <input className="file-input" type="file" accept=".xlsx, .xls" onChange={handleFileChange} />

            <button className="upload-button" onClick={handleUpload}>
                Upload
            </button>
            </div>
        </div>
    );
};

export default UpdateIAT;
