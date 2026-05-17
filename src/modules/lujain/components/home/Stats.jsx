import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './stats.css';

const Stats = () => {
    const [stats, setStats] = useState({
        users: 0,
        analyses: 0,
        consultations: 0
    });

    useEffect(() => {
        axios.get('http://localhost:8000/api/home-stats')
            .then(res => {
                if (res.data.success) {
                    setStats(res.data.data);
                }
            })
            .catch(err => console.error("Error fetching stats:", err));
    }, []);

    return (
        <div className="lujain-scope">
            <section className="stats-bar">
                <div className="stats-inner">
                    
                    <div className="stat-item">
                        <div className="stat-val">{stats.users}+</div>
                        <div className="stat-label">Happy Users</div>
                    </div>

                    <div className="stat-item">
                        <div className="stat-val">{stats.analyses}+</div>
                        <div className="stat-label">Skin Analyses</div>
                    </div>

                    <div className="stat-item">
                        <div className="stat-val">{stats.consultations}+</div>
                        <div className="stat-label">Digital Consultations</div>
                    </div>


                </div>
            </section>
        </div>
    );
};

export default Stats;