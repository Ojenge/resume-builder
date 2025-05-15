import { useEffect, useRef } from 'react';

export default function TimeAllocationChart() {
  const chartRef = useRef<SVGSVGElement>(null);
  
  const timeAllocations = [
    { activity: "Tennis", percentage: 25, color: "#1E3A8A" },
    { activity: "Security operations", percentage: 25, color: "#2563EB" },
    { activity: "Research", percentage: 25, color: "#60A5FA" },
    { activity: "Reading", percentage: 25, color: "#93C5FD" },
  ];

  useEffect(() => {
    if (!chartRef.current) return;
    
    const svg = chartRef.current;
    const size = 150;
    const radius = size / 2;
    const cx = radius;
    const cy = radius;
    
    // Clear any existing content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    let startAngle = 0;
    
    // Create pie segments
    timeAllocations.forEach(item => {
      const angle = (item.percentage / 100) * 360;
      const endAngle = startAngle + angle;
      
      // Convert angles to radians for calculations
      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;
      
      // Calculate points
      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);
      
      // Create path for segment
      const largeArc = angle > 180 ? 1 : 0;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${cx},${cy} L ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`);
      path.setAttribute('fill', item.color);
      svg.appendChild(path);
      
      startAngle = endAngle;
    });
    
    // Add center circle (white)
    const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centerCircle.setAttribute('cx', cx.toString());
    centerCircle.setAttribute('cy', cy.toString());
    centerCircle.setAttribute('r', (radius * 0.6).toString());
    centerCircle.setAttribute('fill', 'white');
    svg.appendChild(centerCircle);
    
    // Add "Time Allocation" text in center
    const text1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text1.setAttribute('x', cx.toString());
    text1.setAttribute('y', (cy - 5).toString());
    text1.setAttribute('text-anchor', 'middle');
    text1.setAttribute('fill', '#374151');
    text1.setAttribute('font-size', '10');
    text1.setAttribute('font-weight', 'bold');
    text1.textContent = 'Time';
    svg.appendChild(text1);
    
    const text2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text2.setAttribute('x', cx.toString());
    text2.setAttribute('y', (cy + 10).toString());
    text2.setAttribute('text-anchor', 'middle');
    text2.setAttribute('fill', '#374151');
    text2.setAttribute('font-size', '10');
    text2.textContent = 'Allocation';
    svg.appendChild(text2);
    
  }, []);

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-primary-700 pb-2">My Time</h2>
      <div className="flex justify-center mb-4">
        <svg ref={chartRef} width="150" height="150" viewBox="0 0 150 150"></svg>
      </div>
      <div className="text-sm space-y-1">
        {timeAllocations.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: item.color }}></div>
            <span>{item.activity} ({item.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
