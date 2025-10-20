import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { aiApi, tripsApi } from '../services/api';
import { useTripStore } from '../store/tripStore';
import { Mic, MicOff, Loader, Sparkles } from 'lucide-react';

export default function TripPlanner() {
  const navigate = useNavigate();
  const { addTrip } = useTripStore();
  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [travelers, setTravelers] = useState('');
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useVoiceInput, setUseVoiceInput] = useState(false);

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      setUseVoiceInput(false);
      // Parse the transcript
      parseVoiceInput(transcript);
    } else {
      resetTranscript();
      startListening();
      setUseVoiceInput(true);
    }
  };

  const parseVoiceInput = (text: string) => {
    // Simple parsing logic - in production, you might want to use more sophisticated NLP
    const input = text.toLowerCase();
    
    // Try to extract destination
    const destMatch = input.match(/(?:去|到|想去|前往)([^，,。.]+?)(?:[，,。.]|$)/);
    if (destMatch && !destination) {
      setDestination(destMatch[1].trim());
    }

    // Try to extract days
    const daysMatch = input.match(/(\d+)\s*天/);
    if (daysMatch && !startDate) {
      const days = parseInt(daysMatch[1]);
      const start = new Date();
      const end = new Date();
      end.setDate(end.getDate() + days);
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(end.toISOString().split('T')[0]);
    }

    // Try to extract budget
    const budgetMatch = input.match(/预算[：:]?\s*(\d+(?:\.\d+)?)\s*(?:元|万)/);
    if (budgetMatch && !budget) {
      let amount = parseFloat(budgetMatch[1]);
      if (input.includes('万')) {
        amount *= 10000;
      }
      setBudget(amount.toString());
    }

    // Try to extract travelers
    const travelersMatch = input.match(/(\d+)\s*人/);
    if (travelersMatch && !travelers) {
      setTravelers(travelersMatch[1]);
    }

    // Set preferences to the full input if not already set
    if (!preferences) {
      setPreferences(text);
    }
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!destination || !startDate || !endDate || !budget || !travelers) {
      setError('请填写所有必填字段');
      return;
    }

    const days = calculateDays();
    if (days <= 0) {
      setError('结束日期必须晚于开始日期');
      return;
    }

    setLoading(true);

    try {
      // Generate itinerary with AI
      const itinerary = await aiApi.generateItinerary({
        destination,
        days,
        budget: parseFloat(budget),
        travelers: parseInt(travelers),
        preferences: preferences || '无特别偏好',
      });

      // Save trip
      const trip = await tripsApi.create({
        destination,
        startDate,
        endDate,
        budget: parseFloat(budget),
        travelers: parseInt(travelers),
        preferences: preferences || '无特别偏好',
        itinerary,
        expenses: [],
      });

      addTrip(trip);
      navigate(`/trip/${trip.id}`);
    } catch (err: any) {
      console.error('Failed to create trip:', err);
      setError('创建行程失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '1rem',
        boxShadow: 'var(--shadow-lg)',
        padding: '2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          <Sparkles size={28} style={{ color: 'var(--primary)' }} />
          <h1 style={{ fontSize: '2rem', margin: 0 }}>AI 智能规划</h1>
        </div>
        <p style={{
          color: 'var(--text-light)',
          marginBottom: '2rem'
        }}>
          告诉我您的旅行需求，我会为您生成详细的行程计划
        </p>

        {isSupported && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#f0f9ff',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: useVoiceInput ? '0.75rem' : 0
            }}>
              <span style={{ color: 'var(--primary)', fontWeight: '600' }}>
                💡 试试语音输入！
              </span>
              <button
                onClick={handleVoiceInput}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: isListening ? 'var(--danger)' : 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                <span>{isListening ? '停止录音' : '开始语音输入'}</span>
              </button>
            </div>
            {useVoiceInput && transcript && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'white',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                color: 'var(--text)'
              }}>
                <strong>识别结果：</strong> {transcript}
              </div>
            )}
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-light)',
              marginTop: '0.5rem',
              marginBottom: 0
            }}>
              示例："我想去日本，5天，预算1万元，喜欢美食和动漫，2人"
            </p>
          </div>
        )}

        {error && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#fee',
            color: 'var(--danger)',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--text)'
              }}>
                目的地 <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--border)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
                placeholder="例如：日本东京"
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--text)'
              }}>
                开始日期 <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--border)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--text)'
              }}>
                结束日期 <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--border)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--text)'
              }}>
                预算（元） <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
                min="0"
                step="100"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--border)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
                placeholder="10000"
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--text)'
              }}>
                同行人数 <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="number"
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                required
                min="1"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--border)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
                placeholder="2"
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--text)'
              }}>
                旅行偏好
              </label>
              <textarea
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--border)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
                placeholder="例如：喜欢美食、历史文化、自然风光，带小孩，希望行程轻松..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: loading ? 'var(--text-light)' : 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {loading ? (
              <>
                <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
                <span>AI 正在为您规划行程...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>生成行程计划</span>
              </>
            )}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

