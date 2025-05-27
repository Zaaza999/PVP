import React, { useEffect, useState } from 'react';
import { formatWorkerRoleName } from '../../utils/formatWorkerRoleName';
import './WorkerStatistics.css';
import { useNavigate } from "react-router-dom";

interface Worker {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role?: { name: string };
    hoursWorked: number;
    tasksCompleted: number;
    status: 'Active' | 'Inactive';
}

const WorkerStatistics: React.FC = () => {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const response = await fetch('http://localhost:5190/users/workers');
                if (!response.ok) throw new Error('Nepavyko gauti darbuotojų duomenų');
                const data = await response.json();
                const enrichedData: Worker[] = data.map((worker: any) => ({
                    id: worker.id,
                    firstName: worker.firstName,
                    lastName: worker.lastName,
                    email: worker.email,
                    role: worker.role,
                    hoursWorked: Math.floor(Math.random() * 100) + 50,
                    tasksCompleted: Math.floor(Math.random() * 50) + 10,
                    status: worker.isOnline ? 'Active' : 'Inactive'
                }));
                setWorkers(enrichedData);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Nežinoma klaida';
                console.error('Klaida:', err);
                setError(errorMessage);
            }
        };

        fetchWorkers();
    }, []);

    const totalWorkers = workers.length;
    const activeWorkers = workers.filter((worker) => worker.status === 'Active').length;
    const totalHours = workers.reduce((sum, worker) => sum + (worker.hoursWorked || 0), 0);
    const totalTasks = workers.reduce((sum, worker) => sum + (worker.tasksCompleted || 0), 0);
    const averageHours = totalWorkers ? (totalHours / totalWorkers).toFixed(1) : 0;
    const completionRate = totalWorkers ? ((totalTasks / (totalWorkers * 50)) * 100).toFixed(1) : 0;

    if (error) {
        return <div className="worker-statistics container">Klaida: {error}</div>;
    }

    return (
        <div className="worker-statistics container">
            <h1 className="header">Darbuotojų statistika</h1>

            <div className="stats-grid">
                <div className="card">
                    <h2>Viso darbuotojų</h2>
                    <p className="total-workers">{totalWorkers}</p>
                </div>
                <div className="card">
                    <h2>Aktyvūs darbuotojai</h2>
                    <p className="active-workers">{activeWorkers}</p>
                </div>
                <div className="card">
                    <h2>Vidutinės darbo valandos</h2>
                    <p className="avg-hours">{averageHours} val.</p>
                </div>
                <div className="card">
                    <h2>Užduočių atlikimo rodiklis</h2>
                    <p className="completion-rate">{completionRate}%</p>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Vardas</th>
                        <th>Rolė</th>
                        <th>Darbo valandos</th>
                        <th>Atliktos užduotys</th>
                        <th>Būsena</th>
                    </tr>
                    </thead>
                    <tbody>
                    {workers.map((worker) => (
                        <tr key={worker.id}>
                            <td className="name">
                                {worker.firstName} {worker.lastName}
                            </td>
                            <td>{formatWorkerRoleName(worker.role?.name ?? '')}</td>
                            <td>{worker.hoursWorked || 0} val.</td>
                            <td>{worker.tasksCompleted || 0}</td>
                            <td>
                  <span className={worker.status === 'Active' ? 'status-active' : 'status-inactive'}>
                    {worker.status === 'Active' ? 'Prisijungęs' : 'Neprisijungęs'}
                  </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="button-wrapper">
                <button className="view-worker-button" onClick={() => navigate("/")}>
                    Grįžti į pagrindinį puslapį
                </button>
            </div>
        </div>
    );
};

export default WorkerStatistics;