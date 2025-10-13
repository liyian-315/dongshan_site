<template>
  <teleport to="body">
    <div class="ios-toast-wrap" aria-live="polite" aria-atomic="true">
      <transition-group name="toast" tag="div">
        <div
            v-for="t in toasts"
            :key="t.id"
            class="ios-toast"
            :class="t.type"
            role="status"
        >
          <span class="icon" aria-hidden="true">
            <svg v-if="t.type==='success'" viewBox="0 0 24 24"><path d="M9.5 16.2 5.8 12.5l-1.6 1.6 5.3 5.3L20 9.9l-1.6-1.6z"/></svg>
            <svg v-else-if="t.type==='error'" viewBox="0 0 24 24"><path d="M12 10.6 6.7 5.3 5.3 6.7 10.6 12l-5.3 5.3 1.4 1.4L12 13.4l5.3 5.3 1.4-1.4L13.4 12l5.3-5.3-1.4-1.4z"/></svg>
            <svg v-else-if="t.type==='warning'" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v2h2v-2zm0-8h-2v6h2V10z"/></svg>
            <svg v-else viewBox="0 0 24 24"><path d="M11 7h2v2h-2V7zm0 4h2v6h-2v-6zm1-9a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/></svg>
          </span>
          <span class="msg">{{ t.message }}</span>
          <button class="close" @click="close(t.id)" aria-label="关闭">✕</button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { useIosToast } from '@/composables/useIosToast'
const { toasts, close } = useIosToast()
</script>

<style scoped>
.ios-toast-wrap{
  position: fixed; inset: 8px 0 auto 0;
  display: flex; justify-content: center; pointer-events: none;
  z-index: 9999;
}
.ios-toast{
  --c: #2563eb; /* info 蓝 */
  display:flex; align-items:center; gap:10px;
  max-width: min(92vw, 720px);
  margin: 6px auto; padding: 12px 14px 12px 12px;
  border-radius: 14px;
  background: rgba(255,255,255,.85);
  border: 1px solid rgba(15,23,42,.08);
  backdrop-filter: blur(10px);
  box-shadow: 0 12px 34px rgba(2,6,23,.12);
  pointer-events: auto;
}
.ios-toast.success{ --c:#16a34a; }
.ios-toast.error{ --c:#e11d48; }
.ios-toast.warning{ --c:#f59e0b; }

.icon{
  width:28px; height:28px; display:grid; place-items:center;
  border-radius:50%;
  background: linear-gradient(180deg, color-mix(in oklab, var(--c), white 80%) , transparent);
  border: 1px solid color-mix(in oklab, var(--c), white 70%);
  flex: 0 0 28px;
}
.icon svg{ width:18px; height:18px; fill: var(--c); }

.msg{ color:#0f172a; line-height:1.5; }
.close{
  margin-left:auto; border:0; background:transparent; cursor:pointer;
  font-size:18px; line-height:1; color:#334155; opacity:.7;
}
.close:hover{ opacity:1; }

/* 入场/离场动画 */
.toast-enter-from{ opacity:0; transform: translateY(-10px) scale(.98); }
.toast-enter-active{ transition: all .18s cubic-bezier(.22,.61,.36,1); }
.toast-leave-to{ opacity:0; transform: translateY(-8px) scale(.98); }
.toast-leave-active{ transition: all .14s ease; }

/* 深色模式优化 */
@media (prefers-color-scheme: dark){
  .ios-toast{
    background: rgba(17, 24, 39, .75);
    border: 1px solid rgba(255,255,255,.08);
    box-shadow: 0 12px 34px rgba(0,0,0,.35);
  }
  .msg{ color:#e5e7eb; }
  .close{ color:#cbd5e1; }
}
</style>
