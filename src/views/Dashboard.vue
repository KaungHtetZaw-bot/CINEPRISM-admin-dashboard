<template>
  <div class="dashboard-wrapper">
    <section class="command-hero">
      <div class="hero-copy">
        <div class="eyebrow"><span class="live-dot"></span> Cinema operations are live</div>
        <h1>Good evening, {{ firstName }}.</h1>
        <p>Here’s the latest signal from your streaming universe.</p>
        <div class="hero-actions">
          <el-button class="primary-action" :loading="adminStore.isLoading" @click="adminStore.fetchAllData()">
            <el-icon><Refresh /></el-icon> Sync platform data
          </el-button>
          <button class="text-action" type="button" @click="router.push('/purchases')">
            Review queue <el-icon><ArrowRight /></el-icon>
          </button>
        </div>
      </div>

      <div class="hero-signal" aria-label="Platform status">
        <div class="signal-topline">
          <span>Platform pulse</span>
          <span class="signal-state">Healthy</span>
        </div>
        <div class="signal-number">{{ formatNumber(adminStore.successCount) }}</div>
        <p>subscriptions successfully activated</p>
        <div class="pulse-chart" aria-hidden="true">
          <span v-for="(bar, index) in pulseBars" :key="index" :style="{ height: `${bar}%` }"></span>
        </div>
        <div class="signal-footer"><span>Last 7 days</span><span>Updated now</span></div>
      </div>
    </section>

    <section class="metric-grid" aria-label="Platform metrics">
      <button v-for="card in metricCards" :key="card.title" class="metric-card" type="button" @click="router.push(card.route)">
        <div class="metric-icon" :class="card.tone"><el-icon><component :is="card.icon" /></el-icon></div>
        <div class="metric-copy">
          <span>{{ card.title }}</span>
          <strong><small v-if="card.isCurrency">Ks </small>{{ formatNumber(card.value) }}</strong>
          <em>{{ card.description }}</em>
        </div>
        <el-icon class="card-arrow"><ArrowRight /></el-icon>
      </button>
    </section>

    <section class="workspace-grid">
      <div class="activity-panel panel-shell">
        <div class="panel-heading">
          <div>
            <span class="section-kicker">Activity feed</span>
            <h2>Recent subscriptions</h2>
          </div>
          <button class="icon-link" type="button" aria-label="View all subscriptions" @click="router.push('/purchases')"><el-icon><ArrowRight /></el-icon></button>
        </div>

        <div v-if="adminStore.mixedPurchases.length" class="subscription-list">
          <button v-for="purchase in adminStore.mixedPurchases.slice(0, 5)" :key="purchase.id" class="subscription-row" type="button" @click="router.push('/purchases')">
            <el-avatar :size="40" :src="`https://ui-avatars.com/api/?name=${purchase.user_name}&background=211f37&color=c9b8ff&bold=true`" />
            <div class="subscriber-copy">
              <strong>{{ purchase.user_name }}</strong>
              <span>{{ purchase.plan_name }} · {{ formatDate(purchase.created_at) }}</span>
            </div>
            <span class="status-pill" :class="purchase.status?.toLowerCase()"><i></i>{{ purchase.status }}</span>
          </button>
        </div>

        <div v-else class="empty-state">
          <el-icon><DataLine /></el-icon>
          <span>No subscription activity yet.</span>
        </div>
      </div>

      <aside class="queue-panel panel-shell">
        <div class="panel-heading">
          <div>
            <span class="section-kicker">Action center</span>
            <h2>Keep things moving</h2>
          </div>
          <span class="queue-count">{{ adminStore.pendingCount }}</span>
        </div>

        <div class="queue-spotlight">
          <div class="spotlight-icon"><el-icon><WarningFilled /></el-icon></div>
          <div>
            <strong>{{ adminStore.pendingCount ? `${adminStore.pendingCount} payment${adminStore.pendingCount === 1 ? '' : 's'} need review` : 'All caught up' }}</strong>
            <p>{{ adminStore.pendingCount ? 'Verify incoming payments to activate access.' : 'There are no subscriptions waiting for approval.' }}</p>
          </div>
        </div>

        <button class="queue-button" type="button" @click="router.push('/purchases')">
          {{ adminStore.pendingCount ? 'Open review queue' : 'View purchase history' }}
          <el-icon><ArrowRight /></el-icon>
        </button>

        <div class="mini-stats">
          <div><span>Plans</span><strong>{{ formatNumber(adminStore.plans.length) }}</strong></div>
          <div><span>Conversion</span><strong>{{ conversionRate }}%</strong></div>
        </div>
      </aside>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { User, Timer, CircleCheck, Money, Refresh, ArrowRight, DataLine, WarningFilled } from '@element-plus/icons-vue'
import { useAdminStore } from '@/store/admin'
import { useAuthStore } from '@/store/auth'
import { formatDate, formatNumber } from '@/utils/helpers'

