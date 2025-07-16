
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Index from './Index';

const universityData = {
  sppu: {
    name: 'Savitribai Phule Pune University',
    shortName: 'SPPU',
    city: 'Pune',
    color: 'bg-blue-600'
  },
  mu: {
    name: 'University of Mumbai',
    shortName: 'MU',
    city: 'Mumbai',
    color: 'bg-purple-600'
  },
  du: {
    name: 'University of Delhi',
    shortName: 'DU',
    city: 'Delhi',
    color: 'bg-green-600'
  },
  jnu: {
    name: 'Jawaharlal Nehru University',
    shortName: 'JNU',
    city: 'Delhi',
    color: 'bg-red-600'
  },
  cu: {
    name: 'University of Calcutta',
    shortName: 'CU',
    city: 'Kolkata',
    color: 'bg-orange-600'
  },
  au: {
    name: 'Anna University',
    shortName: 'AU',
    city: 'Chennai',
    color: 'bg-teal-600'
  },
  impact: {
    name: 'Impact School',
    shortName: 'IMPACT',
    city: 'Lagos',
    color: 'bg-indigo-600'
  }
};

const UniversityResult = () => {
  const { universityId } = useParams<{ universityId: string }>();
  const navigate = useNavigate();
  
  const university = universityId ? universityData[universityId as keyof typeof universityData] : null;

  if (!university) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">University not found</h2>
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${university.color} rounded-lg flex items-center justify-center`}>
                <span className="text-white font-bold text-sm">{university.shortName}</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{university.name}</h1>
                <p className="text-sm text-gray-600">Result Sheet Creator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result Creator Content */}
      <Index universityContext={university} />
    </div>
  );
};

export default UniversityResult;
