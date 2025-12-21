import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMedications, type Medication } from '../../context/MedicationContext';

const EditMedication = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMedication, updateMedication, deleteMedication } = useMedications();
  
  const medication = id ? getMedication(id) : null;

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
    endDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (medication) {
      setFormData({
        name: medication.name,
        dosage: medication.dosage,
        scheduledTime: medication.scheduledTime,
        frequency: medication.frequency,
        riskLevel: medication.riskLevel,
        status: medication.status,
        instructions: medication.instructions || '',
        startDate: medication.startDate.split('T')[0],
        endDate: medication.endDate ? medication.endDate.split('T')[0] : '',
      });
    } else if (id) {
      // Medication not found
      navigate('/medications');
    }
  }, [medication, id, navigate]);

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
      if (!formData.frequency) {
        newErrors.frequency = 'Frequency is required';
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

    if (id) {
      const updateData: Partial<Medication> = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      };
      updateMedication(id, updateData);
      navigate(`/medications/${id}`);
    }
  };

  const handleDelete = () => {
    if (id) {
      deleteMedication(id);
      navigate('/medications');
    }
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (!medication) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Medication not found</p>
          <Link to="/medications" className="text-blue-600 hover:text-blue-700">
            Back to Medications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Edit Medication</h1>
            <Link
              to={`/medications/${id}`}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {/* Progress Indicator */}
          <div className="mb-8">
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
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
                  
                  <div className="space-y-4">
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
                        placeholder="e.g., Lisinopril"
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
                        placeholder="e.g., 10mg"
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
                            ⚠️ High-risk medications require extra attention. Please consult with your healthcare provider.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Schedule */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Schedule</h2>
                  
                  <div className="space-y-4">
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
                        Current: {formatTime(formData.scheduledTime || '08:00')}
                      </p>
                      {errors.scheduledTime && (
                        <p className="mt-1 text-sm text-red-600">{errors.scheduledTime}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency *
                      </label>
                      <select
                        value={formData.frequency || 'once'}
                        onChange={(e) => {
                          setFormData({ ...formData, frequency: e.target.value as Medication['frequency'] });
                          if (errors.frequency) setErrors({ ...errors, frequency: '' });
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.frequency ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="once">Once a day</option>
                        <option value="twice">Twice a day</option>
                        <option value="thrice">Three times a day</option>
                        <option value="daily">Daily (as needed)</option>
                      </select>
                      {errors.frequency && (
                        <p className="mt-1 text-sm text-red-600">{errors.frequency}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={formData.startDate || ''}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date (Optional)
                        </label>
                        <input
                          type="date"
                          value={formData.endDate || ''}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Additional Details */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Details</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instructions (Optional)
                      </label>
                      <textarea
                        value={formData.instructions || ''}
                        onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Take with food, Avoid alcohol, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status || 'active'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as Medication['status'] })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">Summary</h3>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p><strong>Name:</strong> {formData.name}</p>
                        <p><strong>Dosage:</strong> {formData.dosage}</p>
                        <p><strong>Time:</strong> {formatTime(formData.scheduledTime || '08:00')}</p>
                        <p><strong>Frequency:</strong> {formData.frequency}</p>
                        <p><strong>Risk Level:</strong> {formData.riskLevel}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
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
                <div className="flex gap-4 flex-1">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-6 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-3 rounded-xl transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Delete Medication?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete {medication.name}? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EditMedication;