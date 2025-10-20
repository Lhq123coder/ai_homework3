import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTripStore } from '../store/tripStore';
import { tripsApi, aiApi } from '../services/api';
import MapView from '../components/MapView';
import ExpenseTracker from '../components/ExpenseTracker';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  MapPin, 
  Clock,
  Home,
  Utensils,
  Car,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { format } from '../utils/date';

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentTrip, setCurrentTrip } = useTripStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'map' | 'expenses'>('itinerary');
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));

  useEffect(() => {
    if (id) {
      loadTrip(id);
    }
  }, [id]);

  const loadTrip = async (tripId: string) => {
    try {
      const trip = await tripsApi.getOne(tripId);
      setCurrentTrip(trip);
    } catch (error) {
      console.error('Failed to load trip:', error);
      alert('加载行程失败');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(day)) {
      newExpanded.delete(day);
    } else {
      newExpanded.add(day);
    }
    setExpandedDays(newExpanded);
  };

  const handleExpensesUpdate = async (expenses: any[]) => {
    if (!currentTrip || !id) return;
    
    try {
      const updatedTrip = await tripsApi.update(id, {
        ...currentTrip,
        expenses
      });
      setCurrentTrip(updatedTrip);
    } catch (error) {
      console.error('Failed to update expenses:', error);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px'
      }}>
        <p style={{ color: 'var(--text-light)' }}>加载中...</p>
      </div>
    );
  }

  if (!currentTrip) {
    return null;
  }

  const itinerary = currentTrip.itinerary;
  const totalExpenses = currentTrip.expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const remainingBudget = currentTrip.budget - totalExpenses;

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '3rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            {currentTrip.destination}
          </h1>
          <div style={{
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap',
            fontSize: '0.95rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} />
              <span>
                {format(new Date(currentTrip.start_date), 'yyyy年M月d日')} - 
                {format(new Date(currentTrip.end_date), 'M月d日')}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} />
              <span>{currentTrip.travelers} 人</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DollarSign size={18} />
              <span>
                预算 ¥{currentTrip.budget.toLocaleString()} 
                {totalExpenses > 0 && ` / 已花费 ¥${totalExpenses.toLocaleString()}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          gap: '2rem',
          padding: '0 2rem'
        }}>
          {[
            { id: 'itinerary', label: '行程安排', icon: Calendar },
            { id: 'map', label: '地图导航', icon: MapPin },
            { id: 'expenses', label: '费用管理', icon: DollarSign }
          ].map(({ id: tabId, label, icon: Icon }) => (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 0',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: `3px solid ${activeTab === tabId ? 'var(--primary)' : 'transparent'}`,
                color: activeTab === tabId ? 'var(--primary)' : 'var(--text-light)',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {activeTab === 'itinerary' && (
          <div>
            {/* Overview */}
            <div style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '2rem',
              boxShadow: 'var(--shadow)'
            }}>
              <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={24} style={{ color: 'var(--primary)' }} />
                行程概述
              </h2>
              <p style={{ color: 'var(--text)', lineHeight: '1.6' }}>
                {itinerary?.overview || '暂无行程概述'}
              </p>
            </div>

            {/* Daily Itinerary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {itinerary?.days?.map((day: any) => (
                <div
                  key={day.day}
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow)'
                  }}
                >
                  <button
                    onClick={() => toggleDay(day.day)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1.5rem',
                      backgroundColor: 'var(--surface)',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                        第 {day.day} 天
                      </h3>
                      <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
                        {day.activities?.length || 0} 个活动
                      </p>
                    </div>
                    {expandedDays.has(day.day) ? (
                      <ChevronUp size={24} style={{ color: 'var(--text-light)' }} />
                    ) : (
                      <ChevronDown size={24} style={{ color: 'var(--text-light)' }} />
                    )}
                  </button>

                  {expandedDays.has(day.day) && (
                    <div style={{ padding: '0 1.5rem 1.5rem' }}>
                      {day.activities?.map((activity: any, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            gap: '1rem',
                            padding: '1rem',
                            backgroundColor: idx % 2 === 0 ? 'var(--bg)' : 'transparent',
                            borderRadius: '0.5rem',
                            marginBottom: '0.5rem'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--primary)',
                            fontWeight: '600',
                            minWidth: '80px'
                          }}>
                            <Clock size={16} />
                            {activity.time}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ marginBottom: '0.25rem' }}>{activity.title}</h4>
                            <p style={{
                              color: 'var(--text-light)',
                              fontSize: '0.875rem',
                              marginBottom: '0.5rem'
                            }}>
                              {activity.description}
                            </p>
                            <div style={{
                              display: 'flex',
                              gap: '1rem',
                              fontSize: '0.875rem',
                              color: 'var(--text-light)'
                            }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <MapPin size={14} />
                                {activity.location}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <DollarSign size={14} />
                                ¥{activity.estimatedCost?.toLocaleString() || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Accommodation & Transportation */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem',
              marginTop: '2rem'
            }}>
              {itinerary?.accommodation && (
                <div style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow)'
                }}>
                  <h3 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    <Home size={20} style={{ color: 'var(--primary)' }} />
                    住宿推荐
                  </h3>
                  <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                    {itinerary.accommodation.name}
                  </p>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
                    {itinerary.accommodation.type} · {itinerary.accommodation.location}
                  </p>
                  <p style={{ color: 'var(--primary)', fontWeight: '600', marginTop: '0.5rem' }}>
                    约 ¥{itinerary.accommodation.estimatedCost?.toLocaleString()}/晚
                  </p>
                </div>
              )}

              {itinerary?.transportation && (
                <div style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow)'
                }}>
                  <h3 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    <Car size={20} style={{ color: 'var(--primary)' }} />
                    交通建议
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    fontSize: '0.875rem'
                  }}>
                    <div>
                      <strong>到达：</strong>
                      <span style={{ color: 'var(--text-light)' }}> {itinerary.transportation.arrival}</span>
                    </div>
                    <div>
                      <strong>当地：</strong>
                      <span style={{ color: 'var(--text-light)' }}> {itinerary.transportation.local}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tips */}
            {itinerary?.tips && itinerary.tips.length > 0 && (
              <div style={{
                backgroundColor: '#fff7ed',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginTop: '2rem',
                border: '2px solid #fed7aa'
              }}>
                <h3 style={{
                  color: 'var(--warning)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  💡 旅行贴士
                </h3>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  {itinerary.tips.map((tip: string, idx: number) => (
                    <li key={idx} style={{
                      paddingLeft: '1.5rem',
                      position: 'relative',
                      color: '#92400e'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        top: 0
                      }}>•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'map' && (
          <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: 'var(--shadow)'
          }}>
            <MapView itinerary={itinerary} />
          </div>
        )}

        {activeTab === 'expenses' && (
          <ExpenseTracker
            expenses={currentTrip.expenses || []}
            budget={currentTrip.budget}
            onUpdate={handleExpensesUpdate}
          />
        )}
      </div>
    </div>
  );
}

