import React, { useState } from 'react';
import { Printer, Eye, Download, FileText } from 'lucide-react';
import { labelPrintService } from '../../services/labelPrintService';

const LabelTemplateManager = () => {
    const [mockOrder, setMockOrder] = useState({
        id: 'ORD-2024-001',
        customerName: 'Aarav Patel',
        shippingAddress: {
            street: '123 Tech Park, Sector 62',
            city: 'Noida',
            state: 'Uttar Pradesh',
            pincode: '201301'
        },
        items: [
            { name: 'Ergonomic Office Chair', quantity: 1 },
            { name: 'Wooden Desk Organizer', quantity: 2 }
        ],
        amount: '4500',
        paymentMethod: 'COD',
        phoneNumber: '9876543210',
        date: new Date().toISOString().split('T')[0]
    });

    const [zplCode, setZplCode] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);

    const generatePreview = () => {
        const zpl = labelPrintService.generateZPL(mockOrder, { name: 'BlueDart Express' });
        setZplCode(zpl);

        // Use Labelary API for live preview
        // Note: In production, we might want to proxy this to avoid mixed content or direct external calls
        const url = `http://labelary.com/viewer.html?density=8&quality=Bitonal&width=4&height=6&units=inches&zpl=${encodeURIComponent(zpl)}`;
        // For embedded image:
        const imgUrl = `https://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/${encodeURIComponent(zpl)}`;

        setPreviewUrl(imgUrl);
    };

    const handlePrint = async () => {
        await labelPrintService.printLabel(mockOrder);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Printer className="w-6 h-6 text-blue-500" />
                        Thermal Label Manager
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Generate and preview ZPL II shipping labels (4x6")</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mock Data Input */}
                <div className="bg-slate-900/50 border border-white/10 p-6 rounded-xl">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Mock Order Data
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Customer Name</label>
                            <input
                                type="text"
                                value={mockOrder.customerName}
                                onChange={e => setMockOrder({ ...mockOrder, customerName: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded p-2 text-sm text-white"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">City</label>
                                <input
                                    type="text"
                                    value={mockOrder.shippingAddress.city}
                                    onChange={e => setMockOrder({ ...mockOrder, shippingAddress: { ...mockOrder.shippingAddress, city: e.target.value } })}
                                    className="w-full bg-black/40 border border-white/10 rounded p-2 text-sm text-white"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Payment</label>
                                <select
                                    value={mockOrder.paymentMethod}
                                    onChange={e => setMockOrder({ ...mockOrder, paymentMethod: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded p-2 text-sm text-white"
                                >
                                    <option value="PREPAID">Prepaid</option>
                                    <option value="COD">COD</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={generatePreview}
                            className="w-full py-2 mt-4 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium flex justify-center items-center gap-2 transition-colors"
                        >
                            <Eye className="w-4 h-4" /> Generate Preview
                        </button>
                    </div>

                    {zplCode && (
                        <div className="mt-6">
                            <h3 className="text-xs font-semibold text-slate-400 mb-2">Generated ZPL Code</h3>
                            <pre className="bg-black/80 p-3 rounded text-[10px] text-green-400 font-mono overflow-auto max-h-40 border border-white/5">
                                {zplCode}
                            </pre>
                            <button
                                onClick={() => navigator.clipboard.writeText(zplCode)}
                                className="text-xs text-blue-400 mt-1 hover:underline cursor-pointer"
                            >
                                Copy to Clipboard
                            </button>
                        </div>
                    )}
                </div>

                {/* Preview Area */}
                <div className="bg-slate-900/50 border border-white/10 p-6 rounded-xl flex flex-col items-center justify-center min-h-[500px]">
                    {previewUrl ? (
                        <div className="text-center">
                            <div className="bg-white p-2 rounded shadow-lg inline-block">
                                <img src={previewUrl} alt="Label Preview" className="max-h-[400px] border border-gray-300" />
                            </div>
                            <div className="mt-6 flex justify-center gap-4">
                                <button
                                    onClick={handlePrint}
                                    className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
                                >
                                    <Printer className="w-5 h-5" /> Print Label
                                </button>
                                <a
                                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(zplCode)}`}
                                    download={`label-${mockOrder.id}.zpl`}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-full text-sm font-medium flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" /> Save ZPL
                                </a>
                            </div>
                            <p className="text-xs text-slate-500 mt-4">
                                *Preview provided by Labelary API. For local printing, verify browser permissions.
                            </p>
                        </div>
                    ) : (
                        <div className="text-center text-slate-500">
                            <Printer className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p>Enter details and click "Generate Preview"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LabelTemplateManager;
