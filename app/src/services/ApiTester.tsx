import { useState } from 'react';
import { analyzeImage } from './visionApi';

const ApiTester = ({ onClose }: { onClose: () => void }) => {
  const [image, setImage] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        addLog('Image loaded');
      };
      reader.readAsDataURL(file);
    }
  };

  const runTest = async () => {
    if (!image) return;
    setLoading(true);
    addLog('Starting analysis...');
    
    try {
      const result = await analyzeImage(image);
      addLog('Success! Result received:');
      addLog('--- START RESULT ---');
      addLog(result.substring(0, 200) + (result.length > 200 ? '...' : ''));
      addLog('--- END RESULT ---');
    } catch (error: any) {
      addLog(`ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Vision API Tester (Gemini + Grok)</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Config Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg border ${import.meta.env.VITE_GEMINI_API_KEY ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              <div className="font-bold text-sm">Gemini API</div>
              <div className="text-xs">{import.meta.env.VITE_GEMINI_API_KEY ? 'Configured' : 'Missing Key'}</div>
            </div>
            <div className={`p-3 rounded-lg border ${import.meta.env.VITE_GROK_API_KEY ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              <div className="font-bold text-sm">Grok API</div>
              <div className="text-xs">{import.meta.env.VITE_GROK_API_KEY ? 'Configured' : 'Missing Key'}</div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Test Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          {image && (
            <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <img src={image} alt="Preview" className="w-full h-full object-contain" />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={runTest}
              disabled={!image || loading}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Analyzing...' : 'Run Analysis'}
            </button>
            <button
              onClick={() => setLogs([])}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Clear Logs
            </button>
          </div>

          {/* Console Output */}
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-green-400 h-64 overflow-y-auto shadow-inner">
            {logs.length === 0 ? (
              <span className="text-gray-500 italic">Ready to test...</span>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="mb-1 border-b border-gray-800 pb-1 last:border-0">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTester;