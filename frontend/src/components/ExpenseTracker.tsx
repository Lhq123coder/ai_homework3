import { useState } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { 
  Plus, 
  Trash2, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Mic,
  MicOff
} from 'lucide-react';

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

interface ExpenseTrackerProps {
  expenses: Expense[];
  budget: number;
  onUpdate: (expenses: Expense[]) => void;
}

const CATEGORIES = [
  { value: 'accommodation', label: '住宿', icon: '🏨' },
  { value: 'transportation', label: '交通', icon: '🚗' },
  { value: 'food', label: '餐饮', icon: '🍜' },
  { value: 'activities', label: '活动', icon: '🎭' },
  { value: 'shopping', label: '购物', icon: '🛍️' },
  { value: 'other', label: '其他', icon: '📝' }
];

export default function ExpenseTracker({ expenses, budget, onUpdate }: ExpenseTrackerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [category, setCategory] = useState('food');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      parseVoiceExpense(transcript);
    } else {
      resetTranscript();
      startListening();
    }
  };

  const parseVoiceExpense = (text: string) => {
    // Simple parsing - extract amount and use rest as description
    const amountMatch = text.match(/(\d+(?:\.\d+)?)\s*元/);
    if (amountMatch) {
      setAmount(amountMatch[1]);
      const desc = text.replace(amountMatch[0], '').trim();
      if (desc) {
        setDescription(desc);
      }
    } else {
      setDescription(text);
    }
  };

  const handleAddExpense = () => {
    if (!amount || !description) {
      alert('请填写金额和描述');
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      category,
      amount: parseFloat(amount),
      description,
      date
    };

    onUpdate([...expenses, newExpense]);
    
    // Reset form
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setShowAddForm(false);
  };

  const handleDeleteExpense = (id: string) => {
    if (!confirm('确定要删除这条支出记录吗？')) return;
    onUpdate(expenses.filter(exp => exp.id !== id));
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = budget - totalSpent;
  const percentage = (totalSpent / budget) * 100;

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      {/* Budget Overview */}
      <div style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '1rem',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow)'
      }}>
        <h2 style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          <DollarSign size={24} style={{ color: 'var(--primary)' }} />
          预算概览
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            padding: '1rem',
            backgroundColor: '#f0f9ff',
            borderRadius: '0.5rem'
          }}>
            <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
              总预算
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
              ¥{budget.toLocaleString()}
            </p>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: '#fee',
            borderRadius: '0.5rem'
          }}>
            <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
              已花费
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--danger)' }}>
              ¥{totalSpent.toLocaleString()}
            </p>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: remaining >= 0 ? '#f0fdf4' : '#fee',
            borderRadius: '0.5rem'
          }}>
            <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
              剩余
            </p>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: remaining >= 0 ? 'var(--secondary)' : 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              {remaining >= 0 ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
              ¥{Math.abs(remaining).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
            fontSize: '0.875rem'
          }}>
            <span>预算使用进度</span>
            <span style={{
              fontWeight: '600',
              color: percentage > 100 ? 'var(--danger)' : 'var(--primary)'
            }}>
              {percentage.toFixed(1)}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '12px',
            backgroundColor: '#e2e8f0',
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.min(percentage, 100)}%`,
              height: '100%',
              backgroundColor: percentage > 100 ? 'var(--danger)' : 
                              percentage > 80 ? 'var(--warning)' : 'var(--primary)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(categoryTotals).length > 0 && (
        <div style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow)'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>分类统计</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            {CATEGORIES.map(cat => {
              const total = categoryTotals[cat.value] || 0;
              if (total === 0) return null;
              return (
                <div
                  key={cat.value}
                  style={{
                    padding: '1rem',
                    backgroundColor: 'var(--bg)',
                    borderRadius: '0.5rem',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{cat.icon}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                    {cat.label}
                  </div>
                  <div style={{ fontWeight: '700', color: 'var(--text)' }}>
                    ¥{total.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Expense Button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          <Plus size={20} />
          <span>添加支出记录</span>
        </button>
      </div>

      {/* Add Expense Form */}
      {showAddForm && (
        <div style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow)'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>记录新支出</h3>

          {isSupported && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#f0f9ff',
              borderRadius: '0.5rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: transcript ? '0.75rem' : 0
              }}>
                <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.875rem' }}>
                  💡 语音输入（说出金额和描述）
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
                    fontSize: '0.875rem'
                  }}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  <span>{isListening ? '停止' : '开始'}</span>
                </button>
              </div>
              {transcript && (
                <div style={{
                  padding: '0.5rem',
                  backgroundColor: 'white',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}>
                  {transcript}
                </div>
              )}
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}>
                类别
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--border)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}>
                金额（元）
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--border)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
                placeholder="0.00"
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}>
                日期
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
                fontSize: '0.875rem'
              }}>
                描述
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--border)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
                placeholder="例如：午餐"
              />
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '1rem'
          }}>
            <button
              onClick={handleAddExpense}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              添加
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: 'transparent',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* Expenses List */}
      <div style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: 'var(--shadow)'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border)'
        }}>
          <h3>支出明细</h3>
        </div>

        {expenses.length === 0 ? (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: 'var(--text-light)'
          }}>
            <p>还没有支出记录</p>
          </div>
        ) : (
          <div style={{ overflow: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: 'var(--bg)',
                  borderBottom: '1px solid var(--border)'
                }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>日期</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>类别</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>描述</th>
                  <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>金额</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => {
                  const cat = CATEGORIES.find(c => c.value === expense.category);
                  return (
                    <tr
                      key={expense.id}
                      style={{ borderBottom: '1px solid var(--border)' }}
                    >
                      <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                        {new Date(expense.date).toLocaleDateString('zh-CN')}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.875rem'
                        }}>
                          {cat?.icon} {cat?.label}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>{expense.description}</td>
                      <td style={{
                        padding: '1rem',
                        textAlign: 'right',
                        fontWeight: '600',
                        color: 'var(--danger)'
                      }}>
                        ¥{expense.amount.toLocaleString()}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: 'var(--danger)',
                            cursor: 'pointer'
                          }}
                          title="删除"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

