import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTripStore } from '../store/tripStore';
import { tripsApi } from '../services/api';
import { Calendar, MapPin, Users, DollarSign, Trash2 } from 'lucide-react';
import { format } from '../utils/date';

export default function Dashboard() {
  const { trips, setTrips, deleteTrip } = useTripStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const data = await tripsApi.getAll();
      setTrips(data);
    } catch (error) {
      console.error('Failed to load trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个行程吗？')) return;

    try {
      await tripsApi.delete(id);
      deleteTrip(id);
    } catch (error) {
      console.error('Failed to delete trip:', error);
      alert('删除失败，请稍后重试');
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

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>我的行程</h1>
        <Link
          to="/plan"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600'
          }}
        >
          + 规划新行程
        </Link>
      </div>

      {trips.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: 'var(--surface)',
          borderRadius: '1rem',
          boxShadow: 'var(--shadow)'
        }}>
          <MapPin size={64} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
          <h2 style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
            还没有旅行计划
          </h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
            让 AI 帮你规划一次完美的旅行吧！
          </p>
          <Link
            to="/plan"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--primary)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600'
            }}
          >
            开始规划
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {trips.map((trip) => (
            <div
              key={trip.id}
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: '1rem',
                boxShadow: 'var(--shadow)',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow)';
              }}
            >
              <div style={{
                height: '150px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <MapPin size={48} />
              </div>

              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  marginBottom: '1rem',
                  color: 'var(--text)'
                }}>
                  {trip.destination}
                </h3>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-light)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} />
                    <span>
                      {format(new Date(trip.start_date), 'yyyy年M月d日')} - {format(new Date(trip.end_date), 'M月d日')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={16} />
                    <span>{trip.travelers} 人</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <DollarSign size={16} />
                    <span>¥{trip.budget.toLocaleString()}</span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '0.5rem'
                }}>
                  <Link
                    to={`/trip/${trip.id}`}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      textAlign: 'center',
                      backgroundColor: 'var(--primary)',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}
                  >
                    查看详情
                  </Link>

                  <button
                    onClick={() => handleDelete(trip.id)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--danger)',
                      color: 'var(--danger)',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="删除行程"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