const router = useRouter()
const adminStore = useAdminStore()
const authStore = useAuthStore()
const pulseBars = [32, 54, 42, 70, 52, 82, 64, 92, 76, 58, 88, 96]

const firstName = computed(() => authStore.user?.name?.split(' ')[0] || 'Admin')
const conversionRate = computed(() => {
  if (!adminStore.purchases.length) return 0
  return Math.round((adminStore.successCount / adminStore.purchases.length) * 100)
})
const metricCards = computed(() => [
  { title: 'Audience', value: adminStore.users.length, icon: User, tone: 'violet', description: 'registered viewers', route: '/users' },
  { title: 'Needs review', value: adminStore.pendingCount, icon: Timer, tone: 'amber', description: 'pending payments', route: '/purchases' },
  { title: 'Activated', value: adminStore.successCount, icon: CircleCheck, tone: 'green', description: 'successful subscriptions', route: '/purchases' },
  { title: 'Revenue', value: adminStore.totalRevenue, icon: Money, tone: 'rose', description: 'approved payments', isCurrency: true, route: '/purchases' },
])

onMounted(() => adminStore.fetchAllData())
</script>

<style lang="scss" scoped>
.dashboard-wrapper { max-width: 1440px; margin: 0 auto; }

.command-hero {
  min-height: 282px; display: grid; grid-template-columns: minmax(0, 1fr) 330px; gap: 48px; overflow: hidden;
  padding: 38px 40px 30px; border: 1px solid rgba(159, 122, 234, .2); border-radius: 28px;
  background: radial-gradient(circle at 84% 4%, rgba(224, 83, 255, .34), transparent 23%), radial-gradient(circle at 58% 105%, rgba(93, 79, 255, .26), transparent 34%), linear-gradient(118deg, #131323 0%, #1d1733 50%, #111222 100%);
  box-shadow: 0 24px 60px rgba(11, 8, 29, .25); color: #fff;
}
.hero-copy { position: relative; z-index: 1; align-self: center; }
.eyebrow, .section-kicker { display: flex; align-items: center; gap: 8px; color: #bba8ff; font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
.live-dot { width: 7px; height: 7px; border-radius: 50%; background: #6ee7b7; box-shadow: 0 0 0 5px rgba(110, 231, 183, .12); }
.hero-copy h1 { max-width: 620px; margin: 14px 0 8px; color: #fff; font-size: clamp(30px, 4vw, 46px); line-height: 1.05; font-weight: 800; letter-spacing: -.045em; }
.hero-copy > p { margin: 0; color: #b9b5ca; font-size: 15px; }
.hero-actions { display: flex; align-items: center; gap: 22px; margin-top: 29px; }
.primary-action { height: 44px; padding: 0 17px; border: 0; border-radius: 12px; color: #1b1230; background: #fff; font-weight: 800; &:hover { color: #1b1230; background: #f1ecff; transform: translateY(-1px); } }
.text-action { display: inline-flex; align-items: center; gap: 6px; padding: 0; border: 0; color: #e8e0ff; background: transparent; font: inherit; font-size: 13px; font-weight: 700; cursor: pointer; &:hover { color: #fff; } }

.hero-signal { align-self: end; position: relative; z-index: 1; padding: 20px 20px 14px; border: 1px solid rgba(255, 255, 255, .13); border-radius: 18px; background: rgba(13, 11, 29, .36); backdrop-filter: blur(12px); }
.signal-topline, .signal-footer { display: flex; align-items: center; justify-content: space-between; color: #b5afc4; font-size: 11px; font-weight: 700; }
.signal-state { color: #86efc2; }
.signal-number { margin-top: 13px; color: #fff; font-size: 32px; font-weight: 800; letter-spacing: -.06em; }
.hero-signal p { margin: 2px 0 12px; color: #b5afc4; font-size: 12px; }
.pulse-chart { display: flex; align-items: flex-end; height: 45px; gap: 5px; padding: 0 1px 9px; border-bottom: 1px solid rgba(255, 255, 255, .1); }
.pulse-chart span { display: block; flex: 1; min-height: 7px; border-radius: 6px 6px 2px 2px; background: linear-gradient(180deg, #ed95ff, #8b5cf6); opacity: .9; }
.signal-footer { padding-top: 10px; font-size: 10px; color: #817a99; }

.metric-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin: 24px 0; }
.metric-card { display: flex; align-items: flex-start; gap: 13px; position: relative; min-width: 0; padding: 20px; border: 1px solid #e8e6ef; border-radius: 18px; text-align: left; background: #fff; cursor: pointer; transition: .25s ease; &:hover { transform: translateY(-3px); border-color: #cfc6ec; box-shadow: 0 14px 28px rgba(42, 25, 83, .08); .card-arrow { opacity: 1; transform: translateX(1px); } } }
.metric-icon { display: grid; flex: 0 0 auto; width: 38px; height: 38px; place-items: center; border-radius: 12px; font-size: 18px; &.violet { color: #7655dc; background: #f0ecff; } &.amber { color: #bf7800; background: #fff4da; } &.green { color: #198754; background: #e8f8ef; } &.rose { color: #d14a79; background: #ffeaf1; } }
.metric-copy { display: flex; min-width: 0; flex-direction: column; }.metric-copy > span { color: #807a91; font-size: 12px; font-weight: 700; }.metric-copy strong { margin-top: 3px; color: #201b2d; font-size: 24px; line-height: 1.1; letter-spacing: -.05em; }.metric-copy small { font-size: 12px; letter-spacing: 0; }.metric-copy em { overflow: hidden; margin-top: 5px; color: #a09aab; font-size: 11px; font-style: normal; white-space: nowrap; text-overflow: ellipsis; }.card-arrow { position: absolute; right: 16px; bottom: 18px; color: #a9a2b5; opacity: 0; transition: .2s; }

.workspace-grid { display: grid; grid-template-columns: minmax(0, 1.65fr) minmax(310px, .75fr); gap: 24px; }.panel-shell { padding: 24px; border: 1px solid #e8e6ef; border-radius: 20px; background: #fff; }.panel-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 15px; }.panel-heading h2 { margin: 5px 0 0; color: #201b2d; font-size: 18px; letter-spacing: -.04em; }.section-kicker { color: #9389a5; font-size: 10px; }.icon-link { display: grid; width: 34px; height: 34px; place-items: center; border: 1px solid #e6e2ec; border-radius: 10px; color: #655b73; background: #fff; cursor: pointer; &:hover { color: #fff; background: #2b233d; border-color: #2b233d; } }
.subscription-list { margin-top: 20px; }.subscription-row { display: grid; grid-template-columns: 40px minmax(0, 1fr) auto; width: 100%; align-items: center; gap: 12px; padding: 12px 0; border: 0; border-top: 1px solid #f0eef3; text-align: left; background: transparent; cursor: pointer; &:hover .subscriber-copy strong { color: #6f49d5; } }.subscriber-copy { display: grid; gap: 4px; min-width: 0; }.subscriber-copy strong { overflow: hidden; color: #292333; font-size: 13px; text-overflow: ellipsis; white-space: nowrap; transition: .2s; }.subscriber-copy span { overflow: hidden; color: #958e9e; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }.status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 5px 8px; border-radius: 20px; color: #8b8493; background: #f2f0f5; font-size: 10px; font-weight: 800; text-transform: capitalize; }.status-pill i { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }.status-pill.pending { color: #a96800; background: #fff4dc; }.status-pill.approved, .status-pill.success { color: #168553; background: #e7f8ef; }.status-pill.rejected, .status-pill.failed { color: #c13c5f; background: #ffedf2; }
.empty-state { display: grid; min-height: 205px; place-items: center; align-content: center; gap: 8px; color: #aaa4b1; font-size: 13px; }.empty-state .el-icon { color: #c9c3d1; font-size: 30px; }
.queue-count { display: grid; min-width: 28px; height: 28px; place-items: center; border-radius: 9px; color: #6d43db; background: #efeaff; font-size: 12px; font-weight: 800; }.queue-spotlight { display: flex; gap: 13px; margin: 22px 0 18px; padding: 16px; border-radius: 15px; background: #f8f6fd; }.spotlight-icon { display: grid; flex: 0 0 auto; width: 32px; height: 32px; place-items: center; border-radius: 10px; color: #a96800; background: #fff0cc; }.queue-spotlight strong { color: #30283c; font-size: 13px; }.queue-spotlight p { margin: 5px 0 0; color: #898291; font-size: 12px; line-height: 1.45; }.queue-button { display: flex; width: 100%; align-items: center; justify-content: space-between; padding: 12px 14px; border: 0; border-radius: 11px; color: #fff; background: #292137; font: inherit; font-size: 12px; font-weight: 800; cursor: pointer; transition: .2s; &:hover { background: #5e3bbd; transform: translateY(-1px); } }.mini-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 18px; }.mini-stats div { display: grid; gap: 4px; padding: 12px; border: 1px solid #efedf2; border-radius: 12px; }.mini-stats span { color: #9d96a7; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }.mini-stats strong { color: #312a3d; font-size: 18px; letter-spacing: -.04em; }

@media (max-width: 1050px) { .command-hero { grid-template-columns: 1fr 290px; gap: 28px; }.metric-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 760px) { .command-hero { grid-template-columns: 1fr; padding: 28px 24px 24px; }.hero-signal { max-width: none; }.workspace-grid { grid-template-columns: 1fr; }.hero-actions { gap: 16px; }.metric-grid { gap: 12px; margin: 16px 0; }.metric-card { padding: 16px; }.metric-copy strong { font-size: 21px; } }
@media (max-width: 440px) { .metric-grid { grid-template-columns: 1fr; }.subscription-row { grid-template-columns: 35px minmax(0, 1fr); }.subscription-row .status-pill { display: none; } }
</style>
