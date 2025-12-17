import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = {
  income: ['#10B981', '#34D399', '#6EE7B7'],
  expense: ['#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2'],
};

export default function CategoryBreakdown({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  // Separate income and expense categories
  const incomeCategories = Object.entries(data)
    .filter(([_, value]) => value.type === 'income')
    .map(([category, value]) => ({
      category,
      amount: value.total,
      count: value.count,
    }))
    .sort((a, b) => b.amount - a.amount);

  const expenseCategories = Object.entries(data)
    .filter(([_, value]) => value.type === 'expense')
    .map(([category, value]) => ({
      category,
      amount: value.total,
      count: value.count,
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="space-y-6">
      {/* Expense Breakdown */}
      {expenseCategories.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💸 Where Your Money Went
          </h3>
          
          {/* Bar Chart */}
          <div className="mb-6">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={expenseCategories.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="category" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => `R${value.toFixed(2)}`}
                  contentStyle={{ borderRadius: '8px' }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {expenseCategories.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.expense[index % COLORS.expense.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top 3 List */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Top Expenses:</p>
            {expenseCategories.slice(0, 3).map((cat, index) => (
              <div
                key={cat.category}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{cat.category}</p>
                    <p className="text-xs text-gray-600">{cat.count} transaction{cat.count !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-red-600">R{cat.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Income Breakdown */}
      {incomeCategories.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💰 Where Your Money Came From
          </h3>

          {/* Bar Chart */}
          <div className="mb-6">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={incomeCategories.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="category" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => `R${value.toFixed(2)}`}
                  contentStyle={{ borderRadius: '8px' }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {incomeCategories.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.income[index % COLORS.income.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top 3 List */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Top Income Sources:</p>
            {incomeCategories.slice(0, 3).map((cat, index) => (
              <div
                key={cat.category}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{cat.category}</p>
                    <p className="text-xs text-gray-600">{cat.count} transaction{cat.count !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-green-600">R{cat.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


