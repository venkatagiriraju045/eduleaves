import React, { useState } from 'react';
import AdvisorClassWise from './AdvisorClassWise.js';





const AdvisorDashboard = ({ students }) => {

    return (
        <div>
            <div id='class-wise-page' className='class-wise-analytics-page'>
                <AdvisorClassWise students={students}/>
            </div>
        </div>
    );
};

export default AdvisorDashboard;
