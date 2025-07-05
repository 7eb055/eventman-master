import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

const EventSummaryReport = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/reports/event-summary');
        setData(res.data);
      } catch (err) {
        setError(t('event_summary_report.failed_load'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

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
    a.download = 'event_summary_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div>{t('common.loading')}</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h2>{t('event_summary_report.title')}</h2>
      <button className="btn btn-outline-primary mb-3" onClick={exportCSV}>{t('event_summary_report.export_csv')}</button>
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

export default EventSummaryReport;
