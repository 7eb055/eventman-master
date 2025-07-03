import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AttendanceReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/events/attendance-report');
        setData(res.data);
      } catch (err) {
        setError('Failed to load attendance report.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const exportCSV = () => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(h => row[h]));
    let csv = headers.join(',') + '\n';
    rows.forEach(r => { csv += r.join(',') + '\n'; });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h2>Attendance Report</h2>
      <button className="btn btn-outline-primary mb-3" onClick={exportCSV}>Export CSV</button>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              {data.length > 0 && Object.keys(data[0]).map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((v, j) => <td key={j}>{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceReport;
