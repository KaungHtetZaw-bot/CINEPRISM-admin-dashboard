<template>
  <aside class="sidebar-container" :class="{ 'is-collapsed': adminStore.isSidebarCollapsed }">
    <div class="brand-section">
      <div class="brand-mark"><span></span><span></span><span></span></div>
      <div v-if="!adminStore.isSidebarCollapsed" class="brand-copy"><strong>CinePrism</strong><small>ADMIN CONSOLE</small></div>
    </div>

    <nav class="menu-area" aria-label="Primary navigation">
      <span v-if="!adminStore.isSidebarCollapsed" class="menu-label">Workspace</span>
      <el-menu router :default-active="route.path" class="premium-menu" :collapse="adminStore.isSidebarCollapsed" :collapse-transition="false">
        <el-menu-item index="/dashboard"><el-icon><Monitor /></el-icon><template #title>Command center</template></el-menu-item>
        <el-menu-item index="/users"><el-icon><User /></el-icon><template #title>Audience</template></el-menu-item>
        <el-menu-item index="/purchases"><el-icon><ShoppingCart /></el-icon><template #title>Purchase queue</template><span v-if="adminStore.pendingCount && !adminStore.isSidebarCollapsed" class="menu-count">{{ adminStore.pendingCount }}</span></el-menu-item>
        <el-menu-item index="/plans"><el-icon><GoldMedal /></el-icon><template #title>Membership plans</template></el-menu-item>
        <el-menu-item index="/payments"><el-icon><Wallet /></el-icon><template #title>Payment channels</template></el-menu-item>
      </el-menu>
    </nav>

    <div class="sidebar-footer">
      <div v-if="!adminStore.isSidebarCollapsed" class="help-card"><el-icon><VideoPlay /></el-icon><div><strong>Need a hand?</strong><span>Open the operations guide</span></div></div>
      <el-menu class="premium-menu bottom-menu" :collapse="adminStore.isSidebarCollapsed" :collapse-transition="false">
        <el-menu-item index="logout" @click="handleLogout"><el-icon><SwitchButton /></el-icon><template #title>Sign out</template></el-menu-item>
      </el-menu>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Monitor, User, ShoppingCart, GoldMedal, Wallet, SwitchButton, VideoPlay } from '@element-plus/icons-vue'
import { useAuthStore } from '@/store/auth'
import { useAdminStore } from '@/store/admin'

const route = useRoute()
const adminStore = useAdminStore()
const authStore = useAuthStore()
const handleLogout = () => ElMessageBox.confirm('Are you sure you want to sign out?', 'Sign out', { confirmButtonText: 'Sign out', cancelButtonText: 'Stay here', type: 'warning', customClass: 'premium-logout-box', center: true, showClose: false }).then(async () => { ElMessage.success('Signing out…'); await authStore.logout() })
</script>

<style lang="scss" scoped>
.sidebar-container { position: fixed; inset: 0 auto 0 0; z-index: 1001; display: flex; width: 260px; height: 100vh; flex-direction: column; border-right: 1px solid rgba(255,255,255,.06); background: #11111e; transition: width .35s cubic-bezier(.25,1,.5,1); &.is-collapsed { width: 80px; .brand-section { justify-content: center; padding: 0; } .menu-area { padding: 0 10px; } .sidebar-footer { padding: 15px 10px 18px; } } }
.brand-section { display: flex; height: 80px; align-items: center; gap: 12px; padding: 0 24px; }.brand-mark { display: flex; width: 36px; height: 36px; flex: 0 0 auto; align-items: center; justify-content: center; gap: 3px; border-radius: 11px; background: linear-gradient(135deg,#9c6bff,#e845a2); box-shadow: 0 8px 24px rgba(150,82,249,.3); }.brand-mark span { width: 3px; border-radius: 8px; background: #fff; &:nth-child(1){height:11px;opacity:.7}.brand-mark:nth-child(2){height:18px}.brand-mark:nth-child(3){height:7px;opacity:.85} }.brand-copy { display: grid; gap: 2px; white-space: nowrap; }.brand-copy strong { color: #fff; font-size: 16px; letter-spacing: -.04em; }.brand-copy small { color: #8f89a3; font-size: 8px; font-weight: 800; letter-spacing: .13em; }
.menu-area { flex: 1; overflow-y: auto; padding: 14px 13px; }.menu-label { display: block; padding: 0 12px 11px; color: #777188; font-size: 10px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }.premium-menu { border: 0; background: transparent; }.premium-menu :deep(.el-menu-item) { position: relative; height: 48px; margin-bottom: 4px; border-radius: 10px; color: #a39daf; font-size: 13px; font-weight: 600; transition: .2s; &:hover { color: #f4f1fb; background: rgba(255,255,255,.065); } &.is-active { color: #fff; background: linear-gradient(90deg,rgba(145,91,255,.28),rgba(145,91,255,.08)); &::before { position:absolute; left:0; width:3px; height:18px; border-radius:0 4px 4px 0; background:#ae82ff; content:''; } .el-icon { color:#c1a7ff; } } .el-icon { color:#898296; font-size:18px; } }.menu-count { position: absolute; right: 12px; display: grid; min-width: 19px; height: 19px; place-items: center; border-radius: 7px; color: #fff; background: #a765dc; font-size: 10px; font-weight: 800; }
.sidebar-footer { padding: 15px 13px 18px; }.help-card { display: flex; gap: 10px; margin: 0 7px 14px; padding: 13px 11px; border: 1px solid rgba(184,152,255,.12); border-radius: 13px; background: rgba(145,91,255,.09); }.help-card .el-icon { margin-top: 2px; color: #bf99ff; }.help-card div { display: grid; gap: 3px; }.help-card strong { color: #e9e3f6; font-size: 11px; }.help-card span { color: #9991aa; font-size: 10px; }.bottom-menu :deep(.el-menu-item) { margin-bottom: 0; color: #ee9bad; &:hover { color:#ffc0ce;background:rgba(237,78,124,.09); } }
</style>
