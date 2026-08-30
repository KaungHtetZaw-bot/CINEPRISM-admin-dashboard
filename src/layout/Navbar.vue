<template>
  <header class="navbar-container">
    <div class="left-section">
      <button class="toggle-wrapper" type="button" aria-label="Toggle sidebar" @click="adminStore.toggleSidebar">
        <span></span><span></span>
      </button>
      <div class="breadcrumb-wrapper"><span>Workspace</span><i>/</i><strong>{{ currentRouteName }}</strong></div>
    </div>

    <div class="right-section">
      <button class="notification-button" type="button" aria-label="Open purchase queue" @click="router.push('/purchases')">
        <el-badge is-dot :hidden="!adminStore.pendingCount"><el-icon><Bell /></el-icon></el-badge>
      </button>
      <el-dropdown trigger="click">
        <button class="user-trigger" type="button">
          <div class="avatar-wrapper"><img src="https://ui-avatars.com/api/?name=Admin&background=261f37&color=eadfff&bold=true" alt="Admin profile"></div>
          <div class="user-meta"><strong>{{ authStore?.user?.name || 'Administrator' }}</strong><span>{{ authStore?.user?.role?.name || 'Operations' }}</span></div>
          <el-icon class="chevron"><ArrowDown /></el-icon>
        </button>
        <template #dropdown>
          <el-dropdown-menu class="premium-dropdown">
            <el-dropdown-item :icon="User" @click="router.push('/profile')">Your profile</el-dropdown-item>
            <el-dropdown-item :icon="Setting" @click="router.push('/setting')">System settings</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Bell, ArrowDown, User, Setting } from '@element-plus/icons-vue'
import { useAdminStore } from '@/store/admin'
import { useAuthStore } from '@/store/auth'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()
const authStore = useAuthStore()
const currentRouteName = computed(() => route.meta.title || 'Command center')
</script>

<style lang="scss" scoped>
.navbar-container { display: flex; height: 72px; align-items: center; justify-content: space-between; padding: 0 32px; border-bottom: 1px solid #e8e6ed; background: rgba(250,249,252,.88); backdrop-filter: blur(16px); }.left-section, .right-section { display: flex; align-items: center; }.left-section { gap: 18px; }.toggle-wrapper { display: grid; width: 36px; height: 36px; place-content: center; gap: 5px; padding: 0; border: 1px solid #e5e2ea; border-radius: 10px; background: #fff; cursor: pointer; transition: .2s; &:hover { border-color:#c8bce4; background:#f7f4ff; } span { display:block; width:15px; height:1.5px; border-radius:2px; background:#3a3147; &:nth-child(2){width:10px;} } }.breadcrumb-wrapper { display: flex; align-items: center; gap: 9px; color: #9b95a3; font-size: 12px; }.breadcrumb-wrapper i { color: #c8c2cd; font-style: normal; }.breadcrumb-wrapper strong { color: #4a4157; font-weight: 700; }.right-section { gap: 12px; }.notification-button { display: grid; width: 36px; height: 36px; place-items: center; padding: 0; border: 1px solid transparent; border-radius: 10px; color: #5c536a; background: transparent; cursor: pointer; transition:.2s; &:hover { border-color:#e5e1ed; background:#fff; color:#6746cf; } .el-icon { font-size:18px; } }.user-trigger { display: flex; align-items: center; gap: 9px; padding: 4px 7px 4px 4px; border: 1px solid transparent; border-radius: 11px; background: transparent; cursor: pointer; transition:.2s; &:hover { border-color:#e5e1ed; background:#fff; } }.avatar-wrapper { width: 32px; height: 32px; overflow:hidden; border-radius: 9px; background:#261f37; img { display:block; width:100%; height:100%; object-fit:cover; } }.user-meta { display:grid; gap:2px; text-align:left; }.user-meta strong { max-width:150px; overflow:hidden; color:#342c3f; font-size:12px; text-overflow:ellipsis; white-space:nowrap; }.user-meta span { color:#9d96a7; font-size:10px; text-transform:capitalize; }.chevron { color:#9e97a8; font-size:11px; }
@media (max-width: 600px) { .navbar-container { padding: 0 18px; }.breadcrumb-wrapper span, .breadcrumb-wrapper i, .user-meta, .chevron { display:none; }.left-section { gap:8px; } }
</style>
