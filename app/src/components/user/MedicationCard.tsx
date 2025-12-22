import { Link } from "react-router-dom"; 
import { useMedications } from "../../context/MedicationContext";
import { useState } from "react";

const getStatusText = (status: 'taken' | 'upcoming' | 'missed') => {
    switch (status) {
      case 'taken':
        return 'Taken';
      case 'upcoming':
        return 'Upcoming';
      case 'missed':
        return 'Missed';
    }
  };

const getRiskLevelBadge = (riskLevel: 'low' | 'medium' | 'high') => {
const styles = {
    low: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-300 shadow-sm',
    medium: 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-300 shadow-sm',
    high: 'bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border-orange-300 shadow-sm',
};

const labels = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
};

return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${styles[riskLevel]}`}>
    {labels[riskLevel]}
    </span>
);
};

const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

interface MedicationProps {
    medication: any,
    status: any
    id: string
}   

const MedicationCard = ({ medication, status, id  }: MedicationProps) => {
    const { markAsTaken } = useMedications();
    const [isMarking, setIsMarking] = useState(false);
    const [justMarked, setJustMarked] = useState(false);

    const handleMarkAsTaken = () => {
        if (status === 'taken' || isMarking) return;
        
        setIsMarking(true);
        markAsTaken(id);
        
        // Visual feedback animation
        setTimeout(() => {
            setJustMarked(true);
            setIsMarking(false);
        }, 300);
    };
    
    const isTaken = status === 'taken' || justMarked;
    
    return (
        <div
            key={id}
            className={`group flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 ${
            isTaken
                ? 'border-green-200/50 bg-gradient-to-r from-green-50/50 to-emerald-50/50 shadow-md shadow-green-100/30'
                : status === 'upcoming'
                ? 'border-blue-200/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-200/50 hover:-translate-y-0.5'
                : 'border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-yellow-50/50 hover:shadow-lg hover:shadow-amber-100/50'
            } ${justMarked ? 'animate-pulse' : ''}`}
            >
            
            {/* Main Content */}
            <div className="flex-1 min-w-0 flex flex-col gap-3">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 break-words">
                            {medication.name}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shadow-sm ${
                        isTaken ? 'bg-green-100 text-green-700' :
                        status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                        }`}>
                        {getStatusText(isTaken ? 'taken' : status)}
                        </span>
                        {status === 'upcoming' && !isTaken && (
                            <Link
                                to={`/medications/${medication.id}`}
                                className="text-blue-600 hover:text-blue-700 transition-colors p-2 rounded-lg hover:bg-blue-50 active:bg-blue-100 flex-shrink-0"
                                aria-label="View details"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        )}
                    </div>
                </div>
                
                {/* Medication Details */}
                <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-gray-700">
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            <span className="text-sm sm:text-base font-semibold">{medication.dosage}mg</span>
                        </div>
                        <span className="text-gray-300 hidden sm:inline">•</span>
                        <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm sm:text-base font-medium">{formatTime(medication.scheduledTime)}</span>
                        </div>
                        <span className="text-gray-300 hidden sm:inline">•</span>
                        <div className="w-full sm:w-auto">
                            {getRiskLevelBadge(medication.riskLevel)}
                        </div>
                    </div>
                
                    {/* Mark as Taken Button - Mobile Optimized */}
                    <div className="">
                        <button 
                        onClick={handleMarkAsTaken}
                        disabled={isTaken || isMarking || status === 'missed'}
                        className={`
                            w-full sm:w-auto sm:max-w-xs
                            ${isTaken 
                                ? 'bg-gradient-to-r from-green-400 to-green-500 cursor-not-allowed opacity-75' 
                                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 active:scale-95'
                            }
                            text-white font-bold py-3 sm:py-2.5 px-6 rounded-xl 
                            text-base sm:text-lg transition-all duration-200
                            shadow-lg shadow-green-200/50 hover:shadow-xl hover:shadow-green-300/50
                            flex items-center justify-center gap-2
                            min-h-[48px] sm:min-h-[44px]
                            ${isMarking ? 'animate-pulse' : ''}
                        `}
                    >
                        {isMarking ? (
                            <>
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Marking...</span>
                            </>
                        ) : isTaken ? (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Marked as Taken</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Mark as Taken</span>
                            </>
                        )}
                        </button>  
                    </div>
                </div>
            </div>  
        </div>
    )
}        
export default MedicationCard;