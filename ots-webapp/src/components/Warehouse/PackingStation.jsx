import React, { useState } from 'react';
import VisionQC from '../Vision/VisionQC';
import visionService from '../../services/visionService';
import { useData } from '../../context/DataContext';
import { PackageCheck, CheckCircle2, AlertOctagon, Printer } from 'lucide-react';

const PackingStation = () => {
    const { orders, updateOrderStatus } = useData();
    const [scanMode, setScanMode] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [packingStatus, setPackingStatus] = useState({ verified: [], missing: [] });
    const [searchId, setSearchId] = useState('');

    const handleSearch = () => {
        const order = orders.find(o => o.id === searchId || (o.id && o.id.includes(searchId)));
        if (order) {
            setCurrentOrder(order);
            // Reset packing status
            setPackingStatus({
                verified: [],
                missing: order.items ? order.items.map(i => i.sku) : ['SKU-DEMO-1', 'SKU-DEMO-2'] // Fallback for list orders without items array
            });
        } else {
            alert('Order not found!');
        }
    };

    const handleVerification = (results) => {
        if (!currentOrder) return;

        // Mock matching logic since our mock detection returns generics like "Cardboard Box"
        // In real app, we'd match SKU codes detected from barcodes or visual product ID
        const newlyVerified = [...packingStatus.verified];
        const remainingMissing = [...packingStatus.missing];

        // Simulate confirming 1 item per scan for the walkthrough
        if (remainingMissing.length > 0) {
            const itemToVerify = remainingMissing.shift();
            newlyVerified.push(itemToVerify);
        }

        setPackingStatus({
            verified: newlyVerified,
            missing: remainingMissing
        });

        setScanMode(false);
    };

    const isFullyPacked = packingStatus.missing.length === 0 && packingStatus.verified.length > 0;

    const finalizePacking = () => {
        if (!isFullyPacked) return;
        updateOrderStatus(currentOrder.id, 'Ready-to-Ship', {
            packedAt: new Date().toISOString(),
            verificationMethod: 'AI_VISION'
        });
        alert(`Order ${currentOrder.id} Verified & Label Generated!`);
        setCurrentOrder(null);
        setSearchId('');
    };

    return (
        <div className="packing-station p-6 animate-fade max-w-6xl mx-auto">
            <header className="mb-8">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                    Smart Vision Packing Station
                </h1>
                <p className="text-slate-400">AI-Assisted packing verification and Quality Control</p>
            </header>

            {!currentOrder ? (
                <div className="glass p-12 text-center max-w-md mx-auto rounded-2xl">
                    <PackageCheck size={48} className="mx-auto text-blue-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Scan Picklist / Order ID</h3>
                    <div className="flex gap-2 mt-6">
                        <input
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            placeholder="Scan Barcode (e.g., ORD-001)"
                            className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold transition-all"
                        >
                            START
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Packing List */}
                    <div className="space-y-6">
                        <div className="glass p-6 rounded-xl border-l-4 border-blue-500">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold font-mono text-white">{currentOrder.id}</h2>
                                    <p className="text-slate-400 mt-1">{currentOrder.customer}</p>
                                </div>
                                <span className="badge bg-blue-500/20 text-blue-400">{currentOrder.status}</span>
                            </div>

                            <div className="space-y-3 mt-6">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Packing List</h4>
                                {packingStatus.verified.map((sku, i) => (
                                    <div key={`v-${i}`} className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                        <CheckCircle2 size={20} className="text-green-400" />
                                        <span className="font-mono text-green-100 line-through decoration-green-500/50">{sku}</span>
                                        <span className="ml-auto text-xs font-bold text-green-400">VERIFIED</span>
                                    </div>
                                ))}
                                {packingStatus.missing.map((sku, i) => (
                                    <div key={`m-${i}`} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg animate-pulse">
                                        <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
                                        <span className="font-mono text-slate-300">{sku}</span>
                                        <span className="ml-auto text-xs font-bold text-slate-500">PENDING</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="glass p-6 rounded-xl">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setScanMode(true)}
                                    disabled={isFullyPacked}
                                    className={`flex-1 py-4 rounded-xl font-bold flex flex-col items-center justify-center gap-2 transition-all ${isFullyPacked ? 'opacity-50 cursor-not-allowed bg-slate-800' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] shadow-lg shadow-indigo-500/30'}`}
                                >
                                    <PackageCheck size={24} />
                                    {isFullyPacked ? 'ALL ITEMS PACKED' : 'SCAN NEXT ITEM'}
                                </button>

                                <button
                                    onClick={finalizePacking}
                                    disabled={!isFullyPacked}
                                    className={`flex-1 py-4 rounded-xl font-bold flex flex-col items-center justify-center gap-2 transition-all ${!isFullyPacked ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-500' : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/30 hover:scale-[1.02]'}`}
                                >
                                    <Printer size={24} />
                                    GENERATE LABEL
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Vision View */}
                    <div className="glass p-1 rounded-xl bg-black/40">
                        {scanMode ? (
                            <div className="h-full min-h-[400px]">
                                <h3 className="p-4 text-center font-bold text-slate-300">Point Camera at Item</h3>
                                <VisionQC onScanComplete={handleVerification} />
                                <button
                                    onClick={() => setScanMode(false)}
                                    className="w-full py-3 mt-4 text-slate-400 hover:text-white text-sm"
                                >
                                    Cancel Scan
                                </button>
                            </div>
                        ) : (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-600 space-y-4">
                                <div className="p-6 rounded-full bg-white/5 border border-white/10">
                                    <AlertOctagon size={48} />
                                </div>
                                <p>Camera Idle</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PackingStation;
