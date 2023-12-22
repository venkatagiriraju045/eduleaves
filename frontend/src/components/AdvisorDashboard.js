import React, { useState } from 'react';
import AdvisorClassWise from './AdvisorClassWise.js';





const AdvisorDashboard = ({ students, year, section, department}) => {

    return (
        <div>
            <div id='class-wise-page' className='class-wise-analytics-page'>
                <AdvisorClassWise students={students} year={year} section={section} department={department}/>
            </div>
        </div>
    );
};

export default AdvisorDashboard;
