import { defineStore } from "pinia";
import { ElMessage } from 'element-plus'
import http from "@/api/http";

export const useAuthStore = defineStore('authUser', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || {},
        isLoading: false,
        isLoadingProfile:false,
        token: localStorage.getItem('token') || null,
    }),
    getters: {
        isAdmin: (state) => [2, 3].includes(state.user?.role_id),
    },
    actions: {
        async fetchProfile() {
            if (!this.token) return;
            try {
                this.isLoadingProfile = true
                const res = await http.get('/profile');
                localStorage.setItem('user', JSON.stringify(res.user));
                this.user = res.user;
            } catch (err) {
                this.logout();
            } finally{
                this.isLoadingProfile = false
            }
        },
        async login(form, router){
            this.isLoading = true
            try {
                const res = await http.post('/login',form)
                const role = res?.user?.role_id
                if(role === 1){
                    ElMessage({
                        message: 'Access Restricted: Administrator Only',
                        type: 'error',
                    })
                    return
                }
                this.token = res.access_token;
                this.user = res.user;

                localStorage.setItem('token', res.access_token);
                localStorage.setItem('user', JSON.stringify(res.user));
                ElMessage.success('Welcome back!');
                router.push('/dashboard')
            }catch (err){
                ElMessage.error(err.response?.data?.error || 'Login failed. Please try again.')
            }finally {
                this.isLoading = false
            }
        },

        logout() {
            this.user = {};
            this.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Full reload guarantees a clean state, same behavior as http.js 401 handling
            window.location.href = '/login';
        }
    }
})
