import { ref } from 'vue'

const toasts = ref([])
let seed = 0

export function useIosToast() {
    const open = (opts) => {
        const item = {
            id: ++seed,
            type: opts.type || 'info',      // 'success' | 'error' | 'warning' | 'info'
            message: opts.message || '',
            duration: typeof opts.duration === 'number' ? opts.duration : 3000
        }
        toasts.value.push(item)
        if (item.duration > 0) {
            window.setTimeout(() => close(item.id), item.duration)
        }
    }

    const close = (id) => {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    return { toasts, open, close }
}
