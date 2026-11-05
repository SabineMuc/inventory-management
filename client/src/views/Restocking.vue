<template>
  <div class="restocking">
    <div class="page-header">
      <h2>Restocking</h2>
      <p>Get budget-based restock recommendations and submit purchase orders</p>
    </div>

    <div class="card budget-card">
      <div class="card-header">
        <h3 class="card-title">Restocking Budget</h3>
      </div>
      <div class="budget-control">
        <input
          type="range"
          min="0"
          max="50000"
          step="500"
          v-model.number="budget"
          class="budget-slider"
        />
        <div class="budget-value">{{ formatCurrency(budget) }}</div>
      </div>
    </div>

    <div v-if="submitSuccess" class="confirmation">
      <div class="confirmation-title">Restock order submitted</div>
      <div class="confirmation-body">
        Order <strong>{{ submitSuccess.order_number }}</strong> is now
        <strong>{{ submitSuccess.status }}</strong>. Lead time is
        <strong>{{ submitSuccess.lead_time_days }} days</strong>, expected delivery on
        <strong>{{ formatDate(submitSuccess.expected_delivery) }}</strong>.
      </div>
    </div>

    <div v-if="submitError" class="error">{{ submitError }}</div>

    <div v-if="loading" class="loading">Loading recommendations...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Recommended Items ({{ recommendations.length }})</h3>
        </div>

        <div v-if="recommendations.length === 0" class="empty-state">
          No restock recommendations for this budget. Try increasing it.
        </div>
        <div v-else class="table-container">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Warehouse</th>
                <th>Unit Cost</th>
                <th>Recommended Qty</th>
                <th>Line Cost</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in recommendations" :key="item.item_sku">
                <td><strong>{{ item.item_name }}</strong></td>
                <td>{{ item.category }}</td>
                <td>{{ item.warehouse }}</td>
                <td>{{ formatCurrency(item.unit_cost) }}</td>
                <td>{{ item.recommended_quantity }}</td>
                <td><strong>{{ formatCurrency(item.line_cost) }}</strong></td>
                <td>
                  <span :class="['badge', item.trend]">{{ item.trend }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="order-summary">
          <div class="summary-row">
            <span class="summary-label">Recommended Spend</span>
            <span class="summary-value">{{ formatCurrency(totalRecommendedSpend) }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Budget</span>
            <span class="summary-value">{{ formatCurrency(budget) }}</span>
          </div>
          <button
            class="place-order-btn"
            :disabled="loading || submitting || recommendations.length === 0"
            @click="placeOrder"
          >
            {{ submitting ? 'Placing Order...' : 'Place Order' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { api } from '../api'
import { formatCurrencyWithDecimals } from '../utils/currency'

export default {
  name: 'Restocking',
  setup() {
    const budget = ref(10000)
    const recommendations = ref([])
    const loading = ref(true)
    const error = ref(null)

    const submitting = ref(false)
    const submitError = ref(null)
    const submitSuccess = ref(null)

    let debounceTimer = null

    const formatCurrency = (amount) => formatCurrencyWithDecimals(amount, 'USD', 2)

    const totalRecommendedSpend = computed(() => {
      return recommendations.value.reduce((sum, item) => sum + item.line_cost, 0)
    })

    const loadRecommendations = async () => {
      try {
        loading.value = true
        error.value = null
        recommendations.value = await api.getRestockRecommendations(budget.value)
      } catch (err) {
        error.value = 'Failed to load restock recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    watch(budget, () => {
      submitSuccess.value = null
      submitError.value = null
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        loadRecommendations()
      }, 350)
    })

    const placeOrder = async () => {
      submitting.value = true
      submitError.value = null
      submitSuccess.value = null
      try {
        const payload = {
          budget: budget.value,
          items: recommendations.value.map(item => ({
            item_sku: item.item_sku,
            item_name: item.item_name,
            category: item.category,
            quantity: item.recommended_quantity,
            unit_cost: item.unit_cost
          }))
        }
        const order = await api.createRestockOrder(payload)
        submitSuccess.value = order
        await loadRecommendations()
      } catch (err) {
        submitError.value = 'Failed to submit restock order: ' + err.message
      } finally {
        submitting.value = false
      }
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return dateString
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    onMounted(loadRecommendations)

    onBeforeUnmount(() => {
      clearTimeout(debounceTimer)
    })

    return {
      budget,
      recommendations,
      loading,
      error,
      submitting,
      submitError,
      submitSuccess,
      totalRecommendedSpend,
      formatCurrency,
      formatDate,
      placeOrder
    }
  }
}
</script>

<style scoped>
.budget-card {
  margin-bottom: 1.5rem;
}

.budget-control {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.budget-slider {
  flex: 1;
  accent-color: #2563eb;
}

.budget-value {
  min-width: 140px;
  text-align: right;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.025em;
}

.confirmation {
  background: #d1fae5;
  border: 1px solid #a7f3d0;
  color: #065f46;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.25rem;
}

.confirmation-title {
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.confirmation-body {
  font-size: 0.938rem;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #64748b;
  font-size: 0.938rem;
}

.order-summary {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid #e2e8f0;
}

.summary-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.summary-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.place-order-btn {
  margin-left: auto;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.75rem;
  font-size: 0.938rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.place-order-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.place-order-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}
</style>
