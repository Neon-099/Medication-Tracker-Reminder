import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMedications, type Medication } from '../../context/MedicationContext.tsx';
import PrescriptionScanner from '../../components/user/PrescriptionScanner';

const SkeletonField = () => (
  <div className="animate-pulse space-y-2">
    <div className="h-4 bg-gray-200 rounded w-24"></div>
    <div className="h-12 bg-gray-100 rounded-xl w-full border border-gray-200"></div>
  </div>
);

const AddMedication = () => {
  const navigate = useNavigate();
  const { addMedication } = useMedications();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Medication>>({
    name: '',
    dosage: '',
    scheduledTime: '08:00',
    frequency: 'once',
    riskLevel: 'low',
    status: 'active',
    instructions: '',
    startDate: new Date().toISOString().split('T')[0],
  });

  const [showScanner, setShowScanner] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openScanner) {
      setShowScanner(true);
    }
  }, [location]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name?.trim()) {
        newErrors.name = 'Medication name is required';
      }
      if (!formData.dosage?.trim()) {
        newErrors.dosage = 'Dosage is required';
      }
    }

    if (currentStep === 2) {
      if (!formData.scheduledTime) {
        newErrors.scheduledTime = 'Scheduled time is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(step) || step < 3) {
      if (step < 3) {
        setStep(3);
      }
      return;
    }

    const newMedication = {
      name: formData.name!,
      dosage: formData.dosage!,
      scheduledTime: formData.scheduledTime!,
      frequency: formData.frequency || 'once',
      riskLevel: formData.riskLevel || 'low',
      status: formData.status || 'active',
      instructions: formData.instructions,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
    };

    addMedication(newMedication);
    navigate('/medications');
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleScanComplete = (scannedData: Partial<Medication>) => {
    setShowScanner(false);
    setIsAnalyzing(true);
    setScanError(null);
    
    // Simulate processing/filling delay for better UX
    setTimeout(() => {
      // Check if meaningful data was extracted
      if (!scannedData.name && !scannedData.dosage) {
        setScanError("We couldn't clearly read the prescription details. Please fill in the form manually.");
        setIsAnalyzing(false);
        return;
      }

      setFormData(prev => ({ ...prev, ...scannedData }));
      setIsAnalyzing(false);
      // Ensure we are on step 1 to show the filled data
      setStep(1);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Add Medication</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          
          {/* Scan Button */}
          <div className="mb-8">
            <button
              onClick={() => setShowScanner(true)}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 group"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Scan Prescription Label
            </button>
            <p className="text-center text-sm text-gray-500 mt-2">
              Automatically fill details by scanning your medication bottle
            </p>
          </div>

          {scanError && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-800 animate-in fade-in slide-in-from-top-2">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <p className="font-medium">Scan Issue</p>
                <p className="text-sm opacity-90">{scanError}</p>
              </div>
              <button onClick={() => setScanError(null)} className="text-amber-600 hover:text-amber-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Step {step} of 3</span>
              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`w-3 h-3 rounded-full transition-all ${
                      s < step ? 'bg-green-500' : s === step ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
                {isAnalyzing ? (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                      <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full"></div>
                      <span className="font-medium">Analyzing prescription...</span>
                    </div>
                    <SkeletonField />
                    <SkeletonField />
                    <SkeletonField />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medication Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dosage *
                      </label>
                      <input
                        type="text"
                        value={formData.dosage || ''}
                        onChange={(e) => {
                          setFormData({ ...formData, dosage: e.target.value });
                          if (errors.dosage) setErrors({ ...errors, dosage: '' });
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.dosage ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.dosage && (
                        <p className="mt-1 text-sm text-red-600">{errors.dosage}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Risk Level
                      </label>
                      <select
                        value={formData.riskLevel || 'low'}
                        onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as Medication['riskLevel'] })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Low Risk</option>
                        <option value="medium">Medium Risk</option>
                        <option value="high">High Risk</option>
                      </select>
                      {formData.riskLevel === 'high' && (
                        <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <p className="text-sm text-orange-800">
                            ⚠️ High-risk medications require extra attention.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Schedule</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled Time *
                  </label>
                  <input
                    type="time"
                    value={formData.scheduledTime || '08:00'}
                    onChange={(e) => {
                      setFormData({ ...formData, scheduledTime: e.target.value });
                      if (errors.scheduledTime) setErrors({ ...errors, scheduledTime: '' });
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.scheduledTime ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {formatTime(formData.scheduledTime || '08:00')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency *
                  </label>
                  <select
                    value={formData.frequency || 'once'}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value as Medication['frequency'] })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="once">Once a day</option>
                    <option value="twice">Twice a day</option>
                    <option value="thrice">Three times a day</option>
                    <option value="daily">Daily (as needed)</option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Details</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions (Optional)
                  </label>
                  <textarea
                    value={formData.instructions || ''}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Take with food"
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Summary</h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Dosage:</strong> {formData.dosage}</p>
                    <p><strong>Time:</strong> {formatTime(formData.scheduledTime || '08:00')}</p>
                    <p><strong>Frequency:</strong> {formData.frequency}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Save Medication
                </button>
              )}
            </div>
          </form>
        </div>
      </main>

      {showScanner && (
        <PrescriptionScanner 
          onScanComplete={handleScanComplete}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default AddMedication;