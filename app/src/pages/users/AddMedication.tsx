import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMedications, Medication } from '../../context/MedicationContext';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Add Medication</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
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
    </div>
  );
};

export default AddMedication;