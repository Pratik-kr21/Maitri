import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const PhaseArc = ({ phase }) => {
    // Simple Recharts pie chart as arc
    const data = [
        { name: 'Menstrual', value: 25, color: '#E87A86' },
        { name: 'Follicular', value: 25, color: '#A8D8B9' },
        { name: 'Ovulatory', value: 25, color: '#FFDAB9' },
        { name: 'Luteal', value: 25, color: '#C084FC' }
    ];
    return (
        <div className="w-[200px] h-[100px] overflow-hidden mx-auto animate-drift flex justify-center">
            <PieChart width={200} height={200}>
                <Pie
                    data={data}
                    cx={100}
                    cy={100}
                    startAngle={180}
                    endAngle={0}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === phase ? entry.color : 'var(--color-border-light)'} />
                    ))}
                </Pie>
            </PieChart>
        </div>
    );
};

export default PhaseArc;
