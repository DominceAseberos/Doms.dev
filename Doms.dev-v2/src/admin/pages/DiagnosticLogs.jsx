import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, MapPin, Terminal, CheckCircle, X } from 'lucide-react';
import { diagnosticService } from '@shared/services/diagnosticService';
import { useAdminStore } from '@admin/store/adminStore';

const DiagnosticLogs = () => {
    const navigate = useNavigate();
    const { setAdminLoading } = useAdminStore();
    const [logs, setLogs] = useState([]);
    const [selectedLogIds, setSelectedLogIds] = useState([]);
    const [selectedLog, setSelectedLog] = useState(null);
    const [showResolved, setShowResolved] = useState(false);
    const [visitCount, setVisitCount] = useState(0);

    const fetchLogs = async () => {
        setAdminLoading(true, 'LOADING DIAGNOSTIC DATA');
        try {
            const [logsData, visits] = await Promise.all([
                diagnosticService.getLogs(showResolved),
                diagnosticService.getVisitCount()
            ]);
            setLogs(logsData);
            setVisitCount(visits);
            setSelectedLogIds([]); // Reset selection on fetch
        } catch (err) {
            console.error('Failed to fetch logs:', err);
        } finally {
            setAdminLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [showResolved]);

    const handleResolve = async (id) => {
        try {
            await diagnosticService.resolveLog(id);
            fetchLogs(); // Refresh list
        } catch (err) {
            console.error('Failed to resolve log:', err);
        }
    };

    const handleBatchAction = async () => {
        if (selectedLogIds.length === 0) return;

        setAdminLoading(true, showResolved ? 'DELETING LOGS...' : 'RESOLVING LOGS...');
        try {
            if (showResolved) {
                // Batch Delete
                await diagnosticService.deleteLogs(selectedLogIds);
            } else {
                // Batch Resolve
                await diagnosticService.resolveLogs(selectedLogIds);
            }
            await fetchLogs();
        } catch (err) {
            console.error('Batch action failed:', err);
        } finally {
            setAdminLoading(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedLogIds.length === logs.length) {
            setSelectedLogIds([]);
        } else {
            setSelectedLogIds(logs.map(log => log.id));
        }
    };

    const toggleSelectLog = (id) => {
        setSelectedLogIds(prev =>
            prev.includes(id)
                ? prev.filter(logId => logId !== id)
                : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-inter">
            <div className="max-w-7xl mx-auto space-y-8 pb-20">
                {/* Header */}
                <header className="flex justify-between items-center border-b border-white/5 pb-8">
                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => navigate('/admin')}
                            className="p-3 rounded-xl border border-white/10 hover:border-primary/40 transition-all active:scale-95"
                        >
                            <ArrowLeft size={20} className="text-white/60" />
                        </button>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic flex items-center gap-4">
                                <Terminal className="text-primary" size={40} />
                                DIAGNOSTIC <span className="text-primary italic font-light drop-shadow-[0_0_15px_rgba(var(--theme-rgb),0.5)]">LOGS</span>
                            </h1>
                            <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-mono mt-2">
                                System Error Monitoring & Trace Analysis
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Batch Action Button */}
                        {selectedLogIds.length > 0 && (
                            <button
                                onClick={handleBatchAction}
                                className={`px-6 py-3 rounded-xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 ${showResolved
                                    ? 'border-red-500/40 text-red-500 bg-red-500/10 hover:bg-red-500/20'
                                    : 'border-green-500/40 text-green-500 bg-green-500/10 hover:bg-green-500/20'
                                    }`}
                            >
                                {showResolved ? `Delete Selected (${selectedLogIds.length})` : `Resolve Selected (${selectedLogIds.length})`}
                            </button>
                        )}

                        <button
                            onClick={() => setShowResolved(!showResolved)}
                            className={`px-6 py-3 rounded-xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 ${showResolved
                                ? 'border-green-500/40 text-green-500/80 bg-green-500/10'
                                : 'border-white/10 text-white/60 hover:border-white/20'
                                }`}
                        >
                            {showResolved ? 'Showing Resolved' : 'Showing Unresolved'}
                        </button>
                    </div>
                </header>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard label="Total Logs" value={logs.length} />
                    <StatCard label="Site Visits" value={visitCount} />
                    <StatCard label="Status" value={showResolved ? 'Resolved' : 'Active'} />
                </div>

                {/* Main Content Area */}
                {logs.length > 0 && (
                    <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                        <input
                            type="checkbox"
                            checked={logs.length > 0 && selectedLogIds.length === logs.length}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded border-white/20 bg-transparent text-primary focus:ring-primary/50"
                        />
                        <span className="text-xs uppercase tracking-widest opacity-50 font-mono">
                            Select All {showResolved ? 'Resolved' : 'Unresolved'} Logs
                        </span>
                    </div>
                )}

                {/* Logs Table */}
                {logs.length === 0 ? (
                    <div className="p-12 rounded-[2rem] border border-white/5 bg-[#0f0f0f] text-center space-y-4">
                        <CheckCircle size={48} className="mx-auto text-green-500 opacity-50" />
                        <p className="text-sm uppercase tracking-widest opacity-50 font-mono">
                            {showResolved ? 'No resolved logs found' : 'No active errors - System Healthy'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {logs.map((log) => (
                            <LogRow
                                key={log.id}
                                log={log}
                                selected={selectedLogIds.includes(log.id)}
                                onToggleSelect={() => toggleSelectLog(log.id)}
                                onViewTrace={() => setSelectedLog(log)}
                                onResolve={() => handleResolve(log.id)}
                                showResolveButton={!showResolved}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Stack Trace Modal */}
            {selectedLog && (
                <TraceModal log={selectedLog} onClose={() => setSelectedLog(null)} />
            )}
        </div>
    );
};

const StatCard = ({ label, value }) => (
    <div className="p-6 rounded-[2rem] border border-white/5 bg-[#0f0f0f]">
        <p className="text-[8px] uppercase tracking-[0.3em] opacity-40 font-mono mb-2">{label}</p>
        <p className="text-2xl font-black tracking-tight text-primary">{value}</p>
    </div>
);

const LogRow = ({ log, selected, onToggleSelect, onViewTrace, onResolve, showResolveButton }) => {
    const timestamp = new Date(log.created_at).toLocaleString();
    const journey = Array.isArray(log.journey) ? log.journey : [];

    return (
        <div
            className={`p-6 rounded-[2rem] border transition-all space-y-4 ${selected
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-white/10 bg-[#0f0f0f] hover:border-primary/20'
                }`}
        >
            <div className="flex justify-between items-start gap-4">
                <div className="pt-1">
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={onToggleSelect}
                        className="w-5 h-5 rounded border-white/20 bg-transparent text-primary focus:ring-primary/50 cursor-pointer"
                    />
                </div>
                <div className="flex-1  space-y-2">
                    <div className="flex items-center gap-3">
                        <AlertCircle size={20} className="text-red-500" />
                        <h3 className="text-lg font-bold tracking-tight text-white">{log.message}</h3>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest opacity-40 font-mono">{timestamp}</p>
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                        <span className="opacity-50">URL:</span>
                        <span className="text-primary">{log.url}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onViewTrace}
                        className="px-4 py-2 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-wider hover:bg-white/5 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <Terminal size={14} />
                        View Trace
                    </button>
                    {showResolveButton && (
                        <button
                            onClick={onResolve}
                            className="px-4 py-2 rounded-xl border border-green-500/40 text-green-500 text-[9px] font-black uppercase tracking-wider hover:bg-green-500/10 transition-all active:scale-95"
                        >
                            Resolve
                        </button>
                    )}
                </div>
            </div>

            {/* Breadcrumbs */}
            {journey.length > 0 && (
                <div className="pt-4 border-t border-white/5 ml-9">
                    <div className="flex items-center gap-2 mb-2">
                        <MapPin size={14} className="text-primary opacity-50" />
                        <span className="text-[9px] uppercase tracking-widest opacity-50 font-mono">User Journey</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {journey.map((path, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-mono text-white/60"
                            >
                                {path}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const TraceModal = ({ log, onClose }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 z-50" onClick={onClose}>
        <div className="bg-[#0f0f0f] border border-white/10 rounded-[2rem] max-w-4xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-white uppercase">{log.message}</h2>
                    <p className="text-[10px] uppercase tracking-widest opacity-40 font-mono mt-1">Stack Trace Analysis</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-3 rounded-xl border border-white/10 hover:border-red-500/40 hover:text-red-500 transition-all active:scale-95"
                >
                    <X size={20} />
                </button>
            </div>
            <div className="p-8 overflow-auto max-h-[60vh]">
                <pre className="text-[10px] font-mono text-white/60 leading-relaxed whitespace-pre-wrap">
                    {log.stack_trace || 'No stack trace available'}
                </pre>
            </div>
        </div>
    </div>
);

export default DiagnosticLogs;
